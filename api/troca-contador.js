const requiredFields = [
  "nome",
  "whatsapp",
  "cidade",
  "regime",
  "segmento",
  "faturamento",
  "motivo",
  "pendencias",
];

function readBody(request) {
  if (request.body && typeof request.body === "object") {
    return request.body;
  }

  if (typeof request.body === "string") {
    return JSON.parse(request.body);
  }

  return {};
}

function clean(value) {
  return typeof value === "string" ? value.trim().slice(0, 1200) : "";
}

function escapeHtml(value) {
  return clean(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatTelegramMessage(lead) {
  const lines = [
    "<b>Novo lead - Troca de contador</b>",
    "",
    `<b>Nome:</b> ${escapeHtml(lead.nome)}`,
    `<b>WhatsApp:</b> ${escapeHtml(lead.whatsapp)}`,
    `<b>Cidade/UF:</b> ${escapeHtml(lead.cidade)}`,
    `<b>Empresa:</b> ${escapeHtml(lead.empresa) || "Não informado"}`,
    `<b>Regime:</b> ${escapeHtml(lead.regime)}`,
    `<b>Segmento:</b> ${escapeHtml(lead.segmento)}`,
    `<b>Faturamento:</b> ${escapeHtml(lead.faturamento)}`,
    `<b>Pendência fiscal:</b> ${escapeHtml(lead.pendencias)}`,
    `<b>Motivo:</b> ${escapeHtml(lead.motivo)}`,
  ];

  if (clean(lead.observacao)) {
    lines.push("", `<b>Observação:</b> ${escapeHtml(lead.observacao)}`);
  }

  lines.push("", `<b>Origem:</b> ${escapeHtml(lead.pagina) || "Site"}`);
  return lines.join("\n");
}

async function sendTelegram(lead) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return { skipped: true, reason: "Telegram não configurado" };
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatTelegramMessage(lead),
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Telegram falhou: ${detail}`);
  }

  return { ok: true };
}

async function sendGoogleSheets(lead) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    return { skipped: true, reason: "Google Sheets não configurado" };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      secret: process.env.GOOGLE_SHEETS_WEBHOOK_SECRET || "",
      tipo: "troca_contador",
      recebidoEm: new Date().toISOString(),
      ...lead,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Google Sheets falhou: ${detail}`);
  }

  return { ok: true };
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ ok: false, error: "Método não permitido" });
  }

  let body;

  try {
    body = readBody(request);
  } catch {
    return response.status(400).json({ ok: false, error: "JSON inválido" });
  }

  if (clean(body.website)) {
    return response.status(200).json({ ok: true });
  }

  const lead = {
    nome: clean(body.nome),
    whatsapp: clean(body.whatsapp),
    cidade: clean(body.cidade),
    empresa: clean(body.empresa),
    regime: clean(body.regime),
    segmento: clean(body.segmento),
    faturamento: clean(body.faturamento),
    motivo: clean(body.motivo),
    pendencias: clean(body.pendencias),
    observacao: clean(body.observacao),
    origem: clean(body.origem),
    pagina: clean(body.pagina),
  };

  const missingFields = requiredFields.filter((field) => !lead[field]);

  if (missingFields.length > 0) {
    return response.status(400).json({
      ok: false,
      error: "Campos obrigatórios ausentes",
      fields: missingFields,
    });
  }

  const hasTelegram = process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID;
  const hasSheets = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!hasTelegram && !hasSheets) {
    return response.status(500).json({
      ok: false,
      error: "Integração não configurada",
    });
  }

  const results = await Promise.allSettled([
    sendTelegram(lead),
    sendGoogleSheets(lead),
  ]);

  const successes = results.filter(
    (result) =>
      result.status === "fulfilled" &&
      (result.value.ok || result.value.skipped),
  );
  const failures = results.filter((result) => result.status === "rejected");
  const delivered = results.some(
    (result) => result.status === "fulfilled" && result.value.ok,
  );

  if (!delivered) {
    return response.status(502).json({
      ok: false,
      error: "Não foi possível entregar o lead",
      details: failures.map((failure) => failure.reason.message),
    });
  }

  return response.status(200).json({
    ok: true,
    delivered: successes.length,
    warnings: failures.map((failure) => failure.reason.message),
  });
}
