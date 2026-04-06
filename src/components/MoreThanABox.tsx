export default function MoreThanABox() {
  return (
    <section className="mtb" id="mais-que-uma-box">

      <div className="mtb-anchor">
        <p className="mtb-label">VIVE FIT BOX</p>
        <h2 className="mtb-title">mais que uma box</h2>
        <p className="mtb-subtitle">
          seu guarda-roupa fitness resolvido por menos do que voce imagina.
        </p>

        <div className="mtb-compare">
          <div className="mtb-col mtb-col-old">
            <span className="mtb-col-tag">comprando avulso</span>
            <ul className="mtb-col-list">
              <li>R$130 por peca</li>
              <li>voce escolhe no escuro</li>
              <li>frete por sua conta</li>
              <li className="mtb-col-total">R$6.240 por ano</li>
            </ul>
          </div>
          <div className="mtb-col mtb-col-new">
            <span className="mtb-col-tag">com a VIVE FIT</span>
            <ul className="mtb-col-list">
              <li>R$44,97 por peca</li>
              <li>curadoria pelo seu perfil</li>
              <li>frete incluso</li>
              <li className="mtb-col-total">R$2.158,80 por ano</li>
            </ul>
          </div>
        </div>

        <p className="mtb-math">
          48 pecas por ano. menos de R$6 por dia. menos que uma agua de coco.
        </p>
      </div>

      <div className="mtb-cards-wrap">
        <div className="mtb-cards">

          <div className="mtb-card">
            <div className="mtb-card-icon mtb-icon-cobalto">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h3 className="mtb-card-title">curadoria sob medida</h3>
            <p className="mtb-card-desc">cada peca escolhida a partir do seu perfil de look.</p>
          </div>

          <div className="mtb-card">
            <div className="mtb-card-icon mtb-icon-turquesa">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3 className="mtb-card-title">tecido que aguenta</h3>
            <p className="mtb-card-desc">zero transparencia, nao desbota, nao perde forma.</p>
          </div>

          <div className="mtb-card">
            <div className="mtb-card-icon mtb-icon-coral">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
              </svg>
            </div>
            <h3 className="mtb-card-title">sem amarras</h3>
            <p className="mtb-card-desc">cancela quando quiser no plano mensal. sem multa.</p>
          </div>

          <div className="mtb-card">
            <div className="mtb-card-icon mtb-icon-areia">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <h3 className="mtb-card-title">marcas + exclusivas</h3>
            <p className="mtb-card-desc">um mix que voce nao monta sozinha.</p>
          </div>

        </div>
      </div>

    </section>
  )
}