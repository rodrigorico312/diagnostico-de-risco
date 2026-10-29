from pathlib import Path
from store import db
with db() as c:
 c.execute(Path(__file__).with_name('schema.sql').read_text())
 c.execute('REVOKE CREATE ON SCHEMA public FROM PUBLIC')
print('schema ready')
