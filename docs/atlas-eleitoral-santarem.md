# Atlas eleitoral de Santarém

Rota pública: `https://www.nacionalcon.com/eleicoes/santarem/`.

O aplicativo React/TypeScript/Leaflet é compilado separadamente e entregue como arquivos estáticos em `public/eleicoes/santarem/`. A página institucional e as APIs existentes não são usadas para processar os votos.

## Dados e limites

- Base estruturada: `/eleicoes/santarem/data/election.json`.
- CSV dos dois turnos: `/eleicoes/santarem/data/secoes.csv`.
- Fontes, hashes e notas: `/eleicoes/santarem/data/sources.json`.
- Polígonos: `/eleicoes/santarem/data/bairros.geojson` e `municipio.geojson`.

O mapa usa resultados oficiais do TSE por seção principal, 1º turno em CSV e 2º turno em 872 BUs conciliados com a totalização municipal. Mantém as lacunas de coordenadas e de bairros explícitas. Bairro do estabelecimento não representa necessariamente o voto de seus moradores. A malha de bairros é IBGE 2022 e não uma delimitação inventada para 2026. Os tratamentos e a cobertura estão na aba Qualidade e fontes.

## Atualização

1. Execute a importação validada no projeto-fonte do atlas (`scripts/import_data.py`).
2. Execute os testes de conciliação e agregação.
3. Compile o atlas com `ATLAS_BASE_PATH=/eleicoes/santarem/`.
4. Substitua somente `index.html`, `assets/` e `data/` deste caminho pelos arquivos de `dist/`.
5. Confira a página, a base JSON e os downloads no domínio após o deploy.

Não copie arquivos `.env`, cache bruto, credenciais ou `node_modules`. Nenhuma chave de API é necessária no aplicativo estático. As duas entradas de rewrite em `vercel.json` servem a URL com e sem barra final.
