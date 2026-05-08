export default function Hero() {
  return (
    <section className="hero-new" id="hero">
      <div className="hero-center">
        <p className="hero-tag">Clube VIVE FIT</p>
        <h1 className="hero-title">
          Seu look de treino<br />
          RESOLVIDO PRA<br />
          SEMPRE.
        </h1>
        <p className="hero-sub">
          4 peças fitness na sua porta todo<br /> mês, escolhidas pro seu estilo.<br />
          Por menos de R$ 7 por dia.
        </p>
        <div className="hero-features">
          <div className="hero-feat">
            <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            Zero transparência
          </div>
          <div className="hero-feat">
            <svg viewBox="0 0 24 24"><path d="M20.38 3.46L16 2 12 3.46 8 2 3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/></svg>
            4 peças/mês
          </div>
          <div className="hero-feat">
            <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            Tecido premium
          </div>
          <div className="hero-feat">
            <svg viewBox="0 0 24 24"><path d="M20 12v10H4V12"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>
            Bônus todo mês
          </div>
        </div>
        <a href="#/perfil-de-look" className="btn btn-hero">Quero experimentar</a>
      </div>
    </section>
  )
}
