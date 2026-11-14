# Google: rastreamento e medição

Revisão posterior à publicação do formulário em quatro etapas. Este registro atualiza as pendências históricas dos documentos de publicação sem reescrever o estado observado nas datas anteriores.

## Correção publicada

- Metatag verdadeira do Search Console adicionada ao `index.html` no commit `e4a12525bb27cde0943d0292c50b7288901c3481`.
- Build conferido e publicação Git em `origin/main`; deploy `dpl_Bn5y9T8sJq9DJp1keEczAFPaq989` confirmado Ready no domínio oficial.
- Propriedade de prefixo `https://www.nacionalcon.com/` verificada por Tag HTML, com confirmação na interface do Google. Manter a tag no head.
- Nenhuma alteração de DNS. A propriedade de domínio amplo não foi declarada recuperada.

## Retornos do Google

- Sitemap reenviado e processado com **34 páginas encontradas**, atualizando o registro anterior de 24. Esse total não comprova indexação de todas as URLs.
- Home: “O URL está no Google” / “A página está indexada”. Como o rastreamento exibido era anterior ao redesign, foi solicitada atualização uma vez; o Google confirmou inclusão na fila prioritária. Novo rastreamento não foi afirmado.
- `/mei-em-crescimento`: indexada, rastreamento com êxito, canonical correspondente e coleta recente no Googlebot Smartphone. Nenhum novo pedido foi feito. A inspeção ainda mostrou um erro temporário no campo de sitemap; o relatório próprio do sitemap mostrou processamento concluído.
- Relatório de desempenho: dados em processamento, sem tabela utilizável. Sem cliques, impressões ou posição a reportar nesta consulta.

## Conferência técnica

Auditoria HTTP pública com timestamp `2026-11-14T10:39:30.790Z`: 34/34 URLs do sitemap com 200, canonical correspondente, um H1 e sem noindex. Robots e bundle respondem 200. Portal anônimo retorna 401; solicitação vazia retorna 400 antes das notificações. Nenhum lead real de teste foi enviado.

HTML pré-renderizado, metadados e entidade AccountingService preservados. As restrições intencionais de páginas privadas e do formulário não foram removidas. Permitir rastreamento não garante ranking ou citação por IA.

## Analytics — continuidade autorizada em 14/11/2026

Rodrigo autorizou avançar no cadastro após o pedido específico de aceite. Criadas a conta **Nacional Contabilidade**, a propriedade **Nacional Contabilidade — Site** e o fluxo **Site Nacional Contabilidade**, para `https://www.nacionalcon.com`, em reais e com o fuso de Santarém. ID verdadeiro: `G-XEX4N8C1FE`; código do fluxo: `16341315175`.

O ID foi configurado em `VITE_GA_MEASUREMENT_ID` somente no ambiente de produção da Vercel. O código existente carrega a tag apenas após aceitar a medição opcional e preserva o Meta Pixel. A política passou a identificar o uso do Analytics e a apontar para a explicação oficial de tratamento de dados do Google.

A medição otimizada adicional do fluxo foi desativada com confirmação na interface, para manter os eventos explícitos do site e evitar interações automáticas de formulário. Usar apenas envio efetivamente confirmado como evento principal (`generate_lead`). Os botões Continuar não são leads; clique no WhatsApp não comprova conversa ou contrato. A criação da conta e a configuração do ID não comprovam, por si, coleta; o recebimento e a publicação precisam ser conferidos separadamente.

`generate_lead` foi cadastrado como evento principal, pelo método com código, sem valor monetário padrão. O código existente dispara esse evento somente após resposta positiva do endpoint; não foi criada conversão baseada apenas na abertura do formulário.

O teste inicial no domínio confirmou bloqueio de bibliotecas Google após recusar e resposta 204 após aceitar, mas mostrou duas visualizações por abertura. A configuração foi ajustada para definir `send_page_view: false` também globalmente **antes** da inicialização da tag, preservando a visualização explícita e URLs sem query. Referências: [configuração global](https://developers.google.com/analytics/devguides/collection/ga4/reference/config#send_page_view) e [comportamento de inicialização da tag](https://support.google.com/analytics/answer/18411054?hl=en). Foram adicionados testes de recusa, ordem de inicialização, envio único e filtragem de dados pessoais; suíte com 69 testes aprovada, assim como TypeScript. A conferência no Google é registrada separadamente das simulações locais.

## Publicidade

O nome Nacional Contabilidade foi salvo no Ads. Escolhida a opção de configurar apenas a conta, com Brasil, reais e GMT-03:00. O cadastro chegou ao faturamento, cuja confirmação faria uma autorização temporária no cartão salvo; essa etapa financeira não foi enviada. Nenhuma campanha, orçamento, cobrança ou gasto foi ativado pelo assistente. Concluir cadastro não autoriza veiculação. Planejamento de aquisição, evidências das contas e pendências comerciais permanecem na documentação operacional privada da Nacional, fora deste repositório público.
