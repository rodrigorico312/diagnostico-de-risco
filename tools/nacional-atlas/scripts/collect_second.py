"""Baixa todos os BUs presidenciais principais de Santarem, sem duplicar agregadas."""
from pathlib import Path
from datetime import datetime, timezone
import concurrent.futures as cf
import requests, json, hashlib, time, threading
from bu import decode_bu
ROOT=Path(__file__).resolve().parents[1]
RAW=ROOT/'data/raw'
BASE='https://resultados.tse.jus.br/oficial/ele2026'
LOCAL=threading.local()
def get(url,path):
    if path.exists():return path.read_bytes()
    if not hasattr(LOCAL,'session'):LOCAL.session=requests.Session()
    for attempt in range(3):
        try:
            r=LOCAL.session.get(url,timeout=45);r.raise_for_status()
            data=r.content
            path.parent.mkdir(parents=True,exist_ok=True)
            tmp=path.with_suffix(path.suffix+'.part');tmp.write_bytes(data);tmp.replace(path)
            return data
        except requests.RequestException:
            if attempt==2:raise
            time.sleep(attempt+1)
def collect_one(row):
    z,s=row['zona'],row['secao']
    prefix=f'{BASE}/arquivo-urna/3221/dados/pa/05355/{z}/{s}/'
    auxurl=prefix+f'p003221-pa-m05355-z{z}-s{s}-aux.json'
    aux=json.loads(get(auxurl,RAW/'bu2t'/f'{z}-{s}-aux.json'))
    valid=[h for h in aux.get('hashes',[]) if h.get('st','').lower()=='totalizado']
    if len(valid)!=1:raise ValueError(f'{z}/{s}: BU totalizado unico nao identificado')
    h=valid[0];files=[a for a in h['arq'] if a['tp']=='bu']
    if len(files)!=1:raise ValueError(f'{z}/{s}: arquivo BU unico nao identificado')
    url=prefix+h['hash']+'/'+files[0]['nm'];path=RAW/'bu2t'/files[0]['nm'];data=get(url,path)
    decoded=decode_bu(data,6258)
    if (decoded['municipio_bu'],decoded['zona_bu'],decoded['secao_bu'])!=(5355,int(z),int(s)):raise ValueError('Identidade BU divergente')
    if not decoded['fim_local'].startswith('20261025'):raise ValueError('Data de votacao inesperada')
    return {**row,**decoded,'aux_url':auxurl,'bu_url':url,'sha256':hashlib.sha256(data).hexdigest(),'status':aux.get('st')}
def run():
    RAW.mkdir(parents=True,exist_ok=True)
    u=BASE+'/arquivo-urna/3221/config/pa/pa-p003221-cs.json'
    conf=json.loads(get(u,RAW/'pa-p003221-cs.json'))
    towns=[m for a in conf['abr'] for m in a['mu'] if int(m['cd'])==5355]
    if len(towns)!=1 or towns[0]['nm']!='SANTARÉM':raise ValueError('Municipio nao confirmado')
    rows=[{'zona':z['cd'],'secao':s['ns'],'agregadas':s.get('nsa',[])} for z in towns[0]['zon'] for s in z['sec'] if not s.get('nsp')]
    errors=[];out=[]
    with cf.ThreadPoolExecutor(max_workers=10) as pool:
        fs={pool.submit(collect_one,r):r for r in rows}
        for f in cf.as_completed(fs):
            try:out.append(f.result())
            except Exception as e:errors.append({'section':fs[f],'error':str(e)})
            if (len(out)+len(errors))%100==0:print(f'BUs: {len(out)} validos; {len(errors)} falhas',flush=True)
    result={'collectedAt':datetime.now(timezone.utc).isoformat(),'source':u,'expected':len(rows),'rows':sorted(out,key=lambda x:(x['zona'],x['secao'])),'errors':errors}
    (RAW/'bu2t-collection.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    if errors or len(out)!=len(rows):raise RuntimeError('Coleta incompleta: veja bu2t-collection.json')
    print('Coleta completa:',len(out),'BUs; votos',sum(r['comparecimento_bu'] for r in out),flush=True)
    return result
if __name__=='__main__':run()
