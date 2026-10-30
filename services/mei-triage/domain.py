"""Validation and conservative guidance. No debt or remittance eligibility inference."""
import re
OPTANTES = 'https://consopt.www8.receita.fazenda.gov.br/consultaoptantes'
PGMEI = 'https://www8.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATSPO/pgmei.app/Identificacao'
REGULARIZE = 'https://www.regularize.pgfn.gov.br/'
QUESTIONS = {
 'identity': {'yes','no'},
 'simei_check': {'yes','no','unknown'},
 'debt': {'yes','no','unknown'}, 'installment': {'yes','no','unknown'},
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
 if a.get('debt')!='no':order+=['installment','lawsuit']
 if a.get('simei_check')=='yes' and a.get('debt')!='no':order+=['payments']
 return order

def plan(answers,source):
 steps=[]
 def add(title,text,url): steps.append({'title':title,'text':text,'url':url})
 if answers.get('identity')=='no':
  return {'title':'Vamos corrigir o CNPJ','steps':[], 'complete':False}
 simei=answers.get('simei_check')
 if simei=='yes':
  add('Você informou que o CNPJ é MEI','Você informou essa resposta após conferir a Situação no SIMEI na Consulta Optantes. Este site não validou o enquadramento diretamente na Receita. Guarde o resultado da consulta para sua conferência.',OPTANTES)
 elif simei=='no':
  add('Você informou que o CNPJ não é MEI hoje','Isso não significa que ele nunca foi MEI. Confira os períodos anteriores na Consulta Optantes, especialmente se houver dívida de quando era MEI. Este site não verificou esses períodos.',OPTANTES)
 else:
  add('Confirme se o CNPJ é MEI','Abra a Consulta Optantes, informe o CNPJ e procure a linha Situação no SIMEI. Optante pelo SIMEI significa que é MEI. Se ainda não conseguiu consultar, o enquadramento continua sem confirmação.',OPTANTES)
 if answers.get('debt')!='no':
  add('Separe guias correntes e débitos antigos','No PGMEI, confira as competências e os vencimentos em aberto. Gere somente as guias que pretende pagar e confira o CNPJ antes do pagamento. Este quiz não consultou valores de dívida nem emitiu uma guia.',PGMEI)
  add('Verifique a dívida ativa separadamente','O Regularize reúne débitos inscritos na PGFN. Confira com o acesso do titular ou procurador autorizado: uma consulta cadastral não alcança esses valores.',REGULARIZE)
 if answers.get('installment')=='yes':
  add('Confira o acordo antes de interromper parcelas','Guarde o demonstrativo do parcelamento com períodos, componentes e saldo. Este quiz não acessou seu acordo e não orienta cancelamento automático. A análise exige confrontar esses dados com as regras aplicáveis.','/guia-mei?material=1#parcelamento')
 elif answers.get('installment')=='unknown':
  add('Verifique se há parcelamento','Confira os acordos nos canais em que foram negociados. Não saber se existe parcelamento é diferente de não ter um.','/guia-mei?material=1#parcelamento')
 if answers.get('lawsuit') in {'yes','unknown'}:
  add('Confira eventual processo judicial','Se houver ação relacionada ao débito, reúna número, objeto e andamento. Não desista nem renuncie a direitos por uma resposta automática; consulte o responsável pelo processo.','/guia-mei?material=1#duvidas')
 if answers.get('payments')!='yes' and simei=='yes':
  add('Organize o pagamento mensal','Confira os vencimentos das guias correntes no PGMEI. Não confunda a competência da guia com a data em que ela vence. A análise de um benefício depende também de seu período e condições específicos.',PGMEI)
 return {'title':'Seu plano de conferência','steps':steps,'complete':all(k in answers for k in questions(source,answers)), 'scope':'Orientação inicial. Não é certidão, apuração de dívida nem aprovação de perdão. Valores e critérios que não foram consultados permanecem sem confirmação.'}
