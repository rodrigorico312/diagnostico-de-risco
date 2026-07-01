import crypto from "node:crypto";

const DEFAULT_SPREADSHEET_ID = "12lHzel9dKHF6rxpYT_m4OiEEu8PbtJNue_WD4vCpBUs";
const ROW_RANGE = "A1:AC2200";

const TAB_CONFIGS = [
  { sector: "Fiscal", sheet: "ESCRITURAÇÃO", statusCols: [4, 5, 6, 7], collaboratorCol: 2 },
  { sector: "Fiscal", sheet: "CND", statusCols: [2, 3, 4, 5, 6] },
  { sector: "Fiscal", sheet: "ALVARÁ", statusCols: [4, 5, 6] },
  { sector: "Fiscal", sheet: "ESCRITURAÇÃO_SEFA", statusCols: [3, 4, 5, 6, 7, 9], collaboratorCol: 2 },
  { sector: "Fiscal", sheet: "ESCRITURAÇÃO_PREFEITURA", statusCols: [2, 3, 4, 5, 6, 7, 8] },
  { sector: "Fiscal", sheet: "EMISSÃO_PARCELAMENTOS", statusCols: [4, 5] },
  { sector: "Fiscal", sheet: "FISCAL SemMOV", statusCols: [2] },
  { sector: "Fiscal", sheet: "EMISSÃO_NOTAS_FISCAIS", statusCols: [3, 4] },
  { sector: "RH", sheet: "RH SemMOV", statusCols: [2, 4, 5], collaboratorCol: 3 },
  { sector: "RH", sheet: "PRÓ LABORE", statusCols: [3, 4, 5, 6], collaboratorCol: 2 },
  { sector: "RH", sheet: "FUNCIONARIOS", statusCols: [3, 4, 5, 6, 7, 8], collaboratorCol: 2 },
];

const TEAM_MEMBERS = [
  { key: "RODNEI", name: "Rodnei", aliases: ["RODNEI"] },
  { key: "ROGER", name: "Roger", aliases: ["ROGER"] },
  { key: "ROMULO", name: "Romulo", aliases: ["ROMULO"] },
  { key: "GABRIEL", name: "Gabriel", aliases: ["GABRIEL"] },
  { key: "YNAIA", name: "Ynaia", aliases: ["YNAIA"] },
  { key: "LORENZA", name: "Lorenza", aliases: ["LORENZA"] },
  { key: "MARA", name: "Mara", aliases: ["MARA"] },
];

const RANK_TIERS = ["Diamante", "Ouro", "Prata", "Bronze", "Aço", "Ferro", "Plástico"];

const FALLBACK_DATA = {
  live: false,
  source: "snapshot",
  updatedAt: "2026-07-01T00:00:00.000Z",
  note: "Snapshot estático. Configure a integração do Google Sheets para atualização automática.",
  totals: { planned: 3860, completed: 436, pending: 3424, percent: 11 },
  sectors: [
    { name: "Fiscal", planned: 3320, completed: 357, pending: 2963, percent: 11 },
    { name: "RH", planned: 540, completed: 79, pending: 461, percent: 15 },
  ],
  tabs: [
    { sector: "Fiscal", name: "ESCRITURAÇÃO_PREFEITURA", planned: 889, completed: 29, pending: 860, percent: 3, status: "crítico" },
    { sector: "Fiscal", name: "ESCRITURAÇÃO_SEFA", planned: 756, completed: 0, pending: 756, percent: 0, status: "crítico" },
    { sector: "Fiscal", name: "CND", planned: 605, completed: 0, pending: 605, percent: 0, status: "crítico" },
    { sector: "Fiscal", name: "ESCRITURAÇÃO", planned: 552, completed: 0, pending: 552, percent: 0, status: "crítico" },
    { sector: "RH", name: "FUNCIONARIOS", planned: 360, completed: 0, pending: 360, percent: 0, status: "crítico" },
    { sector: "Fiscal", name: "ALVARÁ", planned: 372, completed: 307, pending: 65, percent: 83, status: "avançado" },
    { sector: "RH", name: "RH SemMOV", planned: 120, completed: 79, pending: 41, percent: 66, status: "atenção" },
    { sector: "Fiscal", name: "EMISSÃO_PARCELAMENTOS", planned: 90, completed: 20, pending: 70, percent: 22, status: "baixo avanço" },
  ],
  ranking: [
    { name: "Gabriel", planned: 296, completed: 0, pending: 296, percent: 0, rank: 1, tier: "Diamante" },
    { name: "Lorenza", planned: 140, completed: 0, pending: 140, percent: 0, rank: 2, tier: "Ouro" },
    { name: "Mara", planned: 120, completed: 0, pending: 120, percent: 0, rank: 3, tier: "Prata" },
    { name: "Rodnei", planned: 0, completed: 0, pending: 0, percent: 0, rank: 4, tier: "Bronze" },
    { name: "Roger", planned: 0, completed: 0, pending: 0, percent: 0, rank: 5, tier: "Aço" },
    { name: "Romulo", planned: 0, completed: 0, pending: 0, percent: 0, rank: 6, tier: "Ferro" },
    { name: "Ynaia", planned: 0, completed: 0, pending: 0, percent: 0, rank: 7, tier: "Plástico" },
  ],
};

