import { type ReactNode, useEffect } from "react";
import "./approved-links-page.css";

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
  | "tools"
  | "blog"
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

type ApprovedLinksPageProps = {
  items: LinkItem[];
  renderIcon: (kind: LinkKind) => ReactNode;
};

const COMPANY_NAME = "O GESTOR DO LUCRO CONSULTORIA LTDA";
const CNPJ = "62.560.654/0001-27";

export default function ApprovedLinksPage({
  items,
  renderIcon,
}: ApprovedLinksPageProps) {
  useEffect(() => {
    document.title = "Rodrigo Coelho | Nacional Contabilidade";
  }, []);

  const whatsappLink = items.find((item) => item.kind === "whatsapp")!;
  const switchLink = {
    ...items.find((item) => item.kind === "switch")!,
    href: "/trocar-contador",
  };
  const featuredLinks = [
    {
      ...items.find((item) => item.kind === "company")!,
      title: "Abrir ou regularizar CNPJ",
    },
    items.find((item) => item.kind === "accounting")!,
    items.find((item) => item.kind === "tax")!,
    items.find((item) => item.kind === "address")!,
  ];
  const moreLinks = [
    items.find((item) => item.kind === "correspondent")!,
    items.find((item) => item.kind === "advisor")!,
    items.find((item) => item.kind === "solutions")!,
  ];
  const resourceLinks = [
    items.find((item) => item.kind === "tools")!,
    items.find((item) => item.kind === "blog")!,
  ];
  const footerLinks = [
    items.find((item) => item.kind === "site")!,
    items.find((item) => item.kind === "instagram")!,
    items.find((item) => item.kind === "email")!,
  ];

  return (
    <main className="approved-links-page">
      <section className="approved-links-shell" aria-label="Links da Nacional Contabilidade">
        <div className="approved-links-arcs" aria-hidden="true" />

        <header className="approved-links-profile">
          <a
            className="approved-links-logo"
            href="/"
            aria-label="Ir para o site da Nacional Contabilidade"
          >
            <img src="/nacional-contabilidade-logo-topbar.png" alt="Nacional Contabilidade" />
          </a>

          <div className="approved-links-avatar-frame">
            <img
              className="approved-links-avatar"
              src="/rodrigo-coelho.png"
              alt="Rodrigo Coelho"
            />
          </div>
          <p className="approved-links-kicker">Contabilidade estratégica</p>
          <h1>Rodrigo Coelho</h1>
          <p className="approved-links-bio">
            Contabilidade para empresas que querem <strong>crescer com segurança.</strong>
          </p>
          <div className="approved-links-location" aria-label="Atendimento no Pará e em todo o Brasil">
            {renderIcon("address")}
            <span>Pará · Atendimento nacional</span>
          </div>
        </header>

        <nav className="approved-links-primary" aria-label="Atalhos principais">
          {[whatsappLink, switchLink].map((item) => (
            <a
              className={`approved-links-primary__item approved-links-primary__item--${item.kind}`}
              href={item.href}
              key={item.title}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer" : undefined}
              aria-label={item.ariaLabel}
            >
              <span className="approved-links-primary__icon">{renderIcon(item.kind)}</span>
              <span className="approved-links-primary__text">
                <strong>{item.title}</strong>
                <small>
                  {item.kind === "whatsapp"
                    ? "Resposta rápida e direta"
                    : "Migração fácil e segura"}
                </small>
              </span>
            </a>
          ))}
        </nav>

        <section className="approved-links-section" aria-labelledby="approved-links-featured-title">
          <div className="approved-links-section__heading">
            <span aria-hidden="true" />
            <h2 id="approved-links-featured-title">Soluções mais procuradas</h2>
            <span aria-hidden="true" />
          </div>

          <div className="approved-links-service-grid">
            {featuredLinks.map((item) => (
              <a
                className="approved-links-service-card"
                href={item.href}
                key={item.kind}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
              >
                <span className="approved-links-service-card__icon">{renderIcon(item.kind)}</span>
                <strong>{item.title}</strong>
                <span className="approved-links-chevron" aria-hidden="true">›</span>
              </a>
            ))}
          </div>
        </section>

        <section className="approved-links-section" aria-labelledby="approved-links-more-title">
          <div className="approved-links-section__heading">
            <span aria-hidden="true" />
            <h2 id="approved-links-more-title">Mais soluções</h2>
            <span aria-hidden="true" />
          </div>

          <div className="approved-links-compact-list">
            {moreLinks.map((item) => (
              <a
                className="approved-links-compact-card"
                href={item.href}
                key={item.kind}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
              >
                <span className="approved-links-compact-card__icon">{renderIcon(item.kind)}</span>
                <span className="approved-links-compact-card__text">
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </span>
                <span className="approved-links-chevron" aria-hidden="true">›</span>
              </a>
            ))}
          </div>
        </section>

        <section className="approved-links-section" aria-labelledby="approved-links-resources-title">
          <div className="approved-links-section__heading">
            <span aria-hidden="true" />
            <h2 id="approved-links-resources-title">Conteúdos e ferramentas</h2>
            <span aria-hidden="true" />
          </div>

          <div className="approved-links-resource-grid">
            {resourceLinks.map((item) => (
              <a className="approved-links-resource-card" href={item.href} key={item.kind}>
                <span className="approved-links-service-card__icon">{renderIcon(item.kind)}</span>
                <strong>{item.kind === "blog" ? "Blog" : item.title}</strong>
                <span className="approved-links-chevron" aria-hidden="true">›</span>
              </a>
            ))}
          </div>
        </section>

        <footer className="approved-links-footer">
          <nav className="approved-links-footer__nav" aria-label="Outros canais da Nacional">
            {footerLinks.map((item) => (
              <a
                href={item.href}
                key={item.kind}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
              >
                {renderIcon(item.kind)}
                <span>{item.kind === "email" ? "E-mail" : item.title}</span>
              </a>
            ))}
          </nav>
          <p>{COMPANY_NAME}</p>
          <p>CNPJ: {CNPJ}</p>
        </footer>
      </section>
    </main>
  );
}
