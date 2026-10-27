"""Restaura as bases estáticas ao executar o código dentro de tools/nacional-atlas."""
from pathlib import Path
import argparse,json,shutil
p=argparse.ArgumentParser();p.add_argument('--site-root');args=p.parse_args()
root=Path(__file__).resolve().parents[1]
repo=Path(args.site_root).resolve() if args.site_root else root.parents[1]
src=repo/'public/atlas/para/para-data'
if not (src/'index.json').exists():raise SystemExit('Informe --site-root com o checkout Nacionalcon que contém public/atlas/para/para-data.')
j=json.loads((src/'index.json').read_text(encoding='utf8'))
if len(j['municipalities'])!=144 or not all(c['passed'] for c in j['meta']['checks']):raise SystemExit('Retrato não validado')
shutil.copytree(src,root/'public/para-data',dirs_exist_ok=True)
for name in ['world-data','context-data','history-data','invadergis']:
    context=repo/'public/atlas'/name
    if context.exists():shutil.copytree(context,root/'public'/name,dirs_exist_ok=True)
old=repo/'public/eleicoes/santarem/data'
if old.exists():shutil.copytree(old,root/'public/data',dirs_exist_ok=True)
print('Bases públicas restauradas. Execute npm ci, npm test e npm run dev.')
