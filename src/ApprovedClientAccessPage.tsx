import { type FormEvent, useEffect, useState } from "react";
import "./approved-client-access-page.css";

const WHATSAPP_SUPPORT_URL =
  "https://wa.me/5593992101980?text=Ol%C3%A1%2C%20preciso%20de%20ajuda%20para%20acessar%20a%20%C3%A1rea%20do%20cliente%20da%20Nacional%20Contabilidade.";

const accessBenefits = [
  {
    number: "01",
    title: "Acesso individual",
    text: "Use somente as credenciais vinculadas à sua empresa.",
  },
  {
    number: "02",
    title: "Rotina centralizada",
    text: "Consulte documentos e acompanhe solicitações em um só lugar.",
  },
  {
    number: "03",
    title: "Suporte da Nacional",
    text: "Se precisar, nossa equipe ajuda você a recuperar o acesso.",
  },
];

export default function ApprovedClientAccessPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Área do cliente | Nacional Contabilidade";

    return () => {
      document.title = previousTitle;
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(true);
  };

  return (
    <main className="approved-client-access">
      <header className="approved-client-access__header">
        <div className="approved-client-access__container approved-client-access__header-inner">
          <a className="approved-client-access__logo" href="/" aria-label="Nacional Contabilidade — início">
            <img src="/nacional-contabilidade-logo-topbar.png" alt="Nacional Contabilidade" />
          </a>
          <a
            className="approved-client-access__support-link"
            href={WHATSAPP_SUPPORT_URL}
            target="_blank"
            rel="noreferrer"
            data-whatsapp-kind="client"
          >
            Precisa de ajuda?
          </a>
        </div>
      </header>

      <section className="approved-client-access__main" aria-labelledby="client-access-title">
        <div className="approved-client-access__container approved-client-access__layout">
          <div className="approved-client-access__copy">
            <a className="approved-client-access__back" href="/">
              <span aria-hidden="true">←</span> Voltar para o site
            </a>
            <p className="approved-client-access__eyebrow">Área do cliente</p>
            <h1 id="client-access-title">Sua empresa organizada em um só acesso.</h1>
            <p className="approved-client-access__lead">
              Entre com o e-mail cadastrado para consultar documentos,
              solicitações e informações da sua empresa.
            </p>

            <div className="approved-client-access__benefits" aria-label="Informações sobre o acesso">
              {accessBenefits.map((benefit) => (
                <article key={benefit.number}>
                  <span>{benefit.number}</span>
                  <div>
                    <strong>{benefit.title}</strong>
                    <p>{benefit.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="approved-client-access__panel">
            <div className="approved-client-access__panel-heading">
              <p>Acesso reservado</p>
              <h2>Entrar na área do cliente</h2>
              <span>Informe suas credenciais individuais.</span>
            </div>

            <form className="approved-client-access__form" onSubmit={handleSubmit}>
              <label htmlFor="client-email">E-mail</label>
              <input
                id="client-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="seuemail@empresa.com.br"
                required
              />

              <div className="approved-client-access__password-heading">
                <label htmlFor="client-password">Senha</label>
                <button
                  type="button"
                  aria-controls="client-password"
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              <input
                id="client-password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                placeholder="Digite sua senha"
                required
              />

              <button className="approved-client-access__submit" type="submit">
                Entrar <span aria-hidden="true">→</span>
              </button>

              {notice && (
                <p className="approved-client-access__notice" role="status" aria-live="polite">
                  Não foi possível concluir o acesso. Confira seus dados ou solicite ajuda à equipe.
                </p>
              )}
            </form>

            <div className="approved-client-access__paths">
              <a href="/solicitar-acesso?perfil=cliente">
                <span>Cliente sem acesso</span>
                <strong>Solicitar ou recuperar acesso</strong>
              </a>
              <a href="/solicitar-atendimento?origem=Area%20do%20cliente">
                <span>Ainda não é cliente</span>
                <strong>Conhecer a Nacional</strong>
              </a>
            </div>

            <p className="approved-client-access__security-note">
              Seu acesso é individual. Nunca compartilhe sua senha.
            </p>
          </div>
        </div>
      </section>

      <footer className="approved-client-access__footer">
        <div className="approved-client-access__container">
          <span>© 2026 Nacional Contabilidade</span>
          <span>CRC/PA 024335 · CNPJ 62.560.654/0001-27</span>
          <a href="/politica-de-privacidade">Política de Privacidade</a>
        </div>
      </footer>
    </main>
  );
}
