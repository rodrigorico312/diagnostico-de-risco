import { useEffect } from "react";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import { usePageSeo } from "./usePageSeo";
import { buildServiceRequestUrl } from "./lead-routing";
import "./preview-home.css";
import "./fiscal-address-page.css";

const PAGE_URL = "https://www.nacionalcon.com/endereco-fiscal-santarem";

type Plan = {
  name: string;
  monthly: string;
  total?: string;
  detail: string;
  featured?: boolean;
};

const servicePlans: Plan[] = [
  {
    name: "Mensal",
    monthly: "R$ 180",
    detail: "Renovação mês a mês",
  },
  {
    name: "Semestral",
    monthly: "R$ 160",
    total: "R$ 960 à vista",
    detail: "Uso por 6 meses",
  },
  {
    name: "Anual",
    monthly: "R$ 140",
    total: "R$ 1.680 à vista",
    detail: "Uso por 12 meses",
    featured: true,
  },
];

const stateRegistrationPlans: Plan[] = [
  {
    name: "Mensal",
    monthly: "R$ 450",
    detail: "Renovação mês a mês",
  },
  {
    name: "Trimestral",
    monthly: "R$ 420",
    total: "R$ 1.260 à vista",
    detail: "Uso por 3 meses",
  },
  {
    name: "Semestral",
    monthly: "R$ 400",
    total: "R$ 2.400 à vista",
    detail: "Uso por 6 meses",
  },
  {
    name: "Anual",
    monthly: "R$ 350",
    total: "R$ 4.200 à vista",
    detail: "Uso por 12 meses",
    featured: true,
  },
];

const contactUrl = buildServiceRequestUrl({
  interesse: "Abrir, alterar ou regularizar empresa",
  origem: "Endereco fiscal",
});

function PricingGroup({
  eyebrow,
  title,
  description,
  plans,
}: {
  eyebrow: string;
  title: string;
  description: string;
  plans: Plan[];
}) {
  return (
    <article className="fiscal-pricing-group">
      <div className="fiscal-pricing-group__heading">
        <p>{eyebrow}</p>
        <h3>{title}</h3>
        <span>{description}</span>
      </div>
      <div className={`fiscal-plan-grid fiscal-plan-grid--${plans.length}`}>
        {plans.map((plan) => (
          <div className={`fiscal-plan${plan.featured ? " fiscal-plan--featured" : ""}`} key={plan.name}>
            <span>{plan.name}</span>
            <strong>{plan.monthly}</strong>
            <small>por mês</small>
            <p>{plan.total ?? plan.detail}</p>
            {plan.total && <em>{plan.detail}</em>}
          </div>
        ))}
      </div>
      <a
        className="preview-button preview-button--primary"
        href={contactUrl}
      >
        Consultar compatibilidade
      </a>
    </article>
  );
}

