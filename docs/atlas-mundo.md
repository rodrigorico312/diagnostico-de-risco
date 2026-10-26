# Nacional Atlas · mundo e condições de vida

Aplicação escura e responsiva em `https://www.nacionalcon.com/atlas/`, conectada por um banner ao atlas eleitoral `/atlas/para/`. O mapa mundial oferece navegação até ruas pelo OpenStreetMap. As estatísticas continuam na escala territorial de sua fonte, independentemente do zoom.

## Executar

```powershell
npm ci
npm test
npm run dev
# Abrir a porta informada, caminho /world.html
```

Na cópia versionada no repositório do domínio (`tools/nacional-atlas`), execute antes `python scripts/hydrate_snapshot.py`. Isso restaura as bases a partir dos arquivos públicos versionados no mesmo checkout, sem nova coleta de milhares de arquivos eleitorais.

## Escopo publicado

### Mundo

217 países/economias do Banco Mundial, excluídos agregados estatísticos regionais/de renda. Há seis indicadores e 1.240 valores não nulos: PIB por pessoa em paridade de poder de compra, expectativa de vida, saneamento básico, eletricidade, desemprego e uso da internet. Cada série usa o último registro não nulo entre 2015 e 2026, com ano individual preservado. A edição foi coletada em 26/10/2026.

PIB PPC é produção econômica média anual por habitante, em dólares internacionais constantes de 2021. Não representa renda líquida familiar, salário, aluguel ou dinheiro que sobra. Desemprego é estimativa OIT como percentual da força de trabalho, não quantidade de vagas.

A malha Natural Earth 5.1.1, escala 1:50 milhões, tem 241 feições; 216 economias WB estão associadas à geografia. Gibraltar permanece consultável sem polígono nesta escala. 25 feições cartográficas sem série associada recebem `NE-*` e nenhum dado de vizinhos ou soberanos. Channel Islands agrega Jersey e Guernsey conforme código da fonte. Fronteiras generalizadas/de facto não são afirmações sobre limites legais.

### Brasil municipal

Cadastro IBGE com 5.571 municípios e nove indicadores. A malha mínima oficial contém 5.570 municípios. Boa Esperança do Norte (MT, 5101837) permanece consultável sem desenho aproximado; seus dados censitários anteriores à criação são nulos, enquanto seu Ideb 2025 já pode estar disponível.

| Indicador | Referência | Significado |
|---|---|---|
| Água | 2022 | Domicílios ligados à rede geral que a usam como fonte principal; não mede continuidade ou qualidade da água. |
| Esgoto | 2022 | Rede geral/pluvial ou fossa ligada à rede; não equivale a todo saneamento adequado ou tratamento do esgoto. |
| Coleta de lixo | 2022 | Coleta por serviço de limpeza no universo declarado. |
| Ideb inicial/final | 2025 | Rede pública municipal, etapas separadas, via indicador oficial IBGE/INEP. Ausência não é nota zero. |
| Pavimentação/iluminação | 2022 | Domicílios do universo da pesquisa do entorno com a característica; percentual derivado dos contadores oficiais. |
| Renda domiciliar mensal por pessoa | 2022 | Média nominal em reais de julho de 2022; resultado amostral, sem atualização inflacionária. |
| Pessoas ocupadas, 14+ | 2022 | Quantidade de moradores ocupados na semana de referência, incluindo formal e informal; não é taxa nem vagas abertas. |

Para pavimentação e iluminação, numerador e denominador permanecem em cada observação. O denominador é o total oficial do universo do entorno (289150), incluindo não declarados. Não se divide apenas pela soma das categorias preenchidas nem se atribui o percentual urbano automaticamente aos domicílios rurais.

O vínculo dos indicadores IBGE pesquisas, que retornam códigos-base de seis dígitos, usa o prefixo único do cadastro oficial de sete dígitos; a unicidade é validada antes da associação. Renda e ocupação usam SIDRA/API de agregados com classificações explicitamente em totais.

### Simulador de orçamento familiar

