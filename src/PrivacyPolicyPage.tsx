import { useEffect } from "react";
import "./preview-home.css";
import { SiteFooter, SiteHeader } from "./SiteChrome";

const PRIVACY_EMAIL = "mailto:rodrigorico312@gmail.com";

export default function PrivacyPolicyPage() {
  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = description?.content;

    document.title = "Política de Privacidade | Nacional Contabilidade";
    if (description) {
      description.content =
        "Saiba como a Nacional Contabilidade trata dados pessoais, contatos, formulários e tecnologias de medição em seu site.";
    }

    return () => {
      document.title = previousTitle;
      if (description && previousDescription) description.content = previousDescription;
    };
  }, []);

  return (
    <main className="preview-home privacy-page">
      <SiteHeader navigationId="privacy-navigation" />

      <section className="privacy-hero">
        <div className="preview-container">
          <p className="preview-kicker">Transparência e proteção de dados</p>
          <h1>Política de Privacidade</h1>
          <p>
            Esta política explica, em linguagem direta, quais dados podem ser
            tratados pela Nacional Contabilidade quando você acessa o site ou
            entra em contato conosco.
          </p>
        </div>
      </section>

      <section className="privacy-content">
        <div className="preview-container privacy-content__grid">
          <aside>
            <strong>Nacional Contabilidade</strong>
            <p>CNPJ 62.560.654/0001-27</p>
            <p>CRC/PA 024335</p>
            <a href="mailto:rodrigorico312@gmail.com">rodrigorico312@gmail.com</a>
          </aside>
          <article>
            <section>
              <h2>1. Quais dados podem ser coletados</h2>
              <p>
                Podemos receber os dados que você informa em formulários, no
                WhatsApp ou por email, como nome, telefone, cidade, dados da
                empresa, segmento, faturamento aproximado e a descrição da sua
                necessidade. Também podem ser registrados dados técnicos de
                navegação, como endereço IP, navegador, dispositivo, páginas
                acessadas e eventos de interação.
              </p>
            </section>
            <section>
              <h2>2. Para que usamos esses dados</h2>
              <p>
                Os dados são usados para responder contatos, realizar avaliações
                iniciais, preparar propostas, prestar serviços contratados,
                manter a segurança do site, cumprir obrigações legais e entender
                quais conteúdos e serviços são mais úteis ao público.
              </p>
            </section>
            <section>
              <h2>3. Cookies e tecnologias de medição</h2>
              <p>
                O site pode utilizar cookies e ferramentas de medição, inclusive
                o Meta Pixel, para analisar visitas e a efetividade de campanhas.
                Essas tecnologias podem registrar eventos de navegação conforme
                as configurações do seu navegador e das plataformas utilizadas.
              </p>
            </section>
            <section>
              <h2>4. Compartilhamento e armazenamento</h2>
              <p>
                Os dados podem ser processados por fornecedores necessários ao
                funcionamento do site, hospedagem, formulários, comunicação e
                análise de desempenho. Não comercializamos dados pessoais. O
                acesso é limitado ao necessário e as informações são mantidas
                pelo período compatível com a finalidade ou com exigências legais.
              </p>
            </section>
            <section>
              <h2>5. Seus direitos</h2>
              <p>
                Nos termos da Lei Geral de Proteção de Dados, você pode solicitar
                confirmação do tratamento, acesso, correção, eliminação quando
                cabível, informação sobre compartilhamentos e revogação do
                consentimento. Algumas informações poderão ser conservadas para
                cumprimento de obrigações legais ou defesa de direitos.
              </p>
            </section>
            <section>
              <h2>6. Como falar conosco</h2>
              <p>
                Para dúvidas ou solicitações relacionadas a dados pessoais,
                escreva para <a href="mailto:rodrigorico312@gmail.com">rodrigorico312@gmail.com</a>
                ou envie sua solicitação pelo e-mail institucional.
              </p>
              <a className="preview-button preview-button--primary" href={PRIVACY_EMAIL}>
                Enviar solicitação por e-mail
              </a>
            </section>
          </article>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
