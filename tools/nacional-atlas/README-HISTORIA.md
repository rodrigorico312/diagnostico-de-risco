# Nacional Atlas unificado

Entrada: `https://www.nacionalcon.com/atlas/`. Navegação por História e poder, Mundo e Brasil e Eleições no mapa. Os módulos são carregados sob demanda. A navegação principal usa o mesmo caminho, com `visao=historia`, `visao=mapa` ou `visao=eleicoes`.

Sem `visao`, um endereço antigo com `escala` ou `camada` abre o mapa de indicadores; com `municipio` ou `turno`, abre eleições. A entrada sem filtros abre História. As rotas legadas `/atlas/para/`, `/eleicoes/para/` e `/eleicoes/santarem/` redirecionam para a entrada unificada. Arquivos e downloads existentes continuam acessíveis. As regras são específicas; não afetam outras áreas do domínio.

## Seleção histórica inicial

56 acontecimentos, 73 referências e 16 nomeações selecionadas. Há lacunas importantes entre períodos; ausência de registro não significa ausência de acontecimento. Não é uma lista completa de ministros ou governos. Antes de 1500 há registros arqueológicos; `year=0` é somente um marcador de ordenação e aparece como período aproximado, sem exportar ano zero.

Fontes oficiais e institucionais sustentam a maioria dos registros. Referências de pesquisa têm tipo próprio. O caso de passaportes de Flávio em 2026 está classificado como notícia, com a reportagem identificada. Nesta coleta não foram obtidos número do processo nem decisão original; o registro não afirma fuga, culpa, perseguição ou motivação partidária. Não foi incluída como fato a antiga alegação de prorrogação de votação por Zanin.

Os textos separam contexto, decisão, efeitos descritivos, interpretação e limites. Uma lei demonstra o desenho normativo, não a eficácia. Nomeações não demonstram controle político; coincidência temporal ou vínculos por tema não demonstram causalidade. Números de julgamentos têm fase processual explícita (por exemplo, mérito da AP 470 em 2012, antes de recursos posteriores). Quando só sínteses institucionais foram lidas, não se afirma leitura integral do acórdão.

## Funcionalidades

- **Falas e documentos**: seleção inicial de três registros primários (Ulysses/1988, Carta de Lula/2002, Bolsonaro/2016), oito novos acontecimentos de contexto e desdobramentos, nove novas fontes. Não é amostra representativa nem ranking de políticos.
- Trecho literal com autor, cargo na época, data do acontecimento, localizador dentro da fonte, contexto declarado e limites sobre intenção. Data de republicação não substitui a data histórica.
- Trilha do episódio de 2016: comando de Ustra, prisão/tortura de Dilma, processo civil Teles no TJSP e no STJ e resultado no Conselho de Ética. Não confundir responsabilidade civil com condenação penal ou atribuir tortura pessoal contra Dilma a Ustra com essas fontes.
- Mapa atual de referências municipais (Brasília/DF e São Paulo/SP) associado aos documentos. Marcadores usam o centro do enquadramento da malha municipal simplificada do IBGE, não endereços ou fronteiras históricas. A carta de 2002 é localizada pela cidade de assinatura, sem afirmar o local exato de divulgação. Registros sem referência seguem na lista e nas contagens.
- Novos filtros por tipo de registro e município. A entrada na aba de falas abre toda a seleção; filtros podem ser reaplicados em seguida. O CSV inclui trecho, fonte, limites e precisão municipal, sem anotações privadas.

- Navegação temporal com reprodução: percorre apenas anos com registros, sem interpolar fatos nem representar duração pelo espaçamento do controle.
- Aba **Mapa histórico**, integrada ao mesmo endereço (`h_tela=explorer&m_ano=1000`), com motor InvaderGIS: mapa temporal, relações, governantes, comparação e biblioteca de fontes. O ano do mapa é sincronizado por mensagens verificadas e pode ser compartilhado. O link do Atlas não preserva posição ou entidade selecionada dentro do mapa.
- Painel de filtros recolhido por padrão em todas as telas; botão de hambúrguer abre o painel deslizante. Fechar, Escape ou clique fora recolhem a lateral e mantêm as seleções.
- Filtros por período, década, ano com registro, tema, pessoa/instituição e estado da evidência.
- Busca textual; detalhe com fontes; compartilhamento do recorte e do evento por URL.
- Rede com até seis conexões por atores/temas ou vínculo editorial. A rede atravessa filtros temporais de propósito e avisa isso.
- Comparação contextual de até dois marcos, sem estimar efeito causal.
- Nomeações pesquisáveis por ministro e presidente que indicou, com ano e nota da ficha.
- Favoritos e anotações exclusivamente no armazenamento local do navegador. Não são enviados ao servidor, incluídos na URL nem no CSV público. A aplicação não contém serviço de IA nem backend de anotações.
- CSV com fontes e limites; download do JSON integral com metadados e hashes dos arquivos editoriais de entrada.

