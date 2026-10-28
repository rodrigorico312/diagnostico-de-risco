# Rui Barbosa, Floriano Peixoto e José Martí

Seleção editorial conferida em 28/10/2026. `republicanos.json` acrescenta três perfis e sete marcos; os acontecimentos já existentes sobre Encilhamento, República, Constituição de 1891, sucessão de Deodoro, Armada e governo civil são reutilizados por referência, sem duplicação.

As fichas separam fonte primária, descrição institucional e estudo histórico. Os resumos são explicações do Atlas em português; não transcrições das fontes. Não se afirma uma relação pessoal entre os três autores nem uma correspondência automática com partidos atuais.

## Fontes e alcance

Os 13 links e as notas individuais estão em `sources` no JSON e aparecem na interface. Rui: Arquivo Nacional, Fundação Casa de Rui Barbosa e STF. Floriano: Presidência, Arquivo Nacional e fontes militares já cadastradas. Martí: texto do próprio autor hospedado pela Universidad Interamericana de Puerto Rico, estudo documental do Archivo Nacional de Cuba preservado pela University of Florida, catálogo do Archivo General de la Nación dominicano e cronologia da Library of Congress.

- HC 300: a ficha histórica do STF informa 27/04/1892; o discurso retrospectivo de Celso de Mello informa 23/04/1892. Sem consulta ao acórdão integral, o evento usa apenas 1892. O discurso é primário quanto à fala de 2001, não quanto ao julgamento de 1892.
- Haia: conferência de 15/06 a 18/10/1907. O evento usa o ano, sem transformar o intervalo em data de uma fala.
- Civilismo: 01/03/1910 é o dia da votação, não o início da campanha; vitória oficial e contestação são atos diferentes.
- Nuestra América: conferidos o texto nas páginas impressas 15–23, o trecho na p. 17 (página 12 do PDF) e o fecho mexicano de 30/01/1891 (página 15 do PDF). A ficha marca essa publicação, sem alegar primeira circulação. Uma edição da UNAM de 1991 foi encontrada na pesquisa e não foi confundida com o ano da obra.
- Patria: o arquivo da UF é um volume do Boletín del Archivo Nacional de 1928, não o primeiro número do jornal. Conferidas a p. impressa 69 (página 71 do PDF), inclusive visualmente, e a p. 113 (página 115 do PDF). A data 14/03/1892 refere-se ao jornal, não à proclamação do partido. O estudo relata os colaboradores e a manutenção da publicação. Não foram inferidas métricas de influência.
- Montecristi: consultado o catálogo, referência José Gabriel García / 11 // 41-1-3, signatura C 708881, 25/03/1895. A íntegra manuscrita não foi lida.
- Morte de Martí: a cronologia institucional indexada registra 19/05/1895 em Dos Ríos; acesso direto apresentou HTTP 403. Não se atribuem ao autor atos de 1959.

## Reprodução

Execute `python scripts/build_history.py`, `npm test`, depois `ATLAS_BASE_PATH=/atlas/ npm run build` (no PowerShell: `$env:ATLAS_BASE_PATH='/atlas/'; npm run build`). O manifesto gerado registra hashes dos JSON editoriais. Testes verificam vínculos, ausência de duplicação dos novos eventos, divergência do HC e distinção entre edição, publicação, jornal e partido.

PDFs consultados mantidos fora do site, no diretório de análise do chat; não são redistribuídos no pacote:

| Arquivo | SHA-256 |
| --- | --- |
| Obras completas, volume 6 | `a4e2853ec02c813cda9de30637319b9cadb117d03d1991e0d8c2d51ed4b72bb8` |
| Boletín del Archivo Nacional, 1928 | `072d16c9dba970492fefb40036880270c2f5c9fa9549eb9ee6f0d9854da99574` |
