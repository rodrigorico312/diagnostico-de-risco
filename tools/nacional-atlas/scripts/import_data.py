"""Importacao reproduzivel e fail-closed: TSE 2026 + geografia oficial do IBGE.
Cache em data/raw; --refresh remove somente os arquivos de cache conhecidos.
O JSON publicado so e substituido depois de todas as conciliacoes passarem.
"""
from pathlib import Path
from datetime import datetime,timezone
from collections import defaultdict,Counter
import csv,io,json,zipfile,hashlib,unicodedata,sys,os,time
import shapefile
from shapely.geometry import shape,Point,mapping
from shapely.ops import transform
from pyproj import Transformer,CRS
from collect_second import run as collect_bu,get,RAW
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/data'
URLS={
 'votacao_secao_2026_BR.zip':'https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_secao/votacao_secao_2026_BR.zip',
 'detalhe_votacao_secao_2026.zip':'https://cdn.tse.jus.br/estatistica/sead/odsele/detalhe_votacao_secao/detalhe_votacao_secao_2026.zip',
 'eleitorado_local_votacao_2026.zip':'https://cdn.tse.jus.br/estatistica/sead/odsele/eleitorado_locais_votacao/eleitorado_local_votacao_2026.zip',
 'PA_bairros_CD2022.zip':'https://geoftp.ibge.gov.br/organizacao_do_territorio/malhas_territoriais/malhas_de_setores_censitarios__divisoes_intramunicipais/censo_2022/bairros/shp/UF/PA_bairros_CD2022.zip',
 'santarem-limite.geojson':'https://servicodados.ibge.gov.br/api/v3/malhas/municipios/1506807?formato=application/vnd.geo+json&qualidade=maxima',
 'santarem-total-1t.json':'https://resultados.tse.jus.br/oficial/ele2026/6257/dados/pa/pa05355-c0001-e006257-u.json',
 'santarem-total-2t.json':'https://resultados.tse.jus.br/oficial/ele2026/6258/dados/pa/pa05355-c0001-e006258-u.json',
 'pa-p003221-cs.json':'https://resultados.tse.jus.br/oficial/ele2026/arquivo-urna/3221/config/pa/pa-p003221-cs.json',
 'pa-p003220-cs.json':'https://resultados.tse.jus.br/oficial/ele2026/arquivo-urna/3220/config/pa/pa-p003220-cs.json',
 'resultados-2026-catalogo.json':'https://dadosabertos.tse.jus.br/api/3/action/package_show?id=resultados-2026',
 'eleitorado-2026-catalogo.json':'https://dadosabertos.tse.jus.br/api/3/action/package_show?id=eleitorado-2026'}
