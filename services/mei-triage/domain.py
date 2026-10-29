"""Validation and conservative guidance. No debt or remittance eligibility inference."""
import re
OPTANTES = 'https://consopt.www8.receita.fazenda.gov.br/consultaoptantes'
PGMEI = 'https://www8.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATPGMEI.app/Identificacao'
REGULARIZE = 'https://www.regularize.pgfn.gov.br/'
QUESTIONS = {
 'identity': {'yes','no'}, 'simei': {'yes','former','never','unknown'},
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

def questions(source):
 return ['identity'] + list(k for k in QUESTIONS if k!='identity') if source.get('cadastro') else list(k for k in QUESTIONS if k!='identity')

def plan(answers,source):
 steps=[]
 def add(title,text,url): steps.append({'title':title,'text':text,'url':url})
 if answers.get('identity')=='no':
  return {'title':'Vamos corrigir o CNPJ','steps':[], 'complete':False}
 simei=answers.get('simei')
 if simei in {'former','never','unknown'}:
  add('Confira o histórico de enquadramento', 'Na Consulta Optantes, confira a situação no Simei e os períodos de entrada e saída. Estar com CNPJ ativo não significa estar enquadrado como MEI. Anote as datas que aparecerem.',OPTANTES)
 else:
  add('Confirme o enquadramento no portal oficial','Confira se a Consulta Optantes informa enquadramento no Simei e guarde os períodos exibidos. A confirmação que você marcou no quiz é uma declaração sua; o robô não conseguiu validar esse dado no portal.',OPTANTES)
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
 return {'title':'Seu plano de conferência','steps':steps,'complete':all(k in answers for k in questions(source)), 'scope':'Orientação inicial. Não é certidão, apuração de dívida nem aprovação de perdão. Valores e critérios que não foram consultados permanecem sem confirmação.'}
