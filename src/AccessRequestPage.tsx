import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import "./preview-home.css";
import "./access-page.css";
import "./access-request-page.css";

const WHATSAPP_NUMBER = "5593992101980";

type Profile = "cliente" | "novo";

type RequestForm = {
  profile: Profile;
  name: string;
  document: string;
  company: string;
  email: string;
  phone: string;
  consent: boolean;
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatDocument(value: string) {
  const digits = onlyDigits(value).slice(0, 14);
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function allDigitsEqual(value: string) {
  return /^(\d)\1+$/.test(value);
}

function isValidCpf(cpf: string) {
  if (cpf.length !== 11 || allDigitsEqual(cpf)) return false;
  for (let position = 9; position <= 10; position += 1) {
    let sum = 0;
    for (let index = 0; index < position; index += 1) {
      sum += Number(cpf[index]) * (position + 1 - index);
    }
    const digit = ((sum * 10) % 11) % 10;
    if (digit !== Number(cpf[position])) return false;
  }
  return true;
}

function isValidCnpj(cnpj: string) {
  if (cnpj.length !== 14 || allDigitsEqual(cnpj)) return false;
  const calculateDigit = (base: string, weights: number[]) => {
    const sum = base.split("").reduce((total, digit, index) => total + Number(digit) * weights[index], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };
  const first = calculateDigit(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const second = calculateDigit(cnpj.slice(0, 12) + first, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return cnpj.endsWith(`${first}${second}`);
}

function isValidDocument(value: string) {
  const digits = onlyDigits(value);
  return digits.length === 11 ? isValidCpf(digits) : digits.length === 14 && isValidCnpj(digits);
}

export default function AccessRequestPage() {
  const queryProfile = new URLSearchParams(window.location.search).get("perfil");
  const [form, setForm] = useState<RequestForm>({
    profile: queryProfile === "novo" ? "novo" : "cliente",
    name: "",
    document: "",
    company: "",
    email: "",
    phone: "",
    consent: false,
  });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Solicitar acesso | Nacional Contabilidade";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const updateField = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(false);

    if (!isValidDocument(form.document)) {
      setError("Informe um CPF ou CNPJ válido para continuar.");
      return;
    }

    if (onlyDigits(form.phone).length < 10) {
      setError("Informe um número de WhatsApp válido para continuar.");
      return;
    }

    const relationship = form.profile === "cliente"
      ? "Já sou cliente e preciso solicitar ou recuperar meu acesso."
      : "Ainda não sou cliente e quero conhecer a Nacional Contabilidade.";
    const message = [
      "Olá, vim pelo site da Nacional Contabilidade.",
      relationship,
      `Nome: ${form.name}`,
      `CPF/CNPJ: ${form.document}`,
      form.company ? `Empresa: ${form.company}` : "",
      `E-mail: ${form.email}`,
      `WhatsApp: ${form.phone}`,
    ].filter(Boolean).join("\n");

    setSubmitted(true);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="preview-home access-request-page">
      <SiteHeader navigationId="access-request-navigation" />

      <section className="access-request" aria-labelledby="request-title">
        <div className="preview-container access-request__grid">
          <div className="access-request__copy">
            <a className="access-back" href="/area-do-cliente">← Voltar para a área do cliente</a>
            <p className="preview-kicker">Solicitação de acesso</p>
            <h1 id="request-title">Vamos identificar o melhor caminho para você.</h1>
            <p>
              Informe seus dados para solicitar acesso como cliente ou iniciar uma conversa com a Nacional Contabilidade.
            </p>
            <div className="access-request__security">
              <strong>Seus dados continuam protegidos.</strong>
              <p>
                Por segurança, esta página não informa publicamente se um CPF ou CNPJ já faz parte da nossa carteira. A confirmação acontece pelo contato cadastrado.
              </p>
            </div>
          </div>

          <form className="access-request-form" onSubmit={handleSubmit} noValidate>
            <fieldset className="access-request-form__profiles">
              <legend>Qual é a sua situação?</legend>
              <label className={form.profile === "cliente" ? "is-selected" : ""}>
                <input
                  type="radio"
                  name="profile"
                  value="cliente"
                  checked={form.profile === "cliente"}
                  onChange={updateField}
                />
                <span>
                  <strong>Já sou cliente</strong>
                  Preciso criar ou recuperar meu acesso
                </span>
              </label>
              <label className={form.profile === "novo" ? "is-selected" : ""}>
                <input
                  type="radio"
                  name="profile"
                  value="novo"
                  checked={form.profile === "novo"}
                  onChange={updateField}
                />
                <span>
                  <strong>Quero me tornar cliente</strong>
                  Quero falar sobre a minha empresa
                </span>
              </label>
            </fieldset>

            <div className="access-request-form__fields">
              <label>
                Seu nome
                <input name="name" value={form.name} onChange={updateField} autoComplete="name" required />
              </label>
              <label>
                CPF ou CNPJ
                <input
                  name="document"
                  value={form.document}
                  onChange={(event) => setForm((current) => ({ ...current, document: formatDocument(event.target.value) }))}
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="000.000.000-00"
                  required
                />
              </label>
              <label>
                Empresa <span>(se houver)</span>
                <input name="company" value={form.company} onChange={updateField} autoComplete="organization" />
              </label>
              <label>
                E-mail
                <input name="email" type="email" value={form.email} onChange={updateField} autoComplete="email" required />
              </label>
              <label>
                WhatsApp
                <input
                  name="phone"
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: formatPhone(event.target.value) }))}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(93) 99999-9999"
                  required
                />
              </label>
            </div>

            <label className="access-request-form__consent">
              <input name="consent" type="checkbox" checked={form.consent} onChange={updateField} required />
              <span>
                Autorizo o uso destes dados para atendimento da minha solicitação, conforme a <a href="/politica-de-privacidade">Política de Privacidade</a>.
              </span>
            </label>

            {error && <p className="access-request-form__message is-error" role="alert">{error}</p>}
            {submitted && (
              <p className="access-request-form__message" role="status">
                Solicitação preparada. Continue no WhatsApp para confirmar o envio com segurança.
              </p>
            )}

            <button type="submit">Continuar pelo WhatsApp</button>
            <p className="access-request-form__footnote">
              A Nacional confirma o vínculo e orienta os próximos passos pelo contato informado.
            </p>
          </form>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
