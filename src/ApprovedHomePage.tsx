import { useEffect, useState } from "react";
import { buildServiceRequestUrl } from "./lead-routing";
import "./approved-home-page.css";

const REQUEST_SERVICE_URL = buildServiceRequestUrl({ origem: "Pagina inicial" });
const DIAGNOSTIC_REQUEST_URL = buildServiceRequestUrl({
  interesse: "Diagnóstico fiscal e cadastral",
  origem: "Pagina inicial - Diagnostico fiscal e cadastral",
});

const solutions = [
  {
    number: "01",
    title: "Diagnóstico fiscal e cadastral",
    text: "Omissões, pendências, divergências e riscos identificados antes de qualquer correção.",
    href: "/solucoes/diagnostico-fiscal-cadastral",
  },
  {
    number: "02",
    title: "Regularizar CNPJ e inscrições",
    text: "CNPJ inapto, inscrição irregular e cadastros empresariais tratados na ordem correta.",
    href: "/solucoes/regularizar-cnpj-inscricao",
  },
  {
    number: "03",
    title: "Notificações e intimações",
    text: "Leitura técnica, organização de documentos e definição do caminho de resposta.",
    href: "/solucoes/notificacoes-intimacoes",
  },
  {
    number: "04",
    title: "Corrigir obrigações e períodos",
    text: "Declarações omitidas ou incorretas reconstruídas conforme a realidade da operação.",
    href: "/solucoes/regularizar-obrigacoes",
  },
];

const secondarySolutions = [
  {
    title: "Abrir ou alterar empresa",
    href: "/solucoes/abrir-ou-regularizar-empresa",
  },
  {
    title: "Trocar de contador",
    href: "/trocar-contador",
  },
  {
    title: "Contabilidade mensal",
    href: buildServiceRequestUrl({
      interesse: "Contabilidade mensal",
      origem: "Pagina inicial - Contabilidade mensal",
    }),
  },
  {
    title: "Endereço fiscal em Santarém",
    href: "/endereco-fiscal-santarem",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Triagem do caso",
    text: "Você apresenta a empresa, o problema, a urgência e o resultado que precisa alcançar.",
  },
  {
    number: "02",
    title: "Diagnóstico técnico",
    text: "Quando existe aderência, o diagnóstico é contratado para mapear documentos, omissões e riscos.",
  },
  {
    number: "03",
    title: "Plano e orçamento",
    text: "Você recebe as prioridades, as dependências, o escopo da execução e o investimento necessário.",
  },
  {
    number: "04",
    title: "Execução acompanhada",
    text: "Após a aprovação, conduzimos as correções contratadas e informamos cada próximo passo.",
  },
];

export default function ApprovedHomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "Diagnóstico e regularização fiscal | Nacional Contabilidade";
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
              Solicitar diagnóstico
            </a>
          </nav>
        </div>
      </header>

      <section className="approved-home-hero" aria-labelledby="approved-home-title">
        <div className="approved-home-container approved-home-hero__grid">
          <div className="approved-home-hero__content">
            <p className="approved-home-eyebrow">Diagnóstico fiscal · Regularização empresarial · Contabilidade</p>
            <h1 id="approved-home-title">
              CNPJ inapto, pendências ou notificação fiscal? <span>Existe um caminho para regularizar.</span>
            </h1>
            <p className="approved-home-hero__lead">
              A Nacional identifica omissões, divergências e impedimentos,
              organiza os documentos e conduz cada etapa com responsabilidade técnica.
            </p>
            <div className="approved-home-actions">
              <a className="approved-home-button approved-home-button--primary" href={DIAGNOSTIC_REQUEST_URL}>
                Solicitar diagnóstico <span aria-hidden="true">→</span>
              </a>
              <a className="approved-home-button approved-home-button--secondary" href="#solucoes">
                Ver problemas que resolvemos
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
          <div><strong>Diagnóstico primeiro</strong><span>Correção somente com contexto</span></div>
        </div>
      </section>

      <section className="approved-home-solutions" id="solucoes" aria-labelledby="approved-home-solutions-title">
        <div className="approved-home-container">
          <div className="approved-home-section-heading">
            <p>Problemas que resolvemos</p>
            <h2 id="approved-home-solutions-title">Comece pela situação que está travando sua empresa.</h2>
            <span>O diagnóstico define o que precisa ser corrigido, em qual ordem e com quais documentos.</span>
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

          <div className="approved-home-secondary-services" aria-label="Outras soluções da Nacional">
            <p>Outras soluções</p>
            <div>
              {secondarySolutions.map((solution) => (
                <a href={solution.href} key={solution.title}>
                  {solution.title} <span aria-hidden="true">→</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="approved-home-process" id="como-funciona" aria-labelledby="approved-home-process-title">
        <div className="approved-home-container">
          <div className="approved-home-section-heading approved-home-section-heading--light">
            <p>Como funciona</p>
            <h2 id="approved-home-process-title">Do problema ao plano de regularização.</h2>
            <span>Triagem, diagnóstico, orçamento e execução são etapas separadas e transparentes.</span>
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
              empresas que precisam resolver situações cadastrais, fiscais e
              contábeis com método e responsabilidade.
            </p>
            <p>
              O trabalho começa pela realidade da operação e pelos documentos
              disponíveis. A Nacional organiza o problema, delimita o escopo e
              indica o caminho antes de transmitir ou corrigir qualquer obrigação.
            </p>
            <ul>
              <li><span>✓</span> Regularização baseada em documentos e fatos</li>
              <li><span>✓</span> Análise antes de qualquer correção ou promessa</li>
              <li><span>✓</span> Escopo, responsabilidades e próximos passos claros</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="approved-home-final" aria-labelledby="approved-home-final-title">
        <div className="approved-home-container approved-home-final__box">
          <div>
            <p>Próximo passo</p>
            <h2 id="approved-home-final-title">Sua empresa precisa voltar à regularidade?</h2>
            <span>Conte o que aconteceu. A Nacional avalia a aderência antes de indicar o diagnóstico.</span>
          </div>
          <a className="approved-home-button approved-home-button--gold" href={DIAGNOSTIC_REQUEST_URL}>
            Solicitar diagnóstico <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <footer className="approved-home-footer">
        <div className="approved-home-container approved-home-footer__grid">
          <div className="approved-home-footer__brand">
            <img src="/nacional-contabilidade-logo-topbar.png" alt="Nacional Contabilidade" />
            <p>Diagnóstico e regularização para empresas que precisam resolver situações fiscais e cadastrais.</p>
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
            <a href={DIAGNOSTIC_REQUEST_URL}>Solicitar diagnóstico →</a>
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
