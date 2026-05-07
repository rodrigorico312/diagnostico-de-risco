export default function PainPoints() {
  return (
    <section className="pas" id="dor">
      <div className="pas-inner">
        <p className="pas-tag">Isso parece familiar?</p>
        <h2 className="pas-title">Guarda-roupa cheio e <em>nada pra treinar.</em></h2>
        <div className="pas-cards">
          <div className="pas-card">
            <div className="pas-card-top">
              <div className="pas-card-icon"><svg viewBox="0 0 24 24"><path d="M18.36 6.64A9 9 0 005.64 18.36 9 9 0 0018.36 6.64z"/><line x1="1" y1="1" x2="23" y2="23"/></svg></div>
              <h3>Peça que decepciona</h3>
            </div>
            <p>Legging que perdeu a compressão, top que marca, conjunto que foi pro fundo da gaveta.</p>
          </div>
          <div className="pas-card">
            <div className="pas-card-top">
              <div className="pas-card-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
              <h3>Horas pesquisando</h3>
            </div>
            <p>Chega de perder tempo comparando tecido e preço em 15 lugares diferentes.</p>
          </div>
          <div className="pas-card">
            <div className="pas-card-top">
              <div className="pas-card-icon"><svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></div>
              <h3>Dinheiro no lixo</h3>
            </div>
            <p>R$120,00 numa legging que transpareceu no primeiro agachamento.</p>
          </div>
        </div>
        <div className="pas-stat">
          <p className="pas-stat-num">+de R$ 300,00</p>
          <p className="pas-stat-label"><strong>por mês em peças avulsas</strong> que não servem, não combinam e não duram. Tempo perdido, dinheiro perdido, e motivação no chão.</p>
        </div>
        <div className="pas-turn">
          <p>E se todo mês chegassem na sua porta 4 peças que realmente combinam com você. Sem pesquisar, sem errar, e sem devolver?</p>
          <a href="#/perfil-de-look" className="btn btn-hero" style={{marginTop:'20px'}}>Criar meu perfil de look</a>
        </div>
      </div>
    </section>
  )
}