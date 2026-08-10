import { type FormEvent, useRef, useState } from "react";
import { trackLeadEvent } from "./analytics";
import { usePageSeo } from "./usePageSeo";
import "./switch-accountant-page.css";
import "./request-service-page.css";

type RequestForm = {
  nome: string;
  whatsapp: string;
  email: string;
  cidade: string;
  empresa: string;
  cnpj: string;
  atividade: string;
  faturamento: string;
  contadorAtual: string;
  interesse: string;
  motivo: string;
  urgencia: string;
  momento: string;
  observacao: string;
  website: string;
};

const interestOptions = [
  "Trocar de contador",
  "Abrir, alterar ou regularizar empresa",
  "Contabilidade mensal",
  "Problema ou revisão tributária",
  "Notificação ou fiscalização",
  "Organização financeira e resultados",
  "Diagnóstico ou análise",
  "Controles, dados ou automação",
  "Outro",
];

const revenueOptions = [
  "Ainda não fatura",
  "Até R$ 10 mil por mês",
  "De R$ 10 mil a R$ 30 mil por mês",
  "De R$ 30 mil a R$ 80 mil por mês",
  "De R$ 80 mil a R$ 180 mil por mês",
  "Acima de R$ 180 mil por mês",
  "Prefiro não informar agora",
];

const accountantOptions = [
  "Sim, tenho contador atualmente",
  "Não tenho contador",
  "A empresa ainda será aberta",
];

const reasonOptions = [
  "Quero trocar de contador",
  "Quero abrir ou alterar uma empresa",
  "Suspeito que estou pagando imposto incorretamente",
  "Tenho problema, pendência ou dúvida tributária",
  "Recebi notificação ou fiscalização",
  "Não consigo entender lucro ou caixa",
  "Preciso organizar controles e processos",
  "Preciso de dashboard, dados ou automação",
  "Outro motivo",
];

const urgencyOptions = [
  "Existe prazo, bloqueio ou notificação em andamento",
  "Preciso resolver nas próximas semanas",
  "Quero organizar, mas não existe prazo imediato",
  "Ainda estou entendendo a situação",
];

const decisionOptions = [
  "Quero resolver o quanto antes",
  "Pretendo resolver nos próximos 30 dias",
  "Estou avaliando opções",
  "Estou apenas pesquisando",
];

function formatBrazilPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatCnpj(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function getInitialForm(): RequestForm {
  const query = new URLSearchParams(window.location.search);
  const requestedInterest = query.get("interesse") ?? "";
  const selectedInterest = interestOptions.includes(requestedInterest)
    ? requestedInterest
    : "";

  return {
    nome: "",
    whatsapp: "",
    email: "",
    cidade: "",
    empresa: "",
    cnpj: "",
    atividade: "",
    faturamento: "",
    contadorAtual: "",
    interesse: selectedInterest,
    motivo: "",
    urgencia: "",
    momento: "",
    observacao: "",
    website: "",
  };
}

export default function RequestServicePage() {
  const [form, setForm] = useState<RequestForm>(getInitialForm);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [stepError, setStepError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const formStarted = useRef(false);

  usePageSeo({
    title: "Solicitar atendimento | Nacional Contabilidade",
    description:
      "Conte brevemente sobre sua empresa e o que precisa resolver. A Nacional analisa as informações e indica os próximos passos.",
    path: "/solicitar-atendimento",
  });

  const updateField = (field: keyof RequestForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setStepError("");
  };

  const trackStart = () => {
    if (formStarted.current) return;
    formStarted.current = true;
    trackLeadEvent("form_start", { form_id: "solicitar_atendimento" });
  };

  const goToNextStep = () => {
    const firstStepIsValid =
      form.nome.trim() &&
      form.whatsapp.replace(/\D/g, "").length >= 10 &&
      form.email.includes("@") &&
      form.cidade.trim();
    const secondStepIsValid =
      form.empresa.trim() &&
      form.atividade.trim() &&
      form.faturamento &&
      form.contadorAtual &&
      form.interesse;

    if (currentStep === 1 && !firstStepIsValid) {
      setStepError("Preencha nome, WhatsApp, e-mail e cidade para continuar.");
      return;
    }

    if (currentStep === 2 && !secondStepIsValid) {
      setStepError("Complete as informações da empresa para continuar.");
      return;
    }

    setCurrentStep((step) => Math.min(step + 1, 3));
    setStepError("");
  };

  const goToPreviousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 1));
    setStepError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (currentStep < 3) {
      goToNextStep();
      return;
    }

    if (!form.motivo || !form.urgencia || !form.momento || !form.observacao.trim()) {
      setStepError("Conte o motivo, a urgência, o momento de decisão e o que espera resolver.");
      return;
    }

    setSubmitStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/troca-contador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tipo: "solicitar_atendimento",
          origem:
            new URLSearchParams(window.location.search).get("origem") ||
            "Site - Solicitar atendimento",
          pagina: window.location.href,
        }),
      });

      if (!response.ok) throw new Error("Não foi possível enviar sua solicitação.");

      setSubmitStatus("success");
      trackLeadEvent("form_submit", {
        form_id: "solicitar_atendimento",
        interesse: form.interesse,
        momento: form.momento,
      });
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar sua solicitação.",
      );
    }
  };

  return (
    <main className="lead-page approved-switch-page request-service-page">
      <section className="approved-switch-layout" aria-labelledby="request-service-title">
        <div className="approved-switch-intro">
          <a className="approved-switch-logo" href="/" aria-label="Voltar para a Nacional Contabilidade">
            <img src="/nacional-contabilidade-logo-topbar.png" alt="Nacional Contabilidade" />
          </a>

          <div className="approved-switch-copy">
            <p className="request-service-kicker">Solicitar atendimento</p>
            <h1 id="request-service-title">Conte o que sua empresa precisa resolver.</h1>
            <p>
              Analisamos as informações para indicar se conseguimos ajudar, qual
              atendimento faz sentido e os próximos passos.
            </p>
          </div>

          <ul className="approved-switch-assurances" aria-label="Como a solicitação funciona">
            <li><span aria-hidden="true">✓</span> Sem reunião obrigatória</li>
            <li><span aria-hidden="true">✓</span> Análise comercial antes do contato</li>
            <li><span aria-hidden="true">✓</span> Retorno conforme aderência</li>
          </ul>

          <div className="approved-switch-how">
            <p>Como funciona</p>
            <ol>
              <li><span>1</span> Você apresenta o cenário</li>
              <li><span>2</span> A Nacional avalia a aderência</li>
              <li><span>3</span> Indicamos serviço e próximos passos</li>
            </ol>
          </div>
        </div>

        <div className="approved-switch-form-column">
          <form
            className="approved-switch-form"
            onSubmit={handleSubmit}
            onFocusCapture={trackStart}
          >
            <div className="approved-switch-form-header">
              <div>
                <p>Etapa {currentStep} de 3</p>
                <h2>
                  {currentStep === 1 && "Primeiro, seus dados"}
                  {currentStep === 2 && "Agora, a empresa"}
                  {currentStep === 3 && "O que precisa ser resolvido?"}
                </h2>
              </div>
              <span className="approved-switch-time">Leva 3 minutos</span>
            </div>

            <div className="approved-switch-progress" aria-label={`Etapa ${currentStep} de 3`}>
              {[1, 2, 3].map((step) => (
                <span className={step <= currentStep ? "is-active" : ""} key={step} />
              ))}
            </div>

            {submitStatus === "success" ? (
              <div className="approved-switch-success request-service-success" role="status">
                <span aria-hidden="true">✓</span>
                <h3>Solicitação recebida.</h3>
                <p>
                  Vamos analisar as informações para entender se a Nacional consegue
                  ajudar e qual atendimento faz sentido para o cenário apresentado.
                </p>
                <p>
                  Caso exista aderência, retornaremos com o serviço indicado,
                  funcionamento, investimento e próximos passos.
                </p>
                <strong>
                  O envio não representa início de consultoria, diagnóstico ou análise técnica.
                </strong>
              </div>
            ) : (
              <>
                {currentStep === 1 && (
                  <div className="approved-switch-fields">
                    <label><span>Seu nome</span><input autoFocus autoComplete="name" type="text" value={form.nome} onChange={(event) => updateField("nome", event.target.value)} placeholder="Nome completo" /></label>
                    <label><span>WhatsApp</span><input autoComplete="tel-national" inputMode="numeric" type="tel" value={form.whatsapp} onChange={(event) => updateField("whatsapp", formatBrazilPhone(event.target.value))} placeholder="(93) 99999-9999" /></label>
                    <label><span>E-mail</span><input autoComplete="email" type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="voce@empresa.com.br" /></label>
                    <label><span>Cidade/UF</span><input autoComplete="address-level2" type="text" value={form.cidade} onChange={(event) => updateField("cidade", event.target.value)} placeholder="Ex: Santarém/PA" /></label>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="approved-switch-fields">
                    <label><span>Empresa ou projeto</span><input autoFocus type="text" value={form.empresa} onChange={(event) => updateField("empresa", event.target.value)} placeholder="Nome da empresa ou do projeto" /></label>
                    <label><span>CNPJ, se já existir</span><input inputMode="numeric" type="text" value={form.cnpj} onChange={(event) => updateField("cnpj", formatCnpj(event.target.value))} placeholder="00.000.000/0000-00" /></label>
                    <label><span>Atividade principal</span><input type="text" value={form.atividade} onChange={(event) => updateField("atividade", event.target.value)} placeholder="O que a empresa vende ou faz?" /></label>
                    <label><span>Faturamento aproximado</span><select value={form.faturamento} onChange={(event) => updateField("faturamento", event.target.value)}><option value="">Selecione</option>{revenueOptions.map((option) => <option value={option} key={option}>{option}</option>)}</select></label>
                    <label><span>Possui contador atualmente?</span><select value={form.contadorAtual} onChange={(event) => updateField("contadorAtual", event.target.value)}><option value="">Selecione</option>{accountantOptions.map((option) => <option value={option} key={option}>{option}</option>)}</select></label>
                    <label><span>Área de interesse</span><select value={form.interesse} onChange={(event) => updateField("interesse", event.target.value)}><option value="">Selecione</option>{interestOptions.map((option) => <option value={option} key={option}>{option}</option>)}</select></label>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="approved-switch-fields approved-switch-fields--final request-service-final-fields">
                    <label><span>Principal motivo da procura</span><select autoFocus value={form.motivo} onChange={(event) => updateField("motivo", event.target.value)}><option value="">Selecione</option>{reasonOptions.map((option) => <option value={option} key={option}>{option}</option>)}</select></label>
                    <label><span>Existe urgência?</span><select value={form.urgencia} onChange={(event) => updateField("urgencia", event.target.value)}><option value="">Selecione</option>{urgencyOptions.map((option) => <option value={option} key={option}>{option}</option>)}</select></label>
                    <label><span>Em que momento você está?</span><select value={form.momento} onChange={(event) => updateField("momento", event.target.value)}><option value="">Selecione</option>{decisionOptions.map((option) => <option value={option} key={option}>{option}</option>)}</select></label>
                    <label className="request-service-observation"><span>Conte resumidamente o que está acontecendo e o que você espera resolver</span><textarea value={form.observacao} onChange={(event) => updateField("observacao", event.target.value)} placeholder="Descreva o cenário, o problema e o resultado esperado." rows={5} /></label>
                  </div>
                )}

                <label className="approved-switch-honeypot"><span>Site</span><input tabIndex={-1} autoComplete="off" type="text" value={form.website} onChange={(event) => updateField("website", event.target.value)} /></label>

                {stepError && <p className="approved-switch-alert" role="alert">{stepError}</p>}
                {submitStatus === "error" && <p className="approved-switch-alert" role="alert">{errorMessage} Revise os dados e tente novamente.</p>}

                <div className="approved-switch-actions">
                  {currentStep > 1 && <button className="approved-switch-back" type="button" onClick={goToPreviousStep}>Voltar</button>}
                  {currentStep < 3 ? (
                    <button className="approved-switch-next" type="button" onClick={goToNextStep}>Continuar <span aria-hidden="true">→</span></button>
                  ) : (
                    <button className="approved-switch-next" type="submit" disabled={submitStatus === "sending"}>{submitStatus === "sending" ? "Enviando..." : "Enviar solicitação"}</button>
                  )}
                </div>
              </>
            )}

            <p className="approved-switch-privacy">
              Seus dados serão usados somente para avaliar a solicitação e realizar o contato comercial.
            </p>
          </form>

          <a className="request-service-client-link" href="/area-do-cliente">
            Já é cliente? Acesse seus canais de atendimento →
          </a>
        </div>
      </section>
    </main>
  );
}
