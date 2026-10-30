"""Practical, source-linked guidance reviewed on 2026-10-30."""
OPTANTES='https://consopt.www8.receita.fazenda.gov.br/consultaoptantes'
PGMEI='https://www8.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATSPO/pgmei.app/Identificacao'
SIMPLES='https://www8.receita.fazenda.gov.br/SimplesNacional/'
RFB='https://servicos.receitafederal.gov.br/'
REGULARIZE='https://www.regularize.pgfn.gov.br/'
PORTARIA='https://www.in.gov.br/web/dou/-/portaria-conjunta-rfb/pgfn-n-740-de-22-de-outubro-de-2026-740882562'
SOURCES=[
 {'label':'Regra do perdão e calendário: Portaria RFB/PGFN 740/2026, arts. 2 a 10','url':PORTARIA},
 {'label':'Receita: serviços e caminhos para regularizar pendências','url':'https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/cobrancas-e-intimacoes/orientacoes-para-regularizacao-de-pendencias-simples-nacional'},
 {'label':'Receita: manual do PGMEI, consulta de extratos e emissão de DAS','url':'https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2025/setembro/cartao-de-credito-e-uma-nova-opcao-de-pagamento-do-das-para-o-mei/manual_pgmei_2018.pdf'},
 {'label':'PGFN: como consultar e exportar o relatório da dívida','url':'https://www.gov.br/pt-br/servicos/consultar-debitos-inscritos-em-divida-ativa-da-uniao'},
 {'label':'Serpro: acesso de representantes de empresas ao Regularize com gov.br','url':'https://www7.serpro.gov.br/menu/noticias/noticias-2026/novo-acesso-portal-regularize'},
]
def step(text,label=None,url=None):
 return {'text':text,**({'link':{'label':label,'url':url}} if label else {})}
def card(id,title,text,instructions,**extra):
 return {'id':id,'title':title,'text':text,'instructions':instructions,**extra}

def registry(history=False):
 return card('registry','Confira os períodos em que a empresa foi MEI' if history else 'Confira o enquadramento no MEI',
 'O histórico ajuda a identificar a situação da empresa na época de cada dívida.' if history else 'Procure a situação no SIMEI, que é o enquadramento usado pelo MEI.',
 [step('Cole o CNPJ e clique em Consultar. Se aparecer uma verificação de segurança, conclua-a na própria página.','Abrir Consulta Optantes',OPTANTES),
 step('Leia Situação no SIMEI. Optante pelo Simples Nacional, sozinho, não significa ser MEI.'),
 step('Abra Mais informações, quando disponível, para ver entradas e saídas do SIMEI. Anote as datas dos períodos que coincidem com suas dívidas.'),
 step('Use Gerar PDF para guardar o histórico e depois volte aqui.')])

def revenue():
 return card('revenue','Descubra quais guias estão em aberto na Receita',
 'A Receita administra as guias que ainda não foram encaminhadas à cobrança da dívida ativa. Uma guia emitida pode já ter sido paga: confirme no extrato.',
 [step('Procure SIMEI - Serviços ou MEI - Serviços e entre em Cálculo e Declaração > PGMEI - versão completa. Faça a autenticação oferecida pelo portal.','Abrir Portal do Simples Nacional',SIMPLES),
 step('Na versão completa, abra Consulta Extrato/Pendências > Consulta Pendência no SIMEI. Veja os períodos em cobrança e eventuais declarações anuais pendentes.'),
 step('Abra também Consulta Extrato/Pendências > Consulta Extrato. Escolha o ano e veja cada competência, os valores por tributo e a indicação de pagamento. Repita para os anos com pendências.'),
 step('Anote competência, vencimento original, INSS, ICMS e ISS. Use a opção de imprimir o extrato em PDF para guardar o resultado.')],
 notes=['Se aparecer Acesso restrito, você entrou na versão pública do PGMEI. Volte ao Portal do Simples e escolha a versão completa, com autenticação.'])

def pgfn():
 return card('pgfn','Veja se alguma dívida foi para a PGFN',
 'Dívida ativa é a dívida já encaminhada para cobrança pela Procuradoria-Geral da Fazenda Nacional (PGFN). Ela é consultada em outro portal.',
 [step('Entre com sua conta gov.br quando a opção estiver disponível. Acesse ou selecione o perfil da empresa e confira que o CNPJ é o do MEI, não apenas seu CPF.','Abrir Regularize',REGULARIZE),
 step('Se a tela pedir cadastro de Pessoa Jurídica, faça o cadastro do CNPJ com as informações do responsável. Se não conseguir representar a empresa, use a ajuda de acesso do portal.'),
 step('Abra Consultar Dívida Ativa. Nas naturezas disponíveis, veja as inscrições e clique no número de cada uma.'),
 step('No relatório completo, confira origem, período, valor, situação, eventual negociação e processo judicial. Use Imprimir para salvar o PDF.')],
 notes=['Se não aparecer dívida, ainda confira os débitos na Receita. Se houver valor de ICMS ou ISS encaminhado ao Estado ou à prefeitura, a cobrança deve ser conferida também com esse órgão. Não some duas vezes a mesma dívida presente em extratos e acordos.'])

