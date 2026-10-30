"""Synthetic ready cases only; no provider lookup, debt or fiscal action."""
import json,secrets,urllib.request,urllib.error
from psycopg.types.json import Jsonb
from store import config,db,digest
base='http://127.0.0.1:8793'
token=secrets.token_urlsafe(32);sid=digest(token)
headers={'x-mei-service':config()['proxy_key'],'x-mei-client':'e'*64,'content-type':'application/json','cookie':'__Host-mei-session='+token}
def call(path,body=None):
 req=urllib.request.Request(base+'/v1/'+path,data=json.dumps(body).encode() if body is not None else None,headers=headers)
 try:
  with urllib.request.urlopen(req,timeout=8) as r:return r.status,json.load(r)
 except urllib.error.HTTPError as e:return e.code,json.load(e)
try:
 source={'schema_version':2,'cadastro':{'cnpj':'62560654000127','name':'FIXTURE DE TESTE V009','simei':False},'official':{'status':'human_required'}}
 with db() as c:
  c.execute("INSERT INTO mei_cases(sid,cnpj,client_hash,state,source,answers,revision) VALUES (%s,'62560654000127','test-v009','ready',%s,%s,8)",(sid,Jsonb(source),Jsonb({'identity':'yes','simei':'yes','debt':'unknown','installment':'unknown','lawsuit':'unknown'})))
 code,old=call('current')
 assert code==200 and 'simei' not in old['answers'] and 'simei_check' in old['questions'] and not old['plan']['complete']
 assert call('answer',{'question':'debt','value':'yes','revision':8})[0]==422
 assert call('answer',{'question':'simei_check','value':'never','revision':8})[0]==422
 code,r=call('answer',{'question':'simei_check','value':'yes','revision':8})
 assert code==200 and r['answers']=={'identity':'yes','simei_check':'yes'} and 'payments' in r['questions']
 assert call('answer',{'question':'simei_check','value':'no','revision':8})[0]==409
 code,r=call('answer',{'question':'debt','value':'no','revision':r['revision']})
 assert code==200 and r['plan']['complete'] and r['plan']['steps'][0]['id']=='monthly'
 for answer in ('no','unknown'):
  code,r=call('answer',{'question':'simei_check','value':answer,'revision':r['revision']})
  assert code==200 and 'debt' not in r['answers'] and 'payments' not in r['questions'] and not r['plan']['complete']
  code,r=call('answer',{'question':'debt','value':'no','revision':r['revision']})
  assert code==200 and r['plan']['complete']
  if answer=='no':assert r['plan']['steps'][0]['id']=='registry'
  else:assert r['plan']['steps'][0]['id']=='registry'
 print('PASS: ready legacy session, sequencing, yes/no/unknown, source override, revision conflict, pruning, disclosure')
finally:
 with db() as c:c.execute('DELETE FROM mei_cases WHERE sid=%s',(sid,))
