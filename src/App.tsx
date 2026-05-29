const WHATSAPP_NUMBER = "5593992191980";
const WHATSAPP_MESSAGE =
  "Olá, vim pelo site e preciso falar com um contador para minha empresa.";
const INSTAGRAM_URL = "https://www.instagram.com/seu_instagram";
const CNPJ = "[CNPJ]";
const ADDRESS = "[ENDEREÇO]";

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`;

const services = [
  "Imposto certo",
  "Obrigações em dia",
  "Documentos organizados",
  "Caixa acompanhado",
  "Separação entre pessoa física e empresa",
  "Resposta direta quando precisa decidir",
];

export default function App() {
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
            Falar com o contador no WhatsApp
          </a>
        </div>
      </section>

      <section className="section" aria-labelledby="apresentacao-title">
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

      <section className="section" aria-labelledby="servicos-title">
        <div className="container">
          <p className="eyebrow">Contabilidade e financeiro</p>
          <h2 id="servicos-title">O que eu faço</h2>
          <ul className="service-list">
            {services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
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
            Falar com o contador no WhatsApp
          </a>
        </div>
      </section>

      <section className="section section--local" aria-labelledby="local-title">
        <div className="container">
          <p className="eyebrow">Atendimento contábil</p>
          <h2 id="local-title">Atendimento a partir de Santarém-PA</h2>
          <p className="section__intro">
            Rodrigo Coelho é contador em Santarém-PA. O atendimento pode
            acontecer pelo WhatsApp para empresas de Santarém e de outras
            cidades.
          </p>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__info">
            <p>Rodrigo Coelho — Contador CRC/PA 024335</p>
            <p>CNPJ: {CNPJ}</p>
            <p>Endereço: {ADDRESS}</p>
          </div>
          <nav className="footer__social" aria-label="Canais de contato">
            <a
              className="icon-link"
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
              className="icon-link"
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
    </main>
  );
}