export default function FiscalAddressPage() {
  usePageSeo({
    title: "Endereço fiscal em Santarém | Nacional Contabilidade",
    description: "Endereço fiscal em Santarém para empresas de serviços e operações que precisam solicitar inscrição estadual, com análise de viabilidade e planos transparentes.",
    path: "/endereco-fiscal-santarem",
    image: "/endereco-fiscal-social.png",
  });

  useEffect(() => {
    const structuredData = document.createElement("script");

    structuredData.type = "application/ld+json";
    structuredData.dataset.pageSchema = "fiscal-address";
    structuredData.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Endereço fiscal em Santarém",
      provider: {
        "@type": "AccountingService",
        name: "Nacional Contabilidade",
        url: "https://www.nacionalcon.com/",
        telephone: "+55 93 99210-1980",
        taxID: "62.560.654/0001-27",
        areaServed: ["Santarém", "Pará", "Brasil"],
      },
      areaServed: "Santarém, Pará",
      url: PAGE_URL,
      description: "Uso de endereço fiscal para registro empresarial, sujeito à análise de atividade, viabilidade e exigências dos órgãos competentes.",
      offers: [
        { "@type": "Offer", name: "Endereço fiscal para serviços - plano mensal", price: "180", priceCurrency: "BRL" },
        { "@type": "Offer", name: "Endereço fiscal com estrutura para solicitação de inscrição estadual - plano mensal", price: "450", priceCurrency: "BRL" },
      ],
    });
    document.head.appendChild(structuredData);

    return () => {
      structuredData.remove();
    };
  }, []);

  useEffect(() => {
    if (window.location.hash !== "#planos") return;
    const scrollToPlans = () => {
      const root = document.documentElement;
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      document.getElementById("planos")?.scrollIntoView({ block: "start" });
      root.style.scrollBehavior = previousBehavior;
    };
    const frame = window.requestAnimationFrame(scrollToPlans);
    const timer = window.setTimeout(scrollToPlans, 280);
    document.fonts?.ready.then(scrollToPlans);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <main className="preview-home fiscal-address-page">
      <SiteHeader contactUrl={contactUrl} navigationId="fiscal-address-navigation" />

      <section className="fiscal-address-hero" aria-labelledby="fiscal-address-title">
        <div className="preview-container fiscal-address-hero__grid">
          <div>
            <a className="fiscal-address-breadcrumb" href="/solucoes/abrir-ou-regularizar-empresa">
              ← Abertura de empresa
            </a>
            <h1 id="fiscal-address-title">Seu CNPJ não precisa expor o endereço da sua casa.</h1>
            <p className="fiscal-address-hero__lead">
              A Nacional disponibiliza endereço fiscal para empresas que trabalham online, prestam serviços ou precisam de uma estrutura compatível para solicitar inscrição estadual.
            </p>
            <div className="preview-actions">
              <a className="preview-button preview-button--primary" href="#planos">Ver planos</a>
              <a className="preview-button preview-button--text" href={contactUrl}>
                Solicitar análise comercial →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="fiscal-address-intro" aria-labelledby="fiscal-intro-title">
        <div className="preview-container fiscal-address-intro__layout">
          <header className="fiscal-address-intro__heading">
            <p className="preview-kicker">Quando faz sentido</p>
            <h2 id="fiscal-intro-title">Endereço empresarial sem manter um espaço próprio.</h2>
            <span className="fiscal-address-intro__rule" aria-hidden="true" />
          </header>

          <div className="fiscal-address-use-grid">
            <article>
              <span>01</span>
              <h3>Atendimento sem ponto físico</h3>
              <p>Para quem atende online ou no endereço do cliente.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Privacidade residencial</h3>
              <p>Evite divulgar sua casa nos dados públicos do CNPJ.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Abertura ou mudança</h3>
              <p>Use na abertura da empresa ou na alteração de endereço.</p>
            </article>
            <article>
              <span>04</span>
              <h3>Inscrição estadual</h3>
              <p>Estrutura compatível, sujeita à análise e aprovação.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="fiscal-address-pricing" id="planos" aria-labelledby="fiscal-pricing-title">
        <div className="preview-container fiscal-address-pricing__heading">
          <div>
            <p className="preview-kicker">Planos transparentes</p>
            <h2 id="fiscal-pricing-title">O valor muda conforme a exigência da atividade.</h2>
          </div>
          <p>
            Pacotes trimestrais, semestrais e anuais são pagos integralmente antes do início do período contratado.
          </p>
        </div>

        <div className="preview-container fiscal-pricing-groups">
          <PricingGroup
            eyebrow="Empresas sem inscrição estadual"
            title="Endereço fiscal para serviços"
            description="Indicado principalmente para prestadores de serviços e operações sem circulação de mercadorias."
            plans={servicePlans}
          />
          <PricingGroup
            eyebrow="Atividades com inscrição estadual"
            title="Estrutura adicional para solicitação de IE"
            description="Inclui a estrutura necessária do endereço, como identificação e suporte documental compatível com a solicitação."
            plans={stateRegistrationPlans}
          />
        </div>

        <div className="preview-container fiscal-pricing-note">
          <strong>Importante:</strong>
          <p>
            A contratação não garante a concessão de inscrição estadual, alvará ou licença. A aprovação depende da atividade, da viabilidade do endereço e da análise da SEFA, Prefeitura e demais órgãos competentes. Taxas públicas, alterações cadastrais e serviços contábeis não estão incluídos, salvo quando informados expressamente na proposta.
          </p>
        </div>
      </section>

      <section className="fiscal-address-process" aria-labelledby="fiscal-process-title">
        <div className="preview-container fiscal-address-process__heading">
          <p className="preview-kicker">Como contratar</p>
          <h2 id="fiscal-process-title">Primeiro validamos. Depois liberamos o uso.</h2>
        </div>
        <div className="preview-container fiscal-address-process__steps">
          <article><span>01</span><h3>Entendemos a atividade</h3><p>Analisamos CNAEs, operação, município e necessidade de inscrição estadual.</p></article>
          <article><span>02</span><h3>Verificamos a viabilidade</h3><p>Conferimos se o endereço pode ser utilizado para o cadastro pretendido.</p></article>
          <article><span>03</span><h3>Formalizamos o contrato</h3><p>Definimos plano, período, regras de uso e documentação necessária.</p></article>
          <article><span>04</span><h3>Acompanhamos o cadastro</h3><p>Orientamos a abertura ou alteração do CNPJ e as solicitações aplicáveis.</p></article>
        </div>
      </section>

      <section className="fiscal-address-faq" aria-labelledby="fiscal-faq-title">
        <div className="preview-container fiscal-address-faq__grid">
          <div>
            <p className="preview-kicker">Dúvidas frequentes</p>
            <h2 id="fiscal-faq-title">Antes de usar o endereço.</h2>
          </div>
          <div>
            <details><summary>Posso usar o endereço para qualquer atividade?</summary><p>Não. A compatibilidade depende do CNAE, da forma de operação e das regras municipais e estaduais. A Nacional analisa o caso antes da contratação.</p></details>
            <details><summary>O endereço pode constar no meu CNPJ?</summary><p>Sim, quando a atividade for compatível e a viabilidade for aprovada. O uso é formalizado por contrato e documentação do endereço.</p></details>
            <details><summary>O plano garante a inscrição estadual?</summary><p>Não. O plano fornece estrutura para a solicitação, mas a concessão depende da análise e dos critérios da SEFA e dos demais órgãos envolvidos.</p></details>
            <details><summary>Posso receber clientes no endereço?</summary><p>O serviço é destinado ao uso fiscal e cadastral. Atendimento presencial, estoque, operação física ou recebimento de público precisam ser avaliados separadamente.</p></details>
          </div>
        </div>
      </section>

      <section className="fiscal-address-final" aria-labelledby="fiscal-final-title">
        <div className="preview-container fiscal-address-final__grid">
          <div>
            <p className="preview-kicker">Próximo passo</p>
            <h2 id="fiscal-final-title">Descubra qual plano cabe na sua atividade.</h2>
          </div>
          <div>
            <p>Conte o que sua empresa faz. A Nacional verifica a necessidade de inscrição estadual e a compatibilidade do endereço antes da contratação.</p>
            <a className="preview-button preview-button--light" href={contactUrl}>Solicitar atendimento</a>
          </div>
        </div>
      </section>

      <SiteFooter contactUrl={contactUrl} />
    </main>
  );
}
