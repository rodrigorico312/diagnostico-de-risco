# Publicação do formulário — 13/11/2026

Rodrigo autorizou expressamente publicar as organizações revisadas na prévia. Disponível em https://www.nacionalcon.com/solicitar-atendimento, sem depender do computador ligado ou da rede local.

## Fonte e destino

- Aplicação: commit `37d80a35113277a6cc004328ae047a8e4ed268b2`, integrado a `origin/main` por avanço direto, sem sobrescrever alterações remotas.
- Projeto Vercel `diagnostico-de-risco`, ID `prj_6aRvsPv6U7Tv9o1yzt3mVo3RYO5P`, equipe `team_aw0mjTfuKMJB6vqgtZxolxGa`; conexão GitHub `rodrigorico312/diagnostico-de-risco`, produção na branch `main`.
- Deploy da aplicação conferido como **Ready / Production**: `dpl_GEFETSHeXpk8FMMwsrZtdGvzjaTr`, URL `https://diagnostico-de-risco-a7x9qie8f-rodrigorico312s-projects.vercel.app`, com alias `www.nacionalcon.com`.
- Referência anterior: `dpl_HAtdyFDXZv9bdB5gFy99CDbxpGTG`, `https://diagnostico-de-risco-oeclnfaqa-rodrigorico312s-projects.vercel.app`. Nenhuma migração de banco foi feita.
- Este registro é uma alteração documental posterior à aplicação verificada; eventual redeploy Git desse registro conserva o mesmo código da aplicação.

## Alterações publicadas

Formulário em quatro etapas, com identificação da empresa aberta na etapa 3 e necessidade/urgência/decisão na etapa 4. Consulta automática de CNPJ pela BrasilAPI, confirmação da empresa, alternativas “Não sei meu CNPJ” e “Ainda não tenho CNPJ”, falha com continuidade manual e cancelamento de respostas atrasadas.

Cartão com rótulos explícitos para nome empresarial, nome fantasia, CNPJ, cidade/UF, situação e atividade. Espaçamento e hierarquia conferidos em telas pequenas. Legenda técnica abaixo do CNPJ retirada conforme correção de Rodrigo; informação de tratamento mantida na política de privacidade. Respostas do visitante permanecem separadas da base cadastral.

Telegram e webhook de Google Sheets preservados, com encaminhamento dos novos campos. Sem alteração de credenciais, DNS, permissões do portal, migrações ou acervo de clientes. Nenhum dado pessoal de atendimento foi incluído na publicação.

## Conferências

- TypeScript aprovado e 66 testes Node aprovados, com rede simulada para notificações.
- Vercel confirmou o build e o vínculo ao domínio oficial.
- Consulta real, de leitura, ao CNPJ da própria Nacional no endpoint publicado retornou **200**, `ok: true` e somente os sete campos cadastrais previstos. Resposta com `Cache-Control: no-store`. Disponibilidade contínua da BrasilAPI não é garantida.
- Formulário público retornou **200**. O `noindex, nofollow` dessa rota já existia em `vercel.json` e foi preservado; não é o bloqueio geral do build de prévia. A home continua acessível com canonical e sem `noindex`.
- Envio vazio ao endpoint retornou **400** antes de qualquer canal operacional. Portal sem sessão retornou **401** com cache privado.
- Navegador no domínio oficial: 12 cenários com dados fictícios e interceptação das APIs de teste; quatro etapas, confirmação, erro de envio 502 e nova tentativa 200, alternativas ao CNPJ, falha/repetição de consulta, troca do número e resposta atrasada. Zero mensagens ou leads operacionais reais de teste.
- Rótulos do cartão e ausência da legenda conferidos. Desktop e larguras 390/320 px sem transbordamento ou erro JS. Capturas inspecionadas.

Evidências em `%LOCALAPPDATA%\CodexWork\Nacional\Publicacao-Formulario-CNPJ-20261113`. Utilizado Edge já instalado; sem download de navegador. O teste de encaminhamento ao Sheets não comprova disposição de novas colunas na planilha externa, que não foi alterada nesta tarefa.

As pendências de GA4, Search Console e revisão anual da calculadora registradas na publicação de 12/11 permanecem fora desta alteração.
