"""Pacote estático do atlas estadual; não modifica a aplicação principal do domínio."""
from pathlib import Path
import argparse,shutil,json
p=argparse.ArgumentParser();p.add_argument('--destination',required=True);args=p.parse_args()
root=Path(__file__).resolve().parents[1];dist=root/'dist';dest=Path(args.destination).resolve()
if tuple(p.lower() for p in dest.parts[-3:])!=('public','atlas','para'):
    raise SystemExit('Destino deve terminar em /public/atlas/para')
meta=json.loads((dist/'para-data/index.json').read_text(encoding='utf8'))
if len(meta['municipalities'])!=144 or not all(c['passed'] for c in meta['meta']['checks']):raise SystemExit('Base não validada')
html=(dist/'para.html').read_text(encoding='utf8')
if '/atlas/para/assets/' not in html:raise SystemExit('Recompile com ATLAS_BASE_PATH=/atlas/para/')
dest.mkdir(parents=True,exist_ok=True)
shutil.copytree(dist/'assets',dest/'assets',dirs_exist_ok=True)
shutil.copytree(dist/'para-data',dest/'para-data',dirs_exist_ok=True)
shutil.copy2(dist/'para.html',dest/'index.html');shutil.copy2(dist/'para.html',dest/'para.html')
print(json.dumps({'destination':str(dest),'municipios':144,'checks':len(meta['meta']['checks']),'files':sum(1 for p in dest.rglob('*') if p.is_file())},ensure_ascii=True))
