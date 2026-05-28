const WHATSAPP_NUMBER = "5593992191980";
const WHATSAPP_MESSAGE =
  "Olá, vim pelo site e quero falar sobre contabilidade e financeiro da minha empresa.";

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`;

const services = [
  "Contabilidade tributária",
  "Obrigações e impostos em dia",
  "Organização financeira",
  "Caixa acompanhado",
  "Separação entre pessoa física e empresa",
  "Resposta clara quando você precisa decidir",
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
          <p className="hero__text">
            Sou contador em Santarém-PA e trabalho com contabilidade tributária
            e financeiro para empresas que precisam de um contador presente,
            direto e sem enrolação.
          </p>
          <p className="hero__local">
            Atendimento para Santarém e municípios próximos.
          </p>
          <a
            className="button"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Chamar contador no WhatsApp"
          >
            Chamar no WhatsApp
          </a>
        </div>
      </section>

      <section className="section" aria-labelledby="apresentacao-title">
        <div className="container about">
          <div className="about__image-wrap">
            <img
              className="about__image"
              src="/foto-perfil.jpg"
              alt="Foto do contador responsável pelo atendimento em Santarém"
            />
          </div>
          <div className="about__content">
            <p className="eyebrow">Apresentação</p>
            <h2 id="apresentacao-title">Atendimento direto, de perto</h2>
            <p>
              Meu nome é [SEU NOME]. Sou contador em Santarém-PA e cuido da
              parte contábil, tributária e financeira para empresários que não
              têm tempo de acompanhar tudo sozinho.
            </p>
            <p className="plain-note">
              Sem palestra. Sem promessa. Sem complicar o que já é chato.
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="servicos-title">
        <div className="container">
          <p className="eyebrow">Contabilidade tributária em Santarém</p>
          <h2 id="servicos-title">O que eu faço</h2>
          <p className="section__intro">
            Eu acompanho imposto, obrigação, documento, caixa e movimentação
            financeira da empresa.
          </p>
          <ul className="service-list">
            {services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
          <p className="section__support">
            O foco é manter um financeiro organizado para empresas em Santarém,
            sem deixar a rotina tributária solta.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="publico-title">
        <div className="container">
          <h2 id="publico-title">Para quem é</h2>
          <p className="section__intro">
            Para empresários de Santarém e municípios próximos que vendem,
            entregam, resolvem cliente, fornecedor e funcionário, mas não querem
            deixar imposto, documento e financeiro soltos.
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
            Você chama no WhatsApp, eu entendo como está sua empresa e digo,
            direto, se consigo te atender.
          </p>
          <a
            className="button"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Falar com o contador pelo WhatsApp"
          >
            Falar comigo no WhatsApp
          </a>
        </div>
      </section>

      <section className="section section--local" aria-labelledby="local-title">
        <div className="container">
          <p className="eyebrow">Atendimento para Santarém e municípios próximos</p>
          <h2 id="local-title">Atendimento em Santarém e região</h2>
          <p className="section__intro">
            Atendo empresas de Santarém-PA e também de municípios próximos. O
            atendimento pode começar pelo WhatsApp, de forma simples e direta.
          </p>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>
            Contabilidade tributária + financeiro para empresas em Santarém e
            região.
          </p>
        </div>
      </footer>
    </main>
  );
}
