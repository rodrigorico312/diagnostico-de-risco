import { type FormEvent, useEffect, useRef, useState } from "react";

const WHATSAPP_NUMBER = "5593992101980";
const WHATSAPP_MESSAGE =
  "Olá, vim pelo site e quero falar com a Nacional Contabilidade sobre minha empresa.";
const INSTAGRAM_URL = "https://www.instagram.com/rodrigospcoelho";
const EMAIL = "rodrigorico312@gmail.com";
const COMPANY_NAME = "O GESTOR DO LUCRO CONSULTORIA LTDA";
const CNPJ = "62.560.654/0001-27";
const ADDRESS =
  "Av. Plácido de Castro, 1505, Aparecida, Santarém-PA, CEP 68.040-090";

const buildWhatsappUrl = (message = WHATSAPP_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const whatsappUrl = buildWhatsappUrl();

type LinkKind =
  | "whatsapp"
  | "instagram"
  | "email"
  | "switch"
  | "company"
  | "accounting"
  | "tax"
  | "advisor"
  | "address"
  | "correspondent"
  | "solutions"
  | "site";

type LinkItem = {
  title: string;
  text: string;
  href: string;
  kind: LinkKind;
  external?: boolean;
  featured?: boolean;
  ariaLabel?: string;
};

const linkTreeItems: LinkItem[] = [
  {
    title: "Falar no WhatsApp",
    text: "Atendimento com a Nacional Contabilidade",
    href: whatsappUrl,
    kind: "whatsapp",
    external: true,
    featured: true,
    ariaLabel: "Falar com a Nacional Contabilidade no WhatsApp",
  },
  {
    title: "Trocar de contador",
    text: "Migração contábil, documentos, acessos e pendências",
    href: "/trocar-contador",
    kind: "switch",
  },
  {
    title: "Abrir, alterar ou baixar CNPJ",
    text: "Constituição, alteração contratual, regularização e baixa",
    href: buildWhatsappUrl(
      "Olá, vim pelo link e quero falar sobre abertura, alteração ou baixa de CNPJ.",
    ),
    kind: "company",
    external: true,
  },
  {
    title: "Contabilidade para empresas",
    text: "Impostos, obrigações, notas e rotina fiscal",
    href: buildWhatsappUrl(
      "Olá, vim pelo link e quero falar sobre contabilidade mensal para minha empresa.",
    ),
    kind: "accounting",
    external: true,
  },
  {
    title: "Planejamento tributário",
    text: "Análise de regime, operação, riscos e oportunidades",
    href: buildWhatsappUrl(
      "Olá, vim pelo link e quero falar sobre planejamento tributário.",
    ),
    kind: "tax",
    external: true,
  },
  {
    title: "Assessoria para contadores",
    text: "Apoio técnico, rotina, mentoria e análise de casos",
    href: buildWhatsappUrl(
      "Olá, vim pelo link e sou contador. Quero falar sobre assessoria e apoio técnico.",
    ),
    kind: "advisor",
    external: true,
  },
  {
    title: "Endereço fiscal em Santarém",
    text: "Endereço fiscal para empresas que precisam de base local",
    href: buildWhatsappUrl(
      "Olá, vim pelo link e quero falar sobre endereço fiscal em Santarém.",
    ),
    kind: "address",
    external: true,
  },
  {
    title: "Correspondente empresarial",
    text: "Apoio local em Santarém para demandas empresariais",
    href: buildWhatsappUrl(
      "Olá, vim pelo link e quero falar sobre correspondente empresarial em Santarém.",
    ),
    kind: "correspondent",
    external: true,
  },
  {
    title: "Ver soluções",
    text: "Serviços contábeis, fiscais, tributários e financeiros",
    href: "/#servicos",
    kind: "solutions",
  },
  {
    title: "Site da Nacional",
    text: "Conheça a Nacional Contabilidade",
    href: "/",
    kind: "site",
  },
  {
    title: "Instagram",
    text: "@rodrigospcoelho",
    href: INSTAGRAM_URL,
    kind: "instagram",
    external: true,
    ariaLabel: "Abrir Instagram de Rodrigo Coelho",
  },
  {
    title: "Email",
    text: EMAIL,
    href: `mailto:${EMAIL}`,
    kind: "email",
    ariaLabel: "Enviar email para a Nacional Contabilidade",
  },
];

type SwitchAccountantFormData = {
  nome: string;
  whatsapp: string;
  cidade: string;
  empresa: string;
  regime: string;
  segmento: string;
  faturamento: string;
  motivo: string;
  pendencias: string;
  observacao: string;
  website: string;
};

const initialSwitchAccountantForm: SwitchAccountantFormData = {
  nome: "",
  whatsapp: "",
  cidade: "",
  empresa: "",
  regime: "",
  segmento: "",
  faturamento: "",
  motivo: "",
  pendencias: "",
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

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

const heroHighlights = [
  "CNPJ em dia",
  "Impostos apurados",
  "Suporte contábil e fiscal",
];

const solutionCards = [
  {
    title: "Abrir ou regularizar CNPJ",
    text: "Para quem precisa abrir empresa, alterar dados cadastrais, resolver pendências ou colocar um CNPJ antigo em funcionamento.",
    services:
      "Abertura de empresa, alterações contratuais, regularização e enquadramento tributário.",
    tags: ["Regularização", "CNPJ"],
  },
  {
    title: "Manter a contabilidade em dia",
    text: "Para empresas que precisam emitir notas, calcular impostos, cumprir obrigações mensais e manter a documentação organizada.",
    services:
      "Contabilidade mensal, apuração de impostos, obrigações fiscais e suporte contábil.",
    tags: ["Rotina", "Fiscal"],
  },
  {
    title: "Entender melhor os impostos",
    text: "Para empresas que querem revisar tributação, reduzir riscos e identificar se estão pagando impostos corretamente.",
    services:
      "Planejamento tributário, revisão fiscal, recuperação tributária e análise de regime.",
    tags: ["Tributário", "Análise"],
  },
  {
    title: "Organizar retirada dos sócios e comprovação de renda",
    text: "Para empresários que precisam estruturar pró-labore, distribuição de lucros e documentos que ajudem a comprovar renda de forma correta.",
    services:
      "Pró-labore, distribuição de lucros, escrituração contábil e relatórios.",
    tags: ["Renda", "Sócios"],
  },
  {
    title: "Revisar produtos e operação fiscal",
    text: "Para comércios e empresas que vendem produtos e precisam avaliar NCM, CST, CSOSN, monofásicos, substituição tributária e benefícios fiscais.",
    services: "Classificação fiscal, análise de produtos e revisão tributária.",
    tags: ["Produtos", "Fiscal"],
  },
  {
    title: "Melhorar organização financeira",
    text: "Para empresas que já vendem, mas precisam entender melhor caixa, despesas, lucro e resultado.",
    services:
      "DRE gerencial, classificação financeira, leitura de resultados e apoio na formação de preços.",
    tags: ["Financeiro", "Gestão"],
  },
];

const serviceBlocks = [
  {
    title: "Rotina contábil",
    text: "Para manter a operação fiscal e contábil funcionando sem deixar prazos e documentos soltos.",
    items: [
      "Contabilidade mensal",
      "Apuração de impostos",
      "Obrigações fiscais",
      "Emissão e orientação sobre notas",
      "Pró-labore e distribuição de lucros",
      "Relatórios contábeis",
    ],
  },
  {
    title: "CNPJ e regularização",
    text: "Para abrir, ajustar, migrar ou recuperar a situação cadastral e fiscal da empresa.",
    items: [
      "Abertura de empresa",
      "Alteração contratual",
      "Troca de contador",
      "Regularização de CNPJ",
      "Declarações em atraso",
      "Parcelamentos e pendências",
    ],
  },
  {
    title: "Análises especializadas",
    text: "Para empresas que precisam olhar tributação, produtos, números e rotina financeira com mais profundidade.",
    items: [
      "Planejamento tributário",
      "Recuperação tributária",
      "Classificação fiscal de produtos",
      "Revisão de NCM, CST e CSOSN",
      "Produtos monofásicos e substituição tributária",
      "DRE gerencial e apoio financeiro",
    ],
  },
];

const trackingLevels = [
  {
    level: "Nível 1",
    title: "Essencial",
    text: "Para manter o CNPJ em dia, calcular impostos, cumprir obrigações e emitir notas com segurança.",
  },
  {
    level: "Nível 2",
    title: "Organização",
    text: "Para empresas que precisam, além da contabilidade, organizar documentos, retirada dos sócios, relatórios e rotina financeira.",
  },
  {
    level: "Nível 3",
    title: "Análise",
    text: "Para empresas que precisam revisar tributação, produtos, margens, formação de preço, DRE e oportunidades fiscais.",
  },
];

const steps = [
  {
    title: "Entendemos sua necessidade",
    text: "Você explica se precisa abrir, regularizar, trocar de contador ou organizar a empresa.",
  },
  {
    title: "Analisamos a situação",
    text: "Verificamos regime tributário, faturamento, obrigações, pendências e rotina atual.",
  },
  {
    title: "Definimos o melhor formato",
    text: "A proposta considera o tamanho da empresa, volume de movimentação e nível de acompanhamento necessário.",
  },
  {
    title: "Começamos a organização",
    text: "Alinhamos acessos, documentos, prazos, obrigações e canais de atendimento.",
  },
];

const audienceItems = [
  "Empresas que precisam manter a contabilidade em dia",
  "Comércios e prestadores de serviços",
  "Profissionais com CNPJ que precisam organizar renda e documentos",
  "Empresas que cresceram e não querem continuar operando no improviso",
  "CNPJs com pendências, declarações atrasadas ou risco de irregularidade",
  "Negócios que vendem produtos e precisam revisar a tributação",
  "Empresários que querem entender melhor imposto, caixa, lucro e retirada dos sócios",
];

function ParaFlag() {
  return (
    <svg
      className="para-flag"
      role="img"
      aria-label="Bandeira do Pará"
      viewBox="0 0 48 32"
    >
      <title>Bandeira do Pará</title>
      <rect width="48" height="32" fill="#c8102e" />
      <polygon points="-8 0 4 0 56 32 44 32" fill="#ffffff" />
      <polygon
        className="para-flag__star"
        points="24 11.5 25.3 14.2 28.2 14.6 26.1 16.7 26.6 19.6 24 18.2 21.4 19.6 21.9 16.7 19.8 14.6 22.7 14.2"
      />
    </svg>
  );
}

function BrazilFlag() {
  return (
    <svg
      className="brazil-flag"
      role="img"
      aria-label="Bandeira do Brasil"
      viewBox="0 0 48 32"
    >
      <title>Bandeira do Brasil</title>
      <rect width="48" height="32" fill="#009b3a" />
      <polygon points="24 4 43 16 24 28 5 16" fill="#ffdf00" />
      <circle cx="24" cy="16" r="6.6" fill="#002776" />
      <path
        d="M17.8 14.4c4.2-1 8.4-.7 12.5 1"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="check-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function LinkIcon({ kind }: { kind: LinkKind }) {
  if (kind === "whatsapp") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M6.7 19.2 3.8 20l.8-2.8a8.2 8.2 0 1 1 2.1 2Z" />
        <path d="M8.7 8.5c.2-.4.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.3.1.5-.1.7l-.4.5c.7 1.2 1.6 2.1 2.8 2.8l.5-.4c.2-.2.4-.2.7-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.5-.5.7-.4.2-.9.3-1.4.3-3.3 0-7.4-4.1-7.4-7.4 0-.5.1-1 .3-1.4Z" />
      </svg>
    );
  }

  if (kind === "instagram") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="16.8" cy="7.2" r="0.8" />
      </svg>
    );
  }

  if (kind === "email") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <rect x="4" y="6" width="16" height="12" rx="2" />
        <path d="m5 8 7 5 7-5" />
      </svg>
    );
  }

  if (kind === "site") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" />
        <path d="M4.5 12h15" />
        <path d="M12 4c2.1 2.2 3.2 4.8 3.2 8S14.1 17.8 12 20" />
        <path d="M12 4c-2.1 2.2-3.2 4.8-3.2 8S9.9 17.8 12 20" />
      </svg>
    );
  }

  if (kind === "switch") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M7 7h9" />
        <path d="m13 4 3 3-3 3" />
        <path d="M17 17H8" />
        <path d="m11 14-3 3 3 3" />
      </svg>
    );
  }

  if (kind === "company") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M6 20V5.8A1.8 1.8 0 0 1 7.8 4h8.4A1.8 1.8 0 0 1 18 5.8V20" />
        <path d="M4 20h16" />
        <path d="M9 8h1.5" />
        <path d="M13.5 8H15" />
        <path d="M9 12h1.5" />
        <path d="M13.5 12H15" />
        <path d="M10 20v-4h4v4" />
      </svg>
    );
  }

  if (kind === "accounting") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <rect x="6" y="3.5" width="12" height="17" rx="2" />
        <path d="M9 7.5h6" />
        <path d="M9 11h.1" />
        <path d="M12 11h.1" />
        <path d="M15 11h.1" />
        <path d="M9 14.5h.1" />
        <path d="M12 14.5h.1" />
        <path d="M15 14.5h.1" />
        <path d="M9 18h6" />
      </svg>
    );
  }

  if (kind === "tax") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M5 19h14" />
        <path d="M7 16.5v-4" />
        <path d="M12 16.5v-8" />
        <path d="M17 16.5v-6" />
        <path d="M6.5 8.5 10 5l3 3 4.5-4" />
        <path d="M16 4h1.5v1.5" />
      </svg>
    );
  }

  if (kind === "advisor") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M8.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M4 19a4.5 4.5 0 0 1 9 0" />
        <path d="M15 7.5h4" />
        <path d="M15 11.5h4" />
        <path d="M15 15.5h3" />
      </svg>
    );
  }

  if (kind === "address") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 21s6-5.2 6-11a6 6 0 0 0-12 0c0 5.8 6 11 6 11Z" />
        <circle cx="12" cy="10" r="2.2" />
      </svg>
    );
  }

  if (kind === "correspondent") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M6 15.5 9.5 19l8-8" />
        <path d="M4 11.5 7.5 15" />
        <path d="M12 15.5 20 7.5" />
        <path d="M15 7.5h5v5" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 5h6v6H5Z" />
      <path d="M13 5h6v6h-6Z" />
      <path d="M5 13h6v6H5Z" />
      <path d="M13 13h6v6h-6Z" />
    </svg>
  );
}

