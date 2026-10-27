# Nacional Atlas unificado

Entrada: `https://www.nacionalcon.com/atlas/`. Navegação por História e poder, Mundo e Brasil e Eleições no mapa. Os módulos são carregados sob demanda. A navegação principal usa o mesmo caminho, com `visao=historia`, `visao=mapa` ou `visao=eleicoes`.

Sem `visao`, um endereço antigo com `escala` ou `camada` abre o mapa de indicadores; com `municipio` ou `turno`, abre eleições. A entrada sem filtros abre História. As rotas legadas `/atlas/para/`, `/eleicoes/para/` e `/eleicoes/santarem/` redirecionam para a entrada unificada. Arquivos e downloads existentes continuam acessíveis. As regras são específicas; não afetam outras áreas do domínio.

## Seleção histórica inicial

48 acontecimentos, 64 referências e 16 nomeações selecionadas. Há lacunas importantes entre períodos; ausência de registro não significa ausência de acontecimento. Não é uma lista completa de ministros ou governos. Antes de 1500 há registros arqueológicos; `year=0` é somente um marcador de ordenação e aparece como período aproximado, sem exportar ano zero.

Fontes oficiais e institucionais sustentam a maioria dos registros. Referências de pesquisa têm tipo próprio. O caso de passaportes de Flávio em 2026 está classificado como notícia, com a reportagem identificada. Nesta coleta não foram obtidos número do processo nem decisão original; o registro não afirma fuga, culpa, perseguição ou motivação partidária. Não foi incluída como fato a antiga alegação de prorrogação de votação por Zanin.

Os textos separam contexto, decisão, efeitos descritivos, interpretação e limites. Uma lei demonstra o desenho normativo, não a eficácia. Nomeações não demonstram controle político; coincidência temporal ou vínculos por tema não demonstram causalidade. Números de julgamentos têm fase processual explícita (por exemplo, mérito da AP 470 em 2012, antes de recursos posteriores). Quando só sínteses institucionais foram lidas, não se afirma leitura integral do acórdão.

## Funcionalidades

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

O script aplica adaptações idempotentes (caminho, alias Windows, tipos Node, tema, integração de ano, tradução parcial, manifesto), valida, compila e instala os arquivos estáticos em `public/invadergis`. Nenhum serviço pago ou chave de API é necessário para esse motor e essa base. Cada referência e as licenças das fontes permanecem consultáveis. A geração de estatísticas brasileiras continua independente:

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
