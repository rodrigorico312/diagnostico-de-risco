# Militares, regimes políticos e 8 de janeiro

Seleção editorial consultada em 27/10/2026. `military.json` contém 24 novos registros, 24 fontes e dois percursos. A rotina não inventa eventos para preencher anos vazios.

## Reprodução

```powershell
python scripts/build_history.py
npm test
$env:ATLAS_BASE_PATH='/atlas/'
npm run build
npm run preview -- --port 4199 --strictPort
```

No preview, abrir `/atlas/world.html?visao=historia&h_tela=trails&h_trilha=oito-janeiro`. No domínio publicado, usar `/atlas/?visao=historia&h_tela=trails&h_trilha=oito-janeiro`. O outro percurso é `imperio-democracia`.

O empacotador inclui `public/history-data/index.json`, com hashes dos arquivos editoriais. `HistoryTrail.steps` referencia os mesmos identificadores da linha do tempo; não cria cópias dos acontecimentos. A seleção do percurso fica na URL. Favoritos e anotações continuam locais ao navegador.

## Natureza das evidências

- `testimony`: registro de uma versão atribuída ao depoente; a etiqueta “Documentado” não autentica todas as alegações.
- `law`: texto de uma norma ou ato administrativo; não demonstra seus efeitos materiais.
- `defense`: argumentos dos advogados, sem presumir acolhimento.
- `vote`: voto individual, sem confundi-lo com resultado colegiado.
- `judgment`: decisão judicial identificada, segundo documento ou resumo institucional indicado.
- `historical` e `election`: registro histórico ou resultado eleitoral, com origem na ficha.

O campo `recordNature` também acompanha a exportação CSV. Datas de oitiva e datas do episódio narrado são distinguidas no contexto. O dia 29/12/2022 é o fato narrado por Dutra em 14/09/2023. A ficha de 09/01/2023 data a operação de retirada, sem atribuir à ordem judicial uma hora de assinatura não conferida.

## Fontes centrais e alcance da conferência

- [CLDF: relato de Naime em 16/03/2023](https://www.cl.df.gov.br/-/ex-comandante-naime-diz-a-cpi-que-exercito-protegeu-terroristas): acusa impedimento à entrada no acampamento. É um relato, não uma sentença sobre a intenção dos militares.
- [CLDF: versão de Dutra em 18/05/2023](https://www.cl.df.gov.br/pt/-/general-dutra-nega-que-o-exercito-teria-impedido-desmonte-do-acampamento-em-frente-ao-qg): nega obstrução e invoca risco de vítimas; conversa com Lula é narrada pelo depoente, sem gravação independente examinada nesta coleta.
- [Ata integral da CPMI, 14/09/2023](https://www25.senado.leg.br/web/atividade/notas-taquigraficas/-/notas/r/11830): buscar “Guarani” e “21h”; perguntas e respostas têm autores distintos. Oitiva da CPMI federal e CPI distrital são registros diferentes.
- [Decreto 11.377/2023](https://www.presidencia.gov.br/ccivil_03/_ato2023-2026/2023/decreto/d11377.htm): intervenção federal na segurança do DF, não governo militar.
- [ADI 6457](https://noticias.stf.jus.br/postsnoticias/por-unanimidade-ministros-do-stf-rejeitam-tese-de-poder-moderador-das-forcas-armadas/): resumo institucional do julgamento constitucional concluído em 08/04/2024, não sentença sobre cada participante do acampamento.
- [AP 2668, PDF oficial](https://noticias-stf-wp-prd.s3.sa-east-1.amazonaws.com/wp-content/uploads/wpallimport/uploads/2025/10/22075642/downloadPeca.pdf): conferidas ementa e parte dispositiva nas primeiras 18 das 1.991 páginas. Julgamento em 11/09/2025, publicação em 22/10/2025. Não houve auditoria integral de todas as provas. A trilha inclui também fontes das defesas e do voto divergente.
- [AP 2417, comunicação de 12/03/2026](https://noticias.stf.jus.br/postsnoticias/stf-determina-inicio-do-cumprimento-da-pena-de-ex-integrantes-do-comando-da-pmdf-condenados-pelos-atos-de-8-de-janeiro/): ordem de execução das penas de cinco ex-dirigentes da PMDF, incluindo Naime. Condenação do depoente não torna automaticamente falsa cada frase sua.
- [FGV: Revolta da Armada](https://atlas.fgv.br/verbetes/revolta-da-armada): fonte historiográfica sobre disputas entre dirigentes; não sustenta uma rivalidade invariável entre todos os membros das corporações.

As demais fontes, notas de leitura e datas estão no JSON. Os testes verificam referências, ordenação, distinção entre relato e decisão e a separação entre as eleições de 2022 e 2026. Não verificam automaticamente a verdade histórica de cada texto.

## Lacunas

Não foram estabelecidos nesta coleta: iminência de combate armado entre Exército e PM; motivo individual de cada militar ou acampado; alinhamento político de toda uma corporação; uma cadeia causal de 1893 a 2023; situação penal ou de patente atualizada diariamente. Documentos e decisões posteriores àqueles descritos exigem nova revisão.

O mapa conserva a precisão municipal. A referência a Brasília não localiza a posição exata de um veículo, pessoa ou confronto. A linha cronológica usa períodos políticos distintos e inclui partidos anteriores à ditadura, reforma partidária de 1979 e transição civil de 1985.
