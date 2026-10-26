"""Retrato global reproduzível: Banco Mundial WDI + Natural Earth 50m.

Último valor não nulo de 2015 a 2026 por país/economia e indicador. Nulos não
viram zero. Agregados regionais do Banco Mundial são excluídos. As fronteiras
Natural Earth são cartográficas de facto, não prova de situação jurídica.
"""
from pathlib import Path
from datetime import datetime, timezone
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor
import argparse, hashlib, io, json, math, time, zipfile
import requests, shapefile
from shapely.geometry import shape, mapping
from shapely.ops import unary_union

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'data/raw/world-context'
OUT = ROOT / 'public/world-data'
DATE_FROM, DATE_TO = 2015, 2026
NE_URL = 'https://naciscdn.org/naturalearth/50m/cultural/ne_50m_admin_0_countries.zip'
NE_PAGE = 'https://www.naturalearthdata.com/downloads/50m-cultural-vectors/50m-admin-0-countries-2/'
METRICS = [
    {'id':'gdp_ppp','code':'NY.GDP.PCAP.PP.KD','name':'PIB por pessoa · poder de compra','unit':'int$ 2021 por pessoa/ano','format':'currency-int','polarity':'higher','decimals':0,'category':'Economia','definition':'Produto interno bruto por habitante, convertido por paridades de poder de compra, em dólares internacionais constantes de 2021. Mede produção econômica média; não é salário, renda líquida familiar nem preço de aluguel.','minimum':0},
    {'id':'life_expectancy','code':'SP.DYN.LE00.IN','name':'Expectativa de vida','unit':'anos','format':'number','polarity':'higher','decimals':1,'category':'Saúde','definition':'Expectativa de vida ao nascer para a população total, dadas as condições de mortalidade do período de referência. Indicador do país/economia, sem detalhamento por rua.','minimum':0,'maximum':130},
    {'id':'sanitation','code':'SH.STA.BASS.ZS','name':'Saneamento básico','unit':'% da população','format':'percent','polarity':'higher','decimals':1,'category':'Saneamento','definition':'População que utiliza pelo menos serviços básicos de saneamento: instalação melhorada não compartilhada com outros domicílios, segundo a metodologia do indicador. Não equivale exclusivamente à ligação a rede de esgoto nem a saneamento gerido com segurança.','minimum':0,'maximum':100},
    {'id':'electricity','code':'EG.ELC.ACCS.ZS','name':'Acesso à eletricidade','unit':'% da população','format':'percent','polarity':'higher','decimals':1,'category':'Infraestrutura','definition':'Percentual da população com acesso à eletricidade. Não mede confiabilidade, tarifa nem interrupções do serviço.','minimum':0,'maximum':100},
    {'id':'unemployment','code':'SL.UEM.TOTL.ZS','name':'Desemprego · estimativa OIT','unit':'% da força de trabalho','format':'percent','polarity':'lower','decimals':1,'category':'Trabalho','definition':'Desemprego total como percentual da força de trabalho, estimativa modelada da Organização Internacional do Trabalho disponibilizada pelo Banco Mundial. Não é quantidade de vagas abertas ou toda a população sem emprego.','minimum':0,'maximum':100},
    {'id':'internet','code':'IT.NET.USER.ZS','name':'Uso da internet','unit':'% da população','format':'percent','polarity':'higher','decimals':1,'category':'Conectividade','definition':'Indivíduos que utilizaram a internet no período de referência definido pela fonte. Não mede velocidade, qualidade do sinal ou disponibilidade de fibra em um endereço.','minimum':0,'maximum':100},
]

def compact(obj):
    return json.dumps(obj,ensure_ascii=False,separators=(',',':'))

def write(path,obj):
    path.parent.mkdir(parents=True,exist_ok=True)
    tmp=path.with_suffix(path.suffix+'.part')
    tmp.write_text(compact(obj),encoding='utf8')
    for attempt in range(6):
        try: tmp.replace(path); return
        except PermissionError:
            if attempt==5: raise RuntimeError(f'Arquivo em uso: {path}. Feche a prévia antes de reimportar.')
            time.sleep(.5)

