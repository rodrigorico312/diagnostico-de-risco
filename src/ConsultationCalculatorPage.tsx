import { type FormEvent, useRef, useState } from "react";
import { PremiumFooter, PremiumHeader } from "./PremiumSite";
import { usePageSeo } from "./usePageSeo";
import { calculateConsultation, formatPricingMoney, formatPricingRevenue, validatePricingInput } from "./consultation-pricing";
import "./consultation-calculator.css";

export default function ConsultationCalculatorPage() {
  usePageSeo({ path: "/caucu", title: "Calculadora de precificação da consultoria | Nacional Contabilidade", description: "Simule a entrada, as cinco parcelas mensais e o total da consultoria, com percentuais ajustáveis." });
  const [revenue, setRevenue] = useState("");
  const [installmentPercent, setInstallmentPercent] = useState("10");
  const [entryPercent, setEntryPercent] = useState("30");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const resultRef = useRef<HTMLElement>(null);
  const revenueRef = useRef<HTMLInputElement>(null);
  const installmentRef = useRef<HTMLInputElement>(null);
  const entryRef = useRef<HTMLInputElement>(null);
  const errors = {
    revenue: validatePricingInput(revenue, true),
    installment: validatePricingInput(installmentPercent),
    entry: validatePricingInput(entryPercent),
  };
  const result = Object.values(errors).some(Boolean) ? null : calculateConsultation(revenue, installmentPercent, entryPercent);
  const touch = (key: string) => setTouched(previous => ({ ...previous, [key]: true }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setTouched({ revenue: true, installment: true, entry: true });
    if (errors.revenue) revenueRef.current?.focus();
    else if (errors.installment) installmentRef.current?.focus();
    else if (errors.entry) entryRef.current?.focus();
    else resultRef.current?.focus();
  };

  return <div className="nc-site nc-pricing-page">
    <PremiumHeader />
    <main id="conteudo">
      <div className="nc-container nc-pricing-container">
        <div className="nc-pricing-heading">
          <h1>Precificação da <em>consultoria.</em></h1>
          <p>Informe o faturamento mensal e ajuste os percentuais para simular o projeto.</p>
        </div>
        <div className="nc-pricing-layout">
          <form className="nc-pricing-form" onSubmit={submit} noValidate>
            <h2>Valores da simulação</h2>
            <div className="nc-pricing-field">
              <label htmlFor="pricing-revenue">Faturamento mensal (R$)</label>
              <input id="pricing-revenue" ref={revenueRef} type="text" inputMode="decimal" autoComplete="off" spellCheck={false} maxLength={60} placeholder="65.000,00" value={revenue} aria-invalid={touched.revenue && !!errors.revenue} aria-describedby={touched.revenue && errors.revenue ? "pricing-revenue-error" : undefined} onChange={event => setRevenue(event.target.value)} onBlur={() => { touch("revenue"); if (!errors.revenue) setRevenue(formatPricingRevenue(revenue)); }} />
              {touched.revenue && errors.revenue && <p className="nc-pricing-error" id="pricing-revenue-error">{errors.revenue}</p>}
            </div>
            <div className="nc-pricing-field">
              <label htmlFor="pricing-installment">Parcela sobre o faturamento (%)</label>
              <input id="pricing-installment" ref={installmentRef} type="text" inputMode="decimal" autoComplete="off" spellCheck={false} maxLength={60} value={installmentPercent} aria-invalid={touched.installment && !!errors.installment} aria-describedby={touched.installment && errors.installment ? "pricing-installment-error" : undefined} onChange={event => setInstallmentPercent(event.target.value)} onBlur={() => touch("installment")} />
              {touched.installment && errors.installment && <p className="nc-pricing-error" id="pricing-installment-error">{errors.installment}</p>}
            </div>
            <div className="nc-pricing-field">
              <label htmlFor="pricing-entry">Entrada sobre a soma das 5 parcelas (%)</label>
              <input id="pricing-entry" ref={entryRef} type="text" inputMode="decimal" autoComplete="off" spellCheck={false} maxLength={60} value={entryPercent} aria-invalid={touched.entry && !!errors.entry} aria-describedby={touched.entry && errors.entry ? "pricing-entry-error" : undefined} onChange={event => setEntryPercent(event.target.value)} onBlur={() => touch("entry")} />
              {touched.entry && errors.entry && <p className="nc-pricing-error" id="pricing-entry-error">{errors.entry}</p>}
              <div className="nc-pricing-presets" role="group" aria-label="Atalhos do percentual de entrada">
                {["30", "36"].map(value => <button key={value} type="button" aria-pressed={!errors.entry && Number(entryPercent.replace(",", ".").replace("%", "")) === Number(value)} onClick={() => { setEntryPercent(value); touch("entry"); }}>Usar {value}%</button>)}
              </div>
            </div>
            <button className="nc-button" type="submit">Calcular projeto</button>
          </form>
          <section className="nc-pricing-result" ref={resultRef} tabIndex={-1} aria-labelledby="pricing-result-title">
            <h2 id="pricing-result-title">Resumo do projeto</h2>
            <div aria-live="polite" aria-atomic="true">
              {result ? <>
                <dl>
                  <div><dt>Entrada</dt><dd data-pricing="entry">{formatPricingMoney(result.entry)}</dd></div>
                  <div><dt>5 parcelas mensais de</dt><dd data-pricing="installment">{formatPricingMoney(result.installment)}</dd></div>
                  <div className="nc-pricing-subtotal"><dt>Soma das 5 parcelas</dt><dd data-pricing="installments-total">{formatPricingMoney(result.installmentsTotal)}</dd></div>
                  <div className="nc-pricing-total"><dt>Total do projeto</dt><dd data-pricing="total">{formatPricingMoney(result.total)}</dd></div>
                </dl>
                <p className="nc-pricing-schedule">Pagamento: entrada + 5 parcelas mensais.</p>
              </> : <p className="nc-pricing-empty">{Object.keys(touched).length ? "Confira os campos para visualizar o cálculo atualizado." : "Preencha o faturamento para ver a entrada, as parcelas e o total."}</p>}
            </div>
            <p className="nc-pricing-rule">A entrada é calculada sobre a soma das cinco parcelas, não sobre o total do projeto.</p>
          </section>
        </div>
        <p className="nc-pricing-note">Percentuais ajustáveis para a sua simulação. Os valores são calculados nesta página, sem envio ao servidor.</p>
        <noscript><p>Ative o JavaScript do navegador para usar a calculadora.</p></noscript>
      </div>
    </main>
    <PremiumFooter />
  </div>;
}
