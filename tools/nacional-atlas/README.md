# Nacional Atlas

Código do atlas estadual e do painel original de Santarém. Leia `README-PARA.md`.

```powershell
python scripts/hydrate_snapshot.py
npm ci
npm test
npm run dev
```

As bases públicas versionadas são restauradas por `hydrate_snapshot.py`; os arquivos brutos do TSE não são incluídos no repositório. Para uma nova coleta, execute `python scripts/import_para.py`.
