import secrets,hmac
from fastapi import FastAPI,Request,HTTPException,Response
from psycopg.types.json import Jsonb
from store import config,db,digest,get_case
from domain import cnpj_clean,QUESTIONS,questions,plan
app=FastAPI(docs_url=None,redoc_url=None,openapi_url=None)
COOKIE='__Host-mei-session'
@app.middleware('http')
async def gate(request,call_next):
 if request.url.path!='/health' and not hmac.compare_digest(request.headers.get('x-mei-service',''),config()['proxy_key']):
  return Response(status_code=403)
 response=await call_next(request)
 response.headers['Cache-Control']='private, no-store'
 response.headers['X-Content-Type-Options']='nosniff'
 return response
@app.get('/health')
def health():
 with db() as c: c.execute('SELECT 1')
 return {'ok':True,'service':'mei-triage','version':'1.0.0'}
def view(row):
 answers={k:v for k,v in row['answers'].items() if k in QUESTIONS}
 needs_refresh=row['state']=='ready' and row['source'].get('schema_version',0)<2
 return {'cnpj':row['cnpj'],'state':row['state'],'source':row['source'],'answers':answers,'revision':row['revision'],'questions':questions(row['source'],answers),'plan':plan(answers,row['source']),'needs_refresh':needs_refresh}
@app.post('/v1/start')
async def start(request:Request,response:Response):
 body=await request.json()
 try:cnpj=cnpj_clean(body.get('cnpj',''))
 except ValueError as e:raise HTTPException(422,str(e))
 client=request.headers.get('x-mei-client','')
 if len(client)!=64:raise HTTPException(400,'Solicitação inválida.')
 token=request.cookies.get(COOKIE)
 with db() as c:
  c.execute('SELECT pg_advisory_xact_lock(8793001)')
  old=get_case(c,token,True)
  if old and old['cnpj']==cnpj:
   if old['state']!='ready' or old['source'].get('schema_version',0)>=2:return view(old)
   queue=c.execute("SELECT count(*) AS n FROM mei_cases WHERE state IN ('queued','working') AND expires_at>now()").fetchone()['n']
   if queue>=80:raise HTTPException(429,'Muitas consultas neste momento. Tente novamente mais tarde.')
   refreshed=c.execute("UPDATE mei_cases SET state='queued',source='{}',answers='{}',attempts=0,lease_token=NULL,lease_until=NULL,revision=revision+1 WHERE sid=%s RETURNING *",(old['sid'],)).fetchone()
   response.status_code=202
   return view(refreshed)
  count=c.execute("SELECT count(*) AS n FROM mei_cases WHERE client_hash=%s AND created_at>now()-interval '1 hour'",(client,)).fetchone()['n']
  queue=c.execute("SELECT count(*) AS n FROM mei_cases WHERE state IN ('queued','working') AND expires_at>now()").fetchone()['n']
  if count>=15 or queue>=80:raise HTTPException(429,'Muitas consultas neste momento. Tente novamente mais tarde.')
  if old:c.execute("UPDATE mei_cases SET state='cancelled',source='{}',answers='{}',lease_token=NULL WHERE sid=%s",(old['sid'],))
  token=secrets.token_urlsafe(32)
  row=c.execute('INSERT INTO mei_cases(sid,cnpj,client_hash) VALUES (%s,%s,%s) RETURNING *',(digest(token),cnpj,client)).fetchone()
 response.set_cookie(COOKIE,token,secure=True,httponly=True,samesite='lax',max_age=86400,path='/')
 response.status_code=202
 return view(row)
@app.get('/v1/current')
def current(request:Request):
 with db() as c:
  row=get_case(c,request.cookies.get(COOKIE))
  if not row:raise HTTPException(404,'Inicie uma nova consulta.')
  return view(row)
@app.post('/v1/answer')
async def answer(request:Request):
 body=await request.json()
 key,value=body.get('question'),body.get('value')
 if key=='simei':raise HTTPException(409,'A consulta foi atualizada. Recarregue a página para continuar com os dados consultados automaticamente.')
 if key not in QUESTIONS or value not in QUESTIONS[key]:raise HTTPException(422,'Resposta inválida.')
 with db() as c:
  row=get_case(c,request.cookies.get(COOKIE),True)
  if not row:raise HTTPException(404,'A consulta expirou. Informe o CNPJ novamente.')
  if row['state']!='ready':raise HTTPException(409,'Aguarde a consulta terminar.')
  if body.get('revision')!=row['revision']:raise HTTPException(409,'A consulta foi atualizada. Recarregue para continuar.')
  order=questions(row['source'],row['answers'])
  if key not in order or any(k not in row['answers'] for k in order[:order.index(key)]):raise HTTPException(422,'Responda a etapa anterior.')
  answers={k:v for k,v in row['answers'].items() if k in order[:order.index(key)]}
  answers[key]=value
  updated=c.execute('UPDATE mei_cases SET answers=%s,revision=revision+1 WHERE sid=%s RETURNING *',(Jsonb(answers),row['sid'])).fetchone()
  c.execute('INSERT INTO mei_events(sid,kind,data) VALUES (%s,%s,%s)',(row['sid'],'answer',Jsonb({'question':key,'value':value,'revision':updated['revision']})))
  return view(updated)
@app.post('/v1/delete')
def delete(request:Request,response:Response):
 with db() as c:c.execute('DELETE FROM mei_cases WHERE sid=%s',(digest(request.cookies.get(COOKIE,'')),))
 response.delete_cookie(COOKIE,path='/',secure=True,httponly=True,samesite='lax')
 return {'deleted':True}