def monthly():
 return card('monthly','Organize as guias atuais e os seis meses de 2027',
 'O DAS é a guia mensal do MEI. A competência é o mês a que ele se refere; o vencimento é a data-limite para pagar.',
 [step('Cole o CNPJ, conclua a verificação que aparecer e clique em Continuar.','Abrir PGMEI para emitir DAS',PGMEI),
 step('Entre em Emitir Guia de Pagamento (DAS), escolha o ano e clique em OK. Marque a competência que precisa pagar, confira a data de pagamento e gere o DAS. Se estiver atrasado, emita a guia atualizada.'),
 step('Em 2026, continue cuidando das guias mensais que são devidas. O DAS da competência setembro/2026 venceu em 20/10/2026; o de outubro/2026 vence em novembro. Confira sempre a data da própria guia e eventuais prorrogações.'),
 step('Para manter o perdão, pague pontualmente as contribuições das competências janeiro a junho de 2027, quando devidas como MEI. Elas vencem de fevereiro a julho de 2027, conforme o calendário abaixo.'),
 step('Guarde os comprovantes e confira depois o reconhecimento de cada pagamento no extrato da versão completa. Um boleto gerado ainda não é um pagamento.')],
 table={'headers':['Competência','Mês do vencimento'],'rows':[['Janeiro/2027','Fevereiro/2027'],['Fevereiro/2027','Março/2027'],['Março/2027','Abril/2027'],['Abril/2027','Maio/2027'],['Maio/2027','Junho/2027'],['Junho/2027','Julho/2027']]},
 example='A guia de janeiro/2027 é paga no vencimento de fevereiro. Use a data impressa no DAS; o nome da competência não é o mês do pagamento.',
 notes=['Essa condição de seis meses foi fixada pelo art. 10 da Portaria 740/2026. Não substitui as demais guias devidas. Descumprir a pontualidade das contribuições abrangidas por essa condição pode restabelecer a dívida perdoada.'])

def cutoff(period=None):
 return card('cutoff','Separe os débitos pelo vencimento e pelo tributo',
 'O corte do perdão é 13/10/2026. Use o vencimento original de cada obrigação, e não o mês em que você consultou ou emitiu um boleto atualizado.',
 [step('Pegue os extratos que você salvou e separe os valores com vencimento original até 13/10/2026 dos que venceram depois.'),
 step('Nos débitos do primeiro grupo, identifique a contribuição do próprio MEI ao INSS e confira se o titular estava enquadrado como MEI na data do vencimento. O histórico de opções ajuda nessa comparação.','Conferir histórico no SIMEI',OPTANTES),
 step('Separe ICMS e ISS: são impostos estadual e municipal e continuam devidos. Nem todo valor de um mesmo DAS é perdoado.'),
 step('A extinção dos créditos abrangidos está prevista para 01/01/2027. Acompanhe a baixa e os valores remanescentes no órgão que cobra cada dívida.')],
 example='Um DAS com vencimento original em 20/10/2026 fica depois do corte de 13/10, mesmo sendo uma dívida de outubro. Não trate o mês inteiro como abrangido.',
 notes=(['Você marcou apenas vencimentos após o corte. Esses vencimentos ficam fora desse perdão; confira o pagamento ou a negociação correspondente.'] if period=='after' else []))

def agreements(channel='unknown'):
 instructions=[]
 if channel in ('rfb','both','unknown'):
  instructions += [step('Escolha MEI > Serviços para Microempreendedores Individuais > Pagamentos e Dívidas > Parcelamentos > Meus Parcelamentos do MEI. Entre com gov.br e abra a consulta do acordo existente.','Consultar parcelamento na Receita',RFB)]
 if channel in ('pgfn','both','unknown'):
  instructions += [step('Com o CNPJ da empresa selecionado, entre em Negociar Dívida > Acesso ao Sistema de Negociações. No SISPAR, abra Consulta e selecione o acordo.','Consultar negociação na PGFN',REGULARIZE)]
 instructions += [
  step('Guarde o número do acordo, os débitos incluídos, seus períodos, o saldo e as parcelas pagas/em aberto. A prestação mensal do acordo é diferente do DAS mensal corrente.'),
  step('Se o acordo incluir somente créditos abrangidos, a portaria prevê sua extinção em 01/01/2027. Se misturar valores abrangidos e não abrangidos, prevê revisão independentemente de requerimento.'),
  step('Acompanhe o novo saldo no mesmo canal. Até constar o tratamento aplicável, não cancele o acordo por conta própria: uma prestação pode conter valores que continuam devidos.') ]
 return card('agreements','Confira o parcelamento no canal em que ele foi feito',
 'Abra o acordo existente para saber o que cada prestação está pagando. Não é preciso fazer um novo pedido de parcelamento para consultar.',
 instructions)

