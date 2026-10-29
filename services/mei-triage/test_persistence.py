import sys,pathlib,json,time
from store import db,digest
p=pathlib.Path('/var/lib/nacional-mei/persistence-test.id')
if sys.argv[1]=='seed':
 import secrets
 sid=digest(secrets.token_urlsafe(32));p.write_text(sid);p.chmod(0o600)
 with db() as c:c.execute("INSERT INTO mei_cases(sid,cnpj,client_hash,state,lease_token,lease_until) VALUES (%s,'62560654000127','test-persistence','working','00000000-0000-0000-0000-000000000001',now()-interval '1 second')",(sid,))
 print('expired lease seeded')
else:
 sid=p.read_text()
 for i in range(20):
  with db() as c:r=c.execute('SELECT state,attempts FROM mei_cases WHERE sid=%s',(sid,)).fetchone()
  if r['state']=='ready':break
  time.sleep(1)
 assert r['state']=='ready' and r['attempts']>0,r
 with db() as c:c.execute('DELETE FROM mei_cases WHERE sid=%s',(sid,))
 p.unlink();print('PASS: persistent job and expired lease recovered after API/worker restart')
