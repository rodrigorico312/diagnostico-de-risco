"""Build the pinned InvaderGIS source for personal, noncommercial study in Atlas.

Usage: git clone https://github.com/g-lanza/InvaderGIS.git ../referencias/InvaderGIS
       python scripts/prepare_invadergis.py --source ../referencias/InvaderGIS
The upstream checkout must be at UPSTREAM_COMMIT; adaptations are idempotent.
"""
from pathlib import Path
import argparse, datetime, json, os, shutil, subprocess, sys

ROOT = Path(__file__).resolve().parents[1]
UPSTREAM_COMMIT = 'c2acb1e9cddd75ded98246f8c518ac9acc74a593'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--source', type=Path, required=True)
parser.add_argument('--skip-install', action='store_true')
args = parser.parse_args()
source = args.source.resolve()

def run(*command):
    subprocess.run(command, cwd=source, check=True)

commit = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=source, text=True).strip()
if commit != UPSTREAM_COMMIT:
    raise SystemExit(f'Use o commit fixado {UPSTREAM_COMMIT}; encontrado {commit}')

def replace(file, old, new):
    path = source / file
    text = path.read_text(encoding='utf-8')
    if new in text:
        return
    if text.count(old) != 1:
        raise SystemExit(f'Adaptação não reconhecida: {file}')
    path.write_text(text.replace(old, new), encoding='utf-8')

package = json.loads((source/'package.json').read_text(encoding='utf-8'))
if package['devDependencies'].get('@types/node') != '22.20.0':
    package['devDependencies']['@types/node'] = '22.20.0'
    (source/'package.json').write_text(json.dumps(package, indent=2)+'\n', encoding='utf-8')

replace('vite.config.ts', "import react from '@vitejs/plugin-react';", "import react from '@vitejs/plugin-react';\nimport { fileURLToPath } from 'node:url';")
replace('vite.config.ts', "new URL('./src', import.meta.url).pathname", "fileURLToPath(new URL('./src', import.meta.url))")
replace('src/stores/settingsStore.ts', "theme: 'contrast',", "theme: 'dark',")
replace('index.html', 'data-theme="contrast"', 'data-theme="dark"')
replace('index.html', '<meta charset="UTF-8" />', '<meta charset="UTF-8" />\n    <meta name="robots" content="noindex, nofollow" />')
replace('src/components/useWalkthrough.ts', 'function hasSeen(): boolean {', "function hasSeen(): boolean {\n  if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('embedded') === '1') return true;")

# A small, explicit bridge; the original app owns all its map/year filtering.
bridge = source / 'src/nacionalBridge.ts'
bridge.write_text('''// Nacional Atlas adaptation, 2026-10-27. Upstream licences retained.
import {useTimeStore} from '@/stores/timeStore';
import {useSelectionStore} from '@/stores/selectionStore';
if(window.parent!==window){
 const emit=()=>window.parent.postMessage({type:'invadergis:state',year:useTimeStore.getState().year},location.origin);
 const report=()=>requestAnimationFrame(emit);
 useTimeStore.subscribe(report);
 useSelectionStore.subscribe(report);
 addEventListener('message',(e:MessageEvent)=>{
  if(e.origin!==location.origin||e.source!==window.parent)return;
  if(e.data?.type==='nacional:init')emit();
  if(e.data?.type==='nacional:year'&&typeof e.data.year==='number'&&Number.isFinite(e.data.year)){
   useTimeStore.getState().setPlaying(false);
   useTimeStore.getState().setYear(Math.max(500,Math.min(1500,Math.round(e.data.year))));
  }
 });
 report();
}
''', encoding='utf-8')
replace('src/main.tsx', "import { StrictMode } from 'react';", "import '@/nacionalBridge';\nimport { StrictMode } from 'react';")

# Translate primary desktop actions only. Full corpus and auxiliary UI stay English.
top = source / 'src/components/TopBar.tsx'
text = top.read_text(encoding='utf-8')
for old,new in [('Network','Conexões'),('Compare','Comparar'),('Lineage','Governantes'),('Sources','Fontes'),('Registers','Registros'),('Views','Visões'),('My Data','Meus dados'),('Search','Pesquisar'),('Filter','Filtrar'),('Settings','Ajustes')]:
    text = text.replace('>\n                  '+old+'\n', '>\n                  '+new+'\n').replace('>\n                '+old+'\n', '>\n                '+new+'\n')
top.write_text(text, encoding='utf-8')

npm = shutil.which('npm.cmd' if os.name == 'nt' else 'npm')
if not npm:
    raise SystemExit('Node.js e npm não encontrados.')
