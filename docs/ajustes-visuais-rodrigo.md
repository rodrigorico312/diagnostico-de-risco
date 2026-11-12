# Ajustes visuais indicados por Rodrigo

## Rodapé de repositório e degradê simplificado — 12/11/2026

Rodrigo rejeitou o rodapé anterior e pediu código de um componente profissional aplicado ao projeto. Foi adaptado o [Footer 02 do Shadcn Space](https://github.com/shadcnspace/shadcnspace/blob/main/src/components/shadcn-space/blocks/footer-02/footer.tsx), blob `2024c7ea18e6818f174d44a617e59be8aed166a1`, em `src/NacionalFooter.tsx` e `src/nacional-footer.css`. Licença MIT e autoria preservadas em `LICENSES/Shadcn-Space.md`. Fechamento azul unificado, marca existente em branco por CSS, CTA integrado apenas nas páginas comerciais, duas colunas de navegação e base legal compacta. Sem newsletter, placeholders ou dependências novas. Formulário e páginas de apoio usam a versão sem CTA repetido. Cookies, contato e acessos foram preservados.

Na correção seguinte, Rodrigo pediu retirar “Crescer é uma conquista / Ter direção faz a diferença” e melhorar o degradê. As frases saíram de desktop e mobile. A transição usa paradas progressivas em tons de azul e interpolação OKLab quando disponível, com alternativa CSS convencional. Foram consultados [PostCSS Easing Gradients](https://github.com/larsenwork/postcss-easing-gradients) e a [documentação de interpolação da MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color-interpolation-method). Nenhum plugin de gradiente foi instalado.

Conferência do rodapé: seis páginas em três larguras, um único rodapé por página e sem CTA duplicado. Axe A/AA sem violações em mobile e desktop. Abertura das preferências de cookies e link do diagnóstico com origem “Rodapé” funcionaram. Degradê conferido em 320/390/430/1440px, sem transbordamento. Evidências em `%LOCALAPPDATA%\CodexWork\Nacional\Site-rodape-20261112`.

## Texto e lógica do atendimento — 12/11/2026

Rodrigo rejeitou a redação da seção “Do primeiro contato ao próximo passo”, sobretudo “Definimos o próximo passo”. A seção passou a apresentar o que o empresário recebe e como decide a contratação: “Clareza antes de contratar”, com “Entendemos sua empresa”, “Você recebe uma orientação inicial” e “Você escolhe com a proposta em mãos”. Os textos explicam atividade/faturamento/necessidade, orientação sobre obrigações e ajustes e apresentação dos serviços, inclusões e valores. A mudança alcança home, MEI e páginas comerciais que compartilham o componente, sem alterar o fluxo de atendimento ou criar prazos e promessas de resultado.

## Legenda retirada do cartão da calculadora — 12/11/2026

Rodrigo pediu retirar “Sem cadastro. Resultado preliminar.”, reforçando a preferência por menos notas pequenas e acessórios. A legenda foi removida do cartão da home e seu espaço deixou de ser renderizado. A ação da calculadora permanece no lugar.

## Brilho e pulsação mais nítidos — 12/11/2026

Rodrigo considerou a pulsação fraca e pediu brilho mais perceptível, com acabamento profissional e pesquisa de código. O CSS existente já usava `nc-action-light` e `nc-card-light`; o destaque dos cartões chegava a apenas 0,5 de opacidade, sobre uma borda também translúcida. Foram consultados [Shimmer Button](https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/shimmer-button.tsx) e [Border Beam](https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/border-beam.tsx), do Magic UI, como referências de luz e definição de borda. Nenhum componente externo foi copiado ou instalado.

Aplicado em CSS próprio: contorno dourado mais definido, halo em camadas nos botões principais e WhatsApp e luz periférica nos cartões. Ciclos parametrizados em `--nc-pulse-speed` (3,8s) e `--nc-card-pulse-speed` (4,8s). Cartões alternam intensidade e ficam destacados no hover/foco. Sem escala, deslocamento ou piscada rápida. Movimento reduzido continua desativando as animações e o foco de teclado permanece visível.

Validação: build aprovado; comparação dos estados de mínimo/máximo no Edge instalado, em mobile e desktop. Botão permaneceu com 239,75 × 54px nos dois estados e `transform: none`; contorno/halo variam. Cartão passou de opacidade 0,18 a 0,95. Movimento reduzido: animação `none` em botão e cartão. Foco com contorno de 3px. Sem transbordamento em 320, 390 e 1440px ou erros JS. Evidências em `%LOCALAPPDATA%\CodexWork\Nacional\Site-brilho-20261112`.

Prévia `http://192.168.18.4:57194/?revisao=6`, sem alteração no domínio oficial.

## Retirada das legendas abaixo do botão — 12/11/2026

Rodrigo pediu remover da abertura as duas legendas com check: “Avaliação inicial gratuita” e “Atendimento em todo o Brasil”. O bloco foi retirado do HTML em desktop e mobile, eliminando também seu espaçamento. O botão de diagnóstico e as demais seções foram preservados.

## Correção seguinte — hero contínua no celular

Rodrigo rejeitou a fotografia em cápsula/círculo dentro do título e pediu a retirada do N isolado do card. Essa orientação substitui os dois itens correspondentes da seleção anterior. A marca do cabeçalho permanece.

Aplicado: retrato removido da abertura e N retirado do gráfico, inclusive no desktop. No mobile, o bloco azul deixou de ser um cartão com margem, moldura e sombra. Uma superfície de largura total faz a transição do fundo claro para o azul, reunindo frase, gráfico, etapas, descrição e diagnóstico. Título e fontes aprovados preservados; o CTA usa dourado sobre a área azul para manter destaque e contraste. No desktop, o gráfico continua ao lado do título, simplificado.

Build de prévia e TypeScript aprovados. Edge instalado: larguras 320, 390, 430, 700, 768, 1024 e 1440px sem transbordamento ou erros JS. Confirmados zero imagens dentro da hero, uma marca no cabeçalho e gráfico transparente/sem sombra no mobile. Axe A/AA da home mobile sem violações. Emulação não representa teste físico de Safari. Evidências em `%LOCALAPPDATA%\CodexWork\Nacional\Site-hero-degrade-20261111`.

Prévia atualizada: `http://192.168.18.4:57194/?revisao=4`. Mesmo Wi-Fi e computador ligado. Sem alteração no domínio oficial, nas integrações ou na calculadora.

## Seleção aprovada e aplicada — segunda revisão de 11/11/2026

As dez fotos posteriores encerram a pendência de seleção descrita no histórico abaixo. Rodrigo aprovou a primeira composição (`4e20b4a`): fonte DM Sans com Lora em dourado, a chamada “Sua empresa cresceu. É hora de dar o próximo passo.”, card azul, aviso de cookies, seis cartões de serviços e três cartões de recursos. Esta revisão está na porta **57194**. A referência histórica permanece inalterada na 57196.

Alterações aplicadas:

- Faixa superior contínua “Contabilidade para empresas em crescimento”, com controle de pausa e movimento reduzido. Área do cliente mantida no menu.
- Fotografia integrada ao título e card logo após o título no celular. Sem a legenda introdutória repetida.
- Card com o N oficial, recortado por CSS do arquivo original; retirada das frases “Um novo momento para sua empresa” e “Decisões com contexto / Um passo de cada vez”. Mantidas as três etapas; última com “Com a Nacional”. Gráfico ilustrativo, sem métricas comerciais.
- Setas decorativas removidas das ações públicas revisadas; halo lento azul/dourado em botões e cartões, sem expansão. Rótulos, foco visível e contraste preservados. WhatsApp oficial flutuante azul, com triagem inicial, oculto enquanto o aviso de cookies ocupa a tela.
- Serviços como cenários selecionáveis. Título “Escolha a contabilidade para o momento da sua empresa”. Títulos internos, fontes e espaçamento harmonizados, preservando as rotas anteriores.
- Seção MEI com um único cartão de acesso à calculadora. Sem “Conhecer/entender o próximo passo”. Na landing, a primeira ação leva à simulação; diagnóstico mantido no convite final.
- Calculadora com R$, milhar e centavos; teclado numérico; os dois últimos dígitos são centavos, conforme orientação visível. Negativos e valores excessivos colados são rejeitados, sem conversão silenciosa em positivos ou truncamento. Regra fiscal preservada.
- Campos da calculadora e das três etapas do formulário em pelo menos 16px, mantendo zoom de acessibilidade. Fontes oficiais em seção estática, sem triângulo/setas, com método e limitações preservados.
- “Atendimento próximo. Em todo o Brasil.” mantido. Segmentos expressamente confirmados por Rodrigo: advocacia, construção civil, reformas, marketing, atacado, consultorias, empresas de contabilidade e imobiliárias. Sem nomes de clientes ou resultados inventados.
- Recursos preservados: calculadora, “MEI × ME / Sair do MEI” e gestão tributária/fator R. Rodapé compacto com marca, contato, quatro atalhos, identificação e privacidade/cookies. Introdução do formulário simplificada.

Referências consultadas: [Magic UI / Shimmer Button](https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/shimmer-button.tsx) e [Tailark / Footer](https://github.com/tailark/blocks/blob/main/registry/bases/base/dusk/blocks/footer/one.tsx). Brilho em CSS próprio, sem instalar catálogos ou Motion. Aviso MIT do header Tailark preservado.

Validação: build e TypeScript aprovados; 61 testes aprovados. Edge instalado, 36 combinações de 18 rotas em 390/1440px, sem transbordamento, com um H1 e tipografia comum, sem setas textuais e com controles de pelo menos 16px. Axe A/AA sem violações nas cinco páginas conferidas. Cálculo verificado com previsão separada, fronteira de 20% e seis meses de abertura. Formulário percorrido com dados fictícios: zero POST e aviso de prévia; fontes 16px nas três etapas. Menu/Escape, pausa e movimento reduzido conferidos. Emulação não representa teste físico no Safari/iPhone.

Evidências: `%LOCALAPPDATA%\CodexWork\Nacional\Site-base-aprovada-20261111`. Prévia: `http://192.168.18.4:57194/`, com mesmo Wi-Fi e computador ligado. Sem push, merge ou publicação.

## Histórico da comparação anterior

Registro de 11/11/2026, após revisão da prévia Tailark no iPhone. As quatro imagens anexadas mostram a abertura, os campos monetários, a seção de fontes da calculadora e a página de contabilidade empresarial.

## Pedido imediato

Reabrir a primeira prévia feita nesta conversa, com blocos azuis e gráfico, para Rodrigo identificar os elementos que deseja preservar. Essa referência corresponde ao commit `4e20b4a`, anterior ao teste Tailark `82ee830`. Manter a versão atual e a histórica separadas; não substituir o código atual pelo histórico. A recuperação não significa aprovar novamente toda a primeira composição.

Prévia histórica recuperada: `http://192.168.18.4:57196/`. A prévia Tailark continua em `http://192.168.18.4:57194/`. Ambas dependem do mesmo Wi-Fi e do computador ligado. A cópia histórica fica em `%LOCALAPPDATA%\CodexWork\Nacional\Site-comparacao-anterior-20261111\source-4e20b4a`, com dependências já existentes reutilizadas por junção, sem nova instalação. A extração incluiu somente código e imagens/fontes permitidas, sem o acervo de clientes. O build com `VITE_PREVIEW_MODE=true` passou; o HTTP da página confirmou o gráfico azul e o da versão atual confirmou o layout Tailark. APIs de atendimento continuam desativadas nas prévias.

## Diretrizes confirmadas para a próxima revisão

1. **Abertura:** integrar a fotografia de Rodrigo à composição do título, em vez de uma foto isolada abaixo do texto no celular. Estudar referências para compor texto e fotografia; a solução visual específica ainda será escolhida.
2. **Títulos e texto:** substituir chamadas genéricas por mensagens com sentido comercial e ligação clara ao problema do empresário. “Sua empresa cresceu. A contabilidade precisa acompanhar.” foi considerado genérico. A intenção era relacionar crescimento e necessidade de acompanhamento, mas a frase não apresenta uma dor concreta ou um benefício específico. A nova redação permanece pendente.
3. **Elementos clicáveis:** retirar as setas de botões, links e opções de serviço. Usar destaque luminoso e pulsação discreta como indicação de interação, conforme a direção pedida, mantendo legibilidade e respeitando movimento reduzido. Evitar excesso de efeitos.
4. **Contato:** substituir as chamadas repetidas “Conversar no WhatsApp” por um ícone flutuante no canto da tela. Preservar o número oficial e a triagem inicial. A marca continua sem verde.
5. **Serviços:** apresentar opções claramente selecionáveis em cartões, com título que convide a escolher a contabilidade adequada ao momento da empresa. A formulação final do título ainda será revisada.
6. **Fluxo MEI:** retirar o atalho redundante “Entender meu próximo passo” da seção próxima à ferramenta. Concentrar essa passagem no cartão da calculadora, com destaque/pulsação, levando a preencher e simular.
7. **Calculadora:** formatar os campos de faturamento acumulado e receita adicional com `R$`, separador de milhar e centavos brasileiros. Abrir teclado numérico apropriado no celular, conservar valor em centavos e permitir correção dos dados. A regra fiscal do cálculo não muda por causa da apresentação.
8. **Celular:** evitar ampliação automática e deslocamento indevido ao tocar nos campos ou interagir com a página. Conferir Safari/iPhone, dimensões dos controles e tamanho de fonte. Manter o zoom de acessibilidade disponível; o problema relatado é a ampliação involuntária durante a interação.
9. **Fontes da calculadora:** retirar as setas dos links e a aparência de seta do expansor “Consultar fontes oficiais e método”. Simplificar a apresentação. Manter as referências oficiais e as limitações necessárias para interpretar a simulação.
10. **Trecho aprovado:** preservar a ideia “Atendimento próximo. Em todo o Brasil.”, que Rodrigo avaliou positivamente.

Na página de contabilidade empresarial, Rodrigo criticou a aparência do botão grande de diagnóstico com seta. O formato e o destaque do convite serão revistos junto à retirada das setas; o relato não cancela o objetivo de oferecer diagnóstico inicial gratuito.

## Ordem de trabalho

Primeiro, apresentar a versão histórica para Rodrigo escolher o que quer preservar. Depois, combinar essa seleção com as diretrizes acima na nova versão. Esses ajustes foram registrados, mas ainda não foram implementados neste pedido de recuperação da prévia. Não considerar os blocos azuis, o gráfico ou toda a versão antiga aprovados antes da indicação específica de Rodrigo. Nenhuma alteração em produção está autorizada por este retorno.