def judicial(unknown=False):
 return card('judicial','Descubra se há processo sobre a dívida' if unknown else 'Separe o processo judicial da consulta de guias',
 'Processo judicial envolve a Justiça. Uma dívida pode estar sendo cobrada pela PGFN em uma execução fiscal, ou pode ser discutida em uma ação proposta por você.',
 [step('Abra Consultar Dívida Ativa e o relatório completo da inscrição. Procure a informação de processo judicial e anote o número, se houver.','Ver relatório no Regularize',REGULARIZE),
 step('Se você já contratou advogado para discutir a cobrança, peça o número do processo e confirme quais débitos estão sendo discutidos. A consulta à PGFN não substitui essa conferência das ações propostas por você.'),
 step('Se foi você quem entrou com a ação, peça ao advogado para avaliar a desistência e a renúncia limitadas aos créditos abrangidos pelo perdão. Elas têm efeitos jurídicos e exigem comprovação do protocolo no processo.'),
 step('O requerimento com os comprovantes segue para a Receita, se o crédito não foi inscrito, ou para a PGFN, se está em dívida ativa. Se for execução fiscal, confira com o responsável o tratamento da cobrança e de eventual penhora.')],
 links=[{'label':'Portal da Receita: créditos não inscritos','url':RFB},{'label':'Regularize: créditos inscritos','url':REGULARIZE},{'label':'Regra dos processos: art. 5 da portaria','url':PORTARIA}])

def question_guidance():
 return {
 'debt':{'intro':'Confira dois lugares: guias ainda na Receita e dívidas já encaminhadas à PGFN. Se não conseguiu verificar os dois, escolha Não sei.','cards':[revenue(),pgfn()]},
 'debt_period':{'intro':'Olhe o vencimento original no extrato. A data-limite é 13/10/2026, não o fim de outubro.','cards':[cutoff()]},
 'installment':{'intro':'Parcelamento é um acordo para pagar dívida antiga em prestações. Ele não substitui o DAS mensal atual.','cards':[agreements()]},
 'installment_channel':{'intro':'Veja no comprovante ou na tela do acordo se ele foi feito na Receita ou na PGFN. Isso define qual portal você vai usar.','cards':[agreements()]},
 'lawsuit':{'intro':'Considere ações para discutir a dívida e cobranças na Justiça. Se não sabe, confira o relatório da inscrição e com quem acompanha sua empresa.','cards':[judicial(True)]},
 'payments':{'intro':'Confira as guias mensais atuais, separadamente das parcelas de um acordo. Você também vai receber o calendário exigido para 2027.','cards':[monthly()]},
 }
def answer_feedback(key,value,answers):
 if key=='simei_check':
  if value=='no':return registry(True)
  if value=='unknown':return registry()
  return card('next-debt','Agora vamos localizar as dívidas','Ser MEI não mostra, por si só, se existem guias em aberto. Na próxima etapa você verá como consultar os dois canais de cobrança.',[])
 if key=='debt':
  if value=='no':return card('no-debt','Mantenha as consultas e os pagamentos organizados','Como você já conferiu e não encontrou dívida, vamos focar nos pagamentos atuais e em guardar os comprovantes.',[])
  return card('debt-next','Separe os extratos antes de decidir o pagamento','Guarde um extrato da Receita e outro da PGFN. O próximo passo é conferir os vencimentos e identificar onde cada valor é cobrado.',[step('Se faltou alguma consulta, você encontra as instruções completas no seu plano final. Não precisa adivinhar uma informação para continuar.')])
 if key=='debt_period':return cutoff(value)
 if key=='installment':
  if value=='yes':return card('agreement-next','A próxima pergunta identifica onde consultar seu acordo','Tenha o comprovante ou o número do parcelamento por perto. O DAS do mês continua separado das prestações do acordo.',[])
  if value=='unknown':return agreements()
  return None
 if key=='installment_channel':return agreements(value)
 if key=='lawsuit' and value in ('yes','unknown'):return judicial(value=='unknown')
 if key=='payments':return monthly()
 return None

def build_plan(answers,source):
 cards=[]
 simei=answers.get('simei_check')
 if simei in ('no','unknown',None):cards.append(registry(simei=='no'))
 if simei=='yes':cards.append(monthly())
 if answers.get('debt')!='no':
  cards += [revenue(),pgfn(),cutoff(answers.get('debt_period'))]
 if answers.get('installment') in ('yes','unknown'):
  cards.append(agreements(answers.get('installment_channel','unknown')))
 if answers.get('lawsuit') in ('yes','unknown'):
  cards.append(judicial(answers.get('lawsuit')=='unknown'))
 if not cards:
  cards.append(card('keep-records','Guarde seus comprovantes e confira as próximas guias','Organize os documentos por ano e competência para encontrar cada pagamento quando precisar.',[step('Consulte o extrato sempre que houver dúvida sobre uma guia ou mudança de situação.','Abrir Portal do Simples Nacional',SIMPLES)]))
 return {'title':'Seus próximos passos','steps':cards,'sources':SOURCES,'reviewed_at':'2026-10-30','content_version':11,'scope':'Roteiro preparado com suas respostas. Confira a situação e os valores nos extratos dos órgãos.'}
