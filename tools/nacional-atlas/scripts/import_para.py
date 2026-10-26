"""Atlas estadual: fontes públicas TSE/IBGE, cache retomável e publicação após conciliação.
Uma linha por turno/município/zona/seção principal; agregadas nunca somadas novamente.
"""
from pathlib import Path
from collections import defaultdict, Counter
from datetime import datetime, timezone
import csv, io, json, hashlib, zipfile, unicodedata, threading, time, os
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests, shapefile
from shapely.geometry import shape, Point, mapping
from shapely.ops import transform
from pyproj import CRS, Transformer
from bu import decode_bu

ROOT = Path(__file__).resolve().parents[1]
OLD = ROOT / 'data/raw'
RAW = OLD / 'para'
OUT = ROOT / 'public/para-data'
BASE = 'https://resultados.tse.jus.br/oficial/ele2026'
LOCAL = threading.local()
FIELDS = ['lula','flavio','outros','validos','brancos','nulos','nulosUrna','nulosTecnicos','nominaisOriginais','total','aptos']
SOURCES = {}

def norm(s):
    return ' '.join(''.join(c for c in unicodedata.normalize('NFD',str(s).upper()) if not unicodedata.combining(c)).split())

def write(path, obj):
    path.parent.mkdir(parents=True,exist_ok=True)
    tmp=path.with_suffix(path.suffix+'.part')
    tmp.write_text(json.dumps(obj,ensure_ascii=False,separators=(',',':')),encoding='utf8')
    for attempt in range(6):
        try: tmp.replace(path); return
        except PermissionError:
            if attempt==5: raise RuntimeError(f'Arquivo em uso: {path}. Feche a prévia Vite antes de reimportar no Windows.')
            time.sleep(.5)

def get(url, path):
    if path.exists(): return path.read_bytes()
    if not hasattr(LOCAL,'s'): LOCAL.s=requests.Session()
    for attempt in range(4):
        try:
            r=LOCAL.s.get(url,timeout=(15,60)); r.raise_for_status()
            data=r.content; path.parent.mkdir(parents=True,exist_ok=True)
            tmp=path.with_suffix(path.suffix+'.part'); tmp.write_bytes(data); tmp.replace(path)
            return data
        except requests.RequestException:
            if attempt==3: raise
            time.sleep(1+attempt*2)

def source(name,url,path):
    b=get(url,path); SOURCES[name]={'id':name,'url':url,'sha256':hashlib.sha256(b).hexdigest(),'bytes':len(b)}
    return json.loads(b)

def csv_rows(archive, suffix):
    if not (OLD/archive).exists():
        folder={'eleitorado_local_votacao_2026.zip':'eleitorado_locais_votacao','detalhe_votacao_secao_2026.zip':'detalhe_votacao_secao','votacao_secao_2026_BR.zip':'votacao_secao'}[archive]
        get(f'https://cdn.tse.jus.br/estatistica/sead/odsele/{folder}/{archive}',OLD/archive)
    with zipfile.ZipFile(OLD/archive) as z:
        names=[n for n in z.namelist() if n.endswith(suffix)]
        if len(names)!=1: raise ValueError(f'Arquivo CSV ambíguo: {archive}/{suffix}')
        with z.open(names[0]) as f:
            reader=csv.DictReader(io.TextIOWrapper(f,encoding='latin1'),delimiter=';')
            for r in reader:
                if r['SG_UF']=='PA' and r.get('CD_CARGO','1')=='1': yield r

def key(r): return (int(r['NR_TURNO']),int(r['CD_MUNICIPIO']),int(r['NR_ZONA']),int(r['NR_SECAO']))
def cand(j): return {str(c['n']):c for ca in j['carg'] for g in ca['agr'] for p in g['par'] for c in p.get('cand',[])}
def sums(rs): return {k:sum(r[k] for r in rs) for k in FIELDS}

