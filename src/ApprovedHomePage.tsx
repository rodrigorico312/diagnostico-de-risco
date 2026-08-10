import { useEffect, useState } from "react";
import { buildServiceRequestUrl } from "./lead-routing";
import "./approved-home-page.css";

const REQUEST_SERVICE_URL = buildServiceRequestUrl({ origem: "Pagina inicial" });

const solutions = [
  {
    number: "01",
    title: "Abrir ou regularizar CNPJ",
    text: "Atividade, endereço, registros e tributação definidos antes de executar.",
    href: "/solucoes/abrir-ou-regularizar-empresa",
  },
  {
    number: "02",
    title: "Trocar de contador",
    text: "Uma transição organizada, com documentos, acessos e pendências mapeados.",
    href: "/trocar-contador",
  },
  {
    number: "03",
    title: "Contabilidade mensal",
    text: "Impostos, obrigações e números acompanhados com clareza durante o mês.",
    href: buildServiceRequestUrl({
      interesse: "Contabilidade mensal",
      origem: "Pagina inicial - Contabilidade mensal",
    }),
  },
  {
    number: "04",
    title: "Revisar impostos e riscos",
    text: "Análise da operação para identificar erros, riscos e possibilidades reais.",
    href: "/solucoes/revisar-impostos-e-riscos",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Você apresenta o cenário",
    text: "A solicitação reúne a empresa, o momento do negócio e o que precisa ser resolvido.",
  },
  {
    number: "02",
    title: "Avaliamos a aderência",
    text: "Entendemos o problema o suficiente para indicar se e como a Nacional pode ajudar.",
  },
  {
    number: "03",
    title: "Indicamos o próximo passo",
    text: "Quando existe aderência, apresentamos serviço, funcionamento, investimento e continuidade.",
  },
];