function LinksPage() {
  useEffect(() => {
    document.title = "Links | Nacional Contabilidade";
  }, []);

  return (
    <main className="links-page">
      <section className="links-shell" aria-label="Links da Nacional Contabilidade">
        <div className="links-profile">
          <a className="links-logo" href="/" aria-label="Ir para o site da Nacional Contabilidade">
            <img src="/nacional-contabilidade-logo-topbar.png" alt="Nacional Contabilidade" />
          </a>
          <div className="links-flags" aria-label="Atendimento no Pará e em todo o Brasil">
            <ParaFlag />
            <BrazilFlag />
            <span>Atendimento no Pará e em todo o Brasil</span>
          </div>
          <p>
            Contabilidade, regularização de CNPJ, endereço fiscal, assessoria
            para contadores e apoio empresarial em Santarém e no Brasil.
          </p>
        </div>

        <div className="links-stack" aria-label="Links da Nacional Contabilidade">
          {linkTreeItems.map((item) => (
            <a
              className={`links-item${item.featured ? " links-item--featured" : ""} links-item--${item.kind}`}
              href={item.href}
              key={item.title}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer" : undefined}
              aria-label={item.ariaLabel}
            >
              <span className="links-item__icon">
                <LinkIcon kind={item.kind} />
              </span>
              <span className="links-item__text">
                <strong>{item.title}</strong>
                <small>{item.text}</small>
              </span>
              <span className="links-item__arrow" aria-hidden="true">
                ›
              </span>
            </a>
          ))}
        </div>

        <footer className="links-footer">
          <p>{COMPANY_NAME}</p>
          <p>CNPJ: {CNPJ}</p>
        </footer>
      </section>
    </main>
  );
}

