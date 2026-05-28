# Rodrigo Coelho — Contador em Santarém

Landing page minimalista para Rodrigo Coelho, contador CRC/PA 024335 em
Santarém-PA.

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
  "Olá, vim pelo site e preciso falar com um contador para minha empresa.";
```

A foto pessoal deve ser colocada em `public/foto-perfil.jpg`.
