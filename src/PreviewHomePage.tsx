import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./preview-home.css";
import { SiteFooter, SiteHeader } from "./SiteChrome";

const WHATSAPP_NUMBER = "5593992101980";

const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const diagnosticUrl = whatsappLink(
  "Olá, conheci a nova apresentação da Nacional Contabilidade e quero solicitar um diagnóstico da minha empresa.",
);

const situations = [
  {
    number: "01",
    label: "Abrir ou regularizar uma empresa",
    text: "Para começar certo, corrigir pendências ou colocar um CNPJ antigo em funcionamento.",
    href: "/solucoes/abrir-ou-regularizar-empresa",
  },
  {
    number: "02",
    label: "Trocar de contador",
    text: "Para quem busca mais retorno, organização e acompanhamento da realidade da empresa.",
    href: "/solucoes/trocar-de-contador",
  },
  {
    number: "03",
    label: "Revisar impostos e riscos",
    text: "Para entender se a tributação, as notas e a operação fiscal estão sendo tratadas corretamente.",
    href: "/solucoes/revisar-impostos-e-riscos",
  },
  {
    number: "04",
    label: "Organizar números e retiradas",
    text: "Para enxergar resultado, estruturar pró-labore, distribuição de lucros e comprovação de renda.",
    href: "/solucoes/organizar-numeros-e-retiradas",
  },
  {
    number: "05",
    label: "Usar um endereço fiscal",
    text: "Para abrir o CNPJ sem expor o endereço residencial ou avaliar uma estrutura compatível com inscrição estadual.",
    href: "/endereco-fiscal-santarem",
  },
];

const method = [
  {
    number: "01",
    title: "Entender",
    text: "Começamos pela operação real, pelos documentos e pelo momento da empresa.",
  },
  {
    number: "02",
    title: "Diagnosticar",
    text: "Identificamos pendências, riscos, desperdícios e decisões que precisam de atenção.",
  },
  {
    number: "03",
    title: "Organizar",
    text: "Colocamos rotina, impostos, obrigações, documentos e informações no lugar.",
  },
  {
    number: "04",
    title: "Acompanhar",
    text: "A empresa passa a decidir com suporte e números mais confiáveis ao longo do caminho.",
  },
];

const pillars = [
  {
    index: "I",
    title: "Contábil e fiscal",
    text: "Escrituração, impostos, obrigações, demonstrações e documentação organizada para a empresa funcionar em dia.",
    detail: "A base que sustenta a operação.",
  },
  {
    index: "II",
    title: "Tributário",
    text: "Enquadramento, revisão, classificação fiscal e planejamento para pagar corretamente e reduzir riscos.",
    detail: "Análise antes de qualquer promessa.",
  },
  {
    index: "III",
    title: "Financeiro e decisão",
    text: "Leitura de resultados, organização de retiradas, comprovação de renda e visão mais clara do negócio.",
    detail: "Números que ajudam a decidir.",
  },
];

