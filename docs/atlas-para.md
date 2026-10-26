# Nacional Atlas · Pará

Atlas estadual em React, TypeScript e Leaflet, com interface escura, mapa OpenStreetMap, dados públicos TSE e geografia IBGE. Publicação prevista em `https://www.nacionalcon.com/atlas/para/`. O atlas original de Santarém continua em `/eleicoes/santarem/`.

## Cobertura da edição

- 144 municípios, 7 regiões geográficas intermediárias IBGE, 362 polígonos de bairros do Censo 2022.
- 20.827 seções principais e 1.255 agregadas relacionadas em cada turno. As agregadas não geram votos extras.
- 5.783 locais no primeiro turno e 5.786 no segundo; a mudança é preservada, sem exigir composição idêntica entre turnos.
- 290 conciliações: duas estaduais e 288 municipais. Candidatos, válidos, brancos, nulos, nulos técnicos, comparecimento, aptos e quantidade de seções são conferidos.
- Primeiro turno: CSV presidencial por seção, complementado pelo detalhe da apuração e pelo cadastro de locais.
- Segundo turno: 20.827 BUs oficiais BER, com identidade, data, cargo, contadores e somas verificados; não há verificação criptográfica de assinatura.

| Turno | Lula | Flávio | Outros válidos | Brancos | Nulos da totalização | Total |
|---|---:|---:|---:|---:|---:|---:|
| 1º | 2.427.237 | 2.163.957 | 271.978 | 54.203 | 149.129 | 5.066.504 |
| 2º | 2.690.449 | 2.199.940 | 0 | 36.501 | 62.683 | 4.989.573 |

O primeiro turno tem 183 votos nominais do CSV fora da lista válida da totalização final. São classificados separadamente como nulos técnicos por conciliação exata, município a município. `nominaisOriginais`, `nulosUrna` e `nulosTecnicos` preservam a distinção. Não se infere o motivo jurídico.

### Arquivos auxiliares dos BUs

20.776 auxiliares estão como `Totalizado`; 51 estão como `Recebido`, em Juruti (4) e Gurupá (47). Para estes últimos, foi examinado o único BU oficial recebido e exigida conciliação exata de todos os contadores municipais e estaduais. Seu estado original não foi substituído por `Totalizado`. Isso estabelece compatibilidade aritmética com as totalizações, não prova isolada de inclusão nem auditoria criptográfica. URLs, hashes e estados estão em `public/para-data/bu-hashes.json`; o aviso também aparece em Dados e fontes.

## Executar e compilar

Requisitos: Node 22.12+ e Python 3.11+ para importar. O projeto mantém as duas entradas, sem refazer o painel antigo.

```powershell
npm ci
npm run dev
# Abrir http://127.0.0.1:5173/para.html (ou a porta informada)
npm test
$env:ATLAS_BASE_PATH = '/atlas/para/'
npm run build
```

No checkout do domínio, o código também fica em `tools/nacional-atlas/`. Antes de executar nessa cópia, rode `python scripts/hydrate_snapshot.py` para copiar as bases públicas versionadas para o diretório de trabalho.

O build de produção usa `dist/para.html` como `index.html` no subdiretório `/atlas/para/`, `dist/assets/` e `dist/para-data/`. Toda URL de arquivo respeita `import.meta.env.BASE_URL`. `para.html` também pode ser mantido como alias. A raiz do domínio continua sendo o site existente.

## Importar os dados oficiais

```powershell
python -m pip install -r requirements.txt
python scripts/import_para.py
npm test
```

São necessárias dezenas de milhares de requisições de arquivos públicos na primeira coleta. A rotina tem até 20 conexões simultâneas e cache retomável em `data/raw/para/`. Os CSVs nacionais e a malha de bairros usam `data/raw/`, compartilhado com Santarém. Quando os ZIPs não existem, são baixados automaticamente; a primeira execução pode baixar mais de 500 MB. Feche a prévia antes de reimportar no Windows, para evitar arquivos abertos na substituição.

