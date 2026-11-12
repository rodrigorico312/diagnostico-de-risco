# Publicação — 12/11/2026

Rodrigo autorizou expressamente colocar a atualização em produção e concluir os ajustes do briefing inicial necessários ao lançamento e à descoberta por mecanismos de busca. O site está disponível em https://www.nacionalcon.com, sem depender da rede local.

## Fonte e entrega

- Repositório: `rodrigorico312/diagnostico-de-risco`.
- Fonte da aplicação publicada: `535d2b842a250c574cf3084c6b78a60ccf6e2c46`.
- `origin/main` foi conferido em `54828f0` e atualizado por avanço direto, sem sobrescrever alterações remotas.
- Primeiro artefato de produção conferido antes da troca do domínio: `dpl_7cGnp6ogb4aJSQqgiYPqRobzTB3p`, promovido após os testes.
- O push para `main` gerou também o deploy Git `dpl_aESepMmTBfSjYtAfdAaGkyEQgbz6`, confirmado como Ready e vinculado ao domínio. Mesmo código da aplicação; sem alteração de configuração sensível ou migração.
- Referência anterior para retorno, se necessário: `dpl_9WdVHLm4u2RGvg7BxtMyAY4iHydf`, URL `https://diagnostico-de-risco-nwf2zgloo-rodrigorico312s-projects.vercel.app`. A reversão de frontend não envolve banco.
- Este registro é uma alteração documental posterior à aplicação conferida.

## Visual, captação e preservação

A versão reúne a base escolhida por Rodrigo, DM Sans/Lora locais, abertura com gráfico e degradê contínuo no celular, brilho de interação, cartões sem setas e WhatsApp flutuante azul. Foram retirados retrato em cápsula, N isolado, frases decorativas e pequenas legendas rejeitadas. O rodapé adapta código do Shadcn Space Footer 02, com licença MIT preservada em `LICENSES/Shadcn-Space.md`.

Home, jornada de MEI, calculadora, páginas comerciais e formulário qualificado estão no domínio oficial. O endpoint de captação e os canais Telegram/Google Sheets foram preservados. As variáveis dos canais existem no ambiente de produção; isso não comprova entrega real nesta revisão. Backend privado, permissões por empresa e migrações não foram modificados. Nenhum documento de cliente foi acrescentado como parte do redesign.

## Busca e medição

- HTML individual pré-renderizado em 33 páginas públicas: texto inicial, título, descrição, canonical, Open Graph e JSON-LD pertinentes. Corrigida a entrega indevida do HTML da home em rotas antigas antes do lançamento.
- Sitemap publicado com 34 URLs, preservando as anteriores e a rota independente `/blog/cnpj-para-psicologos`. `robots.txt` aponta ao sitemap; páginas públicas sem `noindex`. Rotas privadas mantêm suas restrições.
- IndexNow: arquivo público de verificação conferido no domínio e 33 URLs atualizadas submetidas. Retorno HTTP **202**, recebido para validação da chave. Indexação e prazo não são garantidos. O artigo independente inalterado não foi reenviado. Referência: https://www.indexnow.org/documentation.
- Google Search Console: a conta disponível no navegador abriu a tela de boas-vindas, sem propriedade da Nacional cadastrada. Nenhuma nova conta, permissão, propriedade ou verificação foi criada. Pendente acesso à propriedade responsável ou definição da conta que fará a verificação e envio do sitemap.
- GA4: não existe `VITE_GA_MEASUREMENT_ID` no ambiente de produção. Código e eventos estão preparados, mas GA4 não foi declarado ativo. Pendente ID real `G-…` e verificação na propriedade. Meta Pixel existente preservado e condicionado à escolha de privacidade.
- Eventos preparados: página de MEI, início/conclusão do cálculo, WhatsApp, início/envio de formulário, lead e solicitação de diagnóstico. Nenhum evento inclui contatos, conteúdo do caso ou valores da calculadora. Nenhuma estatística comercial foi inventada.

## Conferências

- Build de produção na Vercel aprovado; 33 páginas pré-renderizadas.
- TypeScript aprovado; 61 testes aprovados, incluindo cálculo, integração simulada e isolamento privado.
- Auditoria HTTP pública: **34/34** URLs com 200, canonical correspondente, um H1 e sem bloqueio de indexação; robots e bundle respondem 200.
- Portal anônimo: `/api/client-portal?action=me` devolve 401. Formulário com corpo vazio devolve 400 antes dos canais operacionais.
- Antes da publicação: 60 combinações de rota/largura sem transbordamento ou erro JS; rodapé e degradê conferidos inclusive em 320 px; verificações axe A/AA sem violações nas páginas revisadas.
- Após a publicação: home e rodapé conferidos em 390 e 1440 px, sem transbordamento, duplicidade ou erro JS. Capturas preservadas. Calculadora: `R$ 40.000,00`, `inputmode=numeric`, fonte 16 px; abertura em julho/2026 produziu limite proporcional de R$ 40.500,00.
- Formulário completo no domínio publicado, com interceptação de rede e dados fictícios: 502 mostrou erro; 200 simulado mostrou confirmação. Duas requisições interceptadas; nenhuma mensagem real ou lead de teste foi enviado.

Evidências locais em `%LOCALAPPDATA%\CodexWork\Nacional\Site-publicacao-20261112` e capturas em `Site-rodape-20261112`. Utilizado Edge instalado, sem baixar navegador. A prévia na porta 57194 permanece disponível; não é necessária para acessar produção.

## Pendências delimitadas

1. Informar/conectar o ID verdadeiro de GA4 e conferir a medição na propriedade.
2. Acessar/verificar a propriedade responsável no Search Console e enviar o sitemap. Publicação e IndexNow não equivalem a indexação no Google.
3. Conferir entrega real das notificações com um atendimento legítimo ou teste operacional autorizado; os testes atuais são simulados.
4. Rever a calculadora para 2027 antes de oferecer esse ano. Recorte atual: 2024–2026; fontes oficiais reconferidas em 12/11/2026.
