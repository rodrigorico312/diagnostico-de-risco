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
