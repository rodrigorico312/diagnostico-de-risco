# Contador em Santarém

Landing page minimalista para um contador de Santarém-PA que atende empresas
locais e de municípios próximos com contabilidade tributária e organização
financeira.

## Rodar localmente

1. Instale as dependências:
   `npm install`
2. Rode em desenvolvimento:
   `npm run dev`
3. Gere a versão de produção:
   `npm run build`

## Configuração

O link de WhatsApp fica em `src/App.tsx`:

```ts
const WHATSAPP_NUMBER = "5593992191980";
const WHATSAPP_MESSAGE =
  "Olá, vim pelo site e quero falar sobre contabilidade e financeiro da minha empresa.";
```

A foto pessoal deve ser colocada em `public/foto-perfil.jpg`.

Substitua o placeholder `[SEU NOME]` antes de publicar.
