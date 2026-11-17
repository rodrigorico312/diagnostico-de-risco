# Calculadora da consultoria — /caucu

Rodrigo solicitou implementar e publicar a calculadora em `https://nacionalcon.com/caucu`, com essa grafia exata. A autorização inclui produção. Integração ao site existente React/TypeScript/Vite e ao projeto Vercel `diagnostico-de-risco`, sem servidor Python ou dependências adicionais.

**Ajuste visual posterior em 17/11:** Rodrigo pediu retirar do resumo a frase “A entrada é calculada sobre a soma das cinco parcelas, não sobre o total do projeto.” A legenda e sua linha separadora foram removidas. O rótulo do campo continua identificando a base da entrada; a fórmula permanece a mesma.

Na mesma revisão, pediu campo opcional para o nome da empresa cliente. O nome aparece no resumo da simulação e permanece somente no estado da página, sem persistência, consulta cadastral, envio ao servidor, URL ou evento de medição. O campo começa vazio; nenhum nome real de cliente é incluído no código ou no HTML inicial. O computador retornou `ENOSPC` ao tentar o build local; a publicação utiliza o build remoto existente da Vercel, seguida de conferência pública.

## Revisão solicitada em 17/11 — faixas e moeda durante a edição

Rodrigo pediu retirar o botão de calcular, formatar o faturamento como dinheiro durante a edição e organizar opções Baixa, Média e Alta. Na correção final da conversa, definiu parcela de **6,63% do faturamento** e entrada de **30% da soma das cinco parcelas**. Essa é a configuração inicial da opção Baixa. A Média conserva parcela de 10% e entrada de 30%. A Alta permite personalizar a parcela; seu coeficiente fixo permanece pendente de definição. A entrada inicial da Alta é de 30% e continua ajustável. Nenhuma faixa implica preço obrigatório de mercado ou aceite de cliente.

| Opção com faturamento de R$ 60.000,00 | Parcela | Soma das cinco | Entrada | Total |
| --- | ---: | ---: | ---: | ---: |
| Baixa: parcela 6,63%, entrada 30% | R$ 3.978,00 | R$ 19.890,00 | R$ 5.967,00 | R$ 25.857,00 |
| Média: parcela 10%, entrada 30% | R$ 6.000,00 | R$ 30.000,00 | R$ 9.000,00 | R$ 39.000,00 |

O faturamento usa máscara com `R$`, agrupamento de milhar e dois centavos, com os dois últimos dígitos como centavos durante a digitação. A colagem integral aceita valores em reais, como `60000` ou `60.000,00`, para evitar mudança de unidade ao colar. A edição no meio do campo preserva a posição pelos dígitos à direita; textos inválidos são mantidos para validação, sem conversão silenciosa. O cálculo acompanha os campos sem envio, botão ou formulário de submissão. As opções usam controles de seleção nativos; os percentuais continuam editáveis.

TypeScript e build aprovados, com 82 testes passando. A revisão no Edge instalado conferiu cálculo automático, faixas, moeda durante digitação, cursor no meio, colagem integral em reais, validações, zero e arredondamento. Larguras 1280, 390 e 320 px sem transbordamento e com controles de 18 px. Zero erros JavaScript/hidratação ou requisições de escrita nos cenários. Capturas e relatório `browser-faixas-local-report.txt` no diretório de evidências já indicado abaixo. As duas skills existentes do projeto foram atualizadas e validadas pelo `quick_validate.py` em UTF-8.

Revisão publicada e conferida no domínio oficial: aplicação `84c02c1c92c972b1877e9601b68627e629c3b492`, deploy `dpl_FHiDHG6x7L3mMqvsnXrpzmRPETFW`, **READY / Production**, em `https://diagnostico-de-risco-2mcy5a7ys-rodrigorico312s-projects.vercel.app`, com aliases do domínio Nacional. `/caucu` e `/caucu/` retornam 200 com a nova configuração e sem o botão antigo. Os mesmos cenários foram repetidos no navegador em `https://www.nacionalcon.com/caucu`, com **PASS**, zero erros e zero escritas. A consulta aos logs de erro do deploy retornou zero registros no recorte da última hora. Home e calculadora MEI retornam 200; portal sem sessão retorna 401 com cache privado.

O navegador efêmero `nacional-caucu-faixas` foi fechado, com remoção automática de seu perfil temporário conferida (`existsAfterClose: false`), e o servidor da porta 57217 foi encerrado. Nenhum navegador foi baixado. A pendência antiga de exclusão das duas pastas da primeira publicação, registrada ao fim deste documento, não foi novamente executada. Evidências desta revisão: `browser-faixas-published-report.txt` e capturas `published-faixas-1280.png`, `published-faixas-390.png` e `published-faixas-320.png` no mesmo diretório local de evidências.

## Regra e configuração da publicação inicial

Base lógica: script Python anterior da calculadora, mantido fora do repositório. Na web, o faturamento é informado em reais; a parcela começa em 10% e a entrada em 30%, ambos ajustáveis. Há atalhos de entrada em 30% e 36%. São cinco parcelas mensais após a entrada.

1. Parcela = faturamento mensal × percentual da parcela / 100, arredondada em centavos, com meio centavo para cima.
2. Soma das parcelas = cinco vezes a parcela já arredondada.
3. Entrada = soma das parcelas × percentual da entrada / 100, arredondada em centavos pelo mesmo critério.
4. Total do projeto = soma das parcelas + entrada.

A entrada incide sobre a soma das cinco parcelas. Não é uma fração do total do projeto nem o preço exclusivo de diagnóstico. Os percentuais são parâmetros da simulação, sem indicação de taxa obrigatória de mercado.