def collect_one(item):
    m,z,s=item
    file=RAW/'bu2t'/f'{m}-{z}-{s}.json'
    if file.exists(): return json.loads(file.read_text(encoding='utf8'))
    # Reuse the previously validated Santarém archive, preserving its provenance.
    prefix=f'{BASE}/arquivo-urna/3221/dados/pa/{m:05}/{z:04}/{s:04}/'
    auxurl=prefix+f'p003221-pa-m{m:05}-z{z:04}-s{s:04}-aux.json'
    aux=json.loads(get(auxurl,RAW/'aux2t'/f'{m}-{z}-{s}.json'))
    hs=[h for h in aux.get('hashes',[]) if h.get('st','').lower()=='totalizado']
    # Some auxiliary manifests have a later receipt status despite a finished
    # municipal total. A single received BU may be examined, but publication
    # still requires exact reconciliation of ALL candidates and counters for
    # that municipality and the state. Never label it Totalizado.
    if not hs and len(aux.get('hashes',[]))==1 and aux['hashes'][0].get('st','').lower()=='recebido': hs=aux['hashes']
    if len(hs)!=1: raise ValueError(f'BU oficial único não identificado: {item}')
    fs=[a for a in hs[0]['arq'] if a['tp']=='bu']
    if len(fs)!=1: raise ValueError(f'Arquivo BU não único: {item}')
    url=prefix+hs[0]['hash']+'/'+fs[0]['nm']
    old=OLD/'bu2t'/fs[0]['nm']
    b=old.read_bytes() if old.exists() else get(url,RAW/'bu-files'/fs[0]['nm'])
    d=decode_bu(b,6258)
    if (d['municipio_bu'],d['zona_bu'],d['secao_bu'])!=(m,z,s): raise ValueError(f'BU com identidade incorreta {item}')
    if not d['fim_local'].startswith('20261025'): raise ValueError('Data de BU inesperada')
    result={**d,'buUrl':url,'sha256':hashlib.sha256(b).hexdigest(),'auxStatus':hs[0]['st'],'auxUrl':auxurl,'auxSha256':hashlib.sha256(json.dumps(aux,sort_keys=True,ensure_ascii=False).encode()).hexdigest()}
    write(file,result)
    return result