## Reproduzir

`python scripts/verify_statements.py` consulta separadamente as três fontes primárias HTML dos trechos selecionados, extrai texto e normaliza espaços, Unicode/capitalização e espaços antes da pontuação para conferir a citação. O relatório `history-data/statements-audit.json` registra URL, consulta, tamanho, SHA-256 e resultado, inclusive falhas de acesso. A conferência não gera fatos nem atesta a veracidade de afirmações feitas pelo autor; não roda automaticamente durante a compilação. Nesta revisão, os três trechos foram encontrados (HTTP 200).

### Mapa InvaderGIS para estudo pessoal

Código upstream: https://github.com/g-lanza/InvaderGIS, commit `c2acb1e9cddd75ded98246f8c518ac9acc74a593`.
O motor e a base de terceiros são incorporados em uma superfície própria; não alteram os registros brasileiros ou eleitorais. Cobertura: 500–1500, concentrada na Europa e regiões próximas. Não equivale a uma história completa de todos os povos. A interface original e o corpus são majoritariamente em inglês, com tradução parcial dos comandos principais. O tema inicial foi adaptado para escuro.

Licenças: software PolyForm Noncommercial 1.0.0; curadoria/dados CC BY-NC 4.0; fontes upstream mantêm condições próprias, descritas em `ATTRIBUTIONS.txt`. Uso aqui declarado pessoal e não comercial. Aviso `noindex` não é controle de acesso: a audiência existente do Atlas foi preservada.

A validação upstream verifica 12.273 registros de 12 tipos e retorna **0 erros e 106 avisos**, incluindo referências de fontes e vínculos não resolvidos. O compilador reúne 16.415 registros de 15 tipos. Isso **não** significa que todos foram auditados nem que toda afirmação tem referência resolvida. O relatório integral é distribuído com o mapa (`invadergis/validation.txt`), junto com licença, créditos e `integration.json`.

```powershell
git clone https://github.com/g-lanza/InvaderGIS.git ../referencias/InvaderGIS
git -C ../referencias/InvaderGIS checkout c2acb1e9cddd75ded98246f8c518ac9acc74a593
python scripts/prepare_invadergis.py --source ../referencias/InvaderGIS
```

O script aplica adaptações idempotentes (caminho, alias Windows, tipos Node, tema, integração de ano, tradução parcial, manifesto), valida, compila e instala os arquivos estáticos em `public/invadergis`. Nenhum serviço pago ou chave de API é necessário para esse motor e essa base. Cada referência e as licenças das fontes permanecem consultáveis. A geração de estatísticas brasileiras continua independente. Para regenerar a cronologia, execute `python scripts/build_history.py`; o script reúne `research/foundations.json`, `justice.json`, `root.json` e `statements.json`, valida vínculos entre coleções e extrai `history-data/places.geojson` da malha municipal local do IBGE, com hash de origem. A seleção documental é editorial, sem ingestão automática de afirmações ou intenção:

```powershell
npm ci
python scripts/hydrate_snapshot.py
python scripts/seed_history_current.py
python scripts/build_history.py
npm test
$env:ATLAS_BASE_PATH='/atlas/'
npm run build
```

No checkout original de desenvolvimento, `hydrate_snapshot.py` exige `--site-root` para apontar ao checkout do domínio. No espelho `tools/nacional-atlas` ele localiza o domínio automaticamente.

`research/foundations.json` e `research/justice.json` são registros de curadoria, não texto gerado durante uma visita. `research/root.json` é reconstituído por `seed_history_current.py`. Rechecar fontes e revisar conteúdo é uma etapa editorial humana/assistida; `build_history.py` valida estrutura, referências, datas, limites e classificação, mas não prova automaticamente a veracidade de todo texto. O site é um retrato, sem atualização automática.

`build_history.py` grava `public/history-data/index.json`, com IDs prefixados por arquivo, relações resolvidas e SHA-256 dos três insumos. Os testes conferem filtros, integridade de referências, cronologia, nomeações, ausência de notas privadas na exportação e tratamento da notícia atual.

## Empacotar no domínio existente

```powershell
python scripts/package_context.py --destination C:/caminho/do/repositorio/public/atlas
```

O empacotador exige destino terminando em `public/atlas`, verifica as bases e copia assets, `world-data`, `context-data`, `para-data` e `history-data`. `world.html` contém a entrada React unificada e é publicado como `index.html`. Não é mais necessário compilar o módulo eleitoral com base separada para a navegação principal. A configuração de rotas está no `vercel.json` do repositório do domínio.

Código: `src/atlas/` (navegação e compatibilidade), `src/history/` (cronologia), `src/world/` (indicadores) e `src/para/` (eleições). As fontes eleitorais e estatísticas mantêm sua documentação própria. Este módulo não altera votos, coordenadas ou séries oficiais.


### Leitura cartográfica em português e guia de estudo (27/10/2026)

