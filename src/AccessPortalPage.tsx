import { type FormEvent, useEffect, useState } from "react";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import "./preview-home.css";
import "./access-page.css";

type AccessPortalPageProps = {
  portal: "cliente" | "equipe";
};

const portalContent = {
  cliente: {
    kicker: "Área do cliente",
    title: "Acesse as informações da sua empresa.",
    lead: "Consulte documentos e solicitações usando o e-mail cadastrado na Nacional.",
    formLabel: "Acesso do cliente",
    formLead: "Use o e-mail cadastrado na Nacional.",
    note: "Seu acesso é individual. Por segurança, nunca compartilhe sua senha.",
  },
  equipe: {
    kicker: "Área da equipe",
    title: "Acesso interno da Nacional Contabilidade.",
    lead: "Ambiente reservado para a equipe acompanhar rotinas, documentos e solicitações do escritório.",
    formLabel: "Acesso interno",
    formLead: "Entre com suas credenciais individuais.",
    note: "Acesso exclusivo para integrantes autorizados da equipe.",
  },
};

export default function AccessPortalPage({ portal }: AccessPortalPageProps) {
  const content = portalContent[portal];
  const [notice, setNotice] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${content.kicker} | Nacional Contabilidade`;
    return () => {
      document.title = previousTitle;
    };
  }, [content.kicker]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(true);
  };

  return (
    <main className={`preview-home access-page access-page--${portal}`}>
      <SiteHeader navigationId={`access-${portal}-navigation`} />

      <section className="access-hero" aria-labelledby="access-title">
        <div className="preview-container access-hero__grid">
          <div className="access-copy">
            <a className="access-back" href="/">← Voltar para o site</a>
            <p className="preview-kicker">{content.kicker}</p>
            <h1 id="access-title">{content.title}</h1>
            <p>{content.lead}</p>
            <div className="access-trust">
              <span aria-hidden="true" />
              Ambiente exclusivo e protegido pela Nacional Contabilidade.
            </div>
          </div>

          <form className="access-form" onSubmit={handleSubmit}>
            <div className="access-form__heading">
              <span>{content.formLabel}</span>
              <h2>Entrar no ambiente</h2>
              <p>{content.formLead}</p>
            </div>

            <label>
              E-mail
              <input type="email" name="email" autoComplete="email" placeholder="seuemail@empresa.com.br" required />
            </label>
            <label>
              Senha
              <input type="password" name="password" autoComplete="current-password" placeholder="Digite sua senha" required />
            </label>

            <button type="submit">Entrar</button>
            {notice && (
              <p className="access-form__notice" role="status">
                Não foi possível concluir o acesso com esses dados. Confira as credenciais ou solicite um novo acesso.
              </p>
            )}

            {portal === "cliente" && (
              <div className="access-form__paths" aria-label="Outras opções de acesso">
                <a href="/solicitar-acesso?perfil=cliente">
                  <strong>Já é cliente e ainda não tem acesso?</strong>
                  <span>Solicitar ou recuperar acesso</span>
                </a>
                <a href="/solicitar-acesso?perfil=novo">
                  <strong>Ainda não é cliente?</strong>
                  <span>Quero conhecer a Nacional</span>
                </a>
              </div>
            )}

            <p className="access-form__note">{content.note}</p>
          </form>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