const BLOCKED_COLLABORATOR_NAMES = new Set([
  "NAO",
  "NAO EMITIR",
  "N",
  "SIM",
  "S",
  "ATIVO",
  "INATIVO",
  "COMERCIO",
  "SERVICO",
  "COMERCIO/SERVICO",
  "ESCRITORIO",
  "VERIFICAR",
  "FEITO",
  "ENCERRADO",
  "COLABO",
  "COLABORADOR",
  "SIMPLES NACIONAL",
  "LUCRO PRESUMIDO",
]);

function clean(value) {
  return String(value ?? "").replace(/\u00a0/g, " ").trim();
}

function normalizeName(value) {
  return clean(value)
    .replace(/[💙]/g, "")
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function searchableName(value) {
  return normalizeName(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function collaboratorTokens(value) {
  return searchableName(value)
    .split(/[^A-Z]+/)
    .filter(Boolean);
}

function canonicalCollaborator(value) {
  const name = searchableName(value);

  if (!name || name.includes("SEM COLABORADOR")) return null;
  if (BLOCKED_COLLABORATOR_NAMES.has(name)) return null;
  if (/[0-9#@]/.test(name)) return null;

  const tokens = collaboratorTokens(value);
  return TEAM_MEMBERS.find((member) => member.aliases.some((alias) => tokens.includes(alias))) || null;
}

function emptyCollaborator(member, teamOrder) {
  return {
    key: member.key,
    name: member.name,
    planned: 0,
    completed: 0,
    pending: 0,
    percent: 0,
    teamOrder,
  };
}

function percent(completed, planned) {
  return planned ? Math.round((completed / planned) * 100) : 0;
}

function statusLabel(tabPercent) {
  if (tabPercent >= 75) return "avançado";
  if (tabPercent >= 40) return "atenção";
  if (tabPercent > 0) return "baixo avanço";
  return "crítico";
}

function getRows(values = []) {
  return values.slice(1).filter((row) => clean(row?.[0]));
}

function countCompleted(row, statusCols) {
  return statusCols.reduce((total, col) => total + (clean(row[col - 1]) ? 1 : 0), 0);
}

function summarizeTab(config, values, collaborators) {
  const rows = getRows(values);
  let completed = 0;

  rows.forEach((row) => {
    const rowCompleted = countCompleted(row, config.statusCols);
    completed += rowCompleted;

    if (!config.collaboratorCol) return;

    const member = canonicalCollaborator(row[config.collaboratorCol - 1]);

    if (!member) return;

    const current = collaborators.get(member.key) || emptyCollaborator(member, TEAM_MEMBERS.findIndex((item) => item.key === member.key));

    current.planned += config.statusCols.length;
    current.completed += rowCompleted;
    collaborators.set(member.key, current);
  });

  const planned = rows.length * config.statusCols.length;
  const tabPercent = percent(completed, planned);

  return {
    sector: config.sector,
    name: config.sheet,
    planned,
    completed,
    pending: Math.max(planned - completed, 0),
    percent: tabPercent,
    status: statusLabel(tabPercent),
  };
}

function buildDashboard(valuesBySheet, source) {
  const collaborators = new Map(TEAM_MEMBERS.map((member, index) => [member.key, emptyCollaborator(member, index)]));
  const tabs = TAB_CONFIGS.map((config) =>
    summarizeTab(config, valuesBySheet[config.sheet] || [], collaborators),
  );

  const sectorNames = ["Fiscal", "RH"];
  const sectors = sectorNames.map((name) => {
    const sectorTabs = tabs.filter((tab) => tab.sector === name);
    const planned = sectorTabs.reduce((sum, tab) => sum + tab.planned, 0);
    const completed = sectorTabs.reduce((sum, tab) => sum + tab.completed, 0);
    return {
      name,
      planned,
      completed,
      pending: Math.max(planned - completed, 0),
      percent: percent(completed, planned),
    };
  });

  const planned = sectors.reduce((sum, sector) => sum + sector.planned, 0);
  const completed = sectors.reduce((sum, sector) => sum + sector.completed, 0);

  const ranking = Array.from(collaborators.values())
    .map((item) => ({
      ...item,
      pending: Math.max(item.planned - item.completed, 0),
      percent: percent(item.completed, item.planned),
    }))
    .sort((a, b) => b.percent - a.percent || b.completed - a.completed || b.planned - a.planned || a.teamOrder - b.teamOrder)
    .map((item, index) => ({
      name: item.name,
      planned: item.planned,
      completed: item.completed,
      pending: item.pending,
      percent: item.percent,
      rank: index + 1,
      tier: RANK_TIERS[index] || "Base",
    }));

  return {
    live: true,
    source,
    updatedAt: new Date().toISOString(),
    totals: {
      planned,
      completed,
      pending: Math.max(planned - completed, 0),
      percent: percent(completed, planned),
    },
    sectors,
    tabs: tabs.sort((a, b) => b.pending - a.pending),
    ranking,
  };
}

function base64Url(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function getPrivateKey() {
  const key = process.env.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  return key ? key.replace(/\\n/g, "\n") : "";
}

async function getGoogleAccessToken() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = getPrivateKey();

  if (!email || !privateKey) {
    return "";
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64Url(
    JSON.stringify({
      iss: email,
      scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    }),
  );

  const signatureInput = `${header}.${claim}`;
  const signature = crypto
    .createSign("RSA-SHA256")
    .update(signatureInput)
    .sign(privateKey, "base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${signatureInput}.${signature}`,
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error(`Google OAuth falhou: ${await tokenResponse.text()}`);
  }

  const token = await tokenResponse.json();
  return token.access_token;
}

function quoteSheet(sheet) {
  return `'${sheet.replace(/'/g, "''")}'!${ROW_RANGE}`;
}

async function fetchWithServiceAccount() {
  const accessToken = await getGoogleAccessToken();

  if (!accessToken) {
    return null;
  }

  const spreadsheetId = process.env.DASHBOARD_SPREADSHEET_ID || DEFAULT_SPREADSHEET_ID;
  const params = new URLSearchParams({
    majorDimension: "ROWS",
    valueRenderOption: "FORMATTED_VALUE",
  });

  TAB_CONFIGS.forEach((config) => params.append("ranges", quoteSheet(config.sheet)));

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  if (!response.ok) {
    throw new Error(`Google Sheets falhou: ${await response.text()}`);
  }

  const payload = await response.json();
  const valuesBySheet = {};

  payload.valueRanges.forEach((range, index) => {
    valuesBySheet[TAB_CONFIGS[index].sheet] = range.values || [];
  });

  return buildDashboard(valuesBySheet, "google-service-account");
}

async function fetchWithBridge() {
  const bridgeUrl = process.env.DASHBOARD_SHEETS_WEBAPP_URL;

  if (!bridgeUrl) {
    return null;
  }

  const url = new URL(bridgeUrl);
  const secret = process.env.DASHBOARD_SHEETS_WEBAPP_SECRET;

  if (secret) {
    url.searchParams.set("secret", secret);
  }

  const response = await fetch(url, { headers: { Accept: "application/json" } });

  if (!response.ok) {
    throw new Error(`Bridge Sheets falhou: ${await response.text()}`);
  }

  const payload = await response.json();

  if (payload?.totals && payload?.tabs) {
    return {
      ...payload,
      live: true,
      source: payload.source || "google-apps-script",
      updatedAt: payload.updatedAt || new Date().toISOString(),
    };
  }

  if (payload?.valuesBySheet) {
    return buildDashboard(payload.valuesBySheet, "google-apps-script");
  }

  throw new Error("Bridge Sheets retornou JSON sem totais nem valuesBySheet.");
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ ok: false, error: "Método não permitido" });
  }

  response.setHeader("Cache-Control", "s-maxage=2, stale-while-revalidate=8");

  try {
    const bridgeData = await fetchWithBridge();
    const data = bridgeData || (await fetchWithServiceAccount()) || FALLBACK_DATA;

    return response.status(200).json({
      ok: true,
      ...data,
      configured: Boolean(bridgeData || data.source === "google-service-account"),
    });
  } catch (error) {
    return response.status(200).json({
      ok: true,
      ...FALLBACK_DATA,
      configured: false,
      error: error.message,
    });
  }
}
