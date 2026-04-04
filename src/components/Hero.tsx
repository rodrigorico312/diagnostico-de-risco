export default function Hero() {
  return (
    <section className="hero" id="hero">
      
      {/* 1º PRIMEIRO VEM A IMAGEM */}
      <img
        src="https://i.postimg.cc/JhNgPVz0/Gemini-Generated-Image-2y5a702y5a702y5a.png"
        alt="VIVE FIT BOX — A vida fit começa pelo look"
        className="hero-img"
      />

      {/* 2º DEPOIS VEM O BOTÃO */}
      <div className="hero-cta">
        <a href="#planos" className="btn btn-white">
          quero assinar
        </a>
      </div>
      
    </section>
  )
}