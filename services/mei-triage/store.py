import os,json,pathlib,hashlib,secrets,uuid
import psycopg
from psycopg.rows import dict_row
from psycopg.types.json import Jsonb

def config():
 path=pathlib.Path(os.environ['CREDENTIALS_DIRECTORY'])/'mei-secrets'
 return json.loads(path.read_text())
def db():
 return psycopg.connect(config()['database_url'],row_factory=dict_row,connect_timeout=5)
def digest(value): return hashlib.sha256(value.encode()).hexdigest()
def get_case(conn,token,lock=False):
 if not token or len(token)>100: return None
 return conn.execute("SELECT * FROM mei_cases WHERE sid=%s AND expires_at>now() AND state<>'cancelled'"+(" FOR UPDATE" if lock else ""),(digest(token),)).fetchone()
def claim():
 with db() as c:
  c.execute('DELETE FROM mei_cases WHERE expires_at<now()')
  c.execute("UPDATE mei_cases SET state='ready',source=%s,lease_token=NULL,lease_until=NULL WHERE state='working' AND lease_until<now() AND attempts>=3",(Jsonb({'official':{'status':'unavailable'},'cadastro':None,'cadastro_status':'unavailable'}),))
  row=c.execute("SELECT sid,cnpj FROM mei_cases WHERE expires_at>now() AND attempts<3 AND (state='queued' OR (state='working' AND lease_until<now())) ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1").fetchone()
  if not row:return None
  lease=str(uuid.uuid4())
  c.execute("UPDATE mei_cases SET state='working',attempts=attempts+1,lease_token=%s,lease_until=now()+interval '90 seconds' WHERE sid=%s",(lease,row['sid']))
  return {**row,'lease':lease}
def finish(job,result):
 with db() as c:
  return c.execute("UPDATE mei_cases SET state='ready',source=%s,lease_token=NULL,lease_until=NULL WHERE sid=%s AND state='working' AND lease_token=%s AND lease_until>now()",(Jsonb(result),job['sid'],job['lease'])).rowcount
