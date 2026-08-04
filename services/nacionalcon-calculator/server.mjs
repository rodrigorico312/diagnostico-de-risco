import http from "node:http";

const PORT = Number(process.env.PORT || 3334);
const HOST = process.env.HOST || "127.0.0.1";
const VERSION = "2026.08.1";

const PARAMETERS = Object.freeze({
  minimumWage: 1621,
  inssCeiling: 8475.55,
  inssRate: 0.11,
  factorRTarget: 0.28,
  simplesAnnualLimit: 4_800_000,
});

const ANNEX_III = Object.freeze([
  { limit: 180_000, nominalRate: 0.06, deduction: 0 },
  { limit: 360_000, nominalRate: 0.112, deduction: 9_360 },
  { limit: 720_000, nominalRate: 0.135, deduction: 17_640 },
  { limit: 1_800_000, nominalRate: 0.16, deduction: 35_640 },
  { limit: 3_600_000, nominalRate: 0.21, deduction: 125_640 },
  { limit: 4_800_000, nominalRate: 0.33, deduction: 648_000 },
]);

const ANNEX_V = Object.freeze([
  { limit: 180_000, nominalRate: 0.155, deduction: 0 },
  { limit: 360_000, nominalRate: 0.18, deduction: 4_500 },
  { limit: 720_000, nominalRate: 0.195, deduction: 9_900 },
  { limit: 1_800_000, nominalRate: 0.205, deduction: 17_100 },
  { limit: 3_600_000, nominalRate: 0.23, deduction: 62_100 },
  { limit: 4_800_000, nominalRate: 0.305, deduction: 540_000 },
]);

const requestBuckets = new Map();

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function calculateEffectiveRate(annualRevenue, annex) {
  const bracketIndex = annex.findIndex((bracket) => annualRevenue <= bracket.limit);
  const index = bracketIndex === -1 ? annex.length - 1 : bracketIndex;
  const bracket = annex[index];
  const effectiveRate = (annualRevenue * bracket.nominalRate - bracket.deduction) / annualRevenue;

  return {
    bracket: index + 1,
    nominalRate: bracket.nominalRate,
    deduction: bracket.deduction,
    effectiveRate,
  };
}

export function calculateMonthlyServiceFee(monthlyRevenue) {
  if (monthlyRevenue <= 5_000) return 487.9;

  let fee;
  if (monthlyRevenue <= 20_000) {
    fee = 487.9 + (monthlyRevenue - 5_000) * 0.02614;
  } else if (monthlyRevenue <= 50_000) {
    fee = 880 + (monthlyRevenue - 20_000) * 0.018;
  } else if (monthlyRevenue <= 100_000) {
    fee = 1_420 + (monthlyRevenue - 50_000) * 0.012;
  } else {
    fee = 2_020 + (monthlyRevenue - 100_000) * 0.008;
  }

  return Math.ceil(fee / 10) * 10;
}

