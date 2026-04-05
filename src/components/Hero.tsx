export default function Hero() {
  return (
    <section className="hero" id="hero">
      <img
        src="https://i.postimg.cc/rpBTS4MX/HERO-VIVEFIT.png"
        alt="VIVE FIT BOX — A vida fit começa pelo look"
        className="hero-img"
      />
      <div style={{
        position: 'absolute',
        bottom: '6rem',
        left: '5%',
        zIndex: 10
      }}>
        <a href="#/perfil-de-look" className="btn btn-white" style={{
          padding: '.7rem 1.6rem',
          fontSize: '.72rem',
          boxShadow: '0 0 15px rgba(255,255,255,.6), 0 0 30px rgba(255,255,255,.3), 0 4px 15px rgba(0,0,0,.15)'
        }}>
          quero assinar
        </a>
      </div>
    </section>
  )
}