O cache representa uma edição reproduzível, não uma garantia de atualização. `collectedAt` é a execução da importação; as datas oficiais estão nos JSONs de totalização. Para outra edição, preserve o cache anterior e execute com um diretório de cache vazio ou revise deliberadamente os arquivos de origem. Não há tarefa agendada nem atualização automática.

Uma falha de download, chave duplicada, candidato ou contador incompatível, local com cadastro internamente divergente, município não relacionado ou soma que não fecha interrompe o processamento. Nenhuma base nova é emitida antes de todas as conciliações passarem. Faça build/publicação apenas após o encerramento bem-sucedido.

### Saídas estruturadas

`public/para-data/index.json` contém totais por município/turno, fontes, hashes e critérios. `locals.json` contém agregações derivadas por local/turno. `municipios/NNNNN.json` contém as seções principais por município e ambos os turnos, carregadas sob demanda. `secoes.csv` permite reproduzir a base completa. `sources.json`, `bu-hashes.json`, `municipios.geojson` e `bairros.geojson` preservam proveniência e geografia.

A chave de uma seção é turno + município TSE + zona + seção principal. A chave do local inclui município + zona + código do local. A chave da localidade inclui município + nome normalizado; bairros com o mesmo nome em cidades diferentes não são misturados. O vínculo TSE–IBGE é por nome normalizado exato, com a variante explícita `ELDORADO DOS CARAJÁS` → `Eldorado do Carajás` (IBGE 1502954), sem correspondência aproximada.

## Geografia e interpretação

- O cadastro TSE informa bairro/localidade para todos os locais desta edição. Isso não é o bairro de residência dos eleitores.
- Os limites municipais de maior precisão da API IBGE validam os pontos. A malha intermediária, mais leve, é usada no desenho. Os hashes de ambas estão nas fontes.
- `latTse`/`lonTse` preservam as coordenadas originais. `lat`/`lon` são nulos quando a coordenada não pode ser usada dentro do município. Não há deslocamento de pontos, geocodificação presumida ou visita de campo.
- No 2º turno, 267 locais (654 seções, 145.167 votos, aproximadamente 2,91% do total) têm coordenada pendente. Seus votos continuam nas somas. O retrato não define se a causa é o cadastro ou o limite cartográfico.
- Bairro cadastral, área de bairro IBGE e perfil territorial são campos independentes. “Fora da malha de bairros” não significa fora do município.
- Os perfis urbanos, ribeirinhos, rural/planalto e demais localidades são categorias analíticas com regras explícitas; não inventam polígonos de comunidades.
- Cores municipais somam os locais que passam pelos filtros. Círculos numerados são agrupamentos visuais de locais e sua posição média não é uma escola. Ao aproximar, surgem os pontos cadastrais individuais. Os agrupamentos nunca entram nas tabelas como novos registros.
- O indicador de maioria compara Lula e Flávio; percentuais dos candidatos usam todos os válidos, inclusive os demais no primeiro turno. Comparecimento usa votos/aptos; brancos+nulos usa votos totais.
- Consulta por seção agregada retorna apenas sua urna principal. Para selecionar uma seção, o app carrega o arquivo municipal e recalcula o recorte a partir das seções, sem atribuir os votos da escola inteira à seção pesquisada.
- Distância é geodésica em linha reta, não estimativa de trajeto ou tempo de viagem.

## Recursos e escopos

Exploração por região, município, bairro/localidade, zona, escola/endereço, perfil territorial, conferência cartográfica, seção e favoritos locais. Mapa por maioria, percentuais dos candidatos, comparecimento e brancos+nulos. Camadas de locais, limites municipais e bairros disponíveis. Pesquisa, ordenação numérica, paginação e exportação CSV/Excel do recorte completo, com critérios no Excel. Favoritos são mantidos apenas no navegador e não são incluídos no link compartilhado.

Entre turnos aplica os filtros aos dois períodos e recalcula as taxas. Comparar municípios é um escopo separado e explicitamente municipal completo, com até quatro municípios e gráfico dos 144. Mudança de participação percentual não é transferência individual de votos nem efeito causal.

## Expansão para outros temas e países

