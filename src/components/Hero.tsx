export default function Hero() {
  return (
    <section className="hero" id="hero">
      
      {/* 1º PRIMEIRO VEM A IMAGEM */}
      <img
        src="https://i.postimg.cc/FsT14fFz/PERFIL.jpg"
        alt="VIVE FIT BOX — A vida fit começa pelo look"
        className="hero-img"
      />

      {/* 2º DEPOIS VEM O BOTÃO */}
      <div className="hero-cta">
        <a href="#planos" className="btn btn-coral">
          quero assinar
        </a>
      </div>
      
    </section>
  )
}