def main():
    RAW.mkdir(parents=True,exist_ok=True)
    source('catalogo-resultados','https://dadosabertos.tse.jus.br/api/3/action/package_show?id=resultados-2026',RAW/'catalogo-resultados.json')
    source('catalogo-eleitorado','https://dadosabertos.tse.jus.br/api/3/action/package_show?id=eleitorado-2026',RAW/'catalogo-eleitorado.json')
    cities=source('municipios-ibge','https://servicodados.ibge.gov.br/api/v1/localidades/estados/15/municipios',RAW/'municipios-ibge.json')
    city_by_name={norm(c['nome']):c for c in cities}
    geo=source('malha-municipal-ibge','https://servicodados.ibge.gov.br/api/v3/malhas/estados/15?formato=application/vnd.geo+json&qualidade=intermediaria&intrarregiao=municipio',RAW/'municipios.geojson')
    if len(cities)!=144 or len(geo['features'])!=144: raise ValueError('Cobertura IBGE diferente de 144 municípios')
    full_geo=source('malha-municipal-validacao-ibge','https://servicodados.ibge.gov.br/api/v3/malhas/estados/15?formato=application/vnd.geo+json&qualidade=maxima&intrarregiao=municipio',RAW/'municipios-maxima.geojson')
    geoms={f['properties']['codarea']:shape(f['geometry']) for f in full_geo['features']}
    if len(geoms)!=144: raise ValueError('Malha de validação incompleta')
    config={}; municipality={}; principal={}
    for turn,pleito in [(1,3220),(2,3221)]:
        j=source(f'config-{turn}t',f'{BASE}/arquivo-urna/{pleito}/config/pa/pa-p{pleito:06}-cs.json',RAW/f'config-{turn}t.json')
        expected=[]
        for m in [m for a in j['abr'] for m in a['mu']]:
            # Explicit naming variant, same municipality; no fuzzy matching.
            lookup={'ELDORADO DOS CARAJAS':'ELDORADO DO CARAJAS'}.get(norm(m['nm']),norm(m['nm']))
            ibge=city_by_name.get(lookup)
            if not ibge: raise ValueError(f'Município TSE sem correspondência IBGE: {m["nm"]}')
            mid=int(m['cd']); municipality[mid]={'id':f'{mid:05}','ibge':str(ibge['id']),'name':ibge['nome'],'region':ibge['regiao-imediata']['regiao-intermediaria']['nome']}
            for z in m['zon']:
                for s in z['sec']:
                    if not s.get('nsp'):
                        k=(turn,mid,int(z['cd']),int(s['ns']))
                        if k in config: raise ValueError('Chave de seção repetida no TSE')
                        config[k]=[int(a) for a in s.get('nsa',[])]
                        expected.append(k)
        principal[turn]=expected
    if len(municipality)!=144: raise ValueError('Cobertura TSE incompleta')
    print('Configuração: 144 municípios; principais por turno', {t:len(v) for t,v in principal.items()},flush=True)
    tasks=[k[1:] for k in principal[2]]
    if (OLD/'bu2t-collection.json').exists():
        prior=json.loads((OLD/'bu2t-collection.json').read_text(encoding='utf8'))
        for r in prior['rows']:
            dest=RAW/'bu2t'/f'5355-{int(r["zona"])}-{int(r["secao"])}.json'
            if not dest.exists(): write(dest,{**r,'buUrl':r['bu_url']})
    # Begin resumed collection before reading the large first-turn CSV.
    pool=ThreadPoolExecutor(max_workers=20)
    futures={pool.submit(collect_one,k):k for k in tasks}
    print('Coleta de 20.827 BUs iniciada (20 conexões; cache retomável).',flush=True)
    official={}
    def total_one(item):
        t,mid=item; e=6256+t; name=f'total-{t}t-{mid:05}'
        url=f'{BASE}/{e}/dados/pa/pa{mid:05}-c0001-e{e:06}-u.json'
        b=get(url,RAW/'totals'/f'{name}.json')
        return (t,mid,json.loads(b),{'id':name,'url':url,'sha256':hashlib.sha256(b).hexdigest(),'bytes':len(b)})
    with ThreadPoolExecutor(max_workers=10) as tp:
        for t,mid,j,src in tp.map(total_one,[(t,mid) for t in [1,2] for mid in municipality]):
            official[t,mid]=j; SOURCES[src['id']]=src
    state={t:source(f'total-para-{t}t',f'{BASE}/{6256+t}/dados/pa/pa-c0001-e{6256+t:06}-u.json',RAW/f'total-para-{t}t.json') for t in [1,2]}
    print('288 totalizações municipais + 2 estaduais coletadas.',flush=True)
    # Compact local cadastro, never include phone numbers or voter-level data.
    locations={}
    for r in csv_rows('eleitorado_local_votacao_2026.zip','_PA.csv'):
        k=key(r)
        if k in locations: raise ValueError('Cadastro TSE com seção repetida')
        locations[k]=r
    details={}
    for r in csv_rows('detalhe_votacao_secao_2026.zip','_BR.csv'):
        k=key(r)
        if k in details: raise ValueError(f'Detalhes duplicados: {k}')
        details[k]=r
    votes=defaultdict(dict)
    for r in csv_rows('votacao_secao_2026_BR.zip','_BR.csv'):
        k=key(r); nr=r['NR_VOTAVEL']
        if nr in votes[k]: raise ValueError('Votação duplicada')
        votes[k][nr]=int(r['QT_VOTOS'])
    for a,url in [
        ('eleitorado_local_votacao_2026.zip','https://cdn.tse.jus.br/estatistica/sead/odsele/eleitorado_locais_votacao/eleitorado_local_votacao_2026.zip'),
        ('detalhe_votacao_secao_2026.zip','https://cdn.tse.jus.br/estatistica/sead/odsele/detalhe_votacao_secao/detalhe_votacao_secao_2026.zip'),
        ('votacao_secao_2026_BR.zip','https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_secao/votacao_secao_2026_BR.zip'),
        ('PA_bairros_CD2022.zip','https://geoftp.ibge.gov.br/organizacao_do_territorio/malhas_territoriais/malhas_de_setores_censitarios__divisoes_intramunicipais/censo_2022/bairros/shp/UF/PA_bairros_CD2022.zip')]:
        p=OLD/a
        if not p.exists(): get(url,p)
        SOURCES[a]={'id':a,'url':url,'sha256':hashlib.file_digest(p.open('rb'),'sha256').hexdigest(),'bytes':p.stat().st_size}
    print('CSVs lidos: cadastro',len(locations),'votação presidencial',len(votes),'detalhes',len(details),flush=True)
    # All published IBGE neighborhoods, not inferred rural polygons.
    neighborhoods=defaultdict(list); features=[]
    with zipfile.ZipFile(OLD/'PA_bairros_CD2022.zip') as z:
        buf=lambda ext:io.BytesIO(z.read(next(n for n in z.namelist() if n.endswith(ext))))
        reader=shapefile.Reader(shp=buf('.shp'),shx=buf('.shx'),dbf=buf('.dbf'),encoding='utf8')
        trans=Transformer.from_crs(CRS.from_wkt(z.read(next(n for n in z.namelist() if n.endswith('.prj'))).decode()),'EPSG:4326',always_xy=True).transform
        for sr in reader.iterShapeRecords():
            p=sr.record.as_dict(); g=transform(trans,shape(sr.shape.__geo_interface__))
            if not g.is_valid: raise ValueError('Polígono de bairro inválido')
            props={'id':p['CD_BAIRRO'],'name':p['NM_BAIRRO'],'municipioIbge':p['CD_MUN'],'source':'IBGE Censo 2022'}
            neighborhoods[p['CD_MUN']].append((props,g)); features.append({'type':'Feature','properties':props,'geometry':mapping(g)})
    def locate(r,city):
        def num(v):
            try: return float(v.replace(',','.'))
            except (ValueError,AttributeError): return None
        lat,lon=num(r['NR_LATITUDE']),num(r['NR_LONGITUDE'])
        original_lat,original_lon=lat,lon
        status='Coordenada ausente ou inválida'; matches=[]
        if lat is not None and lon is not None and -90<=lat<=90 and -180<=lon<=180:
            point=Point(lon,lat)
            if geoms[city['ibge']].covers(point):
                status='Coordenada TSE dentro do limite municipal IBGE'
                matches=[p for p,g in neighborhoods[city['ibge']] if g.covers(point)]
            else: status='Coordenada TSE fora do limite municipal IBGE';lat=lon=None
        else: lat=lon=None
        name=r['NM_BAIRRO'].strip(); known=name not in ('','#NULO#','#NE#','-1')
        names={norm(p['name']):p['name'] for p,g in neighborhoods[city['ibge']]}
        label=names.get(norm(name),name.title()) if known else 'Não informado no cadastro TSE'
        kind='sem-cadastro' if not known else 'ribeirinhos' if norm(name).startswith('RIBEIRINHOS') or norm(name) in ('RIO AMAZONAS','RIO TAPAJOS') else 'rural' if norm(name).startswith('ZONA RURAL') else 'urbano' if matches or norm(name) in names else 'rural' if norm(name).startswith('PLANALTO') else 'localidades'
        quality='sem-coordenada' if lat is None else 'limite' if len(matches)>1 else 'fora-malha' if not matches else 'compativel' if norm(name)==norm(matches[0]['name']) else 'divergente'
        return {'lat':lat,'lon':lon,'latTse':original_lat,'lonTse':original_lon,'geoStatus':status,'bairroTse':name if known else '', 'localidadeNome':label,'localidadeId':city['id']+':'+(norm(name) if known else 'sem-cadastro'), 'tipoTerritorio':kind,'situacaoGeografica':quality,'areaIbgeId':matches[0]['id'] if len(matches)==1 else None,'bairroGeografico':matches[0]['name'] if len(matches)==1 else None}
    loc_cache={}; records=[]
    def canonical(k,v,aptos,count,source_name,bu=None):
        t,m,z,s=k
        if k not in config: raise ValueError(f'Voto sem seção principal na configuração {k}')
        r=locations.get(k)
        if r is None or r['DS_TIPO_SECAO_AGREGADA']!='Principal': raise ValueError(f'Cadastro principal ausente {k}')
        vc={n for n,c in cand(official[t,m]).items() if c['dvt']=='Válido'}
        nominal={n:q for n,q in v.items() if n not in ('95','96','branco','nulo')}
        valid=sum(q for n,q in nominal.items() if n in vc); tech=sum(q for n,q in nominal.items() if n not in vc)
        blank=v.get('95',v.get('branco',0)); null=v.get('96',v.get('nulo',0))
        if valid+tech+blank+null!=count: raise ValueError(f'Soma de votos não fecha {k}')
        lk=(t,m,z,int(r['NR_LOCAL_VOTACAO']))
        invariant=tuple(r[f] for f in ['NM_LOCAL_VOTACAO','DS_ENDERECO','NM_BAIRRO','NR_LATITUDE','NR_LONGITUDE'])
        if lk not in loc_cache: loc_cache[lk]=(invariant,locate(r,municipality[m]))
        if invariant!=loc_cache[lk][0]: raise ValueError(f'Local com dados divergentes {lk}')
        records.append({'id':f'{t}-{m}-{z}-{s}','turno':t,'municipioTse':f'{m:05}','municipioIbge':municipality[m]['ibge'],'municipio':municipality[m]['name'],'region':municipality[m]['region'],'zona':z,'secao':s,'agregadas':config[k],'localId':f'{m:05}-{z}-{int(r["NR_LOCAL_VOTACAO"])}','localNumero':int(r['NR_LOCAL_VOTACAO']),'local':r['NM_LOCAL_VOTACAO'],'endereco':r['DS_ENDERECO'],'lula':v.get('13',0),'flavio':v.get('22',0),'outros':valid-v.get('13',0)-v.get('22',0),'validos':valid,'brancos':blank,'nulos':null+tech,'nulosUrna':null,'nulosTecnicos':tech,'nominaisOriginais':sum(nominal.values()),'total':count,'aptos':aptos,'source':source_name,'buUrl':bu,**loc_cache[lk][1]})
    for k in principal[1]:
        if k not in votes or k not in details: raise ValueError(f'Primeiro turno incompleto {k}')
        d=details[k]; canonical(k,votes[k],int(d['QT_APTOS']),int(d['QT_COMPARECIMENTO']),'TSE CSV por seção')
    bu_hashes=[]; errors=[]; done=0
    for f in as_completed(futures):
        item=futures[f]
        try:
            d=f.result(); status=d.get('auxStatus','Totalizado'); canonical((2,*item),d['votos'],d['aptos'],d['comparecimento_bu'],'TSE BU decodificado · auxiliar '+status,d['buUrl'])
            bu_hashes.append({'municipio':f'{item[0]:05}','zona':item[1],'secao':item[2],'url':d['buUrl'],'sha256':d['sha256'],'auxStatus':status})
        except Exception as e: errors.append({'key':item,'error':str(e)})
        done+=1
        if done%1000==0: print('BUs processados',done,'/',len(tasks),'falhas',len(errors),flush=True)
    pool.shutdown()
    write(RAW/'errors.json',errors)
    if errors: raise ValueError(f'Coleta incompleta: {len(errors)} erros. Base anterior preservada.')
    records.sort(key=lambda r:(r['turno'],r['municipioTse'],r['zona'],r['secao']))
    if len({r['id'] for r in records})!=len(records): raise ValueError('Seções canônicas duplicadas')
    by_city=defaultdict(list)
    for r in records: by_city[int(r['municipioTse'])].append(r)
    checks=[]; city_rows=[]; state_totals={}
    def reconcile(rs,j,scope):
        s=sums(rs); cs=cand(j)
        expected={'lula':int(cs['13']['vap']),'flavio':int(cs['22']['vap']),'validos':int(j['v']['vv']),'brancos':int(j['v']['vb']),'nulos':int(j['v']['tvn']),'nulosTecnicos':int(j['v']['vnt']),'total':int(j['v']['tv']),'aptos':int(j['e']['te'])}
        for k,v in expected.items():
            if s[k]!=v: raise ValueError(f'Conciliação falhou {scope}/{k}: {s[k]} != {v}')
        if len(rs)!=int(j['s']['st']) or int(j['s']['snt']): raise ValueError(f'Cobertura incompleta {scope}')
        if any(r['total']>r['aptos'] or min(r[k] for k in FIELDS)<0 for r in rs): raise ValueError('Contadores impossíveis')
        checks.append({'name':scope,'passed':True})
        return {**s,'secoes':len(rs),'agregadas':sum(len(r['agregadas']) for r in rs),'locais':len({r['localId'] for r in rs}),'semCoordenadaSecoes':sum(r['lat'] is None for r in rs),'semCoordenadaVotos':sum(r['total'] for r in rs if r['lat'] is None),'semLocalidadeSecoes':sum(not r['bairroTse'] for r in rs),'dataTotalizacao':j['dg']+' '+j['hg']}
    for m,city in sorted(municipality.items()):
        ts={str(t):reconcile([r for r in by_city[m] if r['turno']==t],official[t,m],f'{city["name"]} · {t}º turno') for t in [1,2]}
        city_rows.append({**city,'totals':ts})
    for t in [1,2]: state_totals[str(t)]=reconcile([r for r in records if r['turno']==t],state[t],f'Pará · {t}º turno')
    for f in geo['features']:
        city=next(c for c in city_rows if c['ibge']==f['properties']['codarea'])
        f['properties'].update({'id':city['id'],'name':city['name'],'region':city['region']})
    # Derived local summaries support fast statewide maps without downloading every section.
    by_local=defaultdict(list)
    for r in records: by_local[r['turno'],r['localId']].append(r)
    locals_out=[]
    for (t,lid),rs in by_local.items():
        r=rs[0]
        fields=['turno','municipioTse','municipioIbge','municipio','region','zona','localId','localNumero','local','endereco','lat','lon','latTse','lonTse','geoStatus','bairroTse','localidadeNome','localidadeId','tipoTerritorio','situacaoGeografica','areaIbgeId','bairroGeografico']
        locals_out.append({**{k:r[k] for k in fields},**sums(rs),'secoes':len(rs),'sectionNumbers':[r['secao'] for r in rs],'agregadas':[s for r in rs for s in r['agregadas']]})
    for t in [1,2]:
        if sums([r for r in locals_out if r['turno']==t])!=sums([r for r in records if r['turno']==t]): raise ValueError('Agregação por local não conserva votos')
    aux_counts=dict(Counter(r['auxStatus'] for r in bu_hashes))
    meta={'collectedAt':datetime.now(timezone.utc).isoformat(),'year':2026,'state':'PA','municipios':144,'sources':list(SOURCES.values()),'checks':checks,'buAuxStatus':aux_counts,'aggregation':'Uma linha por turno/município/zona/seção principal. Agregadas são relacionadas sem somar seus votos outra vez. Não há divisão dos votos entre as agregadas.','bairroPolicy':'Bairro/localidade é o nome cadastral do local no TSE, não residência dos eleitores. Não define limites rurais. Área IBGE é uma classificação independente pela coordenada. Divergências não apagam nomes cadastrais.','territoryPolicy':'Ribeirinhos: cadastro iniciado por RIBEIRINHOS ou denominado RIO AMAZONAS/RIO TAPAJÓS. ZONA RURAL permanece rural; nomes/posições reconhecidos em bairros IBGE ficam urbanos, inclusive bairros chamados Planalto. PLANALTO sem correspondência urbana entra em Rural e planalto. Outros nomes ficam em Demais localidades; não se presume que todo nome iniciado por RIO seja ribeirinho. Grupos analíticos, não limites oficiais.','coordinatePolicy':'Coordenadas do TSE verificadas dentro do limite municipal IBGE. Inválidas ou externas não são desenhadas; seus votos permanecem nos totais. Não houve geocodificação aproximada nem visita de campo.','limitations':['Retrato estático, sem atualização automática. Coleta pode reutilizar arquivos em cache, com hashes preservados.','1º turno: CSV oficial por seção. 2º turno: 20.827 BUs oficiais conciliados com 144 totalizações municipais e a estadual.',f'Status nos auxiliares dos BUs: {aux_counts}. Arquivos com status Recebido não são rotulados como Totalizado: foram incluídos somente após conciliação exata de todos os contadores municipais e estaduais. O status auxiliar isolado não prova inclusão na totalização. URLs e estados estão em bu-hashes.json.','CSV do 1º turno contém 183 votos nominais não válidos na totalização final, classificados como nulos técnicos por conciliação exata em cada município. Os contadores originais são preservados. A classificação não explica o motivo jurídico.','Malha de bairros: IBGE Censo 2022; pode não cobrir áreas rurais nem representar mudanças posteriores.','Taxa de comparecimento usa aptos da totalização do respectivo turno; bases de aptos podem variar entre turnos.','Conferência estrutural e aritmética dos BUs; sem auditoria criptográfica de assinaturas.','Votação no estabelecimento não identifica residência nem preferência de moradores de um bairro.','Não há nesta versão dados de infraestrutura, qualidade de vida, renda ou oportunidades. Esses módulos exigem novas fontes e unidades comparáveis.']}
    # Final outputs are written only after EVERY municipal and statewide check passed.
    OUT.mkdir(parents=True,exist_ok=True)
    for m,rs in by_city.items(): write(OUT/'municipios'/f'{m:05}.json',{'municipio':municipality[m],'sections':rs})
    write(OUT/'index.json',{'meta':meta,'totals':state_totals,'municipalities':city_rows})
    write(OUT/'locals.json',locals_out)
    write(OUT/'municipios.geojson',geo)
    write(OUT/'bairros.geojson',{'type':'FeatureCollection','features':features})
    write(OUT/'sources.json',meta)
    write(OUT/'bu-hashes.json',sorted(bu_hashes,key=lambda r:(r['municipio'],r['zona'],r['secao'])))
    with (OUT/'secoes.csv').open('w',encoding='utf-8-sig',newline='') as f:
        wr=csv.DictWriter(f,fieldnames=list(records[0]),delimiter=';');wr.writeheader()
        for r in records: wr.writerow({**r,'agregadas':','.join(map(str,r['agregadas']))})
    print(json.dumps({'totals':state_totals,'municipios':len(city_rows),'bairros':len(features),'checks':len(checks),'locals':len(locals_out),'sections':len(records)},ensure_ascii=True),flush=True)

if __name__=='__main__':main()