Territórios, períodos, medidas e fontes ficam separados. Novas camadas devem declarar identificador territorial e sistema de referência, unidade/denominador, ano, cobertura, método e origem. Educação, infraestrutura, empreendedorismo, renda, custo de vida e poder de compra **não foram integrados nesta edição**. Comparações internacionais precisarão distinguir moeda nominal de paridade de poder de compra, anos e níveis territoriais; não devem deduzir qualidade de vida de resultados eleitorais.

## Fontes principais

- https://dadosabertos.tse.jus.br/dataset/resultados-2026
- https://dadosabertos.tse.jus.br/dataset/eleitorado-2026
- https://resultados.tse.jus.br/
- https://servicodados.ibge.gov.br/api/v1/localidades/estados/15/municipios
- https://servicodados.ibge.gov.br/api/docs/malhas?versao=3
- https://geoftp.ibge.gov.br/organizacao_do_territorio/malhas_territoriais/malhas_de_setores_censitarios__divisoes_intramunicipais/censo_2022/bairros/shp/UF/PA_bairros_CD2022.zip
- https://www.openstreetmap.org/copyright

O manifesto registra as URLs específicas de cada totalização, dos BUs e dos arquivos, com SHA-256. Os arquivos publicados não incluem telefone do estabelecimento ou dados individuais de eleitores.


## Bairros de Santarém, Alter do Chão e Belterra

A camada de bairros agora colore e permite clicar nos 48 polígonos IBGE Censo 2022 de Santarém. A agregação usa `areaIbgeId`, definido pela posição da coordenada do estabelecimento. Não usa o nome cadastral para deslocar votos entre polígonos. Há 44 áreas com locais posicionados e quatro sem local posicionado no segundo turno; cinza/— significa ausência de estabelecimento no recorte, não ausência de eleitores residentes.

Os atalhos Santarém / Alter / Belterra ficam acima do mapa. O seletor de área e os links compartilháveis usam `area`:

- `/atlas/para/?turno=2&municipio=05355`: bairros de Santarém.
- `/atlas/para/?turno=2&municipio=05355&area=alter-vila`: dois locais com os endereços explícitos “VILA DE ALTER DO CHÃO” e “COMUNIDADE UNIÃO DE ALTER DO CHÃO”. Não representa todos os moradores, limite legal da vila ou total do distrito.
- `/atlas/para/?turno=2&municipio=05355&area=150680710`: distrito oficial de Alter do Chão, incluindo comunidades além da vila. São 25 locais com coordenadas dentro da malha original.
- `/atlas/para/?turno=2&municipio=04804`: Belterra, 46 locais e sete grupos cadastrais no segundo turno. Um local não tem coordenada válida, mas seus votos seguem no total e na tabela. Não há polígonos de bairros de Belterra no arquivo PA_bairros_CD2022; não foram desenhados limites aproximados.

Regerar os recortes após importar a base estadual:

```powershell
python scripts/import_territories.py
npm test
```

O script baixa e conserva o ZIP oficial em `data/raw/PA_distritos_CD2022.zip`; grava geometria, método, IDs dos locais e SHA-256 em `public/para-data/territorios.json`. A seleção ponto/polígono usa a malha original; só a geometria visual é simplificada. Os resultados canônicos do TSE não são alterados. `attachAreas` adiciona a associação em memória tanto aos locais quanto às seções; filtros, exportação e comparação de turnos usam o mesmo recorte.

Fonte de distritos: https://geoftp.ibge.gov.br/organizacao_do_territorio/malhas_territoriais/malhas_de_setores_censitarios__divisoes_intramunicipais/censo_2022/distritos/shp/UF/PA_distritos_CD2022.zip

Referência territorial complementar: https://servicodados.ibge.gov.br/api/v1/localidades/municipios/1506807/distritos

Teste de conservação: somar os votos dos bairros e dos locais fora de um bairro reproduz exatamente o total municipal, sem duplicação. Distrito e vila são recortes alternativos, nunca somados como categorias mutuamente exclusivas. A tabela Áreas IBGE mostra todos os polígonos, inclusive sem escola no recorte. A tabela Cadastro TSE mantém separadamente os nomes registrados pela Justiça Eleitoral.