function SwitchAccountantPage() {
  const [form, setForm] = useState<SwitchAccountantFormData>(
    initialSwitchAccountantForm,
  );
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.title = "Trocar de contador | Nacional Contabilidade";
  }, []);

  const updateField = (
    field: keyof SwitchAccountantFormData,
    value: string,
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/troca-contador", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      setForm(initialSwitchAccountantForm);
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
    <main className="lead-page">
      <section className="lead-shell" aria-labelledby="troca-contador-title">
        <a className="lead-logo" href="/links" aria-label="Voltar para os links da Nacional">
          <img src="/nacional-contabilidade-logo-topbar.png" alt="Nacional Contabilidade" />
        </a>

        <div className="lead-heading">
          <p className="lead-kicker">Troca de contador</p>
          <h1 id="troca-contador-title">
            Quer trocar de contador sem bagunçar a empresa?
          </h1>
          <p>
            Preencha as informações principais. Nossa equipe analisa sua
            situação e entra em contato para entender o melhor caminho.
          </p>
        </div>

        <form className="lead-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              <span>Seu nome</span>
              <input
                required
                autoComplete="name"
                type="text"
                value={form.nome}
                onChange={(event) => updateField("nome", event.target.value)}
                placeholder="Nome completo"
              />
            </label>

            <label>
              <span>WhatsApp</span>
              <input
                required
                autoComplete="tel-national"
                inputMode="numeric"
                pattern="[\d\s()+-]{14,15}"
                type="tel"
                value={form.whatsapp}
                onChange={(event) =>
                  updateField("whatsapp", formatBrazilPhone(event.target.value))
                }
                placeholder="(93) 99210-1980"
              />
            </label>

            <label>
              <span>Cidade/UF</span>
              <input
                required
                autoComplete="address-level2"
                type="text"
                value={form.cidade}
                onChange={(event) => updateField("cidade", event.target.value)}
                placeholder="Ex: Santarém/PA"
              />
            </label>

            <label>
              <span>Nome da empresa</span>
              <input
                type="text"
                value={form.empresa}
                onChange={(event) => updateField("empresa", event.target.value)}
                placeholder="Opcional"
              />
            </label>

            <label>
              <span>Regime tributário</span>
              <select
                required
                value={form.regime}
                onChange={(event) => updateField("regime", event.target.value)}
              >
                <option value="">Selecione</option>
                {taxRegimeOptions.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Segmento da empresa</span>
              <select
                required
                value={form.segmento}
                onChange={(event) =>
                  updateField("segmento", event.target.value)
                }
              >
                <option value="">Selecione</option>
                {segmentOptions.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Faturamento aproximado</span>
              <select
                required
                value={form.faturamento}
                onChange={(event) =>
                  updateField("faturamento", event.target.value)
                }
              >
                <option value="">Selecione</option>
                {revenueOptions.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Tem pendência fiscal?</span>
              <select
                required
                value={form.pendencias}
                onChange={(event) =>
                  updateField("pendencias", event.target.value)
                }
              >
                <option value="">Selecione</option>
                {pendingOptions.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            <span>Principal motivo da troca</span>
            <select
              required
              value={form.motivo}
              onChange={(event) => updateField("motivo", event.target.value)}
            >
              <option value="">Selecione</option>
              {switchReasonOptions.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Quer explicar algo?</span>
            <textarea
              value={form.observacao}
              onChange={(event) =>
                updateField("observacao", event.target.value)
              }
              placeholder="Conte rapidamente o que está acontecendo. Opcional."
              rows={4}
            />
          </label>

          <label className="form-honeypot">
            <span>Site</span>
            <input
              tabIndex={-1}
              autoComplete="off"
              type="text"
              value={form.website}
              onChange={(event) => updateField("website", event.target.value)}
            />
          </label>

          {submitStatus === "success" && (
            <p className="form-alert form-alert--success" role="status">
              Recebemos suas informações. A Nacional Contabilidade vai entrar em
              contato pelo WhatsApp informado.
            </p>
          )}

          {submitStatus === "error" && (
            <p className="form-alert form-alert--error" role="alert">
              {errorMessage} Se preferir, fale direto pelo WhatsApp.
            </p>
          )}

          <div className="lead-actions">
            <button
              className="button"
              type="submit"
              disabled={submitStatus === "sending"}
            >
              {submitStatus === "sending" ? "Enviando..." : "Enviar análise"}
            </button>
            <a
              className="button button--secondary"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              Falar no WhatsApp
            </a>
          </div>
        </form>

        <p className="lead-note">
          Seus dados serão usados apenas para contato e avaliação inicial da
          troca de contador.
        </p>
      </section>
    </main>
  );
}

export default function App() {
  const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";
  const isLinksPage = normalizedPath === "/links";
  const isSwitchAccountantPage = normalizedPath === "/trocar-contador";
  const [showFloatingWhatsapp, setShowFloatingWhatsapp] = useState(false);
  const heroSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isLinksPage || isSwitchAccountantPage) return;

    const updateFloatingButton = () => {
      const section = heroSectionRef.current;
      if (!section) return;

      setShowFloatingWhatsapp(section.getBoundingClientRect().bottom < 0);
    };

    updateFloatingButton();
    window.addEventListener("scroll", updateFloatingButton, { passive: true });
    window.addEventListener("resize", updateFloatingButton);

    return () => {
      window.removeEventListener("scroll", updateFloatingButton);
      window.removeEventListener("resize", updateFloatingButton);
    };
  }, [isLinksPage, isSwitchAccountantPage]);

  if (isLinksPage) {
    return <LinksPage />;
  }

  if (isSwitchAccountantPage) {
    return <SwitchAccountantPage />;
  }

  return (
    <main className="site">
      <header className="topbar">
        <div className="container topbar__inner">
          <a className="topbar__brand" href="#" aria-label="Nacional Contabilidade">
            <span className="topbar__logo">
              <img src="/nacional-contabilidade-logo-topbar.png" alt="" />
            </span>
          </a>
          <nav className="topbar__nav" aria-label="Navegação principal">
            <a href="#servicos">Serviços</a>
            <a href="#como-funciona">Como funciona</a>
            <a
              className="topbar__cta"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </nav>
        </div>
      </header>

      <section
        className="hero"
        aria-labelledby="hero-title"
        ref={heroSectionRef}
      >
        <div className="container hero__grid">
          <div className="hero__content">
            <p className="hero__redline">
              O problema não é só pagar imposto. É tocar a empresa sem saber se
              está tudo em ordem.
            </p>
            <h1 id="hero-title">
              Contabilidade para colocar rotina, imposto e números no lugar.
            </h1>
            <p className="hero__subtitle">
              A Nacional Contabilidade ajuda empresas a abrir, regularizar e
              manter a contabilidade em dia, com análise fiscal, tributária e
              financeira quando a operação pede mais atenção.
            </p>
            <p className="hero__support">
              Atendimento presencial em Santarém e online para empresas do Pará
              e de todo o Brasil.
            </p>
            <div className="hero__actions">
              <a
                className="button"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Falar com a Nacional Contabilidade no WhatsApp"
              >
                Falar no WhatsApp
              </a>
              <a className="button button--secondary" href="#servicos">
                Ver serviços
              </a>
            </div>
          </div>

          <aside className="hero-panel" aria-label="Destaques da Nacional">
            <div className="hero-panel__header">
              <span className="flag-pair" aria-hidden="true">
                <ParaFlag />
                <BrazilFlag />
              </span>
              <span>Atendimento contábil</span>
            </div>
            <div className="hero-panel__body">
              {heroHighlights.map((highlight) => (
                <div className="hero-highlight" key={highlight}>
                  <span aria-hidden="true" />
                  <strong>{highlight}</strong>
                </div>
              ))}
            </div>
            <p>
              Começamos pelo básico bem feito e aprofundamos onde existe risco,
              desorganização ou decisão importante pela frente.
            </p>
          </aside>
        </div>
      </section>

      <section className="section section--soft" aria-labelledby="resolve-title">
        <div className="container">
          <div className="section-heading">
            <h2 id="resolve-title">
              Primeiro, tiramos da frente o que trava a empresa
            </h2>
            <p>
              A conversa começa pelo problema real: abrir, regularizar, emitir
              nota, pagar imposto certo, organizar documentos ou entender melhor
              os números.
            </p>
          </div>
          <div className="solution-grid">
            {solutionCards.map((card) => (
              <article className="solution-card" key={card.title}>
                <span className="solution-card__category">
                  {card.tags.join(" / ")}
                </span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <div className="related-services">
                  <span>Serviços relacionados</span>
                  <p>{card.services}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="inline-cta">
            <div>
              <strong>Não sabe exatamente qual serviço precisa?</strong>
              <p>
                Explique a situação da empresa e nossa equipe indica o melhor
                caminho.
              </p>
            </div>
            <a
              className="button button--inline"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Falar com a Nacional Contabilidade no WhatsApp"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section
        className="section"
        id="servicos"
        aria-labelledby="servicos-title"
      >
        <div className="container">
          <div className="section-heading section-heading--center">
            <h2 id="servicos-title">
              Depois, organizamos a rotina contábil, fiscal e tributária
            </h2>
            <p>
              A entrega muda conforme a empresa. Algumas precisam resolver o
              básico. Outras precisam revisar operação, tributação, produtos,
              caixa e resultado.
            </p>
          </div>
          <div className="service-columns">
            {serviceBlocks.map((block) => (
              <article className="service-column" key={block.title}>
                <h3>{block.title}</h3>
                <p>{block.text}</p>
                <CheckList items={block.items} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark" aria-labelledby="nivel-title">
        <div className="container level-layout">
          <div className="section-heading">
            <h2 id="nivel-title">
              Nem toda empresa precisa do mesmo acompanhamento
            </h2>
            <p>
              O ponto é não tratar empresas diferentes como se fossem iguais. O
              acompanhamento precisa caber no tamanho da operação e no nível de
              decisão que ela exige.
            </p>
          </div>
          <div className="level-grid">
            {trackingLevels.map((item) => (
              <article className="level-card" key={item.title}>
                <span>{item.level}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section"
        id="como-funciona"
        aria-labelledby="funciona-title"
      >
        <div className="container">
          <div className="section-heading">
            <h2 id="funciona-title">
              Entendemos a situação antes de falar em solução
            </h2>
            <p>
              Antes de propor qualquer coisa, olhamos o que já existe: regime,
              pendências, documentos, faturamento, notas e rotina atual.
            </p>
          </div>
          <div className="steps">
            {steps.map((step, index) => (
              <article className="step" key={step.title}>
                <span className="step__number">{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft" aria-labelledby="publico-title">
        <div className="container split-section">
          <div className="section-heading">
            <h2 id="publico-title">
              Para empresas que não querem tocar essa parte no improviso
            </h2>
            <p>
              O atendimento faz sentido quando a empresa quer tratar contabilidade,
              fiscal e financeiro como parte da gestão, não como assunto para
              lembrar só quando aparece problema.
            </p>
          </div>
          <div>
            <CheckList items={audienceItems} />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="sobre-title">
        <div className="container about">
          <div className="about__image-wrap">
            <img
              className="about__image"
              src="/rodrigo-coelho.png"
              alt="Rodrigo Coelho, contador em Santarém-PA"
            />
          </div>
          <div className="about__content">
            <h2 id="sobre-title">Nacional Contabilidade</h2>
            <p className="credential">
              Liderada por Rodrigo Coelho, contador, estrategista tributário e
              especialista em consultoria financeira para PMEs, compliance e
              reestruturação de negócios.
            </p>
            <p>
              A Nacional Contabilidade é um escritório contábil com atuação em
              Santarém/PA e atendimento online para empresas do Pará e de todo
              o Brasil.
            </p>
            <p>
              Nosso trabalho começa pelo básico bem feito: CNPJ regular,
              impostos apurados, obrigações entregues e documentos organizados.
            </p>
            <p>
              Quando a empresa precisa de uma análise mais completa, também
              atuamos com revisão tributária, classificação fiscal, organização
              financeira, pró-labore, distribuição de lucros e leitura de
              resultados.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--honorarios" aria-labelledby="honorarios-title">
        <div className="container honorarios">
          <div className="section-heading">
            <h2 id="honorarios-title">
              O valor depende da realidade da empresa
            </h2>
          </div>
          <div className="honorarios__text">
            <p>
              O honorário contábil varia conforme regime tributário, faturamento,
              volume de notas, obrigações, situação fiscal, quantidade de sócios
              e nível de acompanhamento necessário.
            </p>
            <p>
              Por isso, antes de informar valores, entendemos a operação e
              montamos uma proposta proporcional ao que a empresa precisa.
            </p>
            <a
              className="button button--inline"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Solicitar avaliação pelo WhatsApp"
            >
              Solicitar avaliação
            </a>
          </div>
        </div>
      </section>

      <section className="section cta" aria-labelledby="cta-title">
        <div className="container cta__box">
          <h2 id="cta-title">
            Quer parar de empurrar imposto, documento e rotina para depois?
          </h2>
          <p>
            Fale com a Nacional Contabilidade e explique sua situação. Nossa
            equipe vai avaliar o melhor caminho para abrir, regularizar ou
            acompanhar seu CNPJ.
          </p>
          <a
            className="button button--inline"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Chamar a Nacional Contabilidade no WhatsApp"
          >
            Chamar no WhatsApp
          </a>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__info">
            <p>{COMPANY_NAME}</p>
            <p>
              Email:{" "}
              <a className="footer__link" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
            </p>
            <p>CNPJ: {CNPJ}</p>
            <p>Endereço: {ADDRESS}</p>
          </div>
          <nav className="footer__social" aria-label="Canais de contato">
            <a
              className="icon-link icon-link--whatsapp"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Falar com a Nacional Contabilidade no WhatsApp"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M6.7 19.2 3.8 20l.8-2.8a8.2 8.2 0 1 1 2.1 2Z" />
                <path d="M8.7 8.5c.2-.4.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.3.1.5-.1.7l-.4.5c.7 1.2 1.6 2.1 2.8 2.8l.5-.4c.2-.2.4-.2.7-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.5-.5.7-.4.2-.9.3-1.4.3-3.3 0-7.4-4.1-7.4-7.4 0-.5.1-1 .3-1.4Z" />
              </svg>
            </a>
            <a
              className="icon-link icon-link--instagram"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Abrir Instagram de Rodrigo Coelho"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="5" />
                <circle cx="12" cy="12" r="3.5" />
                <circle cx="16.8" cy="7.2" r="0.8" />
              </svg>
            </a>
          </nav>
        </div>
      </footer>

      {showFloatingWhatsapp && (
        <a
          className="floating-whatsapp"
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Falar com a Nacional Contabilidade no WhatsApp"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M6.7 19.2 3.8 20l.8-2.8a8.2 8.2 0 1 1 2.1 2Z" />
            <path d="M8.7 8.5c.2-.4.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.3.1.5-.1.7l-.4.5c.7 1.2 1.6 2.1 2.8 2.8l.5-.4c.2-.2.4-.2.7-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.5-.5.7-.4.2-.9.3-1.4.3-3.3 0-7.4-4.1-7.4-7.4 0-.5.1-1 .3-1.4Z" />
          </svg>
        </a>
      )}
    </main>
  );
}
