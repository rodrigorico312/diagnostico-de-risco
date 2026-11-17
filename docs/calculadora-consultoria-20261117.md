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
- A conclusão da publicação e a conferência pública serão registradas abaixo após o retorno da Vercel.