Até quatro cenários por navegador. Renda líquida mensal e nove categorias de custo são fornecidas pelo usuário. Não há preços simulados como oficiais nem preenchimento automático de custos com médias municipais.

- Campo vazio: não informado. Zero digitado: custo zero conhecido.
- Saldo parcial enquanto qualquer categoria estiver vazia.
- Entradas negativas, texto e formatos monetários inválidos são rejeitados.
- Renda e despesas não são transmitidas ao servidor nem incluídas em URL de compartilhamento.
- Cenários persistem em `localStorage`; quem usa o mesmo navegador pode acessá-los.
- BRL, USD, EUR, CAD, GBP e AUD são unidades alternativas, sem conversão automática. Alterar moeda reinterpreta os números; não converte seu valor.
- Cenários em moedas diferentes não são diretamente comparáveis. Não se calcula recomendação migratória ou viabilidade de visto.

## Interações e comparação

Mapa com cores em faixas da distribuição dos valores disponíveis do recorte; não há nota geral de qualidade de vida. Busca, seleção de UF, inspeção por território, tabela ordenável/paginada e exportação CSV/Excel usam o mesmo recorte. Comparar permite até quatro territórios da mesma escala, com ano e unidade em cada célula. Os filtros da exploração não restringem essa comparação explicitamente separada.

Brasil é carregado sob demanda. Valores ausentes continuam nulos; formas sem dados ficam em cor neutra. Territórios sem geometria continuam na consulta. Os percentuais não são somados e não há conversão de valores nacionais em valores municipais. Não há série de bairros/ruas nem preços de imóveis nesta edição.

## Coletar e reproduzir

```powershell
python -m pip install -r requirements.txt
python scripts/import_world_context.py
python scripts/import_brazil_context.py
npm test
```

O importador mundial aceita `--refresh`. Os scripts usam caches em `data/raw/world-context` e `data/raw/context`. A coleta pode reutilizar arquivos de uma edição anterior: data de execução não é garantia de atualização. Para uma edição brasileira nova, preserve o cache atual e execute com cache deliberadamente renovado; não há rotina agendada instalada. Evite reimportar com prévia Vite aberta no Windows.

Fontes, URLs, hashes, datas, associações e validações estão em `public/world-data/sources.json` e `public/context-data/sources.json`. Cada indicador também registra definição e URL específica. Arquivos publicados: `world-data/index.json`, `world-data/countries.geojson`, `context-data/index.json`, `context-data/municipios.geojson` e `context-data/municipios.csv`.

## Compilar e publicar no domínio existente

```powershell
$env:ATLAS_BASE_PATH='/atlas/'
npm run build
python scripts/package_context.py --destination 'CAMINHO_DO_SITE/public/atlas'
```

O pacote copia `world.html` como `index.html`, assets e duas bases sociais. Preserva `public/atlas/para`. Para atualizar o banner do painel eleitoral, compile separadamente com `ATLAS_BASE_PATH=/atlas/para/` e execute `package_para.py` para seu destino conhecido. Os builds têm três entradas (Santarém original, Pará eleitoral e Mundo), mantendo namespaces de assets separados nas publicações.

Em Vercel, rotas exatas `/atlas` e `/atlas/` apontam para `/atlas/index.html`; rotas eleitorais existentes são preservadas. O site principal, autenticação e APIs privadas não são alterados.

## Fontes

- Banco Mundial: `https://api.worldbank.org/v2/` e URLs individuais por indicador.
- Natural Earth: `https://www.naturalearthdata.com/`, admin0 countries 50m 5.1.1.
- IBGE localidades/malhas/pesquisas: `https://servicodados.ibge.gov.br/`.
- IBGE agregados/SIDRA: tabelas 10295 (renda) e 10261 (ocupação), além das definições de saneamento e entorno do Censo 2022.
- OpenStreetMap: `https://www.openstreetmap.org/copyright`.

As camadas eleitorais mantêm suas fontes TSE e não são usadas para inferir condições dos moradores ou dos eleitores a partir de escolas de votação.