A aba Mapa histórico agora abre uma leitura própria em português, construída com Leaflet e os mesmos 306 registros territoriais da versão fixada do InvaderGIS. Nomes, tipos, regiões, situação editorial e confiança receberam tradução editorial explícita em `research/medieval-pt.json`. Não traduzimos automaticamente as narrativas extensas. O explorador original e suas funções avançadas continuam acessíveis como opção identificada em inglês; títulos bibliográficos conservam o idioma de publicação.

Execute `python scripts/build_medieval_pt.py` depois de restaurar `public/invadergis`; `prepare_invadergis.py` também o executa ao terminar. O catálogo derivado `history-data/medieval-pt.json` preserva IDs, datas e referências, inclui os hashes SHA-256 do JSON territorial e da camada GeoJSON original. Os desenhos são copiados da camada preparada pelo próprio InvaderGIS, sem alteração de coordenadas ou inferência sobre arrays legados que o upstream não publicou como geometria. A camada de continentes é Natural Earth local, preservada com os créditos do upstream, sem imagens de mapas atuais ou novas consultas a terceiros.

A representação usa exclusivamente o último snapshot com ano menor ou igual ao escolhido e entidades dentro do período declarado pela base (extremos inclusivos). Não interpola coordenadas, não antecipa desenhos futuros e mantém fichas sem desenho na lista. Sobreposições, registros duplicados e lacunas do catálogo impedem interpretar contagens de fichas como quantidade de países, habitantes ou cobertura integral. Estado editorial e confiança são declarações do upstream, não auditoria independente.

Controles permitem buscar nomes em português, filtrar região, escolher 500–1500, clicar em polígonos ou fichas e consultar as fontes. O botão da área brasileira explicita a falta de polígonos históricos brasileiros; o acesso à trilha arqueológica não inventa limites indígenas. A cronologia brasileira e o mapa medieval usam bases e controles temporais independentes.

O botão recolhível Como estudar e a aba Fontes e método explicam cada área do Atlas, a leitura de documentos, limites causais e anotações privadas. Atalhos abrem marcos da coleção com filtros reiniciados. O guia não acrescenta fatos históricos, inferências sobre intenções ou dados populacionais.


### Pessoas e ideias — seleção inicial

A aba `h_tela=ideas&h_autor=olavo` reúne seis entradas: Olavo de Carvalho, Daniel Fraga, Marx e Engels, Eduard Bernstein, Vladimir Lênin e Adolf Hitler. O parâmetro de autor aceita IDs da coleção; seleções inválidas exibem a primeira entrada. A navegação permanece no Atlas existente. Busca local, referências por tese, comparação de até duas entradas e atalhos para os documentos e marcos da linha do tempo fazem parte desta edição.

`research/ideas.json` acrescenta 14 acontecimentos e 20 fontes, com distinção entre registro do autor, relato jornalístico e contextualização acadêmica/institucional. A cronologia total passa a 70 acontecimentos, 93 fontes e 16 nomeações. As fichas não prometem biografia ou obra completa, não diagnosticam personalidade e não demonstram filiações intelectuais sem documentos. Correntes socialistas são diferenciadas; o nazismo recebe contextualização crítica do USHMM, do programa histórico e do memorial de Wannsee, sem equivalência automática pelo nome do partido. A reunião de Wannsee não é atribuída à presença pessoal de Hitler nem ao início de todos os assassinatos.

As publicações de Marx/Engels e Olavo que não têm dia confirmado usam `statement.datePrecision=year` com `date` ausente. Interface e CSV preservam essa ausência; nenhum 1º de janeiro é fabricado. A redação do livro de Lênin em 1917 é separada da primeira publicação em 1918. As datas de vídeos são normalizadas para UTC, mantendo os timestamps originais e seus fusos nas notas das fontes e no relatório. Não há localização privada ou coordenadas atribuídas aos autores.

`python scripts/verify_ideas.py` verifica três citações curtas (Manifesto, prefácio de O Capital e excerto de Olavo) e os metadados públicos de dois vídeos originais de Daniel Fraga. Salva `history-data/ideas-audit.json` com escopo, horário de consulta, SHA-256, resultados e erros. O relatório não transcreve fala, não prova as alegações do autor e não audita integralmente todas as referências. Os vídeos de Fraga estão na cronologia como publicações com metadados, sem citação falada ou minutagem inventada. Uma leitura jornalística sobre suas posições é identificada como tal. O relatório anterior `statements-audit.json` continua com o escopo dos três trechos da seleção inicial.

Para reproduzir: restaure as bases com `hydrate_snapshot.py` se necessário, execute `python scripts/build_history.py`, opcionalmente `python scripts/verify_ideas.py`, `npm test`, e compile com `ATLAS_BASE_PATH=/atlas/`. O importador valida perfis, referências por tese, datas, precisão anual e vínculos para acontecimentos. A auditoria de fontes é separada da compilação, pois depende da disponibilidade externa.
