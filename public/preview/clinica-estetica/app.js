(() => {
  const endpoint = "/api/calculadora-estetica";
  const inputs = {
    beautyServiceRevenue: document.getElementById("beauty-revenue"),
    healthServiceRevenue: document.getElementById("health-revenue"),
    productRevenue: document.getElementById("product-revenue"),
    productPurchases: document.getElementById("product-purchases"),
    collaboratorPayroll: document.getElementById("payroll"),
  };
  const stateOptions = document.querySelectorAll('input[name="clinic-state"]');
  const cashBasisOptions = document.querySelectorAll('input[name="cash-basis"]');
  const calculateButton = document.getElementById("calculate-button");
  const status = document.getElementById("calculator-status");
  const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const moneyValue = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const moneyTyping = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });
  const percent = new Intl.NumberFormat("pt-BR", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 2 });
  let debounceTimer;
  let activeRequest;

  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  };

  const parseMoney = (rawValue) => {
    let cleaned = String(rawValue || "").replace(/[^\d,.-]/g, "");
    if (!cleaned) return 0;
    if (cleaned.includes(",")) cleaned = cleaned.replace(/\./g, "").replace(",", ".");
    else if (/^\d{1,3}(\.\d{3})+$/.test(cleaned)) cleaned = cleaned.replace(/\./g, "");
    return Number.parseFloat(cleaned);
  };

  const formatWhileTyping = (input) => {
    const raw = input.value;
    const value = raw.includes(",") ? parseMoney(raw) : Number(raw.replace(/\D/g, "").replace(/^0+(?=\d)/, ""));
    if (!Number.isFinite(value)) return;
    input.value = moneyTyping.format(value);
    const end = input.value.length;
    requestAnimationFrame(() => input.setSelectionRange(end, end));
  };

  const formatOnBlur = (input) => {
    const value = parseMoney(input.value);
    if (Number.isFinite(value)) input.value = moneyValue.format(Math.max(0, value));
  };

  const clearResults = () => {
    ["result-factor", "result-prolabore", "result-beauty", "result-health", "result-products", "result-total-das", "result-total-rate", "result-inss", "result-savings", "result-fee", "icms-benefit-status", "icms-benefit-volume", "icms-benefit-value"].forEach((id) => setText(id, "—"));
    setText("result-annex", "—");
    setText("result-summary", "Informe as receitas para visualizar o cenário.");
    document.getElementById("factor-ring").style.setProperty("--ring", "0deg");
  };

  const render = (data) => {
    const factorApplies = Boolean(data.factorR.applies);
    const factor = Number(data.factorR.projected || 0);
    const target = Number(data.factorR.target || 0.28);
    const factorReached = factor >= target - 0.00001;
    const totalRevenue = Number(data.input.monthlyRevenue || 0);
    const totalDas = Number(data.taxes.totalDasWithPlan || 0);
    const totalRate = totalRevenue > 0 ? totalDas / totalRevenue : 0;
    const ringProgress = factorApplies ? Math.min(factor / target, 1) * 360 : 360;

    setText("result-factor", factorApplies ? percent.format(factor) : "N/A");
    setText("factor-title", factorApplies ? "Fator R projetado" : "Fator R não aplicado");
    setText("factor-detail", factorApplies ? "Meta de 28% para a receita de saúde" : "A receita informada não depende desta regra");
    setText("result-annex", factorApplies ? (factorReached ? "Anexo III" : "Anexo V") : "III + I");
    setText("result-prolabore", factorApplies ? money.format(data.factorR.recommendedProLabore) : "Não altera o anexo");
    setText("result-beauty", money.format(data.taxes.annexIII.beautyMonthlyDas));
    setText("rate-beauty", `${percent.format(data.taxes.annexIII.effectiveRate)} de alíquota efetiva`);
    setText("result-health", money.format(data.taxes.annexIII.healthMonthlyDas));
    setText("rate-health", factorApplies ? `${percent.format(data.taxes.annexIII.effectiveRate)} com Fator R` : "sem receita informada");
    setText("result-products", money.format(data.taxes.annexI.monthlyDas));
    setText("rate-products", data.icmsBenefit.eligible
      ? `${percent.format(data.icmsBenefit.effectiveProductRateAfterBenefit)} após isenção do ICMS`
      : `${percent.format(data.taxes.annexI.effectiveRate)} de alíquota efetiva`);
    setText("result-total-das", money.format(totalDas));
    setText("result-total-rate", `${percent.format(totalRate)} sobre o faturamento total informado`);
    setText("result-inss", money.format(data.taxes.inss.monthlyAmount));
    setText("result-savings", money.format(data.taxes.estimatedTaxSavings));
    setText("result-fee", money.format(data.accounting.monthlyServiceFee));
    document.getElementById("factor-ring").style.setProperty("--ring", `${ringProgress}deg`);

    const benefitBox = document.getElementById("icms-benefit-result");
    benefitBox.classList.toggle("is-ineligible", !data.icmsBenefit.eligible);
    setText("icms-benefit-volume", money.format(data.icmsBenefit.projectedCommercialVolume12m));
    setText("icms-benefit-value", money.format(data.icmsBenefit.estimatedMonthlyExemption));

    if (data.icmsBenefit.eligible) {
      setText("icms-benefit-status", "Aplicado");
    } else if (Number(data.input.productRevenue || 0) === 0) {
      setText("icms-benefit-status", "Sem vendas");
    } else if (data.input.state !== "PA") {
      setText("icms-benefit-status", "Fora do Pará");
    } else if (data.input.simplesCashBasis) {
      setText("icms-benefit-status", "Regime de caixa");
    } else if (data.icmsBenefit.projectedCommercialVolume12m > data.icmsBenefit.limit12m) {
      setText("icms-benefit-status", "Acima do limite");
    } else {
      setText("icms-benefit-status", "Não aplicado");
    }

    let summary;
    if (!factorApplies) {
      summary = "Neste cenário, a separação entre serviços estéticos e comércio é o ponto principal.";
    } else if (data.taxes.estimatedNetSavingsAfterInss > 0) {
      summary = `Depois do INSS estimado, o planejamento do Fator R ainda representa ${money.format(data.taxes.estimatedNetSavingsAfterInss)} por mês.`;
    } else {
      summary = "O ganho no DAS não cobre sozinho o INSS estimado. O caso precisa ser analisado antes de definir o pró-labore.";
    }

    if (data.icmsBenefit.eligible) {
      summary += ` A regra paraense retirou mais ${money.format(data.icmsBenefit.estimatedMonthlyExemption)} de ICMS do DAS das vendas.`;
    }
    setText("result-summary", summary);

    status.className = "calculator-status";
    status.textContent = "Estimativa atualizada pelo servidor da Nacional Contabilidade.";
  };

  const simulate = async () => {
    const payload = Object.fromEntries(Object.entries(inputs).map(([key, input]) => [key, parseMoney(input.value)]));
    payload.state = document.getElementById("state-pa").checked ? "PA" : "OTHER";
    payload.simplesCashBasis = document.getElementById("cash-yes").checked;
    const monthlyRevenue = payload.beautyServiceRevenue + payload.healthServiceRevenue + payload.productRevenue;

    if (Object.entries(payload).some(([key, value]) => !["state", "simplesCashBasis"].includes(key) && (!Number.isFinite(value) || value < 0))) {
      clearResults();
      status.className = "calculator-status is-error";
      status.textContent = "Informe apenas valores mensais válidos.";
      return;
    }

    if (monthlyRevenue < 100) {
      clearResults();
      status.className = "calculator-status is-error";
      status.textContent = "O faturamento mensal total deve ser de pelo menos R$ 100,00.";
      return;
    }

    activeRequest?.abort();
    activeRequest = new AbortController();
    calculateButton.disabled = true;
    status.className = "calculator-status";
    status.textContent = "Calculando estimativa...";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: activeRequest.signal,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível calcular.");
      render(data);
    } catch (error) {
      if (error.name === "AbortError") return;
      clearResults();
      status.className = "calculator-status is-error";
      status.textContent = error.message || "A calculadora está temporariamente indisponível.";
    } finally {
      calculateButton.disabled = false;
    }
  };

  const queueSimulation = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(simulate, 360);
  };

  Object.values(inputs).forEach((input) => {
    input.addEventListener("focus", () => {
      const value = parseMoney(input.value);
      if (Number.isFinite(value)) input.value = moneyTyping.format(value);
      input.select();
    });
    input.addEventListener("input", () => {
      formatWhileTyping(input);
      queueSimulation();
    });
    input.addEventListener("blur", () => formatOnBlur(input));
  });

  [...stateOptions, ...cashBasisOptions].forEach((option) => option.addEventListener("change", queueSimulation));

  calculateButton.addEventListener("click", simulate);
  simulate();
})();
