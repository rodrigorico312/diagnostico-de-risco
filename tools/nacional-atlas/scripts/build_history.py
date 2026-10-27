"""Valida e empacota a seleção histórica a partir dos registros editoriais revisados."""
from pathlib import Path
import json,hashlib,datetime
ROOT=Path(__file__).resolve().parents[1]
sources=[];events=[];appointments=[];hashes={}
for stem in ['foundations','justice','root']:
    p=ROOT/'research'/f'{stem}.json';raw=p.read_bytes();j=json.loads(raw);hashes[p.name]=hashlib.sha256(raw).hexdigest()
    prefix=lambda id:stem+':'+id
    for s in j['sources']:sources.append({**s,'id':prefix(s['id'])})
    for e in j['events']:
        events.append({**e,'id':prefix(e['id']),'sources':[prefix(s) for s in e['sources']],'related':[prefix(id) for id in e.get('related',[])]})
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
check('Notícia atual não promovida a documento judicial',next(e for e in events if e['id']=='root:passaportes-2026')['evidence']=='reported')
meta={'updatedAt':'27/10/2026','scope':'Primeira seleção editorial para navegar por décadas, anos, atores e temas. Não é uma enciclopédia nem um inventário completo de governos, nomeações ou julgamentos.','limitations':['Há evidências arqueológicas e outras fontes anteriores a 1500. O marcador técnico year=0 agrupa esse período e não data os vestígios.','Textos institucionais podem resumir decisões. Quando a íntegra não foi examinada, a nota da fonte e os limites do acontecimento informam isso.','Uma lei documenta o que foi estabelecido. Efeitos quantitativos sobre renda, saúde ou voto exigem dados próprios; não foram inventadas séries históricas.','Vínculos por pessoas ou temas não demonstram causalidade, aliança, troca de favores ou motivação ilícita. Nomeações não demonstram comando partidário.','O caso dos passaportes de Flávio em 2026 está apoiado em notícia identificada; número do processo e decisão original permanecem pendentes nesta coleta.','Registro sem dado não equivale a zero; décadas e anos sem eventos mostram lacunas desta seleção. Fontes e base precisam de nova revisão para atualização.'],'checks':checks,'inputHashes':hashes}
out=ROOT/'public/history-data';out.mkdir(parents=True,exist_ok=True)
(out/'index.json').write_text(json.dumps({'meta':meta,'sources':sources,'events':events,'appointments':appointments},ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print(json.dumps({'events':len(events),'sources':len(sources),'appointments':len(appointments),'checks':len(checks)}))
