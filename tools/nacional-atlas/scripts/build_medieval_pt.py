"""Derive a Portuguese reading catalogue; preserve upstream facts and geometry.

This is a field-based reading mode, not a translation of the narrative corpus.
Run after prepare_invadergis.py. No external translation service is used.
"""
from pathlib import Path
import hashlib,json

ROOT=Path(__file__).resolve().parents[1]
base=ROOT/'public/invadergis/data/records'
labels=json.loads((ROOT/'research/medieval-pt.json').read_text(encoding='utf-8'))
raw=(base/'polity.json').read_bytes()
polities=json.loads(raw)
sources=json.loads((base/'source.json').read_text(encoding='utf-8'))

# Use the exact geometry prepared by the upstream baker, rather than infer the
# meaning of legacy nested arrays. Legacy shapes omitted by upstream stay absent.
geo_raw=(ROOT/'public/invadergis/data/layers/polities.geojson').read_bytes()
geo=json.loads(geo_raw)
snapshots_by_id={}
for f in geo['features']:
    prop=f['properties']; geometry=f['geometry']
    if geometry['type'] not in ('Polygon','MultiPolygon'): raise ValueError('Tipo geométrico inválido')
    snapshots_by_id.setdefault(prop['id'],[]).append({'year':prop['snapshotYear'],'geometry':geometry})

records=[]
for p in polities:
    name=labels['names'].get(p['id'])
    if not name: raise ValueError('Nome sem revisão em português: '+p['id'])
    if p.get('region','') not in labels['regions']: raise ValueError(p['region'])
    if p.get('type','') not in labels['types']: raise ValueError(p['type'])
    snapshots=snapshots_by_id.get(p['id'],[])
    provenance=p.get('provenance',{})
    records.append({'id':p['id'],'name':name,'originalName':p.get('name_primary',''),
      'type':labels['types'][p.get('type','')],'region':labels['regions'][p.get('region','')],
      'formed':p.get('formed'),'dissolved':p.get('dissolved'),
      'status':labels['status'].get(provenance.get('status',''),'Não informado'),
      'confidence':labels['confidence'].get(provenance.get('confidence',''),'Não informada'),
      'sources':provenance.get('sources_used',[]),'snapshots':snapshots})
result={'meta':{'upstream':'https://github.com/g-lanza/InvaderGIS',
 'commit':'c2acb1e9cddd75ded98246f8c518ac9acc74a593','startYear':500,'endYear':1500,
 'inputSha256':hashlib.sha256(raw).hexdigest(),'geometrySha256':hashlib.sha256(geo_raw).hexdigest(),'translation':'Nomes e campos estruturados revisados em português. Narrativas originais não traduzidas.',
 'geometry':'Geometrias idênticas à camada GeoJSON preparada pelo InvaderGIS. Último desenho disponível até o ano escolhido, sem interpolação nem uso de desenho futuro. Arrays legados sem geometria publicada pelo upstream ficam ausentes.',
 'license':'Dados CC BY-NC 4.0; fontes originais em invadergis/ATTRIBUTIONS.txt'},
 'records':records,'sources':[{'id':s['id'],'title':s.get('title',s['id']),'author':s.get('author',''),'year':s.get('year'),'url':s.get('url','')} for s in sources]}
target=ROOT/'public/history-data/medieval-pt.json'
target.write_text(json.dumps(result,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print(json.dumps({'records':len(records),'sources':len(sources),'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest()}))
