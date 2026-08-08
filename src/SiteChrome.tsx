import { useEffect, useState } from "react";

const DEFAULT_CONTACT_URL =
  "https://wa.me/5593992101980?text=Ol%C3%A1%2C%20quero%20agendar%20uma%20reuni%C3%A3o%20com%20a%20Nacional%20Contabilidade.";

type SiteHeaderProps = {
  contactUrl?: string;
  navigationId?: string;
};

export function SiteHeader({
  contactUrl = DEFAULT_CONTACT_URL,
  navigationId = "site-navigation",
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="preview-header">
      <div className="preview-container preview-header__inner">
        <a className="preview-brand" href="/" aria-label="Nacional Contabilidade">
          <img src="/nacional-contabilidade-logo-topbar.png" alt="Nacional Contabilidade" />
        </a>

        <button
          className="preview-menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls={navigationId}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span className="preview-menu-label">Menu</span>
        </button>

        <nav
          className={`preview-navigation${menuOpen ? " is-open" : ""}`}
          id={navigationId}
          aria-label="Navegação principal"
        >
          <a href="/#situacoes" onClick={() => setMenuOpen(false)}>Soluções</a>
          <a href="/ferramentas" onClick={() => setMenuOpen(false)}>Ferramentas</a>
          <a href="/blog" onClick={() => setMenuOpen(false)}>Blog</a>
          <a href="/area-do-cliente" onClick={() => setMenuOpen(false)}>Área do cliente</a>
          <a href="/area-da-equipe" onClick={() => setMenuOpen(false)}>Área da equipe</a>
          <a href="/#sobre" onClick={() => setMenuOpen(false)}>Sobre</a>
          <a
            className="preview-header-cta"
            href={contactUrl}
            target="_blank"
            rel="noreferrer"
          >
            Agendar reunião
          </a>
        </nav>
      </div>
    </header>
  );
}

type SiteFooterProps = {
  contactUrl?: string;
  animated?: boolean;
};

export function SiteFooter({
  contactUrl = DEFAULT_CONTACT_URL,
  animated = false,
}: SiteFooterProps) {
  const motionClass = animated ? " preview-reveal" : "";

  return (
    <footer className="preview-footer">
      <div className={`preview-container preview-footer__grid${motionClass}`}>
        <div className="preview-footer__brand">
          <img src="/nacional-contabilidade-logo-topbar.png" alt="Nacional Contabilidade" />
          <p>
            Contabilidade, tributação e gestão para empresas que precisam decidir
            com mais segurança.
          </p>
        </div>

        <nav aria-label="Soluções da Nacional">
          <strong>Soluções</strong>
          <a href="/solucoes/abrir-ou-regularizar-empresa">Abrir ou regularizar</a>
          <a href="/solucoes/trocar-de-contador">Trocar de contador</a>
          <a href="/solucoes/revisar-impostos-e-riscos">Revisar impostos</a>
          <a href="/solucoes/organizar-numeros-e-retiradas">Organizar números</a>
          <a href="/endereco-fiscal-santarem">Endereço fiscal</a>
          <a href="/contabilidade-em-santarem">Contabilidade em Santarém</a>
          <a href="/abrir-empresa-em-santarem">Abrir empresa em Santarém</a>
        </nav>

        <nav aria-label="Institucional">
          <strong>Institucional</strong>
          <a href="/#sobre">Sobre a Nacional</a>
          <a href="/blog">Blog</a>
          <a href="/area-do-cliente">Área do cliente</a>
          <a href="/area-da-equipe">Área da equipe</a>
          <a href="/politica-de-privacidade">Política de Privacidade</a>
        </nav>

        <div className="preview-footer__contact">
          <strong>Atendimento</strong>
          <p>Atendimento 100% online</p>
          <p>Para empresas de todo o Brasil</p>
          <p>Reuniões somente com agendamento</p>
          <a className="preview-footer__meeting" href={contactUrl} target="_blank" rel="noreferrer">
            Agendar reunião
          </a>
        </div>
      </div>

      <div className={`preview-container preview-footer__legal${motionClass}`}>
        <p>© 2026 Nacional Contabilidade. Todos os direitos reservados.</p>
        <p>CRC/PA 024335 • CNPJ 62.560.654/0001-27</p>
        <a href="/politica-de-privacidade">Política de Privacidade</a>
      </div>
    </footer>
  );
}
