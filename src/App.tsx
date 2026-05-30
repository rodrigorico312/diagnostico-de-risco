import { useEffect, useRef, useState } from "react";

const WHATSAPP_NUMBER = "5593992101980";
const WHATSAPP_MESSAGE =
  "Olá, vim pelo site e preciso falar com um contador para minha empresa";
const INSTAGRAM_URL = "https://www.instagram.com/rodrigospcoelho";
const EMAIL = "rodrigorico312@gmail.com";
const COMPANY_NAME = "O GESTOR DO LUCRO CONSULTORIA LTDA";
const CNPJ = "62.560.654/0001-27";
const ADDRESS =
  "Av. Plácido de Castro, 1505, Aparecida, Santarém-PA, CEP 68.040-090";

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`;

const serviceGroups = [
  {
    id: "legalizacao",
    title: "Legalização de empresas",
    services: [
      "Abertura de empresa",
      "Legalização de empresa",
      "Fechamento de empresa",
      "Representação em órgãos fiscalizadores",
    ],
  },
  {
    id: "contabilidade",
    title: "Contabilidade e rotina fiscal",
    services: [
      "Contabilidade básica",
      "Contabilidade tributária",
      "Obrigações e impostos em dia",
    ],
  },
  {
    id: "financeiro",
    title: "Financeiro e gestão dos números",
    services: ["Organização financeira", "Análise de caixa", "Análise de DRE"],
  },
  {
    id: "planejamento",
    title: "Planejamento e viabilidade",
    services: [
      "Plano de negócios",
      "Viabilidade de negócios",
      "Mapeamento patrimonial",
    ],
  },
  {
    id: "analise",
    title: "Análise técnica",
    services: ["Contabilidade forense"],
  },
];

const authorityFirstParagraph =
  "Contador que gera resultado não é aquele que fala que tem milhares de clientes. E sim o que sabe mostrar resultado real.";

const authorityMoreParagraphs = [
  "Tenho mais de 5 anos de experiência na rotina real de escritório contábil. Foi trabalhando na trincheira, com imposto, prazos, obrigações, documentos atrasados, clientes precisando de respostas e financeiros misturados, que percebi como muitas empresas acabam sendo mal acompanhadas.",
  "Foi nesse dia a dia que eu entendi que muita empresa acha que está sendo acompanhada de uma forma profissional, quando na prática só recebe guia e aviso de prazo.",
  "Eu decidi sair desse formato porque não queria fazer contabilidade como se cuidar de empresa fosse só emitir guia de imposto e mandar pro cliente.",
  "Hoje busco atender empresas que querem algo mais direto: imposto certo, obrigação em dia, documento organizado e financeiro acompanhado de verdade. Com métricas, resultados e muita organização.",
];

export default function App() {
  const [isAuthorityOpen, setIsAuthorityOpen] = useState(false);
  const [openServiceGroups, setOpenServiceGroups] = useState<string[]>([]);
  const [showFloatingWhatsapp, setShowFloatingWhatsapp] = useState(false);
  const aboutSectionRef = useRef<HTMLElement | null>(null);

  const toggleServiceGroup = (groupId: string) => {
    setOpenServiceGroups((currentGroups) =>
      currentGroups.includes(groupId)
        ? currentGroups.filter((currentGroup) => currentGroup !== groupId)
        : [...currentGroups, groupId],
    );
  };

  useEffect(() => {
    const updateFloatingButton = () => {
      const section = aboutSectionRef.current;
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
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__inner">
          <p className="eyebrow">Contador em Santarém-PA</p>
          <h1 id="hero-title">Sua empresa precisa de contador pra quê?</h1>
          <p className="hero__subtitle">
            Pra pagar imposto certo, cumprir obrigação e manter o financeiro
            organizado.
          </p>
          <p className="hero__local">
            Atendimento para empresas de Santarém-PA e de outras cidades.
          </p>
          <a
            className="button"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Falar com Rodrigo Coelho, contador em Santarém, no WhatsApp"
          >
            Conversar sobre minha empresa
          </a>
        </div>
      </section>

      <section
        className="section"
        aria-labelledby="apresentacao-title"
        ref={aboutSectionRef}
      >
        <div className="container about">
          <div className="about__image-wrap">
            <img
              className="about__image"
              src="/rodrigo-coelho.png"
              alt="Rodrigo Coelho, contador em Santarém-PA"
            />
          </div>
          <div className="about__content">
            <p className="eyebrow">Atendimento direto</p>
            <h2 id="apresentacao-title">Rodrigo Coelho</h2>
            <p className="credential">Contador CRC/PA 024335</p>
            <p>
              Cuido da parte contábil, tributária e financeira para empresas
              que precisam manter imposto, obrigação, documento e financeiro em
              ordem.
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="autoridade-title">
        <div className="container authority">
          <h2 id="autoridade-title">Não é só ter contador</h2>
          <div className="authority__text" id="autoridade-texto">
            <p>{authorityFirstParagraph}</p>
            {isAuthorityOpen &&
              authorityMoreParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
          </div>
          <button
            className="read-more"
            type="button"
            aria-expanded={isAuthorityOpen}
            aria-controls="autoridade-texto"
            onClick={() => setIsAuthorityOpen((open) => !open)}
          >
            {isAuthorityOpen ? "Ver menos" : "Ver mais"}
          </button>
        </div>
      </section>

      <section className="section" aria-labelledby="servicos-title">
        <div className="container">
          <p className="eyebrow">Contabilidade e financeiro</p>
          <h2 id="servicos-title">O que eu acompanho</h2>
          <p className="section__intro">
            Da abertura da empresa à rotina fiscal e financeira, o foco é
            manter a empresa regular, organizada e com informação clara para
            decidir.
          </p>
          <div className="service-accordion">
            {serviceGroups.map((group) => {
              const isOpen = openServiceGroups.includes(group.id);
              const contentId = `servicos-${group.id}`;

              return (
                <div className="service-group" key={group.id}>
                  <button
                    className="service-group__button"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    onClick={() => toggleServiceGroup(group.id)}
                  >
                    <span>
                      <span className="service-group__title">
                        {group.title}
                      </span>
                    </span>
                    <span
                      className="service-group__chevron"
                      aria-hidden="true"
                    />
                  </button>

                  {isOpen && (
                    <ul
                      className="service-list service-list--inside"
                      id={contentId}
                    >
                      {group.services.map((service) => (
                        <li key={service}>{service}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
          <p className="plain-note">
            O foco é manter os impostos certos, as obrigações em dia,
            documentos organizados e o financeiro bem estruturado.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="publico-title">
        <div className="container">
          <h2 id="publico-title">Para quem é</h2>
          <p className="section__intro">
            Para empresários que não querem deixar imposto, documento e
            financeiro soltos.
          </p>
          <p className="plain-note">
            Se a empresa já está rodando, alguém precisa acompanhar essa parte
            de perto.
          </p>
        </div>
      </section>

      <section className="section cta" aria-labelledby="comeca-title">
        <div className="container">
          <h2 id="comeca-title">Como começa</h2>
          <p className="section__intro">
            Você chama no WhatsApp e conversamos sobre a situação da sua empresa
            para entender como posso ajudar.
          </p>
          <a
            className="button"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Falar com o contador pelo WhatsApp"
          >
            Conversar sobre minha empresa
          </a>
        </div>
      </section>

      <section className="section section--local" aria-labelledby="local-title">
        <div className="container">
          <p className="eyebrow">Atendimento contábil</p>
          <h2 id="local-title">
            Atendimento presencial em Santarém e em cidades vizinhas
          </h2>
          <p className="section__intro">
            O atendimento pode começar pelo WhatsApp e, quando necessário,
            acontecer presencialmente em Santarém e em cidades vizinhas.
          </p>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__info">
            <p>{COMPANY_NAME}</p>
            <p>Rodrigo Coelho — Contador CRC/PA 024335</p>
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
              aria-label="Falar com Rodrigo Coelho no WhatsApp"
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
          aria-label="Falar com Rodrigo Coelho no WhatsApp"
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