def read(name):return json.loads((RAW/name).read_text(encoding='utf-8'))
def write(path,obj):
    path.parent.mkdir(parents=True,exist_ok=True)
    tmp=path.with_suffix(path.suffix+'.part');tmp.write_text(json.dumps(obj,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
    for attempt in range(6):
        try:tmp.replace(path);return
        except PermissionError:
            if attempt==5:raise RuntimeError(f'Arquivo em uso: {path}. Feche o servidor de desenvolvimento antes de reimportar. O retrato anterior foi preservado.')
            time.sleep(.5)
def norm(s):return ' '.join(''.join(c for c in unicodedata.normalize('NFD',s.upper()) if not unicodedata.combining(c)).split())
def subset(archive,suffix):
    dest=RAW/archive.replace('.zip','-santarem.json')
    if dest.exists():return json.loads(dest.read_text(encoding='utf-8'))
    rows=[]
    with zipfile.ZipFile(RAW/archive) as z:
        members=[n for n in z.namelist() if n.endswith(suffix)]
        if not members:raise ValueError(f'CSV ausente: {archive}')
        for name in members:
            with z.open(name) as f:
                reader=csv.DictReader(io.TextIOWrapper(f,encoding='latin1'),delimiter=';')
                required={'NR_TURNO','SG_UF','CD_MUNICIPIO','NR_ZONA','NR_SECAO'}
                if not required.issubset(set(reader.fieldnames or [])):raise ValueError('Schema TSE mudou')
                for r in reader:
                    if r['SG_UF']=='PA' and int(r['CD_MUNICIPIO'])==5355 and r.get('CD_CARGO','1')=='1':rows.append(r)
    write(dest,rows);return rows
def sectionkey(r):return (int(r['NR_TURNO']),int(r['NR_ZONA']),int(r['NR_SECAO']))
def number(s):
    try:return float(s.replace(',','.'))
    except (ValueError,AttributeError):return None
def main():
    RAW.mkdir(parents=True,exist_ok=True)
    if '--refresh' in sys.argv:
        # Exact cache allowlist, never recursive deletion.
        for name in list(URLS)+['bu2t-collection.json','votacao_secao_2026_BR-santarem.json','detalhe_votacao_secao_2026-santarem.json','eleitorado_local_votacao_2026-santarem.json']:
            (RAW/name).unlink(missing_ok=True)
        for p in (RAW/'bu2t').glob('*'):
            if p.is_file() and p.suffix in ('.dat','.json'):p.unlink()
    sources=[]
    for name,url in URLS.items():
        data=get(url,RAW/name)
        sources.append({'id':name,'url':url,'sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data)})
    locations=subset('eleitorado_local_votacao_2026.zip','_PA.csv')
    votes=subset('votacao_secao_2026_BR.zip','_BR.csv')
    details=subset('detalhe_votacao_secao_2026.zip','_BR.csv')
    print('CSV turnos publicados:',sorted(set(r['NR_TURNO'] for r in votes)),flush=True)
    loc_index={}
    for r in locations:
        k=sectionkey(r)
        if k in loc_index:raise ValueError(f'Cadastro duplicado {k}')
        loc_index[k]=r
    with zipfile.ZipFile(RAW/'PA_bairros_CD2022.zip') as z:
        buf=lambda e:io.BytesIO(z.read(next(n for n in z.namelist() if n.endswith(e))))
        reader=shapefile.Reader(shp=buf('.shp'),shx=buf('.shx'),dbf=buf('.dbf'),encoding='utf-8')
        crs=CRS.from_wkt(z.read(next(n for n in z.namelist() if n.endswith('.prj'))).decode())
        trans=Transformer.from_crs(crs,'EPSG:4326',always_xy=True).transform
        polygons=[];features=[]
        for sr in reader.iterShapeRecords():
            props=sr.record.as_dict()
            if props['CD_MUN']!='1506807':continue
            geom=transform(trans,shape(sr.shape.__geo_interface__))
            if not geom.is_valid:raise ValueError('Poligono IBGE invalido')
            props={'id':props['CD_BAIRRO'],'name':props['NM_BAIRRO'],'source':'IBGE · Censo 2022'}
            polygons.append((props,geom));features.append({'type':'Feature','properties':props,'geometry':mapping(geom)})
    municipality=read('santarem-limite.geojson')
    municipal_geom=shape(municipality['features'][0]['geometry'])
    if not polygons:raise ValueError('Bairros oficiais de Santarem ausentes')
    def locate(r):
        lat,lon=number(r.get('NR_LATITUDE')),number(r.get('NR_LONGITUDE'))
        geostatus='Coordenada ausente ou inválida';matches=[]
        if lat is not None and lon is not None and -90<=lat<=90 and -180<=lon<=180:
            point=Point(lon,lat)
            if municipal_geom.covers(point):
                geostatus='Coordenada TSE dentro do município'
                matches=[props for props,poly in polygons if poly.covers(point)]
            else:geostatus='Coordenada TSE fora do limite municipal';lat=lon=None
        else:lat=lon=None
        tse=r.get('NM_BAIRRO','').strip()
        bairro='Não identificado';bid=None;reason='Fora dos bairros urbanos da malha IBGE 2022 ou sem coordenada verificável'
        if len(matches)==1:
            if norm(tse)==norm(matches[0]['name']) or tse in ('','#NULO#','#NE#'):
                bairro=matches[0]['name'];bid=matches[0]['id'];reason='Coordenada TSE em polígono IBGE; cadastro compatível'
            else:reason='Divergência entre bairro cadastral TSE e polígono IBGE'
        elif len(matches)>1:reason='Ponto em limite ou sobreposição de bairros'
        known_names={norm(props['name']):props['name'] for props,_ in polygons}
        has_name=tse not in ('','#NULO#','#NE#','Não informado')
        place_name=known_names.get(norm(tse),tse.title()) if has_name else 'Cadastro sem localidade'
        place_id='tse:'+norm(tse) if has_name else 'tse:sem-localidade'
        if not has_name:territory='sem-cadastro'
        elif norm(tse).startswith(('RIBEIRINHOS','RIO ')):territory='ribeirinhos'
        elif norm(tse).startswith(('PLANALTO','ZONA RURAL')):territory='rural'
        elif matches or norm(tse) in known_names:territory='urbano'
        else:territory='localidades'
        territory_label={'urbano':'Bairros urbanos','ribeirinhos':'Ribeirinhos','rural':'Rural e planalto','localidades':'Demais localidades','sem-cadastro':'Sem localidade no cadastro'}[territory]
        geographic_status='sem-coordenada' if lat is None else 'limite' if len(matches)>1 else 'fora-malha' if not matches else 'compativel' if bid else 'divergente'
        return {'lat':lat,'lon':lon,'geoStatus':geostatus,'bairro':bairro,'bairroId':bid,'bairroTse':tse or 'Não informado','bairroGeografico':matches[0]['name'] if len(matches)==1 else None,'bairroStatus':reason,
          'localidadeId':place_id,'localidadeNome':place_name,'tipoTerritorio':territory,'tipoTerritorioNome':territory_label,'situacaoGeografica':geographic_status,'areaIbgeId':matches[0]['id'] if len(matches)==1 else None}
    # First turn: one vote row per votable; never sum repeated turnout columns.
    vote_groups=defaultdict(dict);vote_meta={}
    for r in votes:
        if int(r['ANO_ELEICAO'])!=2026:raise ValueError('Ano inesperado')
        k=sectionkey(r);v=r['NR_VOTAVEL']
        if v in vote_groups[k]:raise ValueError(f'Votacao duplicada {k}/{v}')
        vote_groups[k][v]=int(r['QT_VOTOS']);vote_meta[k]=r
    detail_index={sectionkey(r):r for r in details}
    if len(detail_index)!=len(details):raise ValueError('Detalhe duplicado')
    config={}
    for turn,file in [(1,'pa-p003220-cs.json'),(2,'pa-p003221-cs.json')]:
        j=read(file)
        for m in [m for a in j['abr'] for m in a['mu'] if int(m['cd'])==5355]:
            for z in m['zon']:
                for s in z['sec']:
                    if not s.get('nsp'):config[(turn,int(z['cd']),int(s['ns']))]=s.get('nsa',[])
    records=[]
    valid_codes={}
    for turn in (1,2):
        official=read(f'santarem-total-{turn}t.json')
        valid_codes[turn]={str(c['n']) for cargo in official['carg'] for group in cargo['agr'] for party in group['par'] for c in party.get('cand',[]) if c.get('dvt')=='Válido'}
    def canonical(k,v,aptos,total,source,buurl=None):
        r=loc_index.get(k)
        if r is None:raise ValueError(f'Secao sem cadastro: {k}')
        if r['DS_TIPO_SECAO_AGREGADA']!='Principal':raise ValueError('Tentativa de contar agregada separadamente')
        nominal={key:count for key,count in v.items() if key not in ('95','96','branco','nulo')}
        valid=sum(count for key,count in nominal.items() if key in valid_codes[k[0]])
        technical=sum(count for key,count in nominal.items() if key not in valid_codes[k[0]])
        blank=v.get('95',v.get('branco',0));null_raw=v.get('96',v.get('nulo',0));null=null_raw+technical
        if valid+blank+null!=total:raise ValueError(f'Total nao confere {k}')
        row={'id':f'{k[0]}-{k[1]}-{k[2]}','turno':k[0],'municipio':'Santarém','municipioTse':'05355','municipioIbge':'1506807','zona':k[1],'secao':k[2],
         'agregadas':[int(x) for x in config.get(k,[])],'localId':f'{k[1]}-{int(r["NR_LOCAL_VOTACAO"])}','localNumero':int(r['NR_LOCAL_VOTACAO']),
         'local':r['NM_LOCAL_VOTACAO'],'endereco':r['DS_ENDERECO'],'lula':v.get('13',0),'flavio':v.get('22',0),'outros':valid-v.get('13',0)-v.get('22',0),
         'brancos':blank,'nulos':null,'nulosUrna':null_raw,'nulosTecnicos':technical,'nominaisOriginais':sum(nominal.values()),'validos':valid,'total':total,'aptos':aptos,'source':source,'buUrl':buurl,**locate(r)}
        records.append(row)
    for k,v in sorted(vote_groups.items()):
        if k[0]!=1:continue
        d=detail_index.get(k)
        if not d:raise ValueError('Detalhe de comparecimento ausente')
        canonical(k,v,int(d['QT_APTOS']),int(d['QT_COMPARECIMENTO']),'CSV oficial TSE · votação por seção')
    collected=read('bu2t-collection.json') if (RAW/'bu2t-collection.json').exists() else collect_bu()
    if collected['errors']:raise ValueError('BUs incompletos')
    for r in collected['rows']:
        canonical((2,int(r['zona']),int(r['secao'])),r['votos'],r['aptos'],r['comparecimento_bu'],'BU oficial TSE · decodificado',r['bu_url'])
    if len({r['id'] for r in records})!=len(records):raise ValueError('Chave canonica duplicada')
    local_invariants={}
    for r in records:
        key=(r['turno'],r['localId'])
        fields=tuple(r[k] for k in ['local','endereco','lat','lon','bairroId','bairroTse'])
        if key in local_invariants and local_invariants[key]!=fields:raise ValueError(f'Cadastro inconsistente dentro do local: {key}')
        local_invariants[key]=fields
    checks=[];totals={}
    for turn in (1,2):
        rs=[r for r in records if r['turno']==turn];official=read(f'santarem-total-{turn}t.json')
        expected={str(c['n']):int(c['vap']) for cargo in official['carg'] for group in cargo['agr'] for party in group['par'] for c in party.get('cand',[])}
        values={key:sum(r[key] for r in rs) for key in ['lula','flavio','outros','validos','brancos','nulos','total','aptos']}
        required={'lula':expected['13'],'flavio':expected['22'],'validos':int(official['v']['vv']),'brancos':int(official['v']['vb']),'nulos':int(official['v']['tvn']),'total':int(official['v']['tv'])}
        for key,value in required.items():
            if values[key]!=value:raise ValueError(f'Conciliacao municipal falhou {turn}/{key}: {values[key]} != {value}')
        if sum(r['nulosTecnicos'] for r in rs)!=int(official['v']['vnt']):raise ValueError('Reclassificacao tecnica nao conciliada')
        if len(rs)!=int(official['s']['st']) or official['s']['snt']!='0':raise ValueError('Cobertura de secoes incompleta')
        missing_geo=[r for r in rs if r['lat'] is None];missing_bairro=[r for r in rs if not r['bairroId']]
        territory_summary=[{'id':kind,'nome':next(r['tipoTerritorioNome'] for r in rs if r['tipoTerritorio']==kind),'secoes':sum(r['tipoTerritorio']==kind for r in rs),'locais':len({r['localId'] for r in rs if r['tipoTerritorio']==kind}),'votos':sum(r['total'] for r in rs if r['tipoTerritorio']==kind)} for kind in ['urbano','ribeirinhos','rural','localidades','sem-cadastro'] if any(r['tipoTerritorio']==kind for r in rs)]
        if sum(x['votos'] for x in territory_summary)!=values['total']:raise ValueError('Classificacao territorial nao conserva os votos')
        totals[str(turn)]={**values,'secoes':len(rs),'agregadas':sum(len(r['agregadas']) for r in rs),'locais':len({r['localId'] for r in rs}),'semCoordenadaSecoes':len(missing_geo),'semCoordenadaVotos':sum(r['total'] for r in missing_geo),'semBairroSecoes':len(missing_bairro),'semBairroVotos':sum(r['total'] for r in missing_bairro),'localidadesCadastro':len({r['localidadeId'] for r in rs}),'semLocalidadeCadastro':sum(r['tipoTerritorio']=='sem-cadastro' for r in rs),'territorios':territory_summary,'conferenciaCartografica':dict(Counter(r['situacaoGeografica'] for r in rs)),'dataTotalizacao':official['dg']+' '+official['hg']}
        checks.append({'name':f'{turn}º turno: {len(rs)} seções principais conciliadas com total municipal','passed':True,'details':required})
    # Public provenance contains hashes and public URLs, never electorate personal data.
    manifest={'collectedAt':datetime.now(timezone.utc).isoformat(),'sources':sources,'checks':checks,'csvTurns':sorted(set(int(r['NR_TURNO']) for r in votes)),
      'municipioTse':'05355','municipioIbge':'1506807','coordinateSource':'Coordenadas do cadastro TSE 2026, verificadas quanto à presença no limite municipal. Não houve visita ou conferência individual dos estabelecimentos.',
      'geography':'Bairros do IBGE, Censo 2022, reprojetados de SIRGAS 2000 para WGS84. Não constituem confirmação de vigência jurídica em 2026.',
      'bairroPolicy':'Tabelas e filtros usam o bairro ou localidade informado pelo TSE (localidadeId/localidadeNome). A concordância entre esse cadastro e a posição na malha IBGE é uma conferência separada, registrada em situacaoGeografica. O campo legado bairroId mantém o critério estrito de concordância; não é usado para esconder localidades conhecidas. As cores dos polígonos somam locais pela posição da coordenada no IBGE (areaIbgeId), sem atribuir a esses polígonos o bairro divergente do cadastro.',
      'territoryPolicy':'Ribeirinhos: nomes do TSE iniciados por RIBEIRINHOS ou RIO. Rural e planalto: nomes iniciados por PLANALTO ou ZONA RURAL. Bairros urbanos: ponto na malha de bairros ou nome cadastral presente nessa malha. Demais localidades: demais nomes do cadastro, sem inferir limites ou situação jurídica. A classificação é analítica, baseada nessas regras explícitas; nomes originais do TSE são preservados.',
      'aggregation':'Uma linha por turno/município/zona/seção principal. Seções agregadas são relacionadas, sem somar novamente seus votos; não existe divisão dos votos da urna por seção agregada.',
      'limitations':['CSV consolidado consultado contém apenas 1º turno. O 2º turno foi obtido em 872 BUs oficiais e conciliado com o resultado municipal.','No 1º turno, o CSV registra 7 votos para nº 28 que não integram a lista válida da totalização final. Foram classificados separadamente como nulos técnicos por conciliação exata com vnt=7; nulos da urna e nominais originais são preservados. A classificação é um tratamento analítico explícito, não alteração da fonte nem conclusão sobre o motivo jurídico.','Percentuais usam todos os votos válidos do respectivo turno. Outros candidatos são preservados no primeiro turno.','Bairro refere-se ao local de votação, nunca à residência dos eleitores.','Sem polígonos de zonas eleitorais: elas são filtros de seções, não territórios desenhados.','Não foi localizada nesta coleta uma malha municipal de bairros com vigência de 2026, publicada pela Prefeitura; a base cartográfica usada é explicitamente IBGE 2022.','BUs foram validados estruturalmente e aritmeticamente; não houve auditoria criptográfica de assinaturas.'],
      'buFiles':[{'url':r['bu_url'],'sha256':r['sha256'],'zona':r['zona'],'secao':r['secao']} for r in collected['rows']]}
    output={'meta':manifest,'totals':totals,'sections':records}
    OUT.mkdir(parents=True,exist_ok=True)
    write(OUT/'election.json',output);write(OUT/'bairros.geojson',{'type':'FeatureCollection','features':features});write(OUT/'municipio.geojson',municipality);write(OUT/'sources.json',manifest)
    with (OUT/'secoes.csv').open('w',encoding='utf-8-sig',newline='') as f:
        fields=[k for k in records[0] if k!='agregadas'];writer=csv.DictWriter(f,fields,delimiter=';',extrasaction='ignore');writer.writeheader();writer.writerows(records)
    print(json.dumps({'totals':totals,'bairros':len(features),'checks':checks},ensure_ascii=True),flush=True)
if __name__=='__main__':main()
