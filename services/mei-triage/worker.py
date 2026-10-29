"""Dedicated worker. Official browser adapter is paused after anti-bot refusal."""
import json,time,logging,urllib.request,urllib.error,datetime
from store import claim,finish
from domain import cnpj_clean,OPTANTES
logging.basicConfig(level=logging.INFO,format='%(asctime)s %(levelname)s %(message)s')
def lookup(cnpj):
 checked=datetime.datetime.now(datetime.timezone.utc).isoformat()
 out={'checked_at':checked,'official':{'status':'human_required','url':OPTANTES,'reason':'O portal exige verificação humana. Consulta automática suspensa após bloqueio explícito no piloto.'},'cadastro':None,'cadastro_status':'unavailable'}
 if not cnpj.isdigit():
  out['cadastro_status']='unsupported_format';return out
 try:
  req=urllib.request.Request('https://brasilapi.com.br/api/cnpj/v1/'+cnpj,headers={'User-Agent':'NacionalMEI/1.0 (consulta cadastral individual)'})
  with urllib.request.urlopen(req,timeout=16) as r:
   raw=r.read(400001)
   if len(raw)>400000:raise ValueError('oversize')
   d=json.loads(raw)
  if cnpj_clean(str(d.get('cnpj','')))!=cnpj:raise ValueError('wrong_cnpj')
  name=d.get('razao_social')
  if not isinstance(name,str) or not name.strip():raise ValueError('missing_identity')
  out['cadastro']={'cnpj':cnpj,'name':name[:200],'opened_at':d.get('data_inicio_atividade'),'status':d.get('descricao_situacao_cadastral'),'simei':d.get('opcao_pelo_mei') if isinstance(d.get('opcao_pelo_mei'),bool) else None,'simei_since':d.get('data_opcao_pelo_mei'),'simei_until':d.get('data_exclusao_do_mei'),'provider':'BrasilAPI / Minha Receita','url':'https://brasilapi.com.br/docs#tag/CNPJ','reference_date':d.get('data_atualizacao') or d.get('ultima_atualizacao') or None}
  out['cadastro_status']='found'
 except urllib.error.HTTPError as e:out['cadastro_status']='not_found' if e.code==404 else 'unavailable'
 except Exception:out['cadastro_status']='unavailable'
 return out

def run():
 while True:
  try:
   job=claim()
   if not job:time.sleep(2);continue
   result=lookup(job['cnpj'])
   saved=finish(job,result)
   logging.info('lookup completed status=%s saved=%s',result['cadastro_status'],bool(saved))
  except Exception as e:
   logging.error('worker failure type=%s',type(e).__name__);time.sleep(5)
if __name__=='__main__':run()
