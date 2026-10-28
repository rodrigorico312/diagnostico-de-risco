# Origem do STF, governos e controles

Revisão editorial: 28/10/2026. A seção está integrada à aba **STF e indicações**; o caso `stf-origem` e a trilha de mesmo identificador permitem aprofundar a leitura. São oito novos acontecimentos, treze referências novas, doze participantes e doze relações documentadas. A trilha reutiliza acontecimentos de outras coletas.

## Marcos e documentos

- **1808:** [retrospectiva institucional do STF](https://portal.stf.jus.br/noticias/verNoticiaDetalhe.asp?idConteudo=391404), sobre a Casa da Suplicação do Brasil e o alvará de 10 de maio. É um antecedente monárquico.
- **1828–1829:** organização por lei de 18/09/1828 e instalação do Supremo Tribunal de Justiça do Império em 09/01/1829, conforme fontes já cadastradas em `justice.json`. Não é o STJ da Constituição de 1988.
- **22/06/1890:** [Decreto 510](https://www2.camara.leg.br/legin/fed/decret/1824-1899/decreto-510-22-junho-1890-507621-publicacaooriginal-1-pe.html). A Constituição Provisória já usa a denominação STF. Conferir o art. 3º para a vigência imediata limitada desse texto; não confundir com a Constituição promulgada em 1891.
- **11/10/1890:** [Decreto 848](https://www2.camara.leg.br/legin/fed/decret/1824-1899/decreto-848-11-outubro-1890-499488-publicacaooriginal-1-pe.html), arts. 1º, 4º e 5º, e fecho com Deodoro e Campos Salles. O art. 1º estabelece: “A Justiça Federal será exercida: a) Por um Supremo Tribunal Federal”. O ato prevê quinze juízes.
- **24/02/1891:** [Constituição republicana original](https://www2.camara.leg.br/legin/fed/consti/1824-1899/constituicao-35081-24-fevereiro-1891-532699-publicacaooriginal-15017-pl.html), arts. 55–59. Não usar o texto provisório de 1890 como se fosse o final.
- **28/02/1891:** [registro da instalação](https://portal.stf.jus.br/noticias/verNoticiaDetalhe.asp?idConteudo=461420&tip=UN). Sayão Lobato conduziu a sessão interinamente; Freitas Henriques foi o primeiro presidente eleito. A regra geral de aprovação pelo Senado não substitui o estudo das circunstâncias transitórias das primeiras nomeações.
- **18/02/1931:** [Decreto 19.711](https://www2.camara.leg.br/legin/fed/decret/1930-1939/decreto-19711-18-fevereiro-1931-517595-publicacaooriginal-1-pe.html). Vargas aposentou seis ministros, dispensando exame de sanidade. A justificativa do preâmbulo pertence ao governo que editou o ato.
- **27/10/1965:** AI-2, art. 6º, fonte primária já cadastrada em `military.json`: ampliação de onze para dezesseis ministros.
- **16/01/1969:** [retrospectiva do STF](https://noticias.stf.jus.br/postsnoticias/um-ato-de-repudio-contra-as-aposentadorias-compulsorias/) sobre aposentadorias forçadas de Victor Nunes Leal, Hermes Lima e Evandro Lins e Silva. A saída de Gonçalves de Oliveira em protesto é um ato posterior e distinto. Não foi examinada nesta coleta a íntegra do decreto de afastamento.
- **2017:** [sabatina no Senado](https://www12.senado.leg.br/noticias/materias/2017/02/21/moraes-garante-atuacao-isenta-e-pede-judiciario-menos-ativista) e [dados e datas de Alexandre de Moraes](https://cms.stf.jus.br/post-biblioteca/alexandre-de-moraes-dados-e-datas/). Indicação por Temer em 6 de fevereiro, nomeação em 22 de fevereiro, posse em 22 de março. Passagem política anterior e promessa de imparcialidade não demonstram alinhamento ou conduta posteriores.

## Governo e relações

A [Biblioteca da Presidência](https://www.biblioteca.presidencia.gov.br/presidencia/ex-presidentes/deodoro-fonseca/equipe-de-governo/ministerios) informa pastas e períodos. Benjamin Constant deixou o Ministério da Guerra em março de 1890, antes do Decreto 848. Rui Barbosa esteve na Fazenda e Wandenkolk na Marinha. A biografia de Deodoro no Arquivo Nacional complementa o contexto republicano civil e militar, incluindo Quintino Bocaiúva. Essa página pode apresentar bloqueio de acesso. O registro de Campos Sales no ato organizador tem suporte direto no Decreto 848.

“Participou do governo”, “assinou o ato”, “presidiu a sessão” e “foi eleito presidente” são vínculos diferentes. Nenhuma seta demonstra uma aliança permanente, autoria de todos os atos ou equivalência com os partidos atuais. A alegação de criação pelo PT é confrontada com os atos de 1890–1891 e a fundação do partido em 1980, documentada na fonte institucional já cadastrada em `root.json`.

## Regras atuais e alcance das conclusões

O [texto constitucional atualizado](https://www2.camara.leg.br/legin/fed/consti/1988/constituicao-1988-5-outubro-1988-322142-normaatualizada-pl.html) permite conferir competências, fundamentação e controles: arts. 52, 93, 95, 101 e 102. Não atribuir todas as emendas atuais ao texto promulgado em 1988. O [CPC, art. 1.021](https://www2.camara.leg.br/legin/fed/lei/2015/lei-13105-16-marco-2015-780273-normaatualizada-pl.html) trata de agravo interno no processo civil; não foi afirmado cabimento universal em qualquer classe processual.

As nomeações do painel continuam uma **seleção histórica**, com ministros que já deixaram o tribunal. Não são a composição atual, uma contagem partidária nem uma medição de independência. Exemplos da AP 470 e do voto de Fux na AP 2668 não formam amostra estatística representativa. A crítica de imparcialidade do precedente italiano permanece disponível com seu alcance e suas limitações na coleta `networks`.

O novo estado `refuted` (“Contradito pelos documentos”) exige fonte primária ou institucional nos validadores Python e TypeScript. É usado para afirmações históricas delimitadas; alegações amplas sobre ditadura ou coordenação secular ficam acompanhadas do que seria necessário verificar. A existência de controles legais não comprova a eficácia deles em todos os processos.

## Reprodução

1. Editar `research/stf.json` e, quando necessário, os registros originais em outras coletas, preservando identificadores.
2. Executar `python scripts/build_history.py`. A base registra hashes dos insumos, referências e testes de integridade. A data editorial é a maior data de revisão das fontes; não significa atualização automática.
3. Executar `npm test` e, no PowerShell, `$env:ATLAS_BASE_PATH='/atlas/'; npm run build`.
4. Conferir a aba STF, o caso `stf-origem`, suas verificações e a trilha no navegador, inclusive em tela estreita.

As fontes são consultáveis pelos links; podem mudar ou ficar indisponíveis. Esta seleção não é um inventário de todas as alianças, dos autos de todos os processos ou do funcionamento efetivo de todos os mecanismos de controle.
