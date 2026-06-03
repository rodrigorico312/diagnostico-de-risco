# Rodrigo Coelho — Contador em Santarém

Landing page minimalista para Rodrigo Coelho, contador CRC/PA 024335 em
Santarém-PA, com atendimento para empresas em todo o Pará.

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
const WHATSAPP_NUMBER = "5593992101980";
const WHATSAPP_MESSAGE =
  "Olá, vim pelo site e preciso falar com um contador para minha empresa";
```

A imagem usada na apresentação fica em `public/rodrigo-coelho.png`.

Atualize em `src/App.tsx`:

```ts
const INSTAGRAM_URL = "https://www.instagram.com/rodrigospcoelho";
const EMAIL = "rodrigorico312@gmail.com";
const COMPANY_NAME = "O GESTOR DO LUCRO CONSULTORIA LTDA";
const CNPJ = "62.560.654/0001-27";
const ADDRESS =
  "Av. Plácido de Castro, 1505, Aparecida, Santarém-PA, CEP 68.040-090";
```