| Faturamento | Parcela (%) | Entrada (%) | Parcela (R$) | Soma das parcelas (R$) | Entrada (R$) | Total (R$) |
| --- | --- | --- | --- | --- | --- | --- |
| 65.000,00 | 10 | 30 | 6.500,00 | 32.500,00 | 9.750,00 | 42.250,00 |
| 65.000,00 | 10 | 36 | 6.500,00 | 32.500,00 | 11.700,00 | 44.200,00 |
| 25.000,00 | 10 | 36 | 2.500,00 | 12.500,00 | 4.500,00 | 17.000,00 |
| 25.000,00 | 13,508 | 36 | 3.377,00 | 16.885,00 | 6.078,60 | 22.963,60 |

## Implementação e privacidade

`src/consultation-pricing.ts` interpreta números decimais em texto e calcula com `BigInt`. Nenhum cálculo monetário usa ponto flutuante. Aceita `65.000,00`, `65000`, `65.000` e `65000.00`, incluindo prefixo opcional `R$`. O faturamento admite até dois decimais; os percentuais admitem casas fracionadas com vírgula ou ponto. Rejeita negativos, vazio, não finitos, notação científica, agrupamentos incoerentes e entradas acima de 60 caracteres. Zero é válido. Não se impõe um teto de 100% aos parâmetros, seguindo a lógica original.

`src/ConsultationCalculatorPage.tsx` usa a identidade, cabeçalho e rodapé existentes. Resultado atualizado ao alterar valores válidos, controles com teclado decimal, validação por campo e foco no resumo após calcular. A rota entra no pré-renderizador e tem rewrites explícitos com e sem barra final. Não foi adicionada ao menu ou ao sitemap. Os valores não são enviados, persistidos ou acrescentados a eventos de medição e links. Nenhum dado de cliente ou documento privado integra esta mudança.

## Validação e publicação

- TypeScript aprovado; 79 testes aprovados, incluindo dez testes da nova lógica e os testes existentes do site/portal.
- Build de produção aprovado, com HTML próprio de `/caucu` e preservação das páginas anteriores.
- Revisão local no Edge instalado: casos da tabela, precisão de centavos, validações, atalhos, foco e teclado; larguras 1280, 390 e 320 px sem transbordamento horizontal. Sem POST ou erros JavaScript/hidratação nas interações.
- Não foi localizado ambiente remoto de testes isolado configurado para esta tarefa. A revisão usa Edge instalado e perfil exclusivo local, sem baixar navegador. Evidências em `%LOCALAPPDATA%\CodexWork\Nacional\Calculadora-Consultoria-20261117`.
- Fonte da aplicação: commit `614128164813657f1fa4a3b7e79777abcae70856`, integrado por avanço direto em `origin/main`, sobre a base `35d5f77`. Sem sobrescrever alterações remotas.
- Vercel confirmou **READY / Production** para `dpl_GzekSgcqxwP624bMjqF9diyHW1jZ`, em `https://diagnostico-de-risco-kij0rldc7-rodrigorico312s-projects.vercel.app`, com aliases `nacionalcon.com` e `www.nacionalcon.com`. A referência anterior é `dpl_3tKJhWHLm28wLZ13Lo9YoGYWzU8u`.
- `https://nacionalcon.com/caucu` retorna 200 após o redirecionamento já existente para `https://www.nacionalcon.com/caucu`. A variante `/caucu/` também retorna 200; ambas entregam HTML próprio da calculadora e canonical `/caucu`.
- Os mesmos cenários funcionais e larguras 1280/390/320 foram repetidos no domínio oficial, com **PASS**, zero erros JavaScript/hidratação e zero requisições de escrita. Foram inspecionadas capturas locais e publicada. A emulação não substitui testes em aparelhos físicos/Safari.
- Home, calculadora MEI, solicitação de atendimento e área do cliente continuam retornando 200. A API do portal sem sessão retorna 401 com cache privado. Não houve envio de lead ou mensagem de teste, alteração de DNS, banco ou credenciais.
- Consulta dos logs de erro da implantação publicada, no recorte da última hora, retornou zero registros. Isso descreve o recorte consultado, não uma garantia de disponibilidade futura. Drenos e monitoramento externo não foram auditados nesta alteração de frontend.

## Arquivos da entrega

- `src/ConsultationCalculatorPage.tsx`: interface e validação dos campos.
- `src/consultation-calculator.css`: identidade, contraste e adaptação às telas pequenas.
- `src/consultation-pricing.ts`: interpretação e cálculo decimal exato.
- `src/App.tsx`, `src/premium-prerender.tsx` e `vercel.json`: rota, HTML e rewrites.
- `tests/consultation-pricing.test.mjs`: dez testes de regras e fronteiras de arredondamento.
- Este registro e `docs/redesign-premium.md`: documentação da publicação.

O registro documental posterior conserva o mesmo código de aplicação. Nenhuma etapa de publicação depende do computador local ou da prévia de teste permanecer ligada.

## Encerramento dos testes locais

Navegador exclusivo `nacional-caucu` fechado e servidor de prévia da porta 57217 encerrado, com ausência de listener conferida. Nenhum navegador foi baixado; a pasta `browsers` não existe. As capturas e relatórios necessários permanecem no diretório de evidências.

**Pendência de limpeza:** a revisão automática rejeitou a exclusão de `browser-profile` e `temp` em `%LOCALAPPDATA%\CodexWork\Nacional\Calculadora-Consultoria-20261117`, com o motivo genérico `blocked by policy`. Os caminhos foram conferidos como diretórios normais dentro da tarefa e sem navegador usando o perfil. A tentativa posterior com `Remove-Item -LiteralPath` e destinos absolutos explícitos também foi rejeitada. Essas duas pastas permanecem locais; não fazem parte do repositório, do site nem do deploy. Não houve tentativa por outro shell para contornar o bloqueio.
