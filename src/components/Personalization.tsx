export default function Personalization() {
  return (
    <section className="perso" id="perfil">
      <div className="perso-inner">
        <img
          src="https://i.postimg.cc/T2DJVdKN/TERCEIRA-PAGINA.png"
          alt="VIVE FIT"
          className="perso-bg"
        />
        <div className="perso-text">
          <p className="perso-repeat">
            zero <span style={{color: '#1E3A8A', fontStyle: 'italic'}}>zero</span> zero
          </p>
          <h2 className="perso-title">transparencia.</h2>
          <p className="perso-desc">assim voce pode treinar sem se preocupar.</p>
          <a href="#/perfil-de-look" className="perso-link">crie seu perfil de look</a>
        </div>
      </div>
    </section>
  )
}