import { useEffect, useRef, useState } from "react";

const WHATSAPP_NUMBER = "5593992101980";
const WHATSAPP_MESSAGE =
  "Olá, vim pelo site e quero falar com a Nacional Contabilidade sobre minha empresa.";
const INSTAGRAM_URL = "https://www.instagram.com/rodrigospcoelho";
const EMAIL = "rodrigorico312@gmail.com";
const COMPANY_NAME = "O GESTOR DO LUCRO CONSULTORIA LTDA";
const CNPJ = "62.560.654/0001-27";
const ADDRESS =
  "Av. Plácido de Castro, 1505, Aparecida, Santarém-PA, CEP 68.040-090";

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`;

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

export default function App() {
  const [showFloatingWhatsapp, setShowFloatingWhatsapp] = useState(false);
  const heroSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
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
  }, []);

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
            <p>Rodrigo Coelho - Contador CRC/PA 024335</p>
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
