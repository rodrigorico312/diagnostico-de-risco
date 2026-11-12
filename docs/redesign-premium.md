# Redesign e captação da Nacional — prévia para revisão

Brief recebido em 11/11/2026. Base: `rodrigorico312/diagnostico-de-risco`, commit `54828f0ee158a71cd53676579d38dccec6727222`. Trabalho em `redesign/premium-captacao-20261111`, sem push, merge ou publicação no domínio oficial.

## Fase 1 — auditoria e direção visual

| Evidência | Constatação e tratamento |
| --- | --- |
| `package.json`, `vite.config.ts`, `src/main.tsx` | React 19 + TypeScript + Vite 6; dois pontos de entrada, site e portal. A arquitetura foi mantida. |
| `src/App.tsx`, `vercel.json`, `public/sitemap.xml` | Rotas manuais com páginas de soluções, blog, ferramentas, guia MEI e páginas locais. Nenhuma rota existente foi removida. Seis novas rotas comerciais adicionadas. |
| `src/ApprovedHomePage.tsx` e HTML público | A home anterior prioriza diagnóstico e regularização fiscal. O novo briefing dá prioridade ao crescimento e à transição do MEI, mantendo a regularização entre as soluções. |
| `src/RequestServicePage.tsx`, `api/troca-contador.js` | Formulário existente em três etapas; POST no mesmo endpoint. Integrações por variáveis de ambiente para Telegram e Google Sheets e botão de retorno pelo WhatsApp. Contrato de campos e integrações preservado. |
| `portal.html`, `server/portal.mjs`, `supabase/migrations` | Área privada com autorização por empresa, cookies e documentos privados. Backend, migrações e permissões não alterados. |
| `index.html`, `src/analytics.ts` | Meta Pixel existente com disparo imediato. Havia chamadas condicionais para `gtag`, sem instalação ou ID de propriedade GA4 localizados. O pixel foi preservado e passou a depender da escolha do visitante. |
| Código, HTML público e TXT de `nacionalcon.com` | Não localizado identificador de Analytics nem verificação pública do Search Console nessa consulta. Isso não prova inexistência de propriedade: verificação por DNS, Analytics ou conta externa precisa ser conferida na conta responsável. Não foram acessados relatórios de tráfego. |
| Acervo estático | Existem arquivos legados de clientes em `public/`. Não foram lidos nem promovidos nesta entrega. A prévia recusa esses caminhos e serve somente arquivos estáticos permitidos. Não se deve publicar o diretório completo de acervo sem uma revisão específica da autorização de exposição. |

Direção proposta: azul `#193F6B`, azul profundo `#102B48`, dourado `#C2A65C`, branco e superfícies neutras. Dourado escuro `#826B34` para textos com contraste; sem verde. Logomarca e retrato existentes, fontes locais DM Sans e Lora. Composição editorial, grade de serviços discreta, gráfico vetorial ilustrativo de crescimento, poucos destaques por seção e movimentos apenas em interações, respeitando movimento reduzido. O gráfico não representa resultados comerciais.

