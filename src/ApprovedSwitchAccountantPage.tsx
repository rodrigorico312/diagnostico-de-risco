import { type FormEvent, useEffect, useRef, useState } from "react";
import { trackLeadEvent } from "./analytics";
import "./switch-accountant-page.css";

type FormData = {
  nome: string;
  whatsapp: string;
  cidade: string;
  empresa: string;
  regime: string;
  segmento: string;
  faturamento: string;
  motivo: string;
  pendencias: string;
  socios: string;
  notas: string;
  funcionarios: string;
  necessidade: string;
  observacao: string;
  website: string;
};

const initialForm: FormData = {
  nome: "",
  whatsapp: "",
  cidade: "",
  empresa: "",
  regime: "",
  segmento: "",
  faturamento: "",
  motivo: "",
  pendencias: "",
  socios: "",
  notas: "",
  funcionarios: "",
  necessidade: "",
  observacao: "",
  website: "",
};

const taxRegimeOptions = [
  "MEI",
  "Simples Nacional",
  "Lucro Presumido",
  "Lucro Real",
  "Não sei informar",
];

const segmentOptions = [
  "Comércio",
  "Prestação de serviços",
  "Alimentação",
  "Saúde, estética ou bem-estar",
  "Construção ou obras",
  "Transporte ou logística",
  "Negócio digital",
  "Outro segmento",
];

const revenueOptions = [
  "Até R$ 10 mil por mês",
  "De R$ 10 mil a R$ 30 mil por mês",
  "De R$ 30 mil a R$ 80 mil por mês",
  "De R$ 80 mil a R$ 180 mil por mês",
  "Acima de R$ 180 mil por mês",
  "Prefiro falar no atendimento",
];

const switchReasonOptions = [
  "Quero mais retorno e acompanhamento",
  "Tenho pendências ou documentos atrasados",
  "A empresa cresceu e preciso organizar melhor",
  "Tenho dificuldade para falar com o contador atual",
  "Quero revisar impostos, notas ou obrigações",
  "Outro motivo",
];

const pendingOptions = ["Sim", "Não", "Não sei"];

function formatBrazilPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function ApprovedSwitchAccountantPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [stepError, setStepError] = useState("");
  const formStarted = useRef(false);

  useEffect(() => {
    document.title = "Trocar de contador | Nacional Contabilidade";
  }, []);

  const updateField = (field: keyof FormData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setStepError("");
  };

  const trackStart = () => {
    if (formStarted.current) return;
    formStarted.current = true;
    trackLeadEvent("form_start", { form_id: "trocar_contador" });
  };

  const goToNextStep = () => {
    const firstStepIsValid =
      form.nome.trim() &&
      form.whatsapp.replace(/\D/g, "").length >= 10 &&
      form.cidade.trim();
    const secondStepIsValid =
      form.regime && form.segmento && form.faturamento && form.pendencias;

    if (currentStep === 1 && !firstStepIsValid) {
      setStepError("Preencha nome, WhatsApp e cidade para continuar.");
      return;
    }

    if (currentStep === 2 && !secondStepIsValid) {
      setStepError("Selecione todas as informações desta etapa.");
      return;
    }

    setStepError("");
    setCurrentStep((step) => Math.min(step + 1, 3));
  };

  const goToPreviousStep = () => {
    setStepError("");
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (currentStep < 3) {
      goToNextStep();
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
          origem: "Formulario troca de contador",
          pagina: window.location.href,
        }),
      });

      if (!response.ok) {
        throw new Error("Não foi possível enviar o formulário.");
      }

      setSubmitStatus("success");
      trackLeadEvent("form_submit", { form_id: "trocar_contador" });
      setForm(initialForm);
      setCurrentStep(3);
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar o formulário.",
      );
    }
  };

  return (
    <main className="lead-page approved-switch-page">
      <section className="approved-switch-layout" aria-labelledby="troca-contador-title">
        <div className="approved-switch-intro">
          <a
            className="approved-switch-logo"
            href="/links"
            aria-label="Voltar para os links da Nacional"
          >
            <img
              src="/nacional-contabilidade-logo-topbar.png"
              alt="Nacional Contabilidade"
            />
          </a>

          <div className="approved-switch-copy">
            <h1 id="troca-contador-title">
              Troque de contador sem parar a rotina da sua empresa.
            </h1>
            <p>
              Conte o que está acontecendo. A Nacional analisa as informações
              para verificar a aderência e orientar os próximos passos comerciais.
            </p>
          </div>

          <ul className="approved-switch-assurances" aria-label="Diferenciais do atendimento">
            <li><span aria-hidden="true">✓</span> Atendimento humano</li>
            <li><span aria-hidden="true">✓</span> Pará e todo o Brasil</li>
            <li><span aria-hidden="true">✓</span> Análise comercial da solicitação</li>
          </ul>

          <div className="approved-switch-how">
            <p>Como funciona</p>
            <ol>
              <li><span>1</span> Você conta a situação</li>
              <li><span>2</span> Nossa equipe analisa</li>
              <li><span>3</span> Falamos com você no WhatsApp</li>
            </ol>
          </div>
        </div>

        <div className="approved-switch-form-column">
          <form className="approved-switch-form" onSubmit={handleSubmit} onFocusCapture={trackStart}>
            <div className="approved-switch-form-header">
              <div>
                <p>Etapa {currentStep} de 3</p>
                <h2>
                  {currentStep === 1 && "Vamos começar por você"}
                  {currentStep === 2 && "Agora, sobre a empresa"}
                  {currentStep === 3 && "O que motivou a troca?"}
                </h2>
              </div>
              <span className="approved-switch-time">Leva 2 minutos</span>
            </div>

            <div className="approved-switch-progress" aria-label={`Etapa ${currentStep} de 3`}>
              {[1, 2, 3].map((step) => (
                <span className={step <= currentStep ? "is-active" : ""} key={step} />
              ))}
            </div>

            {submitStatus === "success" ? (
              <div className="approved-switch-success" role="status">
                <span aria-hidden="true">✓</span>
                <h3>Informações recebidas.</h3>
                <p>
                  A Nacional vai analisar as informações para verificar a aderência
                  e indicar o serviço, o funcionamento e os próximos passos.
                </p>
                <strong>O envio não representa início de diagnóstico ou análise técnica.</strong>
              </div>
            ) : (
              <>
                {currentStep === 1 && (
                  <div className="approved-switch-fields">
                    <label>
                      <span>Seu nome</span>
                      <input autoFocus autoComplete="name" type="text" value={form.nome} onChange={(event) => updateField("nome", event.target.value)} placeholder="Nome completo" />
                    </label>
                    <label>
                      <span>WhatsApp</span>
                      <input autoComplete="tel-national" inputMode="numeric" type="tel" value={form.whatsapp} onChange={(event) => updateField("whatsapp", formatBrazilPhone(event.target.value))} placeholder="(93) 99210-1980" />
                    </label>
                    <label>
                      <span>Cidade/UF</span>
                      <input autoComplete="address-level2" type="text" value={form.cidade} onChange={(event) => updateField("cidade", event.target.value)} placeholder="Ex: Santarém/PA" />
                    </label>
                    <label>
                      <span>Nome da empresa</span>
                      <input type="text" value={form.empresa} onChange={(event) => updateField("empresa", event.target.value)} placeholder="Opcional" />
                    </label>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="approved-switch-fields">
                    <label>
                      <span>Regime tributário</span>
                      <select autoFocus value={form.regime} onChange={(event) => updateField("regime", event.target.value)}>
                        <option value="">Selecione</option>
                        {taxRegimeOptions.map((option) => <option value={option} key={option}>{option}</option>)}
                      </select>
                    </label>
                    <label>
                      <span>Segmento da empresa</span>
                      <select value={form.segmento} onChange={(event) => updateField("segmento", event.target.value)}>
                        <option value="">Selecione</option>
                        {segmentOptions.map((option) => <option value={option} key={option}>{option}</option>)}
                      </select>
                    </label>
                    <label>
                      <span>Faturamento aproximado</span>
                      <select value={form.faturamento} onChange={(event) => updateField("faturamento", event.target.value)}>
                        <option value="">Selecione</option>
                        {revenueOptions.map((option) => <option value={option} key={option}>{option}</option>)}
                      </select>
                    </label>
                    <label>
                      <span>Tem pendência fiscal?</span>
                      <select value={form.pendencias} onChange={(event) => updateField("pendencias", event.target.value)}>
                        <option value="">Selecione</option>
                        {pendingOptions.map((option) => <option value={option} key={option}>{option}</option>)}
                      </select>
                    </label>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="approved-switch-fields approved-switch-fields--final">
                    <label>
                      <span>Principal motivo da troca</span>
                      <select autoFocus required value={form.motivo} onChange={(event) => updateField("motivo", event.target.value)}>
                        <option value="">Selecione</option>
                        {switchReasonOptions.map((option) => <option value={option} key={option}>{option}</option>)}
                      </select>
                    </label>
                    <label>
                      <span>Quer explicar algo?</span>
                      <textarea value={form.observacao} onChange={(event) => updateField("observacao", event.target.value)} placeholder="Conte rapidamente o que está acontecendo. Opcional." rows={4} />
                    </label>
                  </div>
                )}

                <label className="approved-switch-honeypot">
                  <span>Site</span>
                  <input tabIndex={-1} autoComplete="off" type="text" value={form.website} onChange={(event) => updateField("website", event.target.value)} />
                </label>

                {stepError && <p className="approved-switch-alert" role="alert">{stepError}</p>}
                {submitStatus === "error" && (
                  <p className="approved-switch-alert" role="alert">
                    {errorMessage} Revise os dados e tente novamente.
                  </p>
                )}

                <div className="approved-switch-actions">
                  {currentStep > 1 && <button className="approved-switch-back" type="button" onClick={goToPreviousStep}>Voltar</button>}
                  {currentStep < 3 ? (
                    <button className="approved-switch-next" type="button" onClick={goToNextStep}>Continuar <span aria-hidden="true">→</span></button>
                  ) : (
                    <button className="approved-switch-next" type="submit" disabled={submitStatus === "sending"}>
                      {submitStatus === "sending" ? "Enviando..." : "Enviar para análise"}
                    </button>
                  )}
                </div>
              </>
            )}

            <p className="approved-switch-privacy">
              Seus dados serão usados apenas para esta análise e contato.
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
