"""Camadas municipais brasileiras: IBGE Censo 2022 e IDEB/INEP via IBGE.

Todas as medidas são municipais. Nenhum valor é atribuído a rua, escola,
família ou bairro. Cache retomável e valores não publicados preservados nulos.
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor,as_completed
from datetime import datetime,timezone
from collections import Counter
import json,hashlib,requests,time,threading,math,csv

ROOT=Path(__file__).resolve().parents[1]
RAW=ROOT/'data/raw/context';OUT=ROOT/'public/context-data'
LOCAL=threading.local();SOURCES={}
INDICATORS=[122315,122337,122354,78187,78192,289164,289165,289166,289170,289171,289172,289150]
META_URL='https://servicodados.ibge.gov.br/api/v1/pesquisas'
GEO_URL='https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=application/vnd.geo+json&qualidade=minima&intrarregiao=municipio'
INCOME_URL='https://servicodados.ibge.gov.br/api/v3/agregados/10295/periodos/2022/variaveis/13431?localidades=N6[all]&classificacao=2[6794]|86[95251]|58[95253]'
EMPLOYED_URL='https://servicodados.ibge.gov.br/api/v3/agregados/10261/periodos/2022/variaveis/4090?localidades=N6[all]&classificacao=11913[96165]|2[6794]|86[95251]'

def write(path,obj):
    path.parent.mkdir(parents=True,exist_ok=True)
    tmp=path.with_suffix(path.suffix+'.part');tmp.write_text(json.dumps(obj,ensure_ascii=False,separators=(',',':')),encoding='utf8');tmp.replace(path)

def fetch(name,url):
    path=RAW/(name+'.json')
    if not path.exists():
        if not hasattr(LOCAL,'session'):LOCAL.session=requests.Session()
        for attempt in range(4):
            try:
                r=LOCAL.session.get(url,timeout=(15,100));r.raise_for_status();data=r.content;json.loads(data)
                path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(data);break
            except (requests.RequestException,ValueError):
                if attempt==3:raise
                time.sleep(1+attempt)
    b=path.read_bytes();return json.loads(b),{'id':name,'url':url,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()}

def get(name,url):
    j,s=fetch(name,url);SOURCES[name]=s;return j

def number(value):
    if value is None:return None
    try:
        n=float(str(value).replace(',','.'));return n if math.isfinite(n) else None
    except (ValueError,TypeError):return None

def main():
    RAW.mkdir(parents=True,exist_ok=True)
    cities=get('municipios','https://servicodados.ibge.gov.br/api/v1/localidades/municipios')
    if len(cities)<5500:raise ValueError('Cadastro municipal incompleto')
    by_id={str(c['id']):c for c in cities};by_base={str(c['id'])[:6]:str(c['id']) for c in cities}
    if len(by_id)!=len(cities) or len(by_base)!=len(cities):raise ValueError('Identificadores municipais não são únicos')
    geo=get('malha-brasil-municipios',GEO_URL)
    census_meta=get('metadata-censo2022',META_URL+'/10102/indicadores')
    education_meta=get('metadata-ideb',META_URL+'/40/indicadores')
    infra_meta=get('metadata-entorno',META_URL+'/10101/indicadores')
    income_meta=get('income-metadata','https://servicodados.ibge.gov.br/api/v3/agregados/10295/metadados')
    def flatten(xs):
        out={}
        for x in xs:out[x['id']]=x;out.update(flatten(x.get('children',[])))
        return out
    meta={**flatten(census_meta),**flatten(education_meta),**flatten(infra_meta)}
    if not all(i in meta for i in INDICATORS):raise ValueError('Indicador ausente no catálogo oficial')
    if not any(v['id']==13431 and v['unidade']=='Reais' for v in income_meta['variaveis']):raise ValueError('Semântica da renda mudou')
    ids=sorted(by_id);batches=[ids[i:i+200] for i in range(0,len(ids),200)]
    values={i:{} for i in ids};raw_series={i:{} for i in ids}
    def collect(it):
        i,city_ids=it;url=META_URL+'/-/indicadores/'+'|'.join(map(str,INDICATORS))+'/resultados/'+'|'.join(city_ids)
        j,src=fetch(f'municipal-v2-batch-{i:02}',url);return city_ids,j,src
    with ThreadPoolExecutor(max_workers=6) as pool:
        for city_ids,j,src in pool.map(collect,enumerate(batches)):
            SOURCES[src['id']]=src
            for variable in j:
                ind=int(variable['id'])
                if ind not in INDICATORS:raise ValueError('Indicador inesperado')
                seen=set()
                for r in variable['res']:
                    raw_id=str(r['localidade']);mid=by_base.get(raw_id) if len(raw_id)==6 else raw_id
                    if mid not in city_ids:raise ValueError(f'Resposta fora do lote municipal: {mid}')
                    if mid in seen:raise ValueError('Mais de um resultado municipal para o indicador')
                    seen.add(mid);raw_series[mid][ind]=r['res']
            print('Lote',src['id'],'municípios',len(city_ids),flush=True)
    def store(mid,key,ind,year):
        s=raw_series[mid].get(ind,{})
        values[mid][key]={'value':number(s.get(year)),'year':year,**({'raw':s.get(year)} if number(s.get(year)) is None else {})}
    for mid in ids:
        for key,ind,year in [('water',122315,'2022'),('sewage',122337,'2022'),('waste',122354,'2022'),('ideb_initial',78187,'2025'),('ideb_final',78192,'2025')]:store(mid,key,ind,year)
        for key,inds in [('paving',[289164,289165,289166]),('lighting',[289170,289171,289172])]:
            ns=[number(raw_series[mid].get(i,{}).get('2022')) for i in inds]
            denominator=number(raw_series[mid].get(289150,{}).get('2022'))
            v=ns[0]/denominator*100 if ns[0] is not None and denominator is not None and denominator>0 else None
            values[mid][key]={'value':v,'year':'2022','numerator':ns[0],'denominator':denominator}
    income=get('income-2022',INCOME_URL)
    if len(income)!=1 or income[0]['id']!='13431' or len(income[0]['resultados'])!=1:raise ValueError('Resposta de renda contém partições não previstas')
    income_seen=set()
    for item in income[0]['resultados'][0]['series']:
        mid=str(item['localidade']['id'])
        if mid not in by_id:raise ValueError(f'Renda: município não identificado {mid}')
        if mid in income_seen:raise ValueError('Renda duplicada')
        income_seen.add(mid);values[mid]['income']={'value':number(item['serie'].get('2022')),'year':'2022'}
    for mid in ids:values[mid].setdefault('income',{'value':None,'year':'2022'})
    employment_meta=get('employment-metadata','https://servicodados.ibge.gov.br/api/v3/agregados/10261/metadados')
    if not any(v['id']==4090 and v['unidade']=='Pessoas' for v in employment_meta['variaveis']):raise ValueError('Semântica dos ocupados mudou')
    employed=get('employed-2022',EMPLOYED_URL)
    if len(employed)!=1 or employed[0]['id']!='4090' or len(employed[0]['resultados'])!=1:raise ValueError('Partição de ocupados inesperada')
    seen=set()
    for item in employed[0]['resultados'][0]['series']:
        mid=str(item['localidade']['id'])
        if mid not in by_id or mid in seen:raise ValueError('Ocupados com identificação não única')
        seen.add(mid);values[mid]['employed']={'value':number(item['serie'].get('2022')),'year':'2022'}
    for mid in ids:values[mid].setdefault('employed',{'value':None,'year':'2022'})
    def metric(id,name,unit,definition,sourceUrl,theme,year,**extra):
        return {'id':id,'name':name,'unit':unit,'definition':definition,'sourceUrl':sourceUrl,'theme':theme,'year':year,'polarity':'higher','coverage':sum(values[mid][id]['value'] is not None for mid in ids),'totalMunicipalities':len(ids),'geographicLevel':'municipality',**extra}
    per_home='Percentual de domicílios particulares permanentes ocupados do município. Fonte: Censo Demográfico 2022; não indica qualidade ou continuidade do serviço.'
    metrics=[
      metric('water','Água da rede como fonte principal','%',per_home+' Domicílios ligados à rede geral que a usam como principal forma de abastecimento.',META_URL+'/10102/indicadores/122315','sanitation','2022',validRange=[0,100],indicatorId=122315),
      metric('sewage','Esgoto: rede ou fossa ligada à rede','%',per_home+' Inclui rede geral, rede pluvial e fossa séptica/filtro ligada à rede; não equivale a esgoto tratado nem inclui fossa não ligada à rede.',META_URL+'/10102/indicadores/122337','sanitation','2022',validRange=[0,100],indicatorId=122337),
      metric('waste','Lixo coletado por serviço de limpeza','%',per_home+' Inclui coleta no domicílio e depósito em caçamba de serviço de limpeza.',META_URL+'/10102/indicadores/122354','sanitation','2022',validRange=[0,100],indicatorId=122354),
      metric('ideb_initial','Ideb: anos iniciais, rede pública','pontos','Índice de Desenvolvimento da Educação Básica dos anos iniciais do ensino fundamental na rede pública do município, edição 2025. Escala de 0 a 10. Divulgação pelo INEP, disponibilizada na API IBGE. Não substitui avaliação individual de escola.',META_URL+'/40/indicadores/78187','education','2025',validRange=[0,10],indicatorId=78187),
      metric('ideb_final','Ideb: anos finais, rede pública','pontos','Índice de Desenvolvimento da Educação Básica dos anos finais do ensino fundamental na rede pública do município, edição 2025. Escala de 0 a 10. INEP via IBGE. Resultados não divulgados permanecem nulos.',META_URL+'/40/indicadores/78192','education','2025',validRange=[0,10],indicatorId=78192),
      metric('paving','Domicílios em via pavimentada','%','Percentual DERIVADO: domicílios particulares permanentes ocupados em setores selecionados para a Pesquisa Urbanística do Entorno dos Domicílios em via com pavimentação / total oficial de domicílios pesquisados (indicador289150), incluindo os não declarados, vezes 100. Denominador restrito ao universo pesquisado do entorno; não representa todos os domicílios do município nem toda extensão das ruas. Inclui não declarados no denominador. Censo2022.',META_URL+'/10101/indicadores/289164','infrastructure','2022',validRange=[0,100],status='derived',indicatorIds=[289164,289150]),
      metric('lighting','Domicílios em via com iluminação','%','Percentual DERIVADO: domicílios particulares permanentes ocupados em setores selecionados para a Pesquisa Urbanística do Entorno dos Domicílios em via com iluminação pública / total oficial de domicílios pesquisados (indicador289150), incluindo os não declarados, vezes 100. Denominador restrito ao universo pesquisado do entorno; não representa todos os domicílios do município, funcionamento atual ou manutenção da iluminação. Inclui não declarados no denominador. Censo2022.',META_URL+'/10101/indicadores/289170','infrastructure','2022',validRange=[0,100],status='derived',indicatorIds=[289170,289150]),
      metric('income','Renda domiciliar mensal por pessoa','R$','Rendimento nominal médio mensal domiciliar per capita, em reais de julho de 2022, dos moradores em domicílios particulares permanentes ocupados, excluídos pensionistas, empregados domésticos e parentes dos empregados domésticos, conforme definição da tabela10295. Resultado amostral do Censo2022; não é salário líquido individual, PIB per capita, poder de compra atual ou preço de aluguel. Sexo, cor/raça e idade: totais. Sem atualização inflacionária.', 'https://sidra.ibge.gov.br/tabela/10295','income','2022',validRange=[0,None],status='official',variableId=13431),
      metric('employed','Pessoas ocupadas (14 anos ou mais)','pessoas','Quantidade de moradores de 14 anos ou mais ocupados na semana de referência do Censo2022, considerando todas as posições na ocupação e categorias de emprego do trabalho principal, sexo e cor/raça: totais. Inclui emprego formal, informal e trabalho por conta própria conforme a definição censitária. Não é taxa de ocupação, vagas abertas, novos empregos ou situação atual do mercado de trabalho.', 'https://sidra.ibge.gov.br/tabela/10261','work','2022',validRange=[0,None],status='official',variableId=4090,polarity='neutral')
    ]
    for m in metrics:
        m.setdefault('status','official')
        if m['coverage']<5000:raise ValueError(f'Cobertura insuficiente para {m["id"]}: {m["coverage"]}')
        for mid in ids:
            v=values[mid][m['id']]['value'];lo,hi=m['validRange']
            if v is not None and (v<lo or hi is not None and v>hi):raise ValueError(f'Valor fora da escala: {mid}/{m["id"]}: {v}')
    def uf(c):
        micro=c.get('microrregiao')
        return micro['mesorregiao']['UF']['sigla'] if micro else c['regiao-imediata']['regiao-intermediaria']['UF']['sigla']
    municipalities=[{'id':mid,'name':by_id[mid]['nome'],'uf':uf(by_id[mid]),'values':values[mid]} for mid in ids]
    feature_ids=set()
    for f in geo['features']:
        mid=str(f['properties']['codarea'])
        if mid not in by_id or mid in feature_ids:raise ValueError('Malha municipal inválida')
        c=by_id[mid];f['properties']={'id':mid,'name':c['nome'],'uf':uf(c),'source':'IBGE API malhas, qualidade mínima'};feature_ids.add(mid)
    missing=[{'id':mid,'name':by_id[mid]['nome'],'uf':uf(by_id[mid])} for mid in ids if mid not in feature_ids]
    if len(geo['features'])<5500:raise ValueError('Malha nacional incompleta')
    metadata={'collectedAt':datetime.now(timezone.utc).isoformat(),'sources':list(SOURCES.values()),'geographicLevel':'municipality','checks':[{'name':'Identificadores municipais únicos, vínculo API6→IBGE7 sem correspondência aproximada','passed':True},{'name':'Valores dentro das escalas, duplicidades e recortes das respostas conferidos','passed':True},{'name':'Malha e cadastro associados por código IBGE; geometrias ausentes não são inventadas','passed':True}], 'missingGeometry':missing,'limitations':['Retrato estático. Coleta pode reutilizar cache; datas de referência dos indicadores permanecem explícitas.','Todos os indicadores são MUNICIPAIS. O zoom até uma rua não transforma o valor municipal em um dado daquela rua.','Os municípios atuais e a malha podem ter edições territoriais distintas. Municípios sem polígono permanecem consultáveis, sem atribuição de área vizinha.','IDEB2025 e Censo2022 são períodos diferentes. Não representam observação contemporânea única; comparação deve manter a data de cada medida.','Respostas não numéricas ou ausentes da API são preservadas como nulas, com o símbolo original em raw quando existente; não são convertidas indiscriminadamente em zero. Sem substituição silenciosa por edição anterior do IDEB.','Pavimentação e iluminação são percentuais derivados dos domicílios do universo da Pesquisa Urbanística do Entorno; não indicam a porcentagem das ruas nem todos os domicílios municipais.','Saneamento descreve formas declaradas pelos domicílios; não atesta tratamento, potabilidade, regularidade ou situação atual da rede.','Não há nestes arquivos preços de aluguel, orçamento familiar real, vagas abertas ou estatísticas de segurança.']}
    OUT.mkdir(parents=True,exist_ok=True);write(OUT/'index.json',{'meta':metadata,'municipalities':municipalities,'metrics':metrics});write(OUT/'municipios.geojson',geo);write(OUT/'sources.json',metadata)
    with (OUT/'municipios.csv').open('w',encoding='utf-8-sig',newline='') as f:
        fields=['id','name','uf']+[s for m in metrics for s in [m['id'],m['id']+'_year']];wr=csv.DictWriter(f,fields,delimiter=';');wr.writeheader()
        for c in municipalities:wr.writerow({**{k:c[k] for k in ['id','name','uf']},**{key:val for m in metrics for key,val in [(m['id'],c['values'][m['id']]['value']),(m['id']+'_year',c['values'][m['id']]['year'])]}})
    print(json.dumps({'municipalities':len(municipalities),'features':len(geo['features']),'metrics':[{k:m[k] for k in ['id','coverage','year']} for m in metrics],'missingGeometry':missing},ensure_ascii=True),flush=True)

if __name__=='__main__':main()
