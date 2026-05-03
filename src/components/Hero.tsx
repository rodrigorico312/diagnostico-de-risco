export default function Hero() {
  return (
    <section className="hero" id="hero">
      <picture className="hero-img">
        <source
          media="(max-width: 768px)"
          srcSet="https://i.postimg.cc/nhvmv4B9/HERO-VIVEFIT-mobile.webp"
        />
        <img
          src="https://i.postimg.cc/bvptLZ9d/HERO-VIVEFIT-desktop.webp"
          alt="VIVE FIT BOX - A vida fit comeca pelo look"
          className="hero-img"
        />
      </picture>
      <div
        style={{
          position: 'absolute',
          bottom: '6rem',
          left: '5%',
          zIndex: 10,
        }}
      >
        <a
          href="#/perfil-de-look"
          className="btn btn-white"
          style={{
            padding: '.7rem 1.6rem',
            fontSize: '.72rem',
            boxShadow:
              '0 0 15px rgba(255,255,255,.6), 0 0 30px rgba(255,255,255,.3), 0 4px 15px rgba(0,0,0,.15)',
          }}
        >
          quero assinar
        </a>
      </div>
    </section>
  )
}
