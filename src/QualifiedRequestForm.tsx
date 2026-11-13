import { type FormEvent, useEffect, useRef, useState } from "react";
import { formatCnpj, isValidCnpj, normalizeCnpj, pickCompanyRegistry } from "../services/company-registry.mjs";
import { getLeadAttribution, trackLeadEvent } from "./analytics";
import { usePageSeo } from "./usePageSeo";
import { Icon, PremiumFooter, PremiumHeader } from "./PremiumSite";
import "./qualified-request.css";

const options = {
  regime: ["MEI / SIMEI", "Simples Nacional", "Lucro Presumido", "Lucro Real", "Ainda sem CNPJ", "Não sei informar"],
  situacaoCnpj: ["Ativo, sem pendência conhecida", "Ativo, com pendências", "Inapto, suspenso ou baixado", "Ainda sem CNPJ", "Preciso conferir"],
  faturamento: ["Ainda não fatura", "Até R$ 6.750 por mês", "De R$ 6.750 a R$ 10 mil por mês", "De R$ 10 mil a R$ 30 mil por mês", "De R$ 30 mil a R$ 80 mil por mês", "Acima de R$ 80 mil por mês", "Prefiro conversar sobre isso"],
  interesse: ["MEI em crescimento / desenquadramento", "Contabilidade mensal", "Abrir, alterar ou regularizar empresa", "Regularização de CNPJ ou inscrição", "Consultoria financeira e tributária", "Trocar de contador", "Diagnóstico fiscal e cadastral", "Regularização de obrigações", "Notificação ou fiscalização", "Outro"],
  motivo: ["Meu faturamento está crescendo", "Ultrapassei ou posso ultrapassar o limite do MEI", "Quero entender meus impostos", "Preciso organizar o financeiro", "Tenho pendência no CNPJ ou nas obrigações", "Preciso de acompanhamento contábil", "Quero conhecer serviços e preços", "Outro motivo"],
  urgencia: ["Existe prazo, bloqueio ou notificação em andamento", "Preciso resolver nas próximas semanas", "Quero organizar, sem prazo imediato"],
  momento: ["Quero resolver o quanto antes", "Pretendo contratar nos próximos 30 dias", "Estou comparando serviços e preços", "Estou entendendo o que preciso"],
  contadorAtual: ["Não informado", "Sim, tenho contador atualmente", "Não tenho contador", "A empresa ainda será aberta"],
};
type Form = Record<"nome"|"whatsapp"|"email"|"cidade"|"atividade"|"regime"|"situacaoCnpj"|"faturamento"|"empresa"|"cnpj"|"contadorAtual"|"interesse"|"motivo"|"urgencia"|"momento"|"observacao"|"website",string>;
const initial = (): Form => {
  const query = new URLSearchParams(window.location.search), interest = query.get("interesse") || "";
  return { nome:"",whatsapp:"",email:"",cidade:"",atividade:"",regime:"",situacaoCnpj:"",faturamento:"",empresa:"",cnpj:"",contadorAtual:"Não informado",interesse:options.interesse.includes(interest) ? interest : "",motivo:"",urgencia:"",momento:"",observacao:"",website:"" };
};
type CnpjChoice = "informar" | "nao-sei" | "sem-cnpj";
type Company = NonNullable<ReturnType<typeof pickCompanyRegistry>>;
type Lookup = { status: "idle" | "loading" | "success" | "error"; company?: Company };
const stepTitles = ["Primeiro, como falar com você?", "Agora, um pouco da empresa.", "Vamos identificar sua empresa.", "Qual é o seu próximo passo?"];

