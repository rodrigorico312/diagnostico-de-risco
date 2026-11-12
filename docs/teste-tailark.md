# Teste visual Tailark — Nacional

11/11/2026. Rodrigo pediu uma prévia com Tailark e corrigiu a direção visual: menos informações pequenas, rodapé curto, abertura direta e pouca ornamentação. Isso autoriza o teste visual, sem aprovação final do resultado e sem publicação no site oficial.

Foi adaptada a estrutura aberta do hero e do header Mist, com código React, âncoras nativas e CSS local. Fontes e licença estão em [LICENSES/Tailark.md](../LICENSES/Tailark.md). Nenhuma biblioteca ou framework novo foi instalado.

Mudanças na prévia:

- Cabeçalho em uma linha com serviços, MEI, conteúdos, área do cliente e contato; menu recolhido no celular.
- Abertura com uma mensagem principal, um parágrafo, diagnóstico gratuito, WhatsApp e retrato institucional existente.
- Retirada do gráfico ilustrativo, da faixa superior, de pequenas frases repetidas e dos números decorativos.
- Serviços em lista, com os seis destinos preservados; seção curta de MEI e acesso à calculadora.
- Rodapé com identificação do escritório e quatro links úteis.
- Aviso de privacidade encurtado, preservando aceitação, recusa e alteração da preferência.
- Títulos diretos nas páginas internas e aumento da leitura de textos e controles. O aviso de resultado preliminar, as fontes legais e as limitações da calculadora continuam disponíveis.

O formulário, a calculadora, o endpoint de leads, suas integrações e a área privada mantêm os contratos anteriores. A prévia continua com envio real desativado, `noindex` e bloqueio de arquivos de clientes. O domínio oficial não foi alterado.

Revisão: TypeScript e build passaram; sete páginas foram pré-renderizadas. Os 60 testes existentes passaram. O menu móvel abriu e fechou, com retorno de foco ao acionar Escape. Capturas e resultados da revisão de navegador estão em `%LOCALAPPDATA%\CodexWork\Nacional\Site-tailark-20261111`.

Prévia: `http://192.168.18.4:57194/`, acessível no mesmo Wi-Fi com o computador ligado. O Tailark é uma base de composição adaptada, não uma demonstração de resultados do escritório. A validação visual de Rodrigo permanece pendente.

Validação final: 19 combinações de rota/largura (1440, 390 e 320 px), sem erro de JavaScript, requisições externas ou rolagem horizontal. A revisão axe nas páginas em desktop e mobile não apontou violações WCAG A/AA no recorte automatizado. A calculadora foi exercitada no navegador com exemplo fictício: abertura em julho/2026, receita de R$ 48.600,01 e limite proporcional de R$ 40.500,00, com indicação de excesso superior a 20% e nenhum POST emitido. Títulos repetidos foram retirados das páginas de serviço. A avaliação automatizada não substitui a revisão visual do usuário.