const diagnostics = [
  {
    eyebrow: "FATOR R",
    title: "CNPJ para psicólogos",
    text: "Entenda a tributação e simule o pró-labore necessário para buscar o Anexo III.",
    href: "/blog/cnpj-para-psicologos",
    cta: "Simular e entender",
  },
  {
    eyebrow: "ECONOMIA TRIBUTÁRIA",
    title: "Onde vale a pena procurar",
    text: "Um mapa de oportunidades que dependem do regime, da atividade e da operação real da empresa.",
    href: "/blog/mapa-economia-tributaria",
    cta: "Ver o mapa",
  },
  {
    eyebrow: "ROTINA EMPRESARIAL",
    title: "Central do empresário",
    text: "Portais oficiais, certidões e atalhos úteis reunidos para facilitar a rotina do CNPJ.",
    href: "/ferramentas",
    cta: "Acessar a central",
  },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

type PreviewHomePageProps = {
  previewMode?: boolean;
};

export default function PreviewHomePage({ previewMode = false }: PreviewHomePageProps) {
  const [showWhatsappButton, setShowWhatsappButton] = useState(false);
  const pageRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const previousTitle = document.title;
    const existingRobots = document.querySelector<HTMLMetaElement>(
      'meta[name="robots"]',
    );
    const previousRobots = existingRobots?.content;
    const robots = existingRobots ?? document.createElement("meta");

    if (previewMode) {
      robots.name = "robots";
      robots.content = "noindex, nofollow";
      if (!existingRobots) document.head.appendChild(robots);
    }

    document.title = previewMode
      ? "Prévia da nova home | Nacional Contabilidade"
      : "Nacional Contabilidade | Contábil, fiscal e tributário para empresas";

    return () => {
      document.title = previousTitle;
      if (previewMode) {
        if (!existingRobots) robots.remove();
        else robots.content = previousRobots ?? "";
      }
    };
  }, [previewMode]);

  useEffect(() => {
    const updateWhatsappButton = () => {
      const heroActions = document.querySelector(".preview-actions");
      setShowWhatsappButton(
        Boolean(heroActions && heroActions.getBoundingClientRect().bottom < 0),
      );
    };

    updateWhatsappButton();
    window.addEventListener("scroll", updateWhatsappButton, { passive: true });
    window.addEventListener("resize", updateWhatsappButton);

    return () => {
      window.removeEventListener("scroll", updateWhatsappButton);
      window.removeEventListener("resize", updateWhatsappButton);
    };
  }, []);

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const revealItems = Array.from(
      page.querySelectorAll<HTMLElement>(".preview-reveal"),
    );
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    page.classList.add("preview-motion-ready");

    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return () => page.classList.remove("preview-motion-ready");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
      page.classList.remove("preview-motion-ready");
    };
  }, []);

  return (
    <main className="preview-home" ref={pageRef}>
      {previewMode && (
        <div className="preview-notice" role="status">
          <span>Ambiente de validação</span>
          Esta página não substitui a home atual.
        </div>
      )}

      <SiteHeader contactUrl={diagnosticUrl} navigationId="home-navigation" />

      <section className="preview-hero" aria-labelledby="preview-hero-title">
        <div className="preview-container preview-hero__grid">
          <div className="preview-hero__copy">
            <h1 id="preview-hero-title">
              <span className="preview-hero__desktop-line">Sua empresa em dia.</span>
              <span className="preview-hero__desktop-line">Seus impostos sob controle.</span>
              <span className="preview-hero__desktop-line">Seus números prontos</span>
              <span className="preview-hero__desktop-line">para decidir.</span>
              <span className="preview-hero__mobile-title">Empresa em dia.<br />Impostos sob controle.<br />Números para decidir.</span>
            </h1>
            <span className="preview-gold-rule" aria-hidden="true" />
            <p className="preview-hero__lead">
              A Nacional organiza o contábil, fiscal e financeiro — e aprofunda
              a análise onde existem riscos ou oportunidades.
            </p>
            <div className="preview-actions">
              <a
                className="preview-button preview-button--primary"
                href={diagnosticUrl}
                target="_blank"
                rel="noreferrer"
              >
                Solicitar diagnóstico
              </a>
              <a className="preview-button preview-button--text" href="#sobre">
                Conhecer a Nacional <Arrow />
              </a>
            </div>
            <div className="preview-hero__trust" aria-label="Responsável técnico">
              <img src="/rodrigo-coelho.png" alt="" />
              <div>
                <strong>Atendimento direto com contador</strong>
                <span>Rodrigo Coelho • CRC/PA 024335</span>
              </div>
            </div>
          </div>

          <div className="preview-ledger" aria-hidden="true" />
        </div>
      </section>

      <section className="preview-section preview-situations" id="situacoes" aria-labelledby="situations-title">
        <div className="preview-container preview-reveal">
          <div className="preview-heading preview-heading--situations">
            <h2 id="situations-title">Qual situação trouxe você até aqui?</h2>
            <p>
              Não começamos por um pacote. Começamos pelo problema que precisa
              ser entendido e resolvido.
            </p>
          </div>
          <div className="preview-situation-list">
            {situations.map((item) => (
              <a
                className="preview-situation"
                href={item.href}
                key={item.number}
              >
                <span className="preview-situation__number">{item.number}</span>
                <strong>{item.label}</strong>
                <p>{item.text}</p>
                <Arrow />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="preview-section preview-method" id="metodo" aria-labelledby="method-title">
        <div className="preview-container preview-reveal">
          <div className="preview-heading preview-heading--editorial preview-heading--light">
            <div>
              <p className="preview-kicker">Como trabalhamos</p>
              <h2 id="method-title">O Método Nacional</h2>
            </div>
            <p>
              Um caminho claro para sair do improviso sem complicar o que o
              empresário precisa entender.
            </p>
          </div>
          <div className="preview-method__grid">
            {method.map((item) => (
              <article className="preview-method__item" key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="preview-section preview-pillars" aria-labelledby="pillars-title">
        <div className="preview-container preview-reveal">
          <div className="preview-heading preview-heading--editorial">
            <div>
              <h2 id="pillars-title">A contabilidade não termina no imposto.</h2>
            </div>
            <p>
              A obrigação precisa estar em dia. Mas a informação também precisa
              ajudar a empresa a seguir com segurança.
            </p>
          </div>
          <div className="preview-pillars__grid">
            {pillars.map((pillar) => (
              <article className="preview-pillar" key={pillar.index}>
                <span>{pillar.index}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
                <small>{pillar.detail}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="preview-section preview-diagnostics" id="diagnosticos" aria-labelledby="diagnostics-title">
        <div className="preview-container preview-reveal">
          <div className="preview-heading preview-heading--editorial">
            <div>
              <h2 id="diagnostics-title">Diagnósticos e ferramentas da Nacional</h2>
            </div>
            <p>
              Explicações e simulações para o empresário entender a própria
              realidade antes de tomar uma decisão.
            </p>
          </div>
          <div className="preview-diagnostics__grid">
            {diagnostics.map((item, index) => (
              <a
                className={`preview-diagnostic${index === 0 ? " preview-diagnostic--featured" : ""}`}
                href={item.href}
                key={item.title}
              >
                <span>{item.eyebrow}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <strong>{item.cta} <Arrow /></strong>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="preview-section preview-about" id="sobre" aria-labelledby="about-title">
        <div className="preview-container preview-about__grid preview-reveal">
          <div className="preview-about__portrait">
            <img src="/rodrigo-coelho.png" alt="Rodrigo Coelho, contador e responsável pela Nacional Contabilidade" />
            <div>
              <strong>Rodrigo Coelho</strong>
              <span>Contador • CRC/PA 024335</span>
            </div>
          </div>
          <div className="preview-about__content">
            <p className="preview-kicker">Quem está por trás da Nacional</p>
            <h2 id="about-title">Proximidade para entender. Técnica para orientar.</h2>
            <p className="preview-about__lead">
              A Nacional Contabilidade é liderada por Rodrigo Coelho, contador,
              estrategista tributário e especialista em consultoria financeira
              para pequenas e médias empresas.
            </p>
            <p>
              A atuação combina conformidade contábil, estratégia tributária e
              leitura financeira para transformar dados dispersos em informação
              confiável. Cada empresa é acompanhada com método, clareza e
              orientação próxima às decisões do negócio.
            </p>
            <a className="preview-text-link" href={diagnosticUrl} target="_blank" rel="noreferrer">
              Conversar sobre minha empresa <Arrow />
            </a>
          </div>
        </div>
      </section>

      <section className="preview-section preview-content" id="conteudos" aria-labelledby="content-title">
        <div className="preview-container preview-reveal">
          <div className="preview-heading preview-heading--inline">
            <div>
              <p className="preview-kicker">Nacional explica</p>
              <h2 id="content-title">Conteúdo para quem precisa decidir.</h2>
            </div>
            <a className="preview-text-link" href="/blog">Ver todos os conteúdos <Arrow /></a>
          </div>
          <div className="preview-content__list">
            <a href="/blog/mapa-economia-tributaria">
              <span>Economia tributária</span>
              <strong>Existem formas legais de pagar menos imposto. O problema é saber onde procurar.</strong>
              <Arrow />
            </a>
            <a href="/blog/icms-simples-para">
              <span>ICMS no Pará</span>
              <strong>Empresas de comércio podem estar pagando ICMS a mais no DAS.</strong>
              <Arrow />
            </a>
            <a href="/blog/fator-r-simples-nacional">
              <span>Simples Nacional</span>
              <strong>Fator R: quando a folha muda a tributação de uma empresa de serviços.</strong>
              <Arrow />
            </a>
          </div>
        </div>
      </section>

      <section className="preview-final" aria-labelledby="preview-final-title">
        <div className="preview-container preview-final__inner preview-reveal">
          <p className="preview-kicker">Próximo passo</p>
          <h2 id="preview-final-title">Sua empresa não precisa continuar no improviso.</h2>
          <p>
            Conte o momento do seu negócio. A Nacional avalia a situação e
            indica o caminho contábil, fiscal e tributário mais adequado.
          </p>
          <a className="preview-button preview-button--light" href={diagnosticUrl} target="_blank" rel="noreferrer">
            Solicitar diagnóstico
          </a>
        </div>
      </section>

      <SiteFooter contactUrl={diagnosticUrl} animated />

      {showWhatsappButton && (
        <a
          className="preview-whatsapp-float"
          href={diagnosticUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Falar com a Nacional Contabilidade no WhatsApp"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M6.7 19.2 3.8 20l.8-2.8a8.2 8.2 0 1 1 2.1 2Z" />
            <path d="M8.7 8.5c.2-.4.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.3.1.5-.1.7l-.4.5c.7 1.2 1.6 2.1 2.8 2.8l.5-.4c.2-.2.4-.2.7-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.5-.5.7-.4.2-.9.3-1.4.3-3.3 0-7.4-4.1-7.4-7.4 0-.5.1-1 .3-1.4Z" />
          </svg>
          <span>Falar no WhatsApp</span>
        </a>
      )}
    </main>
  );
}
