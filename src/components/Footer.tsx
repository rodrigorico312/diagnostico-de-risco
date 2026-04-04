export default function Footer() {
  return (
    <footer className="ftr">
      <div className="ftr-in">
        <div className="ftr-logo">
          <img 
            src="/img/logo.jpg" 
            alt="VIVE FIT" 
            style={{ height: '48px', display: 'block', margin: '0 auto', filter: 'brightness(0) invert(1)' }} 
          />
        </div>

        <div className="ftr-links">
          <a href="#">Blog</a>
          <a href="#">Perguntas frequentes</a>
          <a href="#">WhatsApp VIVE FIT</a>
          <a href="#">Termos de uso</a>
          <a href="#">Política de privacidade</a>
        </div>

        <div className="ftr-social">
          <a href="#">WhatsApp</a>
          <a href="#">Instagram</a>
          <a href="#">Pinterest</a>
        </div>

        <div className="ftr-cp">© 2026 VIVE FIT. Todos os direitos reservados.</div>
      </div>
    </footer>
  )
}