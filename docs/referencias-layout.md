# Repositórios para reorganizar o layout da Nacional

**Decisão posterior:** Rodrigo escolheu testar Tailark com uma composição mais simples. A preferência anterior por combinar Mainline e Tailark não é a direção adotada neste teste. Veja o [registro da adaptação](teste-tailark.md).

Pesquisa de 11/11/2026, após Rodrigo rejeitar o layout da primeira prévia. Essa composição não está aprovada. A funcionalidade construída e os resultados dos testes anteriores não representam aprovação visual.

Foram consultados repositórios, arquivos de licença, manifests e componentes pelo GitHub, e visitadas as demonstrações públicas no Edge instalado. Não foram instalados ou executados os projetos externos. Capturas desktop e mobile estão em `%LOCALAPPDATA%\CodexWork\Nacional\Site-referencias-20261111`. O site oficial não foi modificado.

## Seleção

| Projeto | Código / demonstração | Aplicação proposta | Encaixe e condições |
| --- | --- | --- | --- |
| Tailark Blocks | [Repositório](https://github.com/tailark/blocks) · [Catálogo Dusk](https://tailark.com/pages/dusk) · [Página demonstrativa](https://tailark.com/pages/dusk/dusk/landing/one?fullscreen=true) | Abertura, menus, apresentação dos serviços, CTA, FAQ e rodapé, escolhidos dentro de uma direção única. | MIT no repositório livre. Mist, Dusk e Veil são OSS; Quartz é catálogo pago. Os componentes consultados usam React, Tailwind e imports de Next.js. Adaptar Link/Image ao Vite e incluir apenas dependências dos componentes escolhidos. |
| Mainline | [Repositório](https://github.com/shadcnblocks/mainline-nextjs-template) · [Demonstração](https://mainline-nextjs-template.vercel.app/) | Referência principal de composição: cabeçalho contido, títulos legíveis, introdução organizada e alternância das seções. | React 19, Next.js e Tailwind 4. Licença MIT + Commons Clause: uso comercial em site permitido pelo texto consultado, com restrição à revenda do template original ou quase intacto. Preservar os avisos exigidos ao reutilizar código. |
| Solid Free | [Repositório](https://github.com/NextJSTemplates/solid-nextjs) · [Demonstração gratuita](https://solid-free.nextjstemplates.com/) | Alternativa mais convencional para institucional, sobre, FAQ, contato e blog. | MIT; React/Next.js/Tailwind. A versão gratuita oferece a interface, sem comprovar integração funcional dos formulários. A demonstração tem textos antigos de versão; a compatibilidade foi avaliada pelo package.json do código atual. |

Preferência do estudo, ainda não aprovação de Rodrigo: Mainline como referência de composição e Tailark como fonte seletiva de componentes. Não concatenar três templates completos. Definir tipografia, espaçamento, formas e comportamento consistentes e adaptar ao azul, dourado e branco da Nacional.

### Pontos de código conferidos

- Tailark: [hero Mist](https://github.com/tailark/blocks/blob/main/registry/bases/base/mist/blocks/hero-section/one/hero-section.tsx), [hero Dusk](https://github.com/tailark/blocks/blob/main/registry/bases/base/dusk/blocks/hero-section/one/hero-section.tsx), `registry/bases/base/dusk/pages/landing/one/landing-page.tsx` e organização de seções dessa página. Árvore consultada: `8139698115c1341bfd2e3e286c04bb4d8146f472`.
- Mainline: [hero](https://github.com/shadcnblocks/mainline-nextjs-template/blob/master/src/components/blocks/hero.tsx), `src/components/blocks/navbar.tsx`, `about.tsx`, `contact-form.tsx` e `faq.tsx` identificados na árvore. Árvore consultada: `2329ed3524a6038d834b925187084a0e41fab2d9`.
- Solid: [hero](https://github.com/NextJSTemplates/solid-nextjs/blob/main/components/Hero/index.tsx), diretórios `Header`, `About`, `Contact`, `FAQ`, `Blog` e `Footer`. Árvore consultada: `8e48747b93fbaf5c4beb04aaaf4efe70da94e98b`.

## Avaliados como reserva, não escolhidos para a aparência

- [leoMirandaa/shadcn-landing-page](https://github.com/leoMirandaa/shadcn-landing-page): MIT, React + Vite, com [demonstração](https://shadcn-landing-page.vercel.app/). É o mais próximo do runtime atual, mas usa React 18/Tailwind 3 e uma apresentação com cartões, preços, gradientes e temas de software que não resolve a direção institucional desejada. Não reduzir as versões do site para adotá-lo.
- [Cruip Open](https://github.com/cruip/open-react-template): bom material de estudo visual, mas o README informa GPL e condições adicionais de redistribuição. Não foi selecionado como fonte para transplante rápido de código.
- Sailboat UI: biblioteca de elementos; não foi selecionada como referência principal de página completa.

## Aplicação ao site existente

A avaliação visual do assistente é que a prévia precisa diferenciar melhor as seções, aumentar a legibilidade dos textos de apoio e construir uma abertura com presença institucional. O gráfico de crescimento não é uma prova de resultados e não precisa dominar a abertura. Evitar repetir grades de cartões em sequência.

A futura revisão deve manter diagnóstico gratuito, página MEI, calculadora, formulário, notificações, área privada e páginas indexadas. A imagem de software dos modelos deve ser substituída por material pertinente à Nacional, sem apresentar interfaces, clientes, logos parceiros, depoimentos ou números do template como fatos do escritório. As cores do modelo também não devem ser transplantadas: permanece azul/dourado/branco, sem verde.

A pesquisa não alterou componentes, dependências, deploy ou integrações. A migração de framework não é necessária para aproveitar as seções React escolhidas. O resultado da adaptação deverá ser revisto em desktop/mobile e apresentado em prévia antes de qualquer publicação autorizada.

Licenças verificadas: [Tailark](https://github.com/tailark/blocks/blob/main/LICENCE.md), [Mainline](https://github.com/shadcnblocks/mainline-nextjs-template/blob/master/LICENSE), [Solid](https://github.com/NextJSTemplates/solid-nextjs/blob/main/LICENSE).
