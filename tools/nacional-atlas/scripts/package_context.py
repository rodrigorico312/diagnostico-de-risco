"""Publica o build estático mundial em public/atlas, preservando seu subdiretório para/."""
from pathlib import Path
import argparse,json,shutil
p=argparse.ArgumentParser();p.add_argument('--destination',required=True);args=p.parse_args()
root=Path(__file__).resolve().parents[1];dist=root/'dist';dest=Path(args.destination).resolve()
if tuple(p.lower() for p in dest.parts[-2:])!=('public','atlas'):raise SystemExit('Destino deve terminar em public/atlas')
for name,collection,count in [('world-data','countries',217),('context-data','municipalities',5571)]:
 j=json.loads((dist/name/'index.json').read_text(encoding='utf8'))
 if len(j[collection])!=count or not all(c['passed'] for c in j['meta']['checks']):raise SystemExit('Base não validada: '+name)
history=json.loads((dist/'history-data/index.json').read_text(encoding='utf8'))
if not history['events'] or not all(c['passed'] for c in history['meta']['checks']):raise SystemExit('Cronologia não validada')
html=(dist/'world.html').read_text(encoding='utf8')
if '/atlas/assets/' not in html:raise SystemExit('Compile com ATLAS_BASE_PATH=/atlas/')
dest.mkdir(parents=True,exist_ok=True)
for name in ['assets','world-data','context-data','para-data','history-data']:shutil.copytree(dist/name,dest/name,dirs_exist_ok=True)
shutil.copy2(dist/'world.html',dest/'index.html');shutil.copy2(dist/'world.html',dest/'world.html')
print(json.dumps({'destination':str(dest),'countries':217,'municipalities':5571,'files':sum(1 for p in dest.rglob('*') if p.is_file())},ensure_ascii=True))