def fetch(url,name,refresh=False):
    path=RAW/name
    if path.exists() and not refresh:
        data=path.read_bytes()
    else:
        for attempt in range(4):
            try:
                r=requests.get(url,timeout=(15,90));r.raise_for_status();data=r.content;break
            except requests.RequestException:
                if attempt==3:raise
                time.sleep(1+attempt*2)
        path.parent.mkdir(parents=True,exist_ok=True)
        tmp=path.with_suffix(path.suffix+'.part');tmp.write_bytes(data);tmp.replace(path)
    return data,{'id':name,'url':url,'sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data)}

def api(url,name,refresh=False):
    data,src=fetch(url,name,refresh)
    j=json.loads(data)
    if not isinstance(j,list) or len(j)!=2 or not isinstance(j[1],list):
        raise ValueError(f'Resposta WB inesperada: {name}')
    if int(j[0]['pages'])!=1 or int(j[0]['total'])!=len(j[1]):
        raise ValueError(f'Paginação incompleta: {name}')
    return j,src

def rounded_coordinates(value):
    if isinstance(value,(list,tuple)):
        if len(value)>=2 and all(isinstance(v,(float,int)) for v in value):
            return [round(v,4) for v in value]
        return [rounded_coordinates(v) for v in value]
    return value

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--refresh',action='store_true');args=parser.parse_args()
    RAW.mkdir(parents=True,exist_ok=True)
    en,src_en=api('https://api.worldbank.org/v2/country?format=json&per_page=400','countries-en.json',args.refresh)
    pt,src_pt=api('https://api.worldbank.org/v2/pt/country?format=json&per_page=400','countries-pt.json',args.refresh)
    translated={r['id']:r for r in pt[1]}
    included=[r for r in en[1] if r['region']['id']!='NA']
    if len(included)<200 or len({r['id'] for r in included})!=len(included):raise ValueError('Cobertura ou identificação WB inesperada')
    known={r['id']:r for r in included}
    sources=[src_en,src_pt]

    def collect(metric):
        code=metric['code']
        url=f'https://api.worldbank.org/v2/country/all/indicator/{code}?format=json&date={DATE_FROM}:{DATE_TO}&per_page=20000'
        data,src=api(url,code+'.json',args.refresh)
        metadata,meta_src=api(f'https://api.worldbank.org/v2/indicator/{code}?format=json',code+'-metadata.json',args.refresh)
        if len(metadata[1])!=1 or metadata[1][0]['id']!=code:raise ValueError('Metadados de indicador incompatíveis')
        if metadata[1][0].get('source',{}).get('id')!='2':raise ValueError('Indicador não identificado como WDI')
        last={};duplicates=set()
        for row in data[1]:
            c=row['countryiso3code'];year=int(row['date'])
            if c not in known:continue
            if row['indicator']['id']!=code or not DATE_FROM<=year<=DATE_TO:raise ValueError('Identidade/ano de indicador incompatível')
            key=(c,year)
            if key in duplicates:raise ValueError('Observação duplicada')
            duplicates.add(key)
            v=row['value']
            if v is None:continue
            if not isinstance(v,(int,float)) or not math.isfinite(v):raise ValueError('Valor numérico inválido')
            if v<metric['minimum']-1e-8 or v>metric.get('maximum',float('inf'))+1e-8:raise ValueError(f'Valor fora do domínio {code}/{c}/{v}')
            if c not in last or year>int(last[c]['year']):last[c]={'value':v,'year':str(year)}
        years=Counter(r['year'] for r in last.values())
        spec={**metric,'sourceUrl':f'https://data.worldbank.org/indicator/{code}','apiUrl':url,'metadataUrl':f'https://api.worldbank.org/v2/indicator/{code}?format=json','scope':'País/economia','provider':'Banco Mundial · WDI','selection':f'Último valor não nulo de {DATE_FROM} a {DATE_TO}, individualmente por país e indicador.','coverage':len(last),'eligible':len(known),'years':dict(sorted(years.items())),'sourceDefinition':metadata[1][0].get('sourceNote',''),'sourceOrganization':metadata[1][0].get('sourceOrganization',''),'sourceUpdated':data[0].get('lastupdated')}
        return spec,last,[src,meta_src]
    with ThreadPoolExecutor(max_workers=6) as pool:results=list(pool.map(collect,METRICS))
    metrics=[];values={c:{} for c in known}
    for spec,last,srcs in results:
        metrics.append(spec);sources.extend(srcs)
        for c in known:values[c][spec['id']]=last.get(c,{'value':None,'year':None})
        print(spec['id'],spec['coverage'],'/',spec['eligible'],'anos',spec['years'],flush=True)

    archive,ne_src=fetch(NE_URL,'ne_50m_admin_0_countries.zip',args.refresh);sources.append({**ne_src,'documentationUrl':NE_PAGE,'version':'5.1.1'})
    geographies=defaultdict(list);names={};name_candidates=defaultdict(list);unmatched=[];join_methods=Counter();join_examples=[]
    with zipfile.ZipFile(io.BytesIO(archive)) as z:
        version=z.read(next(n for n in z.namelist() if n.endswith('.VERSION.txt'))).decode().strip()
        if version!='5.1.1':raise ValueError(f'Versão Natural Earth alterada ({version}); revise os metadados antes de publicar.')
        f=lambda ext:io.BytesIO(z.read(next(n for n in z.namelist() if n.endswith(ext))))
        reader=shapefile.Reader(shp=f('.shp'),shx=f('.shx'),dbf=f('.dbf'),encoding='utf8')
        name_lookup={r['name']:r['id'] for r in included}
        for sr in reader.iterShapeRecords():
            props=sr.record.as_dict();c=None;method=None
            for field in ['WB_A3','ISO_A3','ISO_A3_EH','ADM0_A3']:
                code=props.get(field)
                # ISO_A3_EH can assign a sovereign's code to a separately drawn
                # dependency. Do not copy the sovereign's series to that dependency.
                if field=='ISO_A3_EH' and code!=props.get('ADM0_A3') and (code not in known or props['ADMIN']!=known[code]['name']):continue
                if code in known:c=code;method=field;break
            if c is None and props['ADMIN'] in name_lookup:
                c=name_lookup[props['ADMIN']];method='ADMIN exact official WB name'
            if c is None:
                c='NE-'+props['ADM0_A3'];method='Natural Earth only';unmatched.append({'id':c,'name':props['ADMIN']})
            join_methods[method]+=1
            if method not in ('WB_A3','Natural Earth only'):join_examples.append({'name':props['ADMIN'],'id':c,'method':method})
            geom=shape(sr.shape.__geo_interface__)
            if not geom.is_valid:
                # Do not invent replacement coordinates or silently repair geopolitical limits.
                raise ValueError(f'Geometria Natural Earth inválida: {props["ADMIN"]}')
            geographies[c].append(geom)
            name_candidates[c].append({'english':props['ADMIN'],'portuguese':props.get('NAME_PT') or props['ADMIN']})
    for c,candidates in name_candidates.items():
        preferred=next((p for p in candidates if c in known and p['english']==known[c]['name']),None)
        if c in known:
            names[c]=translated.get(c,{}).get('name') or (preferred['portuguese'] if preferred else candidates[0]['portuguese'] if len(candidates)==1 else known[c]['name'])
        else:names[c]=candidates[0]['portuguese']
    features=[]
    for c,gs in geographies.items():
        original=unary_union(gs) if len(gs)>1 else gs[0]
        geom=original.simplify(.015,preserve_topology=True)
        if not geom.is_valid:raise ValueError('Simplificação de geometria inválida')
        coords=mapping(geom);coords['coordinates']=rounded_coordinates(coords['coordinates'])
        if not shape(coords).is_valid:
            # Rounded output may collapse very tiny islands; retain full precision
            # for that complete feature rather than shifting or deleting islands.
            coords=mapping(geom)
        features.append({'type':'Feature','properties':{'id':c,'name':names[c],'hasCountryData':c in known,'source':'Natural Earth 5.1.1 · 1:50m','generalized':True},'geometry':coords})
    countries=[]
    for c,r in known.items():
        tr=translated.get(c,{})
        name=names.get(c) or tr.get('name') or r['name']
        countries.append({'id':c,'name':name,'officialName':r['name'],'iso2':r['iso2Code'],'region':tr.get('region',{}).get('value') or r['region']['value'],'regionId':r['region']['id'],'incomeLevel':tr.get('incomeLevel',{}).get('value') or r['incomeLevel']['value'],'hasGeometry':c in geographies,'values':values[c]})
    countries.sort(key=lambda c:c['name'])
    checks=[
        {'name':'Agregados regionais e de renda excluídos pela região NA do Banco Mundial','passed':all(r['regionId']!='NA' for r in countries)},
        {'name':'Chaves únicas de países/economias e feições cartográficas','passed':len(set(c['id'] for c in countries))==len(countries) and len(set(f['properties']['id'] for f in features))==len(features)},
        {'name':'Últimos valores com anos explícitos; ausências preservadas como null','passed':all((v['value'] is None and v['year'] is None) or (isinstance(v['value'],(float,int)) and DATE_FROM<=int(v['year'])<=DATE_TO) for c in countries for v in c['values'].values())},
        {'name':'Brasil, Portugal, Canadá e Estados Unidos com séries e geometria associadas','passed':all(c in known and c in geographies and values[c]['gdp_ppp']['value'] is not None for c in ['BRA','PRT','CAN','USA'])},
        {'name':'Domínio numérico e identidade de cada série validados','passed':True},
    ]
    if not all(c['passed'] for c in checks):raise ValueError('Verificação global não aprovada')
    meta={'collectedAt':datetime.now(timezone.utc).isoformat(),'scope':'Países e economias do Banco Mundial; não inclui agregados estatísticos','fromYear':DATE_FROM,'toYear':DATE_TO,'countryCount':len(countries),'geometryCount':len(features),'countriesWithGeometry':sum(c['hasGeometry'] for c in countries),'geometryOnly':unmatched,'joinMethods':dict(join_methods),'joinExceptions':join_examples,'checks':checks,'selectionPolicy':f'Último valor não nulo entre {DATE_FROM} e {DATE_TO}, por país e indicador. Os anos não são forçados a coincidir; comparação exige ler os anos exibidos. Nenhum dado posterior a {DATE_TO} é usado.','geographyPolicy':'Natural Earth admin0 50m versão 5.1.1. Limites generalizados de facto; não constituem reconhecimento de soberania ou delimitação jurídica. Simplificação topológica de 0,015 grau para visualização mundial. Ao aproximar ruas, o indicador continua no nível do país/economia.','joinPolicy':'Associação exata aos códigos Banco Mundial por WB_A3, ISO_A3, ISO_A3_EH ou ADM0_A3, nessa ordem. ISO_A3_EH só é aceito se coincidir com ADM0_A3 ou com o nome oficial da economia, evitando atribuir o indicador de um soberano a uma dependência separada. Quando nenhum código coincide, permite-se apenas nome ADMIN idêntico ao nome inglês da API WB. Demais formas ficam sem série, com chave NE-. WB_A3=CHI reúne as geometrias de Jersey e Guernsey para a economia Channel Islands, explicitamente conforme o código da fonte.','namePolicy':'Nome português da API WB quando fornecido; caso ausente, NAME_PT do Natural Earth da feição associada. Para economias agrupadas sem nome traduzido ou economias não mapeadas, usa-se o nome inglês oficial WB. A API pt fornece alguns nomes vazios.','limitations':['Retrato estático da API, podendo reutilizar cache. Não representa tempo real.','Último ano disponível varia por país e indicador; não se calcula ranking de anos simultâneos automaticamente.','PIB por pessoa em PPC representa produção econômica média e não renda líquida, salário, orçamento familiar ou custo de moradia.','Valores nacionais não podem ser atribuídos a municípios, bairros ou ruas apenas por aproximação do mapa.','Parte das séries é estimada/modelada pelas fontes, em especial o desemprego OIT. As definições originais são preservadas por indicador.','Economias pequenas sem geometria nesta escala continuam consultáveis nos registros. Formas cartográficas sem associação WB aparecem sem dados.','Uso de saneamento básico pode incluir soluções individuais; não se confunde com conexão à rede pública de esgoto.','Não há dados de aluguel, custo de vida por cidade, preços de mercado, vagas abertas nem recomendação migratória nesta base.']}
    OUT.mkdir(parents=True,exist_ok=True)
    write(OUT/'index.json',{'meta':meta,'sources':sources,'metrics':metrics,'countries':countries})
    write(OUT/'countries.geojson',{'type':'FeatureCollection','features':features})
    write(OUT/'sources.json',{'meta':meta,'sources':sources,'metrics':metrics})
    print(compact({'countries':len(countries),'mapped':meta['countriesWithGeometry'],'features':len(features),'checks':checks}),flush=True)

if __name__=='__main__':main()
