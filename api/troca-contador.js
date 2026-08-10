const requiredFieldsByType = {
  troca_contador: [
    "nome",
    "whatsapp",
    "cidade",
    "regime",
    "segmento",
    "faturamento",
    "motivo",
    "pendencias",
  ],
  contabilidade_empresas: [
    "nome",
    "whatsapp",
    "cidade",
    "regime",
    "segmento",
    "faturamento",
    "motivo",
    "pendencias",
  ],
  solicitar_atendimento: [
    "nome",
    "whatsapp",
    "email",
    "cidade",
    "empresa",
    "atividade",
    "faturamento",
    "contadorAtual",
    "interesse",
    "motivo",
    "urgencia",
    "momento",
    "observacao",
  ],
};

const leadTitles = {
  troca_contador: "Novo lead - Troca de contador",
  contabilidade_empresas: "Novo lead - Contabilidade para empresas",
  solicitar_atendimento: "Nova solicitação de atendimento",
};

const whatsappSubjects = {
  troca_contador: "troca de contador",
  contabilidade_empresas: "contabilidade para empresas",
  solicitar_atendimento: "solicitação de atendimento",
};

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

function pushOptionalLine(lines, label, value) {
  if (clean(value)) {
    lines.push(`<b>${label}:</b> ${escapeHtml(value)}`);
  }
}

function formatTelegramMessage(lead) {
  const title = leadTitles[lead.tipo] || "Novo lead - Nacional Contabilidade";
  const lines = [
    `<b>${title}</b>`,
    "",
    `<b>Nome:</b> ${escapeHtml(lead.nome)}`,
    `<b>WhatsApp:</b> ${escapeHtml(lead.whatsapp)}`,
    `<b>E-mail:</b> ${escapeHtml(lead.email) || "Não informado"}`,
    `<b>Cidade/UF:</b> ${escapeHtml(lead.cidade)}`,
    `<b>Empresa:</b> ${escapeHtml(lead.empresa) || "Não informado"}`,
    `<b>Regime:</b> ${escapeHtml(lead.regime)}`,
    `<b>Segmento:</b> ${escapeHtml(lead.segmento)}`,
    `<b>Faturamento:</b> ${escapeHtml(lead.faturamento)}`,
    `<b>Pendência fiscal:</b> ${escapeHtml(lead.pendencias)}`,
    `<b>Motivo:</b> ${escapeHtml(lead.motivo)}`,
  ];

  pushOptionalLine(lines, "Sócios", lead.socios);
  pushOptionalLine(lines, "CNPJ", lead.cnpj);
  pushOptionalLine(lines, "Atividade", lead.atividade);
  pushOptionalLine(lines, "Área de interesse", lead.interesse);
  pushOptionalLine(lines, "Contador atual", lead.contadorAtual);
  pushOptionalLine(lines, "Urgência", lead.urgencia);
  pushOptionalLine(lines, "Momento de decisão", lead.momento);
  pushOptionalLine(lines, "Notas fiscais", lead.notas);
  pushOptionalLine(lines, "Funcionários", lead.funcionarios);
  pushOptionalLine(lines, "Necessidade", lead.necessidade);

  if (clean(lead.observacao)) {
    lines.push("", `<b>Observação:</b> ${escapeHtml(lead.observacao)}`);
  }

  lines.push("", `<b>Origem:</b> ${escapeHtml(lead.pagina) || "Site"}`);
  return lines.join("\n");
}

function getWhatsappNumber(value) {
  const digits = clean(value).replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  if (digits.startsWith("55") && digits.length >= 12) {
    return digits;
  }

  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  return digits;
}

function buildWhatsappUrl(lead) {
  const number = getWhatsappNumber(lead.whatsapp);

  if (!number) {
    return "";
  }

  const subject = whatsappSubjects[lead.tipo] || "atendimento";
  const message = `Olá, ${clean(lead.nome)}. Recebi seu formulário sobre ${subject} pela Nacional Contabilidade.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function buildTelegramReplyMarkup(lead) {
  const whatsappUrl = buildWhatsappUrl(lead);

  if (!whatsappUrl) {
    return undefined;
  }

  return {
    inline_keyboard: [
      [
        {
          text: "Chamar lead no WhatsApp",
          url: whatsappUrl,
        },
      ],
    ],
  };
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
      reply_markup: buildTelegramReplyMarkup(lead),
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
      tipo: lead.tipo || "troca_contador",
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
    tipo: clean(body.tipo) || "troca_contador",
    nome: clean(body.nome),
    whatsapp: clean(body.whatsapp),
    email: clean(body.email),
    cidade: clean(body.cidade),
    empresa: clean(body.empresa),
    cnpj: clean(body.cnpj),
    atividade: clean(body.atividade),
    regime: clean(body.regime),
    segmento: clean(body.segmento),
    faturamento: clean(body.faturamento),
    motivo: clean(body.motivo),
    interesse: clean(body.interesse),
    contadorAtual: clean(body.contadorAtual),
    urgencia: clean(body.urgencia),
    momento: clean(body.momento),
    pendencias: clean(body.pendencias),
    socios: clean(body.socios),
    notas: clean(body.notas),
    funcionarios: clean(body.funcionarios),
    necessidade: clean(body.necessidade),
    observacao: clean(body.observacao),
    origem: clean(body.origem),
    pagina: clean(body.pagina),
  };

  const requiredFields =
    requiredFieldsByType[lead.tipo] || requiredFieldsByType.troca_contador;
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
