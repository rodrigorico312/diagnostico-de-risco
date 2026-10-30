import json,time,secrets,urllib.request,urllib.error
from psycopg.types.json import Jsonb
from store import config,db,digest
base='http://127.0.0.1:8793';token=secrets.token_urlsafe(32);sid=digest(token)
cookie='__Host-mei-session='+token
headers={'x-mei-service':config()['proxy_key'],'x-mei-client':'d'*64,'content-type':'application/json','cookie':cookie}
def call(path,body=None):
 req=urllib.request.Request(base+'/v1/'+path,data=json.dumps(body).encode() if body is not None else None,headers=headers)
 with urllib.request.urlopen(req,timeout=10) as r:return r.status,json.load(r)
for _ in range(30):
 try:urllib.request.urlopen(base+'/health',timeout=2).close();break
 except urllib.error.URLError:time.sleep(.2)
try:
 with db() as c:
  c.execute("INSERT INTO mei_cases(sid,cnpj,client_hash,state,source,answers,revision) VALUES (%s,'62560654000127','test-refresh','ready',%s,%s,8)",(sid,Jsonb({'cadastro':{'cnpj':'62560654000127','name':'FIXTURE DE CACHE ANTIGO','simei':True}}),Jsonb({'identity':'yes','simei':'never','debt':'unknown'})))
 code,old=call('current');assert old['needs_refresh'];assert 'simei' not in old['answers'];assert 'simei_check' in old['questions']
 code,refresh=call('start',{'cnpj':'62560654000127'});assert code==202;assert refresh['revision']==9;assert refresh['answers']=={}
 _,again=call('start',{'cnpj':'62560654000127'});assert again['revision']==9
 for _ in range(40):
  _,fresh=call('current')
  if fresh['state']=='ready':break
  time.sleep(1)
 assert fresh['state']=='ready';assert not fresh['needs_refresh'];assert fresh['source']['schema_version']==2
 print('source status:',fresh['source']['cadastro_status'])
 data=fresh['source'].get('cadastro')
 if data:
  assert data['cnpj']=='62560654000127';assert data['opened_at'];assert data['address']
  print('verified fields: legal name, CNPJ, opening date, address; indicator:',data['simei'])
  _,confirmed=call('answer',{'question':'identity','value':'yes','revision':fresh['revision']})
  assert 'simei_check' in confirmed['questions']
 assert fresh['source']['official']['status']=='human_required'
 print('PASS: legacy refresh, deduplication, version, user-confirmed MEI question, explicit official pending')
finally:
 with db() as c:c.execute('DELETE FROM mei_cases WHERE sid=%s',(sid,))
