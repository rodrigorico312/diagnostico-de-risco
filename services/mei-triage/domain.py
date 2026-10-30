"""Validation and conservative guidance. No debt or remittance eligibility inference."""
import re
OPTANTES = 'https://consopt.www8.receita.fazenda.gov.br/consultaoptantes'
PGMEI = 'https://www8.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATSPO/pgmei.app/Identificacao'
REGULARIZE = 'https://www.regularize.pgfn.gov.br/'
QUESTIONS = {
 'identity': {'yes','no'},
 'simei_check': {'yes','no','unknown'},
 'debt': {'yes','no','unknown'}, 'debt_period': {'before','after','both','unknown'},
 'installment_channel': {'rfb','pgfn','both','unknown'}, 'installment': {'yes','no','unknown'},
 'lawsuit': {'yes','no','unknown'}, 'payments': {'yes','no','unknown'},
}
def cnpj_clean(value):
 value = re.sub(r'[. /-]', '', str(value).upper())
 if not re.fullmatch(r'[A-Z0-9]{12}[0-9]{2}',value) or len(set(value))==1:
  raise ValueError('Confira os 14 caracteres do CNPJ.')
 base=value[:12]
 for weights in ([5,4,3,2,9,8,7,6,5,4,3,2],[6,5,4,3,2,9,8,7,6,5,4,3,2]):
  rest=sum((ord(c)-48)*w for c,w in zip(base,weights))%11
  base+=str(0 if rest<2 else 11-rest)
 if base!=value: raise ValueError('Os dígitos verificadores do CNPJ não conferem.')
 return value

def registry_indicator(source):
 value=(source.get('cadastro') or {}).get('simei')
 return value if isinstance(value,bool) else None

def questions(source,answers=None):
 a=answers or {}
 order=['identity'] if source.get('cadastro') else []
 order+=['simei_check','debt']
 if a.get('debt')=='yes':order+=['debt_period']
 if a.get('debt')!='no':
  order+=['installment']
  if a.get('installment')=='yes':order+=['installment_channel']
  order+=['lawsuit']
 if a.get('simei_check')=='yes' and a.get('debt')!='no':order+=['payments']
 return order

def plan(answers,source):
 from guidance import build_plan
 if answers.get('identity')=='no':
  return {'title':'Vamos corrigir o CNPJ','steps':[], 'complete':False}
 result=build_plan(answers,source)
 result['complete']=all(k in answers for k in questions(source,answers))
 return result