export default function QualifiedRequestForm() {
  const [form, setForm] = useState<Form>(initial);
  const [step, setStep] = useState(1), [error, setError] = useState("");
  const [status, setStatus] = useState("idle"), [privacy, setPrivacy] = useState(false);
  const [cnpjChoice, setCnpjChoice] = useState<CnpjChoice>("informar");
  const [lookup, setLookup] = useState<Lookup>({ status: "idle" });
  const [confirmed, setConfirmed] = useState(false), [retry, setRetry] = useState(0);
  const started = useRef(false), heading = useRef<HTMLHeadingElement>(null), cnpjInput = useRef<HTMLInputElement>(null);
  const diagnostic = new URLSearchParams(window.location.search).get("diagnostico") === "inicial";
  const cnpj = normalizeCnpj(form.cnpj);
  const company = cnpjChoice === "informar" && lookup.company?.cnpj === cnpj ? lookup.company : undefined;
  const confirmedCompany = confirmed ? company : undefined;
  usePageSeo({ title: "Diagnóstico inicial gratuito | Nacional Contabilidade", description: "Apresente o cenário da sua empresa para uma avaliação inicial gratuita. Atendimento da Nacional em Santarém-PA e para todo o Brasil.", path: "/solicitar-atendimento" });

  useEffect(() => {
    if (step !== 3 || cnpjChoice !== "informar" || !isValidCnpj(cnpj)) return;
    if (lookup.status === "success" && lookup.company?.cnpj === cnpj) return;
    let active = true;
    const controller = new AbortController();
    let timeout: ReturnType<typeof setTimeout>;
    const timer = setTimeout(async () => {
      setLookup({ status: "loading" });
      timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const response = await fetch("/api/consultar-cnpj", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cnpj }), signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok || data.ok !== true || data.empresa?.cnpj !== cnpj || !data.empresa?.razaoSocial) throw new Error("Consulta indisponível");
        if (active) setLookup({ status: "success", company: data.empresa });
      } catch {
        if (active) setLookup({ status: "error" });
      } finally { clearTimeout(timeout); }
    }, 450);
    return () => { active = false; clearTimeout(timer); clearTimeout(timeout); controller.abort(); };
    // Run once per document/retry; a status change must not restart the request.
  }, [cnpj, cnpjChoice, step, retry]);

  const update = (key: keyof Form, value: string) => {
    setForm(current => ({ ...current, [key]: value })); setError("");
    if (key === "cnpj" && normalizeCnpj(value) !== cnpj) { setConfirmed(false); setLookup({ status: "idle" }); }
  };
  const chooseCnpj = (choice: CnpjChoice) => {
    setCnpjChoice(choice); setConfirmed(false); setLookup({ status: "idle" }); setError("");
  };
  const select = (key: keyof typeof options, label: string, required = true) => <label key={key}>{label}<select required={required} value={form[key]} onChange={e => update(key, e.target.value)}>{required && <option value="">Selecione</option>}{options[key].map(o => <option key={o}>{o}</option>)}</select></label>;
  const validate = () => {
    if (step === 1) return form.nome.trim().length >= 2 && /^\d{10,11}$/.test(form.whatsapp.replace(/\D/g, "")) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && form.cidade.trim().length >= 3;
    if (step === 2) return form.atividade.trim() && form.regime && form.situacaoCnpj && form.faturamento;
    if (step === 3) return cnpjChoice !== "informar" || (isValidCnpj(cnpj) && (lookup.status === "error" || confirmedCompany));
    return form.interesse && form.motivo && form.urgencia && form.momento && privacy;
  };
  const go = (next: number) => { setStep(next); setError(""); requestAnimationFrame(() => heading.current?.focus()); };
  const submit = async (event: FormEvent) => {
    event.preventDefault(); if (status === "sending") return;
    if (!validate()) {
      setError(step === 1 ? "Confira nome, WhatsApp com DDD, e-mail e cidade/UF." : step === 2 ? "Preencha as quatro informações sobre a empresa." : step === 3 ? company ? "Confirme se esta é a sua empresa ou corrija o CNPJ." : isValidCnpj(cnpj) ? "Aguarde a consulta ou escolha uma das alternativas ao CNPJ." : "Confira o CNPJ ou marque que não sabe ou ainda não tem." : "Escolha as opções e confirme a ciência sobre o uso dos dados.");
      return;
    }
    if (step < 4) { go(step + 1); return; }
    if (import.meta.env.VITE_PREVIEW_MODE === "true") { setError("Esta é uma prévia de revisão. Nenhuma solicitação foi enviada. O atendimento real continua disponível no site oficial."); return; }
    setStatus("sending"); setError("");
    try {
      const attribution = getLeadAttribution(), query = new URLSearchParams(window.location.search);
      const response = await fetch("/api/troca-contador", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form, cnpj: cnpjChoice === "informar" ? formatCnpj(cnpj) : "",
          empresa: confirmedCompany?.razaoSocial || form.empresa.trim() || "Não informado na triagem",
          cnpjInformacao: cnpjChoice === "informar" ? "Informado" : cnpjChoice === "nao-sei" ? "Não sabe informar" : "Ainda sem CNPJ",
          cnpjConfirmado: confirmedCompany ? "Sim, pelo visitante" : "Não conferido",
          cnpjRazaoSocial: confirmedCompany?.razaoSocial || "", cnpjNomeFantasia: confirmedCompany?.nomeFantasia || "",
          cnpjMunicipioUf: confirmedCompany ? [confirmedCompany.municipio, confirmedCompany.uf].filter(Boolean).join("/") : "",
          cnpjSituacao: confirmedCompany?.situacao || "", cnpjAtividade: confirmedCompany?.atividade || "",
          cnpjConsultaFonte: confirmedCompany ? "BrasilAPI - base pública, sujeita a atualização" : "",
          observacao: form.observacao.trim() || "Sem observações adicionais", tipo: "solicitar_atendimento",
          diagnosticoInicial: diagnostic ? "Sim" : "Não", privacyAcknowledged: "Sim", privacyVersion: "2026-11-13",
          ...attribution, origem: query.get("origem")?.slice(0,120) || "Site - Solicitar atendimento", pagina: `${window.location.origin}${window.location.pathname}`,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.ok !== true) throw new Error("Não foi possível confirmar o recebimento. Tente novamente ou fale pelo WhatsApp.");
      setStatus("success"); trackLeadEvent("form_submit", { form_id: "solicitar_atendimento" }); trackLeadEvent("generate_lead", { method: "form" });
      if (diagnostic) trackLeadEvent("diagnostic_requested", { form_id: "solicitar_atendimento" });
      requestAnimationFrame(() => heading.current?.focus());
    } catch (e) { setStatus("error"); setError(e instanceof Error ? e.message : "Não foi possível enviar a solicitação."); }
  };

  return <div className="nc-site nc-request"><PremiumHeader/><main id="conteudo"><div className="nc-container nc-request-layout">
    <aside><h1>Solicite seu<br/>diagnóstico <em>gratuito.</em></h1><p>Conte um pouco sobre seu negócio. A equipe fará uma avaliação preliminar e indicará o próximo passo.</p><div className="nc-request-scope"><Icon name="shield"/><p>Orientação inicial sobre as informações enviadas. Análises detalhadas e execução têm escopo e contratação próprios.</p></div></aside>
    <form className="nc-request-form" onSubmit={submit} onFocusCapture={() => { if (!started.current) { started.current = true; trackLeadEvent("form_start", { form_id: "solicitar_atendimento" }); } }}>
      <div className="nc-request-progress"><span>ETAPA {step} DE 4</span></div><div className="nc-request-progress-bars" aria-hidden="true">{[1,2,3,4].map(n => <i className={n <= step ? "active" : ""} key={n}/>)}</div>
      <h2 ref={heading} tabIndex={-1}>{status === "success" ? "Solicitação recebida." : stepTitles[step - 1]}</h2>
      {status === "success" ? <div className="nc-request-success" role="status"><Icon name="check"/><p>O recebimento foi confirmado. A equipe vai analisar as informações e entrar em contato para a orientação inicial.</p><p>O envio não inicia serviços pagos. Se houver necessidade de trabalho adicional, você receberá uma proposta antes de contratar.</p><a className="nc-button" href="/">Voltar ao início</a></div> : <>
        <div className="nc-fields">
          {step === 1 && <>
            <label>Seu nome<input autoComplete="name" required maxLength={120} value={form.nome} onChange={e => update("nome", e.target.value)}/></label>
            <label>WhatsApp com DDD<input type="tel" autoComplete="tel-national" inputMode="tel" required placeholder="(93) 99999-9999" maxLength={18} value={form.whatsapp} onChange={e => update("whatsapp", e.target.value.replace(/[^\d ()-]/g, ""))}/></label>
            <label>E-mail<input type="email" autoComplete="email" required maxLength={180} value={form.email} onChange={e => update("email", e.target.value)}/></label>
            <label>Cidade e estado<input autoComplete="address-level2" required placeholder="Ex.: Santarém/PA" maxLength={120} value={form.cidade} onChange={e => update("cidade", e.target.value)}/></label>
          </>}
          {step === 2 && <>
            <label className="nc-full-field">Atividade da empresa<input required placeholder="O que sua empresa vende ou faz?" maxLength={180} value={form.atividade} onChange={e => update("atividade", e.target.value)}/></label>
            {select("regime", "Regime tributário atual")}{select("situacaoCnpj", "Situação do CNPJ")}{select("faturamento", "Faturamento mensal aproximado")}
          </>}
          {step === 3 && <>
            <fieldset className="nc-full-field nc-cnpj-options"><legend>Você sabe o CNPJ?</legend>
              {([["informar", "Sei o CNPJ"], ["nao-sei", "Não sei meu CNPJ"], ["sem-cnpj", "Ainda não tenho CNPJ"]] as const).map(([value, label]) => <label key={value}><input type="radio" name="cnpj-choice" value={value} checked={cnpjChoice === value} onChange={() => chooseCnpj(value)}/><span>{label}</span></label>)}
            </fieldset>
            {cnpjChoice === "informar" && <>
              <label className="nc-full-field">CNPJ da empresa<input ref={cnpjInput} autoCapitalize="characters" spellCheck={false} autoComplete="off" placeholder="00.000.000/0000-00" maxLength={18} value={form.cnpj} onChange={e => update("cnpj", formatCnpj(e.target.value))}/></label>
              <div className="nc-full-field nc-cnpj-feedback" role="status" aria-live="polite">
                {lookup.status === "loading" && <p>Consultando CNPJ…</p>}
                {lookup.status === "error" && <p>Não conseguimos consultar agora. Você pode continuar com o CNPJ informado ou <button type="button" onClick={() => { setLookup({ status: "idle" }); setRetry(n => n + 1); }}>tentar novamente</button>.</p>}
              </div>
              {company && <section className="nc-full-field nc-company-result" aria-label="Empresa encontrada">
                <h3>{confirmed ? "Empresa confirmada" : "É esta a sua empresa?"}</h3>
                <dl>
                  <div className="nc-company-wide"><dt>Nome empresarial</dt><dd className="nc-company-name">{company.razaoSocial}</dd></div>
                  <div className="nc-company-wide"><dt>Nome fantasia</dt><dd>{company.nomeFantasia || "Não informado"}</dd></div>
                  <div><dt>CNPJ</dt><dd className="nc-company-number">{formatCnpj(company.cnpj)}</dd></div>
                  <div><dt>Cidade/UF</dt><dd>{[company.municipio, company.uf].filter(Boolean).join(" / ") || "Não informada"}</dd></div>
                  <div className="nc-company-wide"><dt>Situação cadastral</dt><dd><span className="nc-company-status">{company.situacao || "Não informada"}</span></dd></div>
                  <div className="nc-company-wide"><dt>Atividade principal</dt><dd>{company.atividade || "Não informada"}</dd></div>
                </dl>
                <div className="nc-company-confirm">{!confirmed && <button className="nc-button" type="button" onClick={() => { setConfirmed(true); setError(""); }}>É essa empresa</button>}<button type="button" onClick={() => { update("cnpj", ""); cnpjInput.current?.focus(); }}>Corrigir CNPJ</button></div>
              </section>}
            </>}
            {!confirmedCompany && <label className="nc-full-field">Nome da empresa (opcional)<input autoComplete="organization" maxLength={180} value={form.empresa} onChange={e => update("empresa", e.target.value)}/></label>}
            {select("contadorAtual", "Já tem contador?", false)}
          </>}
          {step === 4 && <>
            {select("interesse", "Serviço que procura")}{select("motivo", "Principal dificuldade")}{select("urgencia", "Urgência")}{select("momento", "Momento de contratação")}
            <label className="nc-full-field">Quer acrescentar algo? (opcional)<textarea rows={3} maxLength={1200} placeholder="Evite senhas, dados bancários ou documentos pessoais." value={form.observacao} onChange={e => update("observacao", e.target.value)}/></label>
          </>}
        </div>
        <div className="nc-honeypot" aria-hidden="true"><label>Site<input tabIndex={-1} autoComplete="off" value={form.website} onChange={e => update("website", e.target.value)}/></label></div>
        {step === 4 && <label className="nc-privacy-ack"><input type="checkbox" required checked={privacy} onChange={e => setPrivacy(e.target.checked)}/><span>Estou ciente de que os dados serão usados para avaliar e responder esta solicitação, conforme a <a href="/politica-de-privacidade" target="_blank" rel="noreferrer">Política de Privacidade</a>.</span></label>}
        {error && <p className="nc-form-error" role="alert">{error}</p>}
        <div className="nc-request-actions">{step > 1 && <button type="button" onClick={() => go(step - 1)} disabled={status === "sending"}>Voltar</button>}<button className="nc-button" type="submit" disabled={status === "sending" || (step === 3 && lookup.status === "loading")}>{status === "sending" ? "Enviando…" : step < 4 ? "Continuar" : diagnostic ? "Solicitar diagnóstico gratuito" : "Enviar solicitação"}</button></div>
        <p className="nc-form-privacy"><Icon name="lock"/> Sem compromisso de contratação.</p>
      </>}
    </form>
  </div><div className="nc-container nc-request-client"><a href="/area-do-cliente">Já é cliente? Acesse sua área de atendimento</a></div></main><PremiumFooter/></div>;
}
