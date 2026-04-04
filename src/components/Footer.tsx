export default function Footer() {
  return (
    <footer className="ftr">
      <div className="ftr-in">
        {/* EDITAR: substituir por <img src="/img/logo-white.svg" /> */}
       <div className="ftr-logo">
  <img 
    src="https://i.postimg.cc/kXgnSDG6/V-I-V-E-FIT-1.jpg" 
    alt="VIVE FIT" 
    style={{ height: '32px', display: 'block', margin: '0 auto' }} 
  />
</div>

        <div className="ftr-links">
          {/* EDITAR: links reais */}
          <a href="#">Blog</a>
          <a href="#">Perguntas frequentes</a>
          <a href="#">WhatsApp VIVE FIT</a>
          <a href="#">Termos de uso</a>
          <a href="#">Política de privacidade</a>
        </div>

        <div className="ftr-social">
          {/* EDITAR: links reais das redes sociais */}
          <a href="#">WhatsApp</a>
          <a href="#">Instagram</a>
          <a href="#">Pinterest</a>
        </div>

        <div className="ftr-cp">© 2026 VIVE FIT. Todos os direitos reservados.</div>
      </div>
    </footer>
  )
}