Referências estudadas: [shadcn/ui — formulários](https://ui.shadcn.com/docs/forms), [componentes](https://ui.shadcn.com/docs/components) e [Stripe Atlas](https://stripe.com/atlas). Aproveitados padrões de rótulos, foco, navegação e composição; sem adicionar bibliotecas de interface ou copiar afirmações e provas dessas empresas.

## Fases 2 e 3 — páginas e ferramenta

| URL | Função |
| --- | --- |
| `/` | Nova home com seis frentes, diagnóstico inicial, jornada, responsável e conteúdos. |
| `/mei-em-crescimento` | Página dedicada, problemas reconhecíveis, dúvidas frequentes e passagem para cálculo/atendimento. |
| `/calculadora-mei` | Limite anual/proporcional, receitas realizadas e previstas, interpretação preliminar e contato opcional. |
| `/contabilidade-empresarial` | Acompanhamento recorrente, responsabilidades e relações com as soluções existentes. |
| `/desenquadramento-mei` | Transição, efeitos, alterações e explicação de que preços dependem do escopo. |
| `/consultoria-financeira-tributaria` | Caixa, retiradas, revisão e plano de ação. |
| `/conteudos-e-ferramentas` | Descoberta de cálculo, guia, artigos e consultas existentes. |

A calculadora usa centavos inteiros e valores mensais previstos na norma; inclui o mês de abertura. Analisa somente 2024, 2025 e 2026, anos revisados. A ocupação genérica não é tratada como prova de permissão ao SIMEI. O limite do MEI Caminhoneiro depende das ocupações exclusivas aplicáveis e não é aplicado a transporte combinado com outras atividades. Mudança de ocupação no ano exige análise própria.

Fontes oficiais conferidas em 11/11/2026: [Manual de desenquadramento do SIMEI](https://www8.receita.fazenda.gov.br/SimplesNacional/Arquivos/manual/MANUAL_DESENQUADRAMENTO_SIMEI.pdf), [Resolução CGSN 140/2018](https://normas.receita.fazenda.gov.br/sijut2consulta/link.action?idAto=92278), [LC 238/2026 e vigência](https://legis.senado.gov.br/norma/44276013/publicacao/44280206). Os novos limites futuros não foram aplicados a anos anteriores. A revisão para 2027 deverá verificar vigência, condições e regulamentação, inclusive o art. 3º da LC 238.

Não há consulta de CNPJ nem cálculo de imposto definitivo. A receita prevista não é tratada como excesso ocorrido. Nenhum valor da calculadora é transmitido, guardado no servidor ou incluído em mensagens de WhatsApp.

## Fase 4 — qualificação e atendimento

A mesma URL `/solicitar-atendimento` mantém três etapas: contato; atividade, regime, CNPJ e receita; serviço, dificuldade, urgência e momento. Empresa, CNPJ, contador atual e observações são complementares. Não é necessário preencher documentos ou senhas. Há ciência de privacidade, tratamento de falha de envio e bloqueio de reenvio enquanto a requisição está em curso.

O endpoint mantém Telegram, Google Sheets e o retorno manual pelo WhatsApp. Acrescenta os novos campos, origem inicial e uma sugestão de prioridade calculada no servidor. Perguntar preço não elimina nem desqualifica automaticamente o interessado. A prioridade apenas ordena a análise humana; não envia mensagens nem aceita/rejeita propostas.

O diagnóstico inicial gratuito foi separado do diagnóstico técnico aprofundado. A avaliação preliminar se limita ao cenário informado e encerra-se com a primeira orientação e indicação do próximo passo. Não inclui cálculo definitivo, auditoria, transmissões ou execução. Atividades adicionais são propostas com escopo, prazo e valor antes da contratação. A cadência interna e a capacidade de atendimento permanecem decisões operacionais a confirmar; o site não promete um prazo de resposta inventado.

## Fase 5 — SEO, privacidade e eventos

Sete páginas comerciais possuem HTML pré-renderizado, títulos, descrições, canonical, Open Graph e dados estruturados com identidade da Nacional, atuação nacional e presença em Santarém. Isso permite leitura do conteúdo inicial sem executar JavaScript. As seis URLs novas foram incluídas no sitemap e na configuração de rotas; as antigas permanecem. Não foram criados depoimentos, avaliações, resultados, métricas ou promessas de posicionamento.

| Evento | Momento |
| --- | --- |
| `mei_page_view` | Abertura da página MEI, com medição autorizada. |
| `calculator_start` | Primeiro foco na ferramenta. |
| `calculator_complete` | Simulação válida, apenas classes do resultado. |
| `whatsapp_click` | Clique no canal, sem equiparar clique a contato recebido. |
| `form_start` | Primeiro foco no formulário. |
| `form_submit` e `generate_lead` | Resposta positiva do endpoint de entrega. |
| `diagnostic_requested` | Envio confirmado em jornada marcada como diagnóstico inicial. |

Medição opcional só inicia após aceitação e pode ser revogada pelo rodapé. Eventos não incluem nome, telefone, e-mail, descrição do caso, valores de faturamento ou URL com query. A origem comercial registra na sessão apenas parâmetros de campanha, página e domínio de referência e acompanha o formulário até os canais operacionais. A política de privacidade foi atualizada. Não foi alterado o tratamento documental da área privada.

Para ligar GA4, configurar o ID verdadeiro em `VITE_GA_MEASUREMENT_ID` e verificar o recebimento na propriedade. A definição dos eventos principais, filtros internos, medição aprimorada da propriedade e a propriedade do Search Console precisam de conferência na conta. Não há dados de tráfego/conversão disponíveis nesta auditoria.

## Prévia e retomada

- Computador: `http://127.0.0.1:57194` (mesmo servidor da revisão no celular).
- Celular no mesmo Wi-Fi: `http://192.168.18.4:57194`. O computador deve permanecer ligado; o endereço pode mudar com a rede.
- Executar `VITE_PREVIEW_MODE=true npm run build` e `npm run preview:local` para recriar a prévia em loopback. No PowerShell, definir a variável com `$env:VITE_PREVIEW_MODE='true'` antes do build.
- Para acesso na rede, definir `$env:PREVIEW_HOST='0.0.0.0'` e `$env:PORT='57194'` antes de executar o servidor. A autorização de rede foi dada para a revisão no celular, sem autorização para produção.
- `scripts/preview-server.mjs` devolve 503 para API e bloqueia arquivos de clientes. O próprio build de prévia impede envio do formulário e tem `noindex`. O portal real continua no domínio oficial; não está conectado na prévia.
- Capturas, relatórios e ferramentas temporárias: `%LOCALAPPDATA%\CodexWork\Nacional\Site-redesign-20261111`.

## Validação e limites

TypeScript do site conferido. `tools/nacional-atlas` é outro projeto com dependências próprias e foi excluído do tsconfig raiz; não foram instaladas dependências desse aplicativo. Os 43 testes existentes passaram, incluindo isolamento do portal, assim como 17 novos testes de cálculo e integrações simuladas, sem envio real.

Revisão Edge em desktop e mobile; 19 combinações de rota/viewport verificadas, sem transbordamento horizontal, com um H1 por página e sem requisições externas. A revisão axe WCAG A/AA encontrou apenas contraste dos índices dos serviços na home, corrigido e revisto. Verificações automatizadas não substituem uso com leitores de tela ou medição em aparelhos e redes reais.

Pendências para publicação: revisão visual de Rodrigo; propriedade real GA4 e Search Console; conferência da configuração de notificações em homologação autorizada; conciliação com o HEAD remoto antes de integrar; autorização de produção. Não houve alteração de DNS, deploy, formulários recebidos em produção ou dados do portal. Reverter o código restaura o frontend anterior; nenhuma migração foi feita.


Validação complementar: o fluxo completo do formulário foi executado no navegador em uma instância local separada, com os POSTs interceptados. Uma resposta 502 preservou o erro e não mostrou recebimento; a nova tentativa 200 mostrou confirmação. Regime, situação do CNPJ, origem Google e ciência de privacidade chegaram no corpo simulado, sem query na página enviada. O build de prévia também foi testado: nenhum POST é emitido ao clicar em enviar. Resultado final da suíte: 60 testes, 60 aprovados. A revisão de contraste da home após a correção terminou sem violações axe A/AA em desktop e mobile.

A instância de teste do formulário na porta 57195 e o servidor anterior em 57193 foram encerrados, assim como os três navegadores de teste. Permanece ativo apenas o servidor de prévia 57194 para a revisão solicitada por Rodrigo. A remoção de `npm-cache`, `qa` e `clone-incompleto` na pasta temporária exclusiva da tarefa foi rejeitada pela revisão automática com motivo genérico `blocked by policy`. Não foi feita tentativa de contornar esse bloqueio; a limpeza dessas pastas permanece pendente. Nenhum navegador foi baixado; o Edge instalado e as dependências do site foram preservados.
