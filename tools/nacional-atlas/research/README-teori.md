# Teori Zavascki no Atlas

Revisão: 28/10/2026. `teori.json` acrescenta oito acontecimentos, dez referências, uma nomeação histórica e a trilha de nove etapas `teori-zavascki`. A trilha reutiliza a nomeação de Moraes já cadastrada. Os links são acessíveis pelas fichas, por STF e indicações e por Trilhas históricas.

## O que foi conferido

- **Indicação, nomeação e posse:** o [catálogo bibliográfico do STF](https://portal.stf.jus.br/textos/verTexto.asp?pagina=TeoriZavasckiDadosDatas&servico=bibliotecaConsultaProdutoBibliotecaPastaMinistro) registra indicação de Dilma em 10/09/2012, decreto de 31/10 e posse em 29/11. A ficha da linha do tempo usa a data de posse; a lista de nomeações usa o ano do decreto. Uma notícia institucional de lançamento de livro encontrada na busca informa outra data de posse; foi priorizado o registro específico de dados e datas, que aponta termo e ata.
- **Atuação:** notícia institucional da questão de foro das APs 871–878/PET 5170, de 10/06/2014, e notícia do referendo da decisão cautelar da AC 4070, de 05/05/2016. Não foram lidos integralmente todos esses autos. Não se apresenta o julgamento de junho de 2014 como data exata do início de toda a relatoria.
- **Morte:** registro do STF sobre a queda do PR-SOM em 19/01/2017, em Paraty, e nota da JFRJ sobre o sigilo inicial. O caminho da nota no portal TRF2 contém 2024 por migração/atualização, mas a publicação é de janeiro de 2017.
- **Continuidade:** [STF, 02/02/2017](https://noticias.stf.jus.br/postsnoticias/ministro-edson-fachin-e-sorteado-novo-relator-da-lava-jato/), registra a homologação dos 77 acordos por Cármen Lúcia em 30/01 e o sorteio de Fachin em 02/02. Relatoria e vaga no tribunal são distintas. Não se infere responsabilidade pela morte de quem assumiu função posterior.
- **Segurança de voo:** a [síntese oficial da FAB de 22/01/2018](https://www.fab.mil.br/noticias/mostra/31575/SEGURAN%C3%87A%20DE%20VOO%20%E2%80%93%20FAB%20divulga%20resultado%20de%20investiga%C3%A7%C3%A3o%20sobre%20acidente%20com%20aeronave%20PR-SOM) descreve fatores contribuintes e a finalidade preventiva. O Relatório Final A-013/CENIPA/2017 foi localizado, mas o acesso à íntegra no endereço oficial retornou HTTP 403. Não se afirma leitura integral nem julgamento de responsabilidade penal pelo CENIPA.
- **Apuração criminal:** examinadas pp. 1–8 e 57–61 da [cópia da promoção do MPF](https://static.aosfatos.org/media/cke_uploads/2021/02/05/arquivamento-mpf.pdf), hospedada por Aos Fatos. A p. 61 foi também conferida visualmente: conclusão pelo arquivamento com ressalvas e assinatura em 22/01/2019 às 18:08. A peça identifica EPROC 5000053-27.2019.4.02.5111, APOLO 0500010-89.2017.4.02.5111 e IPL 0006/2017 DPF/ARS/RJ. Não foi realizada validação criptográfica pelo portal do MPF. SHA-256: `5331efa04d8a3bd7b9ab024e8bded6cf87146ba39dfbbb06f0a5707028493b0a`.

O [STF, em retrospectiva de 2021](https://portal.stf.jus.br/noticias/verNoticiaDetalhe.asp?idConteudo=458867), informa que o inquérito foi arquivado. A manifestação do MPF não foi apresentada como sentença: a íntegra do ato judicial e sua data permanecem pendentes nesta coleta. Não se converte conclusão investigativa em certeza absoluta sobre toda hipótese imaginável, nem se usa mera proximidade cronológica como evidência de sabotagem.

## Integração e reprodução

`recordNature=investigation` identifica apuração/manifestação, com rótulo próprio no detalhe, na trilha e no CSV. A morte tem referência municipal de Paraty (IBGE 3303807), conferida na malha já disponível, sem coordenada exata de queda inventada. A lista de nomeações é uma seleção histórica; não mostra o quadro atual do STF.

Execute `python scripts/build_history.py`, `npm test` e, no PowerShell, `$env:ATLAS_BASE_PATH='/atlas/'; npm run build`. A base registra hashes dos insumos. Confirme a trilha e os links no navegador antes de empacotar. Não há atualização automática dos processos.
