# Formulário em quatro etapas e identificação por CNPJ

13/11/2026 — publicado após autorização expressa de Rodrigo. [Registro da publicação](publicacao-formulario-20261113.md).

Rodrigo apontou que o expansor de dados complementares escondia informações importantes. Pediu abri-lo como etapa própria, consultar a BrasilAPI e permitir que o visitante confirme a empresa ou informe que não sabe o CNPJ.

## Fluxo

1. Contato: nome, WhatsApp, e-mail e cidade/UF.
2. Cenário: atividade relatada, regime informado, situação conhecida e faturamento aproximado.
3. Identificação: sei o CNPJ / não sei meu CNPJ / ainda não tenho CNPJ; consulta automática, confirmação da empresa, nome manual quando necessário e contador atual.
4. Necessidade: serviço, dificuldade, urgência, momento de contratação, observação e ciência de privacidade.

Nome da empresa e contador atual continuam acessíveis, sem expansor. Não é obrigatório conhecer o número para solicitar atendimento. Um CNPJ informado deve ter formato e dígitos válidos. Após encontrar a empresa, é necessário confirmá-la; se a consulta falhar, o interessado pode continuar com o número informado e nome manual. Nenhuma falha é apresentada como empresa inexistente ou ausência de dívida.

### Ajuste visual solicitado na revisão

Rodrigo pediu retirar a legenda técnica abaixo do CNPJ e identificar melhor os dados retornados. O cartão agora separa **Nome empresarial**, **Nome fantasia**, CNPJ, cidade/UF, situação cadastral e atividade. Nomes ocupam linhas próprias; no celular, os campos ficam empilhados, com rótulos e valores legíveis. Nome fantasia ausente aparece como “Não informado”. A consulta e o envio não mudam; a informação sobre a fonte permanece na política de privacidade e no encaminhamento interno.

## Consulta

- `POST /api/consultar-cnpj`: somente número no corpo; upstream fixo `https://brasilapi.com.br/api/cnpj/v1/{cnpj}`. Nenhum dado de contato é enviado à BrasilAPI.
- Validação numérica/alfanumérica e máscara em módulo compartilhado, sem dependências novas. Consulta após 450 ms de estabilidade, com cancelamento e tempo limite; não há tentativas automáticas repetidas.
- Resposta limitada a CNPJ, razão social, nome fantasia, município/UF, situação e atividade principal. QSA, CPF, telefones, endereço completo e e-mail não são encaminhados. CNPJ divergente é recusado.
- Sem cache da resposta nem persistência do resultado por esse endpoint. O navegador mantém o necessário durante o preenchimento. A alteração do número ou da alternativa invalida a confirmação anterior; respostas atrasadas não substituem a empresa atual.
- A consulta é cadastral e pode estar desatualizada. Não preenche automaticamente regime, situação relatada, atividade real ou cidade de contato. Esses dados são preservados para comparação pela equipe.
- A política de privacidade informa a consulta. Analytics não recebem número ou dados cadastrais.

## Integrações preservadas

O envio permanece em `/api/troca-contador`, mantendo Telegram, webhook de Google Sheets, origem comercial, prioridade e retorno manual pelo WhatsApp. Novos campos: `cnpjInformacao`, `cnpjConfirmado`, `cnpjRazaoSocial`, `cnpjNomeFantasia`, `cnpjMunicipioUf`, `cnpjSituacao`, `cnpjAtividade`, `cnpjConsultaFonte`. Só dados confirmados da consulta acompanham o lead. Quando não se conhece/não existe CNPJ, o número segue vazio e a alternativa é identificada.

O encaminhamento ao webhook foi conferido com simulação; a disposição das novas colunas na planilha externa não foi alterada ou comprovada por este teste. Uma confirmação do visitante não é autenticação de representação da empresa.

## Validação

- TypeScript aprovado; 66 testes Node aprovados, incluindo novo endpoint, dados mínimos, erro/divergência, CNPJ numérico/alfanumérico e encaminhamento aos dois canais com rede simulada.
- Consulta real de leitura com o CNPJ da própria Nacional retornou 200, com os sete campos previstos. Isso não garante disponibilidade contínua da BrasilAPI.
- Navegador Edge instalado: quatro etapas, confirmação obrigatória, envio simulado 502/200, não sei/sem CNPJ, falha da consulta, nova tentativa, alteração do número, resposta atrasada e número inválido. Desktop 1440 px e mobile 390/320 px sem transbordamento; sem erros JS ou notificações operacionais reais.
- Build de prévia aprovado, com 33 páginas pré-renderizadas. Evidências em `%LOCALAPPDATA%\CodexWork\Nacional\Formulario-CNPJ-20261113`.
- Prévia LAN conferida: página 200 com `noindex`, consulta de leitura 200, envio de lead bloqueado com 503 e caminho de cliente bloqueado com 404. No navegador, o botão final exibiu o aviso de prévia sem emitir POST de lead.

## Prévia

`http://192.168.18.4:57194/solicitar-atendimento` — celular no mesmo Wi-Fi, computador ligado. Build `VITE_PREVIEW_MODE=true` e `noindex`. O servidor continua bloqueando envio de leads e arquivos de clientes. Exceção explícita de leitura: `PREVIEW_CNPJ_LOOKUP=true` habilita somente o endpoint de consulta cadastral para esta revisão. Nenhuma mensagem de teste é enviada ao Telegram/Sheets.

## Fonte técnica

[Documentação do endpoint CNPJ da BrasilAPI](https://github.com/BrasilAPI/BrasilAPI/blob/main/pages/docs/doc/cnpj.json) e [implementação oficial da rota](https://github.com/BrasilAPI/BrasilAPI/blob/main/pages/api/cnpj/v1/%5Bcnpj%5D.js), consultadas em 13/11/2026. Não foi copiado um componente externo nem incluída dependência de interface.
