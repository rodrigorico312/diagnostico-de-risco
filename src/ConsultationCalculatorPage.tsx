import { type ChangeEvent, type ClipboardEvent, useState } from "react";
import { PremiumFooter, PremiumHeader } from "./PremiumSite";
import { usePageSeo } from "./usePageSeo";
import { CONSULTATION_PRESETS, calculateConsultation, formatPricingMoney, formatPricingRevenue, formatPricingRevenueInput, validatePricingInput } from "./consultation-pricing";
import "./consultation-calculator.css";

export default function ConsultationCalculatorPage() {
  usePageSeo({ path: "/caucu", title: "Calculadora de precificação da consultoria | Nacional Contabilidade", description: "Simule a entrada, as cinco parcelas mensais e o total da consultoria, com percentuais ajustáveis." });
  const [revenue, setRevenue] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [installmentPercent, setInstallmentPercent] = useState<string>(CONSULTATION_PRESETS[0].installmentPercent);
  const [entryPercent, setEntryPercent] = useState("30");
  const [selectedPreset, setSelectedPreset] = useState<string | null>("baixa");
  const [highRates, setHighRates] = useState({ installmentPercent: "", entryPercent: "30" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const errors = {
    revenue: validatePricingInput(revenue, true),
    installment: validatePricingInput(installmentPercent),
    entry: validatePricingInput(entryPercent),
  };
  const result = Object.values(errors).some(Boolean) ? null : calculateConsultation(revenue, installmentPercent, entryPercent);
  const touch = (key: string) => setTouched(previous => ({ ...previous, [key]: true }));
  const choosePreset = (preset: typeof CONSULTATION_PRESETS[number]) => {
    const rates = preset.id === "alta" ? highRates : preset;
    setSelectedPreset(preset.id);
    setInstallmentPercent(rates.installmentPercent);
    setEntryPercent(rates.entryPercent);
    setTouched(previous => ({ revenue: previous.revenue }));
  };
  const editRate = (key: "installmentPercent" | "entryPercent", value: string) => {
    if (key === "installmentPercent") setInstallmentPercent(value);
    else setEntryPercent(value);
    if (selectedPreset === "alta") setHighRates(previous => ({ ...previous, [key]: value }));
    else setSelectedPreset(null);
  };
  const editRevenue = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const raw = input.value;
    const caret = input.selectionStart;
    const digitsOnRight = raw.slice(caret ?? raw.length).replace(/\D/g, "").length;
    const formatted = formatPricingRevenueInput(raw);
    setRevenue(formatted);
    // Keep the editing position when inserting or deleting in the middle of the amount.
    if (caret !== null && formatted !== raw) requestAnimationFrame(() => {
      if (document.activeElement !== input) return;
      let position = formatted.length, remaining = digitsOnRight;
      while (position > 0 && remaining > 0) {
        position--;
        if (/\d/.test(formatted[position])) remaining--;
      }
      input.setSelectionRange(position, position);
    });
  };
  const pasteRevenue = (event: ClipboardEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    if (input.selectionStart !== 0 || input.selectionEnd !== input.value.length) return;
    const raw = event.clipboardData.getData("text");
    event.preventDefault();
    // A complete pasted amount is expressed in reais, including unformatted numbers.
    setRevenue(validatePricingInput(raw, true) ? raw : `R$ ${formatPricingRevenue(raw)}`);
    touch("revenue");
  };

  return <div className="nc-site nc-pricing-page">
    <PremiumHeader />
    <main id="conteudo">
      <div className="nc-container nc-pricing-container">
        <div className="nc-pricing-heading">
          <h1>Precificação da <em>consultoria.</em></h1>
          <p>Informe o faturamento e escolha uma opção. O resultado é atualizado automaticamente.</p>
        </div>
        <fieldset className="nc-pricing-tiers">
          <legend>Opções de precificação</legend>
          {CONSULTATION_PRESETS.map(preset => <label key={preset.id}>
            <input type="radio" name="pricing-tier" value={preset.id} checked={selectedPreset === preset.id} onChange={() => choosePreset(preset)} />
            <span>{preset.label}</span>
          </label>)}
        </fieldset>
        <div className="nc-pricing-layout">
          <section className="nc-pricing-form" aria-labelledby="pricing-values-title">
            <h2 id="pricing-values-title">Valores da simulação</h2>
            <div className="nc-pricing-field">
              <label htmlFor="pricing-client-company">Empresa cliente (opcional)</label>
              <input id="pricing-client-company" type="text" autoComplete="off" maxLength={160} placeholder="Nome da empresa" value={clientCompany} onChange={event => setClientCompany(event.target.value)} />
            </div>
            <div className="nc-pricing-field">
              <label htmlFor="pricing-revenue">Faturamento mensal (R$)</label>
              <input id="pricing-revenue" type="text" inputMode="numeric" autoComplete="off" spellCheck={false} maxLength={60} placeholder="R$ 0,00" value={revenue} aria-invalid={touched.revenue && !!errors.revenue} aria-describedby={`pricing-revenue-hint${touched.revenue && errors.revenue ? " pricing-revenue-error" : ""}`} onChange={editRevenue} onPaste={pasteRevenue} onBlur={() => touch("revenue")} />
              <p className="nc-pricing-hint" id="pricing-revenue-hint">Os dois últimos dígitos são os centavos.</p>
              {touched.revenue && errors.revenue && <p className="nc-pricing-error" id="pricing-revenue-error">{errors.revenue}</p>}
            </div>
            <div className="nc-pricing-field">
              <label htmlFor="pricing-installment">Parcela sobre o faturamento (%)</label>
              <input id="pricing-installment" type="text" inputMode="decimal" autoComplete="off" spellCheck={false} maxLength={60} placeholder={selectedPreset === "alta" ? "Defina o percentual da opção alta" : undefined} value={installmentPercent} aria-invalid={touched.installment && !!errors.installment} aria-describedby={touched.installment && errors.installment ? "pricing-installment-error" : undefined} onChange={event => editRate("installmentPercent", event.target.value)} onBlur={() => touch("installment")} />
              {touched.installment && errors.installment && <p className="nc-pricing-error" id="pricing-installment-error">{errors.installment}</p>}
            </div>
            <div className="nc-pricing-field">
              <label htmlFor="pricing-entry">Entrada sobre a soma das 5 parcelas (%)</label>
              <input id="pricing-entry" type="text" inputMode="decimal" autoComplete="off" spellCheck={false} maxLength={60} value={entryPercent} aria-invalid={touched.entry && !!errors.entry} aria-describedby={touched.entry && errors.entry ? "pricing-entry-error" : undefined} onChange={event => editRate("entryPercent", event.target.value)} onBlur={() => touch("entry")} />
              {touched.entry && errors.entry && <p className="nc-pricing-error" id="pricing-entry-error">{errors.entry}</p>}
            </div>
          </section>
          <section className="nc-pricing-result" aria-labelledby="pricing-result-title">
            <h2 id="pricing-result-title">Resumo do projeto</h2>
            {clientCompany.trim() && <p className="nc-pricing-client">{clientCompany.trim()}</p>}
            <div aria-live="polite" aria-atomic="true">
              {result ? <>
                <dl>
                  <div><dt>Entrada</dt><dd data-pricing="entry">{formatPricingMoney(result.entry)}</dd></div>
                  <div><dt>5 parcelas mensais de</dt><dd data-pricing="installment">{formatPricingMoney(result.installment)}</dd></div>
                  <div className="nc-pricing-subtotal"><dt>Soma das 5 parcelas</dt><dd data-pricing="installments-total">{formatPricingMoney(result.installmentsTotal)}</dd></div>
                  <div className="nc-pricing-total"><dt>Total do projeto</dt><dd data-pricing="total">{formatPricingMoney(result.total)}</dd></div>
                </dl>
                <p className="nc-pricing-schedule">Pagamento: entrada + 5 parcelas mensais.</p>
              </> : <p className="nc-pricing-empty">{selectedPreset === "alta" && !installmentPercent ? "Defina o percentual da parcela para simular a opção alta." : Object.keys(touched).length ? "Confira os campos para visualizar o cálculo atualizado." : "Preencha o faturamento para ver a entrada, as parcelas e o total."}</p>}
            </div>
          </section>
        </div>
        <p className="nc-pricing-note">Percentuais ajustáveis para a sua simulação. Os valores são calculados nesta página, sem envio ao servidor.</p>
        <noscript><p>Ative o JavaScript do navegador para usar a calculadora.</p></noscript>
      </div>
    </main>
    <PremiumFooter />
  </div>;
}
