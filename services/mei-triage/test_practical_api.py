"""API regression with synthetic ready cases; no external provider queries."""
import json,secrets,urllib.request,urllib.error,base64
from store import config,db,digest
from psycopg.types.json import Jsonb
base='http://127.0.0.1:8793'
token=secrets.token_urlsafe(32);sid=digest(token)
headers={'x-mei-service':config()['proxy_key'],'x-mei-client':'f'*64,'cookie':'__Host-mei-session='+token,'content-type':'application/json'}
def request(path,body=None,custom=None):
 req=urllib.request.Request(base+'/v1/'+path,data=json.dumps(body).encode() if body is not None else None,headers=custom or headers)
 try:
  with urllib.request.urlopen(req,timeout=12) as r:return r.status,r.headers,r.read()
 except urllib.error.HTTPError as e:return e.code,e.headers,e.read()
try:
 source={'schema_version':2,'cadastro':{'cnpj':'00000000000000','name':'EMPRESA FICTICIA PARA TESTE DO PDF','simei':True}}
 with db() as c:
  c.execute("INSERT INTO mei_cases(sid,cnpj,client_hash,state,source,answers) VALUES (%s,'00000000000000','test-v011','ready',%s,%s)",(sid,Jsonb(source),Jsonb({'identity':'yes','simei_check':'yes','debt':'yes','installment':'yes','lawsuit':'yes','payments':'no'})))
 code,_,raw=request('current');old=json.loads(raw);assert code==200
 assert not old['plan']['complete'] and 'debt_period' in old['questions'] and 'guidance' in old
 assert request('pdf')[0]==409
 code,_,raw=request('answer',{'question':'debt_period','value':'both','revision':old['revision']})
 r=json.loads(raw);assert code==200 and r['feedback']['debt_period']['id']=='cutoff'
 assert 'installment' not in r['answers']
 for key,value in [('installment','yes'),('installment_channel','both'),('lawsuit','yes'),('payments','no')]:
  code,_,raw=request('answer',{'question':key,'value':value,'revision':r['revision']});r=json.loads(raw);assert code==200
 assert r['plan']['complete'] and r['plan']['content_version']==11
 text=json.dumps(r['plan'],ensure_ascii=False)
 assert 'Você informou' not in text and 'material=1' not in text and 'Este quiz' not in text
 assert 'Janeiro/2027' in text and 'Julho/2027' in text
 assert request('pdf',custom={**headers,'cookie':'__Host-mei-session=not-real'})[0]==404
 code,h,data=request('pdf');assert code==200 and h['content-type'].startswith('application/pdf') and data.startswith(b'%PDF-') and b'%%EOF' in data[-30:]
 print(json.dumps({'pass':True,'bytes':len(data),'plan_cards':len(r['plan']['steps']),'pdf_base64':base64.b64encode(data).decode()}))
finally:
 with db() as c:c.execute('DELETE FROM mei_cases WHERE sid=%s',(sid,))