if not args.skip_install or not (source/'node_modules/@types/node').exists():
    run(npm, 'install', '--ignore-scripts', '--no-audit', '--no-fund')
validation = subprocess.run([npm,'run','validate'], cwd=source, check=True, capture_output=True, text=True, encoding='utf-8')
print('Validação upstream concluída; relatório integral será publicado com a base.')
run(npm, 'run', 'build', '--', '--base=/atlas/invadergis/')

destination = ROOT / 'public/invadergis'
destination.mkdir(parents=True, exist_ok=True)
shutil.copytree(source / 'dist', destination, dirs_exist_ok=True,
                ignore=lambda folder,names: ['by-year'] if Path(folder).resolve()==(source/'dist/index').resolve() else [])
# These generated indexes are never requested: loaders.ts builds the same index
# in memory. Excluding them saves ~93 MB without removing any underlying record.
year_slices=(destination/'index/by-year').resolve()
if year_slices != (ROOT/'public/invadergis/index/by-year').resolve() or not year_slices.is_relative_to(destination.resolve()):
    raise SystemExit('Caminho de índices fora do destino esperado.')
if year_slices.exists():
    for generated in year_slices.glob('*.json'):
        generated.unlink()
    year_slices.rmdir()
(destination/'validation.txt').write_text(validation.stdout+validation.stderr, encoding='utf-8')
for upstream, target in [('LICENSE','LICENSE.txt'), ('ATTRIBUTIONS.md','ATTRIBUTIONS.txt'), ('README.md','UPSTREAM-README.txt')]:
    shutil.copy2(source/upstream, destination/target)
dependencies=subprocess.run([npm,'ls','--omit=dev','--parseable'],cwd=source,capture_output=True,text=True,encoding='utf-8')
notices=[]
for name in dependencies.stdout.splitlines():
    dependency=Path(name)
    if dependency==source or not dependency.is_dir():
        continue
    info=json.loads((dependency/'package.json').read_text(encoding='utf-8'))
    for file in dependency.iterdir():
        if file.is_file() and file.name.lower().startswith(('license','licence','copying','notice')):
            notices.append(f"{info['name']} {info['version']}\n{file.name}\n"+file.read_text(encoding='utf-8',errors='replace'))
if not notices:
    raise SystemExit('Não foi possível coletar os avisos das dependências de runtime.')
(destination/'DEPENDENCY-NOTICES.txt').write_text('\n\n'.join(notices),encoding='utf-8')
manifest = json.loads((destination/'manifest.webmanifest').read_text(encoding='utf-8'))
for key in ['start_url','scope','id']:
    manifest[key]='/atlas/invadergis/'
(destination/'manifest.webmanifest').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
metadata = {'project':'InvaderGIS','upstream':'https://github.com/g-lanza/InvaderGIS','commit':commit,
 'preparedAt':datetime.date.today().isoformat(),'purpose':'Estudo pessoal e não comercial',
 'softwareLicense':'PolyForm Noncommercial 1.0.0','dataLicense':'CC BY-NC 4.0; ver também ATTRIBUTIONS.txt para fontes upstream',
 'coverage':{'startYear':500,'endYear':1500,'focus':'Europa medieval e regiões próximas'},
 'changes':['Base /atlas/invadergis/ e alias Windows compatível com tipos Node 22.20.0','Tema escuro inicial','Atalhos de ano sincronizados com Nacional Atlas','Guia automático desativado no modo incorporado','Tradução parcial dos comandos principais','Manifesto local e aviso noindex','Índices por ano não utilizados omitidos; índice temporal calculado na memória pelo motor original'],
 'validation':{'report':'validation.txt','scope':'Validador upstream: 12273 registros, 12 tipos; não audita integralmente os 16415 registros compilados','result':'0 erros e 106 avisos; inclui referências e vínculos não resolvidos'},
 'limitations':['Base experimental de terceiros; referências e vínculos incompletos, ver validation.txt','Não representa a história completa do mundo','Explorador original em inglês; leitura estruturada em português disponível no Atlas','Link externo do Nacional Atlas preserva o ano, não a posição do mapa ou a seleção de entidades']}
(destination/'integration.json').write_text(json.dumps(metadata, ensure_ascii=False, indent=2), encoding='utf-8')
subprocess.run([sys.executable,str(ROOT/'scripts/build_medieval_pt.py')],check=True)
print(json.dumps({'destination':str(destination),'upstreamCommit':commit,'files':sum(p.is_file() for p in destination.rglob('*'))}))
