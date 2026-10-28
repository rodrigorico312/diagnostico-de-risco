A entrada principal agora é `/atlas/`, com história, indicadores e eleições na mesma navegação. Leia `README-HISTORIA.md` para executar e publicar a versão unificada.

# Nacional Atlas

Mundo, municípios brasileiros e orçamento familiar: leia `README-MUNDO.md`. Eleições do Pará: leia `README-PARA.md`.

```powershell
python scripts/hydrate_snapshot.py
npm ci
npm test
npm run dev
```

Abra `/world.html` para o atlas mundial ou `/para.html` para o painel eleitoral, na porta informada. As bases públicas versionadas são restauradas pelo script; arquivos brutos e valores pessoais de orçamento não são publicados.

## Trilhas históricas: militares e democracia

A área unificada `/atlas/?visao=historia&h_tela=trails` contém os percursos do 8 de janeiro e do Império à democracia. Fontes, alcance da conferência, distinção entre depoimento e decisão e instruções de reprodução estão em [research/README-military.md](research/README-military.md). Execute `python scripts/build_history.py` antes do build ao editar as bases históricas.

## Participantes e relações com evidências

A aba Quem participa (`/atlas/?visao=historia&h_tela=cases&h_caso=tagliaferro`) distingue funções, relações documentais, relatos da imprensa e perguntas em aberto. Pesquisa, filtros de relações e exportação CSV estão disponíveis. Consulte [research/README-networks.md](research/README-networks.md) para fontes, lacunas e reprodução.