export default function ApprovedHomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "Nacional Contabilidade | Segurança tributária para empresas";
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="approved-home">
      <header className="approved-home-header">
        <div className="approved-home-container approved-home-header__inner">
          <a className="approved-home-logo" href="/" aria-label="Nacional Contabilidade — início">
            <img src="/nacional-contabilidade-logo-topbar.png" alt="Nacional Contabilidade" />
          </a>

          <button
            className="approved-home-menu-button"
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="approved-home-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>

          <nav
            className={`approved-home-nav${menuOpen ? " is-open" : ""}`}
            id="approved-home-navigation"
            aria-label="Navegação principal"
          >
            <a href="#solucoes" onClick={closeMenu}>Soluções</a>
            <a href="#como-funciona" onClick={closeMenu}>Como funciona</a>
            <a href="#sobre" onClick={closeMenu}>Sobre</a>
            <a href="/blog" onClick={closeMenu}>Conteúdos</a>
            <a href="/area-do-cliente" onClick={closeMenu}>Acessar</a>
            <a className="approved-home-nav__cta" href={REQUEST_SERVICE_URL}>
              Solicitar atendimento
            </a>
          </nav>
        </div>
      </header>

      <section className="approved-home-hero" aria-labelledby="approved-home-title">
        <div className="approved-home-container approved-home-hero__grid">
          <div className="approved-home-hero__content">
            <p className="approved-home-eyebrow">Contabilidade · Tributação · Financeiro</p>
            <h1 id="approved-home-title">
              Segurança tributária para empresas <span>em crescimento.</span>
            </h1>
            <p className="approved-home-hero__lead">
              A Nacional estrutura contabilidade, tributação e financeiro para
              sustentar o crescimento, entendendo a operação antes de recomendar.
            </p>
            <div className="approved-home-actions">
              <a className="approved-home-button approved-home-button--primary" href={REQUEST_SERVICE_URL}>
                Solicitar atendimento <span aria-hidden="true">→</span>
              </a>
              <a className="approved-home-button approved-home-button--secondary" href="#solucoes">
                Ver soluções
              </a>
            </div>
            <p className="approved-home-hero__note">
              Atendimento 100% online para empresas de Santarém e de todo o Brasil.
            </p>
          </div>

          <div className="approved-home-portrait">
            <div className="approved-home-portrait__frame">
              <img
                src="/rodrigo-coelho.png"
                alt="Rodrigo Coelho, contador responsável pela Nacional Contabilidade"
                fetchPriority="high"
              />
            </div>
            <div className="approved-home-portrait__caption">
              <span>Atendimento direto</span>
              <strong>Rodrigo Coelho</strong>
              <small>Contador · CRC/PA 024335</small>
            </div>
          </div>
        </div>
      </section>

      <section className="approved-home-trust" aria-label="Informações de confiança">
        <div className="approved-home-container approved-home-trust__grid">
          <div><strong>100% online</strong><span>Atendimento em todo o Brasil</span></div>
          <div><strong>Direto com contador</strong><span>Comunicação sem complicação</span></div>
          <div><strong>CRC/PA 024335</strong><span>Responsabilidade técnica</span></div>
          <div><strong>Visão completa</strong><span>Contábil, fiscal e financeiro</span></div>
        </div>
      </section>

      <section className="approved-home-solutions" id="solucoes" aria-labelledby="approved-home-solutions-title">
        <div className="approved-home-container">
          <div className="approved-home-section-heading">
            <p>Como podemos ajudar</p>
            <h2 id="approved-home-solutions-title">Escolha o que sua empresa precisa agora.</h2>
            <span>Quatro caminhos claros para os momentos mais comuns de uma empresa.</span>
          </div>

          <div className="approved-home-solutions__grid">
            {solutions.map((solution) => (
              <a className="approved-home-solution-card" href={solution.href} key={solution.number}>
                <span className="approved-home-solution-card__number">{solution.number}</span>
                <h3>{solution.title}</h3>
                <p>{solution.text}</p>
                <strong>Conhecer solução <span aria-hidden="true">→</span></strong>
              </a>
            ))}
          </div>

          <a className="approved-home-address-link" href="/endereco-fiscal-santarem">
            <span>
              <strong>Precisa de endereço fiscal em Santarém?</strong>
              Conheça os planos e veja qual modalidade combina com sua operação.
            </span>
            <b aria-hidden="true">→</b>
          </a>
        </div>
      </section>

      <section className="approved-home-process" id="como-funciona" aria-labelledby="approved-home-process-title">
        <div className="approved-home-container">
          <div className="approved-home-section-heading approved-home-section-heading--light">
            <p>Como funciona</p>
            <h2 id="approved-home-process-title">Da conversa à rotina organizada.</h2>
            <span>Você entende o que será feito, por que será feito e qual é o próximo passo.</span>
          </div>

          <div className="approved-home-process__grid">
            {processSteps.map((step) => (
              <article key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="approved-home-about" id="sobre" aria-labelledby="approved-home-about-title">
        <div className="approved-home-container approved-home-about__grid">
          <div className="approved-home-about__heading">
            <p>Quem está por trás</p>
            <h2 id="approved-home-about-title">Proximidade para entender. Técnica para orientar.</h2>
          </div>

          <div className="approved-home-about__content">
            <p>
              A Nacional Contabilidade é liderada por Rodrigo Coelho e atende
              empresas que precisam manter as obrigações em dia e entender melhor
              os próprios números.
            </p>
            <p>
              O trabalho reúne contabilidade, tributação e organização financeira
              com uma comunicação direta, para que decisões importantes não sejam
              tomadas no escuro.
            </p>
            <ul>
              <li><span>✓</span> Atendimento próximo e sem linguagem complicada</li>
              <li><span>✓</span> Análise antes de qualquer promessa tributária</li>
              <li><span>✓</span> Rotina organizada para acompanhar o crescimento</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="approved-home-final" aria-labelledby="approved-home-final-title">
        <div className="approved-home-container approved-home-final__box">
          <div>
            <p>Próximo passo</p>
            <h2 id="approved-home-final-title">Vamos colocar sua empresa em ordem?</h2>
            <span>Conte brevemente sobre sua empresa. Analisamos as informações antes do contato.</span>
          </div>
          <a className="approved-home-button approved-home-button--gold" href={REQUEST_SERVICE_URL}>
            Solicitar atendimento <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <footer className="approved-home-footer">
        <div className="approved-home-container approved-home-footer__grid">
          <div className="approved-home-footer__brand">
            <img src="/nacional-contabilidade-logo-topbar.png" alt="Nacional Contabilidade" />
            <p>Contabilidade clara para empresas que querem crescer com segurança.</p>
          </div>

          <nav aria-label="Links institucionais">
            <strong>Nacional</strong>
            <a href="#solucoes">Soluções</a>
            <a href="#sobre">Sobre</a>
            <a href="/blog">Conteúdos</a>
            <a href="/links">Todos os links</a>
          </nav>

          <nav aria-label="Acessos">
            <strong>Acessar</strong>
            <a href="/area-do-cliente">Área do cliente</a>
            <a href="/area-da-equipe">Área da equipe</a>
            <a href="/politica-de-privacidade">Privacidade</a>
          </nav>

          <div className="approved-home-footer__contact">
            <strong>Atendimento</strong>
            <p>Santarém · Pará</p>
            <p>Empresas de todo o Brasil</p>
            <a href={REQUEST_SERVICE_URL}>Solicitar atendimento →</a>
          </div>
        </div>

        <div className="approved-home-container approved-home-footer__legal">
          <span>© 2026 Nacional Contabilidade</span>
          <span>CRC/PA 024335 · CNPJ 62.560.654/0001-27</span>
        </div>
      </footer>
    </main>
  );
}
