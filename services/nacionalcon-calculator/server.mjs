import http from "node:http";

const PORT = Number(process.env.PORT || 3334);
const HOST = process.env.HOST || "127.0.0.1";
const VERSION = "2026.08.4";

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

const ANNEX_I = Object.freeze([
  { limit: 180_000, nominalRate: 0.04, deduction: 0, icmsShare: 0.34 },
  { limit: 360_000, nominalRate: 0.073, deduction: 5_940, icmsShare: 0.34 },
  { limit: 720_000, nominalRate: 0.095, deduction: 13_860, icmsShare: 0.335 },
  { limit: 1_800_000, nominalRate: 0.107, deduction: 22_500, icmsShare: 0.335 },
  { limit: 3_600_000, nominalRate: 0.143, deduction: 87_300, icmsShare: 0.335 },
  { limit: 4_800_000, nominalRate: 0.19, deduction: 378_000, icmsShare: 0 },
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

export function calculateSimulation(monthlyRevenue, collaboratorPayroll = 0) {
  const annualRevenue = monthlyRevenue * 12;

  if (annualRevenue > PARAMETERS.simplesAnnualLimit) {
    const error = new Error("O faturamento projetado ultrapassa o limite anual do Simples Nacional.");
    error.statusCode = 422;
    error.code = "OUTSIDE_SIMPLES_LIMIT";
    throw error;
  }

  const annexIII = calculateEffectiveRate(annualRevenue, ANNEX_III);
  const annexV = calculateEffectiveRate(annualRevenue, ANNEX_V);
  const targetMonthlyPayroll = monthlyRevenue * PARAMETERS.factorRTarget;
  const remainingPayrollForTarget = Math.max(0, targetMonthlyPayroll - collaboratorPayroll);
  const recommendedProLabore = Math.max(remainingPayrollForTarget, PARAMETERS.minimumWage);
  const totalEligiblePayroll = collaboratorPayroll + recommendedProLabore;
  const projectedFactorR = totalEligiblePayroll / monthlyRevenue;
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

  if (collaboratorPayroll > 0) {
    warnings.push("A folha de colaboradores foi tratada como valor elegível já existente. Encargos e custos trabalhistas adicionais não foram somados à comparação.");
  }

  return {
    version: VERSION,
    calculatedAt: new Date().toISOString(),
    input: {
      monthlyRevenue: roundMoney(monthlyRevenue),
      projectedAnnualRevenue: roundMoney(annualRevenue),
      collaboratorPayroll: roundMoney(collaboratorPayroll),
    },
    factorR: {
      target: PARAMETERS.factorRTarget,
      projected: projectedFactorR,
      recommendedProLabore: roundMoney(recommendedProLabore),
      targetMonthlyPayroll: roundMoney(targetMonthlyPayroll),
      totalEligiblePayroll: roundMoney(totalEligiblePayroll),
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

export function calculateAestheticsSimulation({
  beautyServiceRevenue = 0,
  healthServiceRevenue = 0,
  productRevenue = 0,
  productPurchases = 0,
  collaboratorPayroll = 0,
  state = "PA",
  simplesCashBasis = false,
}) {
  const monthlyRevenue = beautyServiceRevenue + healthServiceRevenue + productRevenue;
  const annualRevenue = monthlyRevenue * 12;

  if (annualRevenue > PARAMETERS.simplesAnnualLimit) {
    const error = new Error("O faturamento projetado ultrapassa o limite anual do Simples Nacional.");
    error.statusCode = 422;
    error.code = "OUTSIDE_SIMPLES_LIMIT";
    throw error;
  }

  const annexI = calculateEffectiveRate(annualRevenue, ANNEX_I);
  const annexIII = calculateEffectiveRate(annualRevenue, ANNEX_III);
  const annexV = calculateEffectiveRate(annualRevenue, ANNEX_V);
  const factorRApplies = healthServiceRevenue > 0;
  const targetMonthlyPayroll = factorRApplies ? monthlyRevenue * PARAMETERS.factorRTarget : 0;
  const payrollGap = factorRApplies ? Math.max(0, targetMonthlyPayroll - collaboratorPayroll) : 0;
  const recommendedProLabore = !factorRApplies || payrollGap === 0 ? 0 : Math.max(payrollGap, PARAMETERS.minimumWage);
  const totalEligiblePayroll = collaboratorPayroll + recommendedProLabore;
  const projectedFactorR = factorRApplies && monthlyRevenue > 0 ? totalEligiblePayroll / monthlyRevenue : 0;
  const inssBase = Math.min(recommendedProLabore, PARAMETERS.inssCeiling);
  const inss = inssBase * PARAMETERS.inssRate;

  const beautyDas = beautyServiceRevenue * annexIII.effectiveRate;
  const productsDasBeforeBenefit = productRevenue * annexI.effectiveRate;
  const annexIBracket = ANNEX_I[annexI.bracket - 1];
  const icmsInsideProductsDas = productsDasBeforeBenefit * annexIBracket.icmsShare;
  const projectedCommercialVolume12m = Math.max(productRevenue, productPurchases) * 12;
  const icmsBenefitEligible = state === "PA"
    && !simplesCashBasis
    && productRevenue > 0
    && projectedCommercialVolume12m <= 120_000
    && annualRevenue <= 3_600_000;
  const estimatedIcmsExemption = icmsBenefitEligible ? icmsInsideProductsDas : 0;
  const productsDas = productsDasBeforeBenefit - estimatedIcmsExemption;
  const healthDasWithFactor = healthServiceRevenue * annexIII.effectiveRate;
  const healthDasWithoutFactor = healthServiceRevenue * annexV.effectiveRate;
  const directTaxes = beautyDas + productsDas;
  const totalDasWithPlan = directTaxes + healthDasWithFactor;
  const totalDasWithoutPlan = directTaxes + healthDasWithoutFactor;
  const estimatedTaxSavings = totalDasWithoutPlan - totalDasWithPlan;
  const estimatedNetSavingsAfterInss = estimatedTaxSavings - inss;
  const monthlyServiceFee = calculateMonthlyServiceFee(monthlyRevenue);

  const warnings = [
    "A simulação pressupõe faturamento constante por 12 meses e serve apenas como referência educativa.",
    "A classificação depende dos procedimentos efetivamente prestados, da habilitação profissional e dos CNAEs da empresa.",
    "Receitas de serviços, procedimentos de saúde e comércio devem ser segregadas corretamente na emissão fiscal e no Simples Nacional.",
  ];

  if (icmsBenefitEligible) {
    warnings.push("Foi aplicada a estimativa da isenção da parcela do ICMS no DAS prevista no art. 230-E do Anexo I do RICMS-PA.");
  } else if (state === "PA" && productRevenue > 0 && projectedCommercialVolume12m > 120_000) {
    warnings.push("A projeção das operações sujeitas ao ICMS ultrapassa R$ 120.000,00 em 12 meses; por isso, a isenção paraense não foi aplicada.");
  } else if (state === "PA" && productRevenue > 0 && simplesCashBasis) {
    warnings.push("A isenção paraense não foi aplicada porque o art. 230-E exclui optantes que apuram o Simples pelo regime de caixa.");
  }

  if (healthServiceRevenue === 0) {
    warnings.push("Sem receita de serviços de saúde sujeita ao Fator R, o pró-labore não altera o anexo usado nesta simulação.");
  }

  if (recommendedProLabore > 0) {
    warnings.push("O IRRF sobre o pró-labore, quando aplicável, não está incluído nesta estimativa.");
  }

  return {
    version: VERSION,
    calculatedAt: new Date().toISOString(),
    input: {
      beautyServiceRevenue: roundMoney(beautyServiceRevenue),
      healthServiceRevenue: roundMoney(healthServiceRevenue),
      productRevenue: roundMoney(productRevenue),
      productPurchases: roundMoney(productPurchases),
      collaboratorPayroll: roundMoney(collaboratorPayroll),
      state,
      simplesCashBasis,
      monthlyRevenue: roundMoney(monthlyRevenue),
      projectedAnnualRevenue: roundMoney(annualRevenue),
    },
    factorR: {
      applies: factorRApplies,
      target: PARAMETERS.factorRTarget,
      projected: projectedFactorR,
      recommendedProLabore: roundMoney(recommendedProLabore),
      targetMonthlyPayroll: roundMoney(targetMonthlyPayroll),
      totalEligiblePayroll: roundMoney(totalEligiblePayroll),
    },
    taxes: {
      annexI: {
        bracket: annexI.bracket,
        effectiveRate: annexI.effectiveRate,
        monthlyDas: roundMoney(productsDas),
        monthlyDasBeforeIcmsBenefit: roundMoney(productsDasBeforeBenefit),
        icmsShare: annexIBracket.icmsShare,
      },
      annexIII: {
        bracket: annexIII.bracket,
        effectiveRate: annexIII.effectiveRate,
        beautyMonthlyDas: roundMoney(beautyDas),
        healthMonthlyDas: roundMoney(healthDasWithFactor),
      },
      annexV: {
        bracket: annexV.bracket,
        effectiveRate: annexV.effectiveRate,
        healthMonthlyDas: roundMoney(healthDasWithoutFactor),
      },
      inss: {
        rate: PARAMETERS.inssRate,
        contributionBase: roundMoney(inssBase),
        monthlyAmount: roundMoney(inss),
      },
      totalDasWithPlan: roundMoney(totalDasWithPlan),
      totalDasWithoutPlan: roundMoney(totalDasWithoutPlan),
      estimatedTaxSavings: roundMoney(estimatedTaxSavings),
      estimatedNetSavingsAfterInss: roundMoney(estimatedNetSavingsAfterInss),
    },
    icmsBenefit: {
      jurisdiction: "PA",
      legalReference: "Art. 230-E do Anexo I do RICMS-PA",
      limit12m: 120_000,
      eligible: icmsBenefitEligible,
      projectedCommercialVolume12m: roundMoney(projectedCommercialVolume12m),
      volumeBasis: productPurchases > productRevenue ? "purchases" : "revenue",
      estimatedMonthlyExemption: roundMoney(estimatedIcmsExemption),
      effectiveProductRateAfterBenefit: productRevenue > 0 ? productsDas / productRevenue : 0,
    },
    accounting: {
      monthlyServiceFee: roundMoney(monthlyServiceFee),
      estimatedMonthlyOutlay: roundMoney(totalDasWithPlan + inss + monthlyServiceFee),
      scopeNote: "Estimativa sujeita à confirmação do volume de documentos, equipe, procedimentos e complexidade sanitária da operação.",
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

  const isPsychologyRoute = url.pathname === "/v1/psychology-simulate";
  const isAestheticsRoute = url.pathname === "/v1/aesthetics-simulate";

  if (request.method !== "POST" || (!isPsychologyRoute && !isAestheticsRoute)) {
    json(response, 404, { error: "Rota não encontrada." });
    return;
  }

  try {
    const body = await readJsonBody(request);

    if (isAestheticsRoute) {
      const beautyServiceRevenue = Number(body.beautyServiceRevenue || 0);
      const healthServiceRevenue = Number(body.healthServiceRevenue || 0);
      const productRevenue = Number(body.productRevenue || 0);
      const productPurchases = Number(body.productPurchases || 0);
      const collaboratorPayroll = Number(body.collaboratorPayroll || 0);
      const state = body.state === "OTHER" ? "OTHER" : "PA";
      const simplesCashBasis = body.simplesCashBasis === true;
      const values = [beautyServiceRevenue, healthServiceRevenue, productRevenue, productPurchases, collaboratorPayroll];
      const monthlyRevenue = beautyServiceRevenue + healthServiceRevenue + productRevenue;

      if (values.some((value) => !Number.isFinite(value) || value < 0 || value > 400_000)) {
        json(response, 422, { error: "Informe valores mensais válidos entre R$ 0,00 e R$ 400.000,00." });
        return;
      }

      if (monthlyRevenue < 100 || monthlyRevenue > 400_000) {
        json(response, 422, { error: "O faturamento mensal total deve ficar entre R$ 100,00 e R$ 400.000,00." });
        return;
      }

      json(response, 200, calculateAestheticsSimulation({
        beautyServiceRevenue,
        healthServiceRevenue,
        productRevenue,
        productPurchases,
        collaboratorPayroll,
        state,
        simplesCashBasis,
      }));
      return;
    }

    const monthlyRevenue = Number(body.monthlyRevenue);
    const collaboratorPayroll = body.collaboratorPayroll == null ? 0 : Number(body.collaboratorPayroll);

    if (!Number.isFinite(monthlyRevenue) || monthlyRevenue < 100 || monthlyRevenue > 400_000) {
      json(response, 422, { error: "Informe um faturamento mensal entre R$ 100,00 e R$ 400.000,00." });
      return;
    }

    if (!Number.isFinite(collaboratorPayroll) || collaboratorPayroll < 0 || collaboratorPayroll > 400_000) {
      json(response, 422, { error: "Informe uma folha mensal de colaboradores entre R$ 0,00 e R$ 400.000,00." });
      return;
    }

    json(response, 200, calculateSimulation(monthlyRevenue, collaboratorPayroll));
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
