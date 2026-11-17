# Calculadora da consultoria — /caucu

Rodrigo solicitou implementar e publicar a calculadora em `https://nacionalcon.com/caucu`, com essa grafia exata. A autorização inclui produção. Integração ao site existente React/TypeScript/Vite e ao projeto Vercel `diagnostico-de-risco`, sem servidor Python ou dependências adicionais.

## Regra solicitada

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
