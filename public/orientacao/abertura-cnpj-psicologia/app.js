(() => {
  const endpoint = "/api/calculadora-psicologia";
  const revenueInput = document.getElementById("monthly-revenue");
  const payrollInput = document.getElementById("employee-payroll");
  const payrollWrap = document.getElementById("employee-payroll-wrap");
  const employeeOptions = document.querySelectorAll('input[name="has-employees"]');
  const calculateButton = document.getElementById("calculate-button");
  const status = document.getElementById("calculator-status");
  const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const moneyValue = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const moneyTyping = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });
  const percent = new Intl.NumberFormat("pt-BR", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 });
  let debounceTimer;
  let activeRequest;

  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  };

  const hasEmployees = () => document.getElementById("employees-yes").checked;

  const parseMoney = (rawValue) => {
    let cleaned = String(rawValue || "").replace(/[^\d,.-]/g, "");
    if (!cleaned) return 0;
    if (cleaned.includes(",")) cleaned = cleaned.replace(/\./g, "").replace(",", ".");
    else if (/^\d{1,3}(\.\d{3})+$/.test(cleaned)) cleaned = cleaned.replace(/\./g, "");
    return Number.parseFloat(cleaned);
  };

  const formatWhileTyping = (input) => {
    const raw = input.value;
    const value = raw.includes(",")
      ? parseMoney(raw)
      : Number(raw.replace(/\D/g, "").replace(/^0+(?=\d)/, ""));

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
    [
      "result-factor",
      "result-prolabore",
      "result-das-iii",
      "result-rate-iii",
      "result-inss",
      "result-savings",
      "result-fee",
      "comparison-factor",
      "comparison-no-factor",
    ].forEach((id) => setText(id, "—"));
    setText("result-annex", "—");
    setText("result-summary", "Informe seus dados para comparar os cenários.");
    document.getElementById("factor-ring").style.setProperty("--ring", "0deg");
    document.getElementById("bar-factor").style.width = "0";
    document.getElementById("bar-no-factor").style.width = "0";
  };

  const render = (data) => {
    const factor = Number(data.factorR.projected || 0);
    const target = Number(data.factorR.target || 0.28);
    const reachedTarget = factor >= target - 0.00001;
    const annex = reachedTarget ? data.taxes.annexIII : data.taxes.annexV;
    const withFactor = Number(data.taxes.totalWithFactorR || annex.monthlyDas || 0);
    const withoutFactor = Number(data.taxes.annexV.monthlyDas || 0);
    const savings = Number(data.taxes.estimatedSavingsAgainstAnnexV || 0);
    const maxComparison = Math.max(withFactor, withoutFactor, 1);
    const ringProgress = Math.min(factor / target, 1) * 360;
    const payroll = Number(data.input.collaboratorPayroll || 0);

    setText("result-factor", percent.format(factor));
    setText("factor-detail", payroll > 0 ? `${money.format(payroll)} de folha de colaboradores considerada` : "Meta mínima de 28%");
    setText("result-annex", reachedTarget ? "Anexo III" : "Anexo V");
    setText("result-prolabore", money.format(data.factorR.recommendedProLabore));
    setText("result-das-iii", money.format(annex.monthlyDas));
    setText("result-rate-iii", `${percent.format(annex.effectiveRate)} de alíquota efetiva`);
    setText("result-inss", money.format(data.taxes.inss.monthlyAmount));
    setText("result-savings", money.format(Math.abs(savings)));
    setText("result-fee", money.format(data.accounting.monthlyServiceFee));
    setText("comparison-factor", money.format(withFactor));
    setText("comparison-no-factor", money.format(withoutFactor));

    document.getElementById("factor-ring").style.setProperty("--ring", `${ringProgress}deg`);
    document.getElementById("bar-factor").style.width = `${Math.max(5, (withFactor / maxComparison) * 100)}%`;
    document.getElementById("bar-no-factor").style.width = `${Math.max(5, (withoutFactor / maxComparison) * 100)}%`;

    if (savings > 0) {
      setText("result-summary", `Economia tributária estimada de ${money.format(savings)} por mês com o Fator R.`);
    } else if (savings < 0) {
      setText("result-summary", `Neste cenário, o custo com pró-labore supera a diferença estimada de DAS em ${money.format(Math.abs(savings))}.`);
    } else {
      setText("result-summary", "Os dois cenários apresentam o mesmo custo tributário estimado.");
    }

    status.className = "calculator-status";
    status.textContent = "Estimativa atualizada pelo servidor da Nacional Contabilidade.";
  };

  const simulate = async () => {
    const monthlyRevenue = parseMoney(revenueInput.value);
    const collaboratorPayroll = hasEmployees() ? parseMoney(payrollInput.value) : 0;

    if (!Number.isFinite(monthlyRevenue) || monthlyRevenue < 100) {
      clearResults();
      status.className = "calculator-status is-error";
      status.textContent = "Informe um faturamento mensal a partir de R$ 100,00.";
      return;
    }

    if (!Number.isFinite(collaboratorPayroll) || collaboratorPayroll < 0) {
      clearResults();
      status.className = "calculator-status is-error";
      status.textContent = "Informe uma folha de colaboradores válida.";
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
        body: JSON.stringify({ monthlyRevenue, collaboratorPayroll }),
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

  [revenueInput, payrollInput].forEach((input) => {
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

  employeeOptions.forEach((option) => {
    option.addEventListener("change", () => {
      payrollWrap.classList.toggle("is-hidden", !hasEmployees());
      payrollWrap.setAttribute("aria-hidden", String(!hasEmployees()));
      if (hasEmployees()) {
        requestAnimationFrame(() => payrollInput.focus({ preventScroll: true }));
      } else {
        payrollInput.value = "0,00";
      }
      queueSimulation();
    });
  });

  calculateButton.addEventListener("click", simulate);
  simulate();
})();
