// Adapted from Shadcn Space Footer 02 (MIT).
// Source blob 2024c7ea18e6818f174d44a617e59be8aed166a1; see LICENSES/Shadcn-Space.md.
import "./nacional-footer.css";

type Props = { diagnosticHref?: string };

const footerLinks = [
  { label: "Soluções contábeis", href: "/#solucoes" },
  { label: "MEI em crescimento", href: "/mei-em-crescimento" },
  { label: "Calculadora do MEI", href: "/calculadora-mei" },
  { label: "Conteúdos e ferramentas", href: "/conteudos-e-ferramentas" },
  { label: "Área do cliente", href: "/area-do-cliente" },
  { label: "Área da equipe", href: "/area-da-equipe" },
];

export default function NacionalFooter({ diagnosticHref }: Props) {
  return (
    <footer className="nf-footer" id="rodape">
      <div className="nc-container nf-container">
        <div className="nf-brand-row">
          <a className="nf-logo" href="/" aria-label="Nacional Contabilidade — início">
            <img src="/nacional-contabilidade-logo-topbar.png" alt="Nacional Contabilidade" width="250" height="64" loading="lazy"/>
          </a>
          <a className="nf-email" href="mailto:rodrigorico312@gmail.com">rodrigorico312@gmail.com</a>
        </div>

        <div className={`nf-main${diagnosticHref ? " nf-with-cta" : ""}`}>
          <div className="nf-intro">
            {diagnosticHref ? <>
              <h2>Vamos entender o momento<br/>da sua empresa?</h2>
              <p>Comece com uma avaliação inicial gratuita.</p>
              <a className="nc-button nc-button-gold nf-cta" href={diagnosticHref}>Solicitar meu diagnóstico</a>
            </> : <p className="nf-location">Santarém, Pará.<br/>Atendimento em todo o Brasil.</p>}
          </div>

          <div className="nf-navigation">
            <nav className="nf-group" aria-label="Soluções no rodapé">
              <h3>Para sua empresa</h3>
              <ul>{footerLinks.slice(0,3).map(link => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}</ul>
            </nav>
            <nav className="nf-group" aria-label="Acessos no rodapé">
              <h3>Explore a Nacional</h3>
              <ul>{footerLinks.slice(3).map(link => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}</ul>
            </nav>
          </div>
        </div>

        <div className="nf-bottom">
          <p>© {new Date().getFullYear()} Nacional Contabilidade</p>
          <nav aria-label="Privacidade e cookies">
            <a href="/politica-de-privacidade">Privacidade</a>
            <button type="button" onClick={() => window.dispatchEvent(new Event("nc:privacy-settings"))}>Preferências de cookies</button>
          </nav>
        </div>
        <div className="nf-identification">
          <p>O Gestor do Lucro Consultoria Ltda.</p>
          <p>CNPJ 62.560.654/0001-27 <span aria-hidden="true">·</span> CRC/PA 024335</p>
          {diagnosticHref && <p>Santarém, Pará · Atendimento em todo o Brasil</p>}
        </div>
      </div>
    </footer>
  );
}
