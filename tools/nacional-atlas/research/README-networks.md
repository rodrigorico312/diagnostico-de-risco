# Quem participa: funções, relações e verificação de alegações

Primeiro caso: Tagliaferro, circulação de relatórios, cobertura jornalística e extradição. Revisão em 27/10/2026.

`networks.json` acrescenta 10 acontecimentos, 19 referências, um percurso e um caso com 13 participantes, 10 relações explícitas e 7 perguntas verificadas ou pendentes. São dados editoriais sujeitos à revisão; não há coleta automática de notícias ou inferência automática de influência.

## Uso e reprodução

```powershell
python scripts/build_history.py
npm test
$env:ATLAS_BASE_PATH='/atlas/'
npm run build
npm run preview -- --port 4199 --strictPort
```

No preview: `/atlas/world.html?visao=historia&h_tela=cases&h_caso=tagliaferro`. Na publicação: `/atlas/?visao=historia&h_tela=cases&h_caso=tagliaferro`. O percurso usa `h_tela=trails&h_trilha=tagliaferro-extradicao`.

A interface permite pesquisar nome, função ou atividade; selecionar um participante; filtrar a base documental das relações; examinar perguntas e lacunas; abrir os registros na linha do tempo; percorrer a cronologia; e exportar somente as relações do recorte em CSV. As fichas e a visualização de conexões oferecem acesso ao caso correspondente.

## Modelo e critérios

- `actors` identifica função na época, atuação descrita e fontes. Uma pessoa não recebe rótulo político por compartilhar gabinete, profissão ou audiência.
- `relations` contém origem, destino, rótulo, período, alcance e fontes. A seta expressa a relação escrita no rótulo. Não é um modelo de causalidade, comando ou financiamento.
- `documented` exige ao menos uma fonte primária ou institucional vinculada; o alcance depende do documento. Uma nota comprova a posição declarada do gabinete, não uma validação externa de sua versão.
- `reported` preserva a atribuição à reportagem e não é promovido automaticamente a conclusão judicial.
- `claims` distingue documento, notícia, leitura delimitada e pergunta pendente. Toda pendência exige origem da pergunta e informação necessária para respondê-la.
- Identificadores de participantes são locais ao caso; eventos e fontes usam o prefixo `networks:`. Os mesmos eventos são referenciados nas fichas e no percurso, sem duplicação.

O compilador Python e o validador do navegador conferem referências e impedem que uma relação sustentada apenas por imprensa seja marcada como documental. Isso não substitui revisão humana da interpretação das fontes.

## Documentos e separação de datas

- TSE: [Portaria 771/2022](https://www.tse.jus.br/legislacao/compilada/prt/2022/portaria-no-771-de-16-de-agosto-de-2022), com antecessor e sucessor no cargo, e [Portaria 358/2023](https://sintse.tse.jus.br/documentos/2023/Mai/10/diario-oficial-da-uniao-secao-2-edicao-extra/portaria-no-358-de-9-de-maio-de-2023-exoneracao-eduardo-de-oliveira-tagliaferro-cj3-aeed), ato de 9/5 publicado em 10/5.
- [Nota do gabinete de Moraes de 13/08/2024](https://noticias.stf.jus.br/postsnoticias/nota-do-gabinete-do-ministro-alexandre-de-moraes-6/): resposta institucional às reportagens, apresentada como tal.
- [Ata do Senado de 30/04/2025](https://www.congressonacional.leg.br/web/atividade/notas-taquigraficas/-/notas/r/13490): participação de Glenn e presidência de Flávio. A fala sobre sigilo não confirma a identidade da fonte.
- [PET 12.936 no STF](https://portal.stf.jus.br/processos/abaDecisoes.asp?incidente=7013522): sessão de recebimento da denúncia encerrada em 14/11/2025, resultado lançado em 17/11. Não foi tratado como condenação nem exame integral da instrução.
- [Sentença 21634/2026, página oficial italiana](https://www.cortedicassazione.it/en/penale_dettaglio.page?contentId=SZP50894): audiência de 22/5, depósito de 11/6. O [PDF oficial anonimizado](https://www.cortedicassazione.it/resources/cms/documents/21634_06_2026_osc_noindex.pdf) tem 16 páginas; foram conferidos visualmente dispositivo na p. 15 e depósito na p. 16, além do resumo oficial. É precedente distinto da sentença específica de Tagliaferro. Não houve revisão integral de todos os fundamentos nem reidentificação de nomes ocultados. Hash do PDF: `127613fba16898e0127dce609ca6d8b12f756c8350fd95635ea12d3bfb8f7e72`.

## Imprensa e lacunas

As notícias de Folha, Veja e Cosenza Channel estão identificadas na base. Não foi obtida a íntegra da sentença específica de Catanzaro, relatada como 17/26. Deliberação em 29/04 e registro em 22/10 são datas reportadas; a ficha data a notícia de 26/10, sem transformar esse dia na data da decisão. A Folha de 27/10 informa possibilidade de recurso. Não foi certificado trânsito em julgado nem resultado posterior.

O primeiro levantamento partiu de três capturas fornecidas pelo usuário. Elas exibem tradução automática e não fornecem a URL integral da publicação. Não foram publicadas no domínio nem incluídas como fonte judicial. Alegações abrangentes sobre Espanha, EUA e INTERPOL permanecem abertas, exigindo documentos individualizados. Respostas de outros usuários e acusações de financiamento nos comentários não foram incorporadas como fatos.

O fundamento italiano de falta de imparcialidade objetiva está apresentado com a sua fonte, sem atenuá-lo ou extrapolá-lo para todos os casos. O tratado, a recusa de entrega, a acusação penal, a absolvição e o asilo são procedimentos e resultados distintos. A lista pública da INTERPOL não é completa; sua consulta isolada não demonstra o motivo de uma alegada recusa.
