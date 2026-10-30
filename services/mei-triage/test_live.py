import json,time,secrets,urllib.request,urllib.error
from store import config,db,digest,claim,finish
from domain import cnpj_clean,plan
key=config()['proxy_key']
base='http://127.0.0.1:8793'
def req(path,body=None,cookie=None):
 headers={'x-mei-service':key,'x-mei-client':'a'*64,'content-type':'application/json'}
 if cookie:headers['cookie']=cookie
 r=urllib.request.Request(base+'/v1/'+path,data=json.dumps(body).encode() if body is not None else None,headers=headers)
 try:
  with urllib.request.urlopen(r,timeout=10) as response:return response.status,json.load(response),response.headers.get('set-cookie','').split(';')[0]
 except urllib.error.HTTPError as e:return e.code,json.load(e),''
for _ in range(30):
 try:
  urllib.request.urlopen(base+'/health',timeout=2).close();break
 except urllib.error.URLError:time.sleep(.2)
assert cnpj_clean('62.560.654/0001-27')=='62560654000127'
try:cnpj_clean('62560654000128');raise AssertionError('accepted invalid')
except ValueError:pass
assert cnpj_clean('12.ABC.345/01DE-35')=='12ABC34501DE35'
a,first,cookie=req('start',{'cnpj':'62560654000127'});assert a==202,(a,first)
a,duplicate,_=req('start',{'cnpj':'62560654000127'},cookie);assert a==200 and duplicate['cnpj']==first['cnpj']
assert req('current')[0]==404
assert req('current',cookie='__Host-mei-session=wrong')[0]==404
for i in range(25):
 a,result,_=req('current',cookie=cookie)
 if result['state']=='ready':break
 time.sleep(1)
assert result['state']=='ready',result['state']
print('real lookup:',result['source']['cadastro_status'])
if result['source']['cadastro']:
 assert result['source']['cadastro']['cnpj']==first['cnpj']
 print('identity:',result['source']['cadastro']['name'])
assert result['source']['official']['status']=='human_required'
assert 'debt_amount' not in result['source']
assert req('answer',{'question':'payments','value':'yes','revision':0},cookie)[0]==422
while not result['plan']['complete']:
 k=next(k for k in result['questions'] if k not in result['answers'])
 v='yes' if k=='identity' else 'unknown'
 code,result,_=req('answer',{'question':k,'value':v,'revision':result['revision']},cookie)
 assert code==200,(code,result)
assert result['plan']['complete']
assert req('answer',{'question':'debt','value':'yes','revision':0},cookie)[0]==409
code,revised,_=req('answer',{'question':result['questions'][0],'value':'yes' if result['questions'][0]=='identity' else 'unknown','revision':result['revision']},cookie)
assert code==200 and len(revised['answers'])==1
# Independent visitor obtains no other visitor's answers.
code,second,cookie2=req('start',{'cnpj':'62560654000127'})
assert code==202 and cookie2!=cookie
assert second['answers']=={}
assert req('current',cookie=cookie)[1]['answers']!=second['answers']
# Delete removes case and descendants; no later job result may resurrect it.
assert req('delete',{},cookie)[0]==200
assert req('current',cookie=cookie)[0]==404
assert req('delete',{},cookie2)[0]==200
# Stale worker must not overwrite newer lease or cancelled cases.
sid=digest(secrets.token_urlsafe(32));lease='00000000-0000-0000-0000-000000000001'
with db() as c:
 c.execute("INSERT INTO mei_cases(sid,cnpj,client_hash,state,lease_token,lease_until) VALUES (%s,'62560654000127','test','working',%s,now()+interval '90 seconds')",(sid,lease))
assert finish({'sid':sid,'lease':'00000000-0000-0000-0000-000000000002'},{'cadastro':None})==0
with db() as c:
 c.execute("UPDATE mei_cases SET state='cancelled' WHERE sid=%s",(sid,))
assert finish({'sid':sid,'lease':lease},{'cadastro':None})==0
with db() as c:c.execute('DELETE FROM mei_cases WHERE sid=%s',(sid,))
print('PASS: validation, deduplication, source coverage, sequencing, revision, isolation, deletion, stale lease')
