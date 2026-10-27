"""Valida e empacota a seleção histórica a partir dos registros editoriais revisados."""
from pathlib import Path
import json,hashlib,datetime
ROOT=Path(__file__).resolve().parents[1]
sources=[];events=[];appointments=[];hashes={}
for stem in ['foundations','justice','root','statements']:
    p=ROOT/'research'/f'{stem}.json';raw=p.read_bytes();j=json.loads(raw);hashes[p.name]=hashlib.sha256(raw).hexdigest()
    prefix=lambda id:id if ':' in id else stem+':'+id
    for s in j['sources']:sources.append({**s,'id':prefix(s['id'])})
    for e in j['events']:
        item={**e,'id':prefix(e['id']),'sources':[prefix(s) for s in e['sources']],'related':[prefix(id) for id in e.get('related',[])]}
        if e.get('statement'):item['statement']={**e['statement'],'source':prefix(e['statement']['source'])}
        if e.get('studyLinks'):item['studyLinks']=[{**link,'event':prefix(link['event'])} for link in e['studyLinks']]
        events.append(item)
    for a in j.get('appointments',[]):appointments.append({**a,'id':prefix(a['id']),'source':prefix(a['source'])})
sources.sort(key=lambda s:s['title']);events.sort(key=lambda e:(e['year'],e.get('date',f"{e['year']:04d}-01-01"),e['id']))
source_ids={s['id'] for s in sources};event_ids={e['id'] for e in events}
checks=[]
def check(name,condition):
    if not condition:raise SystemExit('Validação reprovada: '+name)
    checks.append({'name':name,'passed':True})
check('Identificadores únicos',len(source_ids)==len(sources) and len(event_ids)==len(events))
check('Referências resolvidas',all(e['sources'] and all(s in source_ids for s in e['sources']) and all(r in event_ids for r in e['related']) for e in events))
check('Fontes HTTPS',all(s['url'].startswith('https://') and s.get('checkedAt') for s in sources))
check('Nomeações com fonte',all(a['source'] in source_ids for a in appointments))
check('Limites e natureza da evidência',all(e['limits'] and e['evidence'] in ['documented','reported','question'] for e in events))
check('Datas arqueológicas não inventadas',all(e.get('approximate') for e in events if e['year']==0))
check('Datas válidas',all(0<=e['year']<=2026 and (not e.get('date') or datetime.date.fromisoformat(e['date']).year==e['year']) for e in events))
statements=[e for e in events if e.get('statement')]
check('Falas e publicações com autoria, data, trecho e fonte vinculada',all(e.get('date') and e['statement']['kind'] in ['speech','publication'] and all(e['statement'].get(k) for k in ['speaker','roleAtTime','venue','excerpt','locator','declaredContext','intentLimit']) and e['statement']['source'] in e['sources'] for e in statements))
check('Trilhas de estudo com destinos existentes',all(link.get('label') and link['event'] in event_ids for e in events for link in e.get('studyLinks',[])))
geographic=json.loads((ROOT/'public/context-data/municipios.geojson').read_text(encoding='utf8'))
place_ids={e['place']['municipalityCode'] for e in events if e.get('place')}
features=[f for f in geographic['features'] if str(f['properties'].get('id')) in place_ids]
check('Referências municipais verificadas na malha do IBGE',place_ids=={str(f['properties']['id']) for f in features})
check('Notícia atual não promovida a documento judicial',next(e for e in events if e['id']=='root:passaportes-2026')['evidence']=='reported')
meta={'updatedAt':'27/10/2026','scope':'Primeira seleção editorial para navegar por décadas, anos, atores e temas. Não é uma enciclopédia nem um inventário completo de governos, nomeações ou julgamentos.','limitations':['Há evidências arqueológicas e outras fontes anteriores a 1500. O marcador técnico year=0 agrupa esse período e não data os vestígios.','Textos institucionais podem resumir decisões. Quando a íntegra não foi examinada, a nota da fonte e os limites do acontecimento informam isso.','Uma lei documenta o que foi estabelecido. Efeitos quantitativos sobre renda, saúde ou voto exigem dados próprios; não foram inventadas séries históricas.','Vínculos por pessoas ou temas não demonstram causalidade, aliança, troca de favores ou motivação ilícita. Nomeações não demonstram comando partidário.','O caso dos passaportes de Flávio em 2026 está apoiado em notícia identificada; número do processo e decisão original permanecem pendentes nesta coleta.','Registro sem dado não equivale a zero; décadas e anos sem eventos mostram lacunas desta seleção. Fontes e base precisam de nova revisão para atualização.'],'checks':checks,'inputHashes':hashes}
meta['limitations'].append('Falas e publicações são uma seleção editorial, sem representatividade estatística. A fonte da fala comprova ocorrência e atribuição; suas alegações e a intenção do autor exigem exame próprio. O mapa usa referências municipais atuais, sem precisão de endereço.')
out=ROOT/'public/history-data';out.mkdir(parents=True,exist_ok=True)
(out/'index.json').write_text(json.dumps({'meta':meta,'sources':sources,'events':events,'appointments':appointments},ensure_ascii=False,separators=(',',':')),encoding='utf-8')
(out/'places.geojson').write_text(json.dumps({'type':'FeatureCollection','features':features,'metadata':{'sourceUrl':'https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=application/vnd.geo+json&qualidade=minima&intrarregiao=municipio','sourceFileSha256':hashlib.sha256((ROOT/'public/context-data/municipios.geojson').read_bytes()).hexdigest(),'precision':'Malha municipal atual simplificada; marcadores representam o centro do enquadramento cartográfico, não endereço exato nem limites históricos.'}},ensure_ascii=False,separators=(',',':')),encoding='utf8')
print(json.dumps({'events':len(events),'sources':len(sources),'appointments':len(appointments),'checks':len(checks)}))