export function calculateSimulation(monthlyRevenue) {
  const annualRevenue = monthlyRevenue * 12;

  if (annualRevenue > PARAMETERS.simplesAnnualLimit) {
    const error = new Error("O faturamento projetado ultrapassa o limite anual do Simples Nacional.");
    error.statusCode = 422;
    error.code = "OUTSIDE_SIMPLES_LIMIT";
    throw error;
  }

  const annexIII = calculateEffectiveRate(annualRevenue, ANNEX_III);
  const annexV = calculateEffectiveRate(annualRevenue, ANNEX_V);
  const recommendedProLabore = Math.max(monthlyRevenue * PARAMETERS.factorRTarget, PARAMETERS.minimumWage);
  const projectedFactorR = recommendedProLabore / monthlyRevenue;
  const inssBase = Math.min(recommendedProLabore, PARAMETERS.inssCeiling);
  const inss = inssBase * PARAMETERS.inssRate;
  const dasAnnexIII = monthlyRevenue * annexIII.effectiveRate;
  const dasAnnexV = monthlyRevenue * annexV.effectiveRate;
  const monthlyServiceFee = calculateMonthlyServiceFee(monthlyRevenue);
  const totalWithFactorR = dasAnnexIII + inss;
  const estimatedSavings = dasAnnexV - totalWithFactorR;

  const warnings = [
    "Esta é uma projeção educativa. A apuração oficial utiliza a receita e a folha acumuladas conforme as regras aplicáveis a cada período.",
    "O IRRF sobre o pró-labore, quando aplicável, não está incluído nesta estimativa.",
  ];

  if (monthlyRevenue < PARAMETERS.minimumWage) {
    warnings.unshift("Neste faturamento, o pró-labore mínimo de referência supera a receita mensal e exige análise individual de viabilidade.");
  }

  return {
    version: VERSION,
    calculatedAt: new Date().toISOString(),
    input: {
      monthlyRevenue: roundMoney(monthlyRevenue),
      projectedAnnualRevenue: roundMoney(annualRevenue),
    },
    factorR: {
      target: PARAMETERS.factorRTarget,
      projected: projectedFactorR,
      recommendedProLabore: roundMoney(recommendedProLabore),
    },
    taxes: {
      annexIII: {
        bracket: annexIII.bracket,
        effectiveRate: annexIII.effectiveRate,
        monthlyDas: roundMoney(dasAnnexIII),
      },
      annexV: {
        bracket: annexV.bracket,
        effectiveRate: annexV.effectiveRate,
        monthlyDas: roundMoney(dasAnnexV),
      },
      inss: {
        rate: PARAMETERS.inssRate,
        contributionBase: roundMoney(inssBase),
        monthlyAmount: roundMoney(inss),
      },
      totalWithFactorR: roundMoney(totalWithFactorR),
      estimatedSavingsAgainstAnnexV: roundMoney(estimatedSavings),
    },
    accounting: {
      monthlyServiceFee: roundMoney(monthlyServiceFee),
      estimatedMonthlyOutlay: roundMoney(totalWithFactorR + monthlyServiceFee),
      scopeNote: "Valor estimado para a operação descrita na página, sujeito à confirmação do volume de documentos, equipe e complexidade.",
    },
    warnings,
  };
}

function json(response, statusCode, payload, extraHeaders = {}) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    ...extraHeaders,
  });
  response.end(JSON.stringify(payload));
}

function isRateLimited(request) {
  const forwarded = request.headers["x-forwarded-for"];
  const ip = String(forwarded || request.socket.remoteAddress || "unknown").split(",")[0].trim();
  const now = Date.now();
  const windowMs = 60_000;
  const current = requestBuckets.get(ip);

  if (!current || now - current.startedAt >= windowMs) {
    requestBuckets.set(ip, { startedAt: now, count: 1 });
    return false;
  }

  current.count += 1;
  return current.count > 60;
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 4_096) {
        const error = new Error("Corpo da requisição muito grande.");
        error.statusCode = 413;
        reject(error);
        request.destroy();
      }
    });

    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        const error = new Error("JSON inválido.");
        error.statusCode = 400;
        reject(error);
      }
    });

    request.on("error", reject);
  });
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

  if (isRateLimited(request)) {
    json(response, 429, { error: "Muitas simulações em pouco tempo. Tente novamente em um minuto." });
    return;
  }

  if (request.method === "GET" && url.pathname === "/health") {
    json(response, 200, { status: "ok", service: "nacionalcon-calculator", version: VERSION });
    return;
  }

  if (request.method !== "POST" || url.pathname !== "/v1/psychology-simulate") {
    json(response, 404, { error: "Rota não encontrada." });
    return;
  }

  try {
    const body = await readJsonBody(request);
    const monthlyRevenue = Number(body.monthlyRevenue);

    if (!Number.isFinite(monthlyRevenue) || monthlyRevenue < 100 || monthlyRevenue > 400_000) {
      json(response, 422, { error: "Informe um faturamento mensal entre R$ 100,00 e R$ 400.000,00." });
      return;
    }

    json(response, 200, calculateSimulation(monthlyRevenue));
  } catch (error) {
    json(response, error.statusCode || 500, {
      error: error.statusCode ? error.message : "Não foi possível concluir a simulação.",
      code: error.code,
    });
  }
});

if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, HOST, () => {
    console.log(`nacionalcon-calculator ${VERSION} listening on http://${HOST}:${PORT}`);
  });
}

function shutdown() {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5_000).unref();
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
