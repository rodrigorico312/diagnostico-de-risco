# Nacional Contabilidade

Site institucional da Nacional Contabilidade, com landing page principal,
pagina de links e formulario de lead para troca de contador.

## Rodar localmente

1. Instale as dependencias:
   `npm install`
2. Rode em desenvolvimento:
   `npm run dev`
3. Gere a versao de producao:
   `npm run build`

## Rotas

- `/`: landing page principal
- `/links`: pagina de links
- `/trocar-contador`: formulario para lead de troca de contador

## Configuracao do WhatsApp

O link de WhatsApp fica em `src/App.tsx`:

```ts
const WHATSAPP_NUMBER = "5593992101980";
const WHATSAPP_MESSAGE =
  "Ola, vim pelo site e quero falar com a Nacional Contabilidade sobre minha empresa.";
```

## API de leads

O formulario de `/trocar-contador` envia os dados para:

`/api/troca-contador`

Configure as variaveis abaixo na Vercel:

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
GOOGLE_SHEETS_WEBHOOK_URL=
GOOGLE_SHEETS_WEBHOOK_SECRET=
```

Nao coloque token do Telegram direto no codigo.

## Telegram

1. Adicione o bot ao grupo de leads.
2. Envie uma mensagem qualquer no grupo, como `teste`.
3. Consulte os updates do bot pela API do Telegram.
4. Use o `chat.id` do grupo como `TELEGRAM_CHAT_ID`.

O `TELEGRAM_CHAT_ID` normalmente comeca com `-100` em grupos.

## Google Sheets

Uma forma simples de gravar os leads na planilha e criar um Apps Script com
um webhook publicado como Web App. O endpoint publicado entra em
`GOOGLE_SHEETS_WEBHOOK_URL`.

Exemplo de Apps Script:

```js
const SECRET = "troque-esta-chave";

function doPost(e) {
  const payload = JSON.parse(e.postData.contents);

  if (payload.secret !== SECRET) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads");

  sheet.appendRow([
    new Date(),
    payload.tipo,
    payload.nome,
    payload.whatsapp,
    payload.cidade,
    payload.empresa,
    payload.regime,
    payload.segmento,
    payload.faturamento,
    payload.pendencias,
    payload.motivo,
    payload.observacao,
    payload.pagina,
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Na Vercel, use o mesmo valor de `SECRET` em
`GOOGLE_SHEETS_WEBHOOK_SECRET`.
