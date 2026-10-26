"""Recortes locais verificáveis, sem modificar resultados ou o cadastro do TSE.

Execute depois de import_para.py. Distrito: ponto na malha original IBGE.
Vila: somente endereços explicitamente identificados, sem criar polígono.
"""
from pathlib import Path
import hashlib, io, json, zipfile
import requests, shapefile
from shapely.geometry import shape, Point, mapping

ROOT = Path(__file__).resolve().parents[1]
URL = 'https://geoftp.ibge.gov.br/organizacao_do_territorio/malhas_territoriais/malhas_de_setores_censitarios__divisoes_intramunicipais/censo_2022/distritos/shp/UF/PA_distritos_CD2022.zip'
cache = ROOT / 'data/raw/PA_distritos_CD2022.zip'
cache.parent.mkdir(parents=True, exist_ok=True)
if not cache.exists():
    response = requests.get(URL, timeout=120)
    response.raise_for_status()
    cache.write_bytes(response.content)
archive = zipfile.ZipFile(cache)
stem = next(n[:-4] for n in archive.namelist() if n.endswith('.shp'))
reader = shapefile.Reader(**{ext: io.BytesIO(archive.read(stem+'.'+ext)) for ext in ['shp','shx','dbf']}, encoding='utf-8')
record = next(r for r in reader.iterShapeRecords() if r.record.as_dict()['CD_DIST']=='150680710')
geometry = shape(record.shape.__geo_interface__)
places = json.loads((ROOT/'public/para-data/locals.json').read_text(encoding='utf-8'))
district = sorted({p['localId'] for p in places if p['municipioTse']=='05355' and p['lat'] is not None and geometry.covers(Point(p['lon'],p['lat']))})
village = sorted({p['localId'] for p in places if p['municipioTse']=='05355' and p['endereco'] in ['VILA DE ALTER DO CHÃO','COMUNIDADE UNIÃO DE ALTER DO CHÃO']})
assert len(village)==2 and set(village).issubset(district), 'Revisar os endereços da vila antes de publicar'
result = {'type':'FeatureCollection','source':{'url':URL,'sha256':hashlib.sha256(cache.read_bytes()).hexdigest(),'vintage':2022},'features':[
    {'type':'Feature','properties':{'id':'150680710','name':'Alter do Chão — distrito IBGE','municipioIbge':'1506807','kind':'district','localIds':district,'source':'IBGE Censo 2022','method':'Coordenada cadastral dentro da malha original do distrito; inclui comunidades além da vila.'},'geometry':mapping(geometry.simplify(.00003,preserve_topology=True))},
    {'type':'Feature','properties':{'id':'alter-vila','name':'Alter do Chão — vila / endereços explícitos','municipioIbge':'1506807','kind':'locality','localIds':village,'source':'Endereços do cadastro de locais de votação TSE 2026','method':'Somente VILA DE ALTER DO CHÃO e COMUNIDADE UNIÃO DE ALTER DO CHÃO. Recorte de dois estabelecimentos, sem inferir limite da vila ou total distrital.'},'geometry':None}
]}
(ROOT/'public/para-data/territorios.json').write_text(json.dumps(result,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print(json.dumps({'districtPlaces':len(district),'villagePlaces':len(village),'sha256':result['source']['sha256']}))
