export default function PriceAnchor() {
  return (
    <section className="anchor">
      <div className="anchor-inner">
        <h2>Quanto custa comprar avulso<br/>x<br/> assinar a VIVE FIT?</h2>
        <div className="anchor-badge">Economia de +de R$ 200,00 por mês</div>
        <div className="anchor-cards">
          <div className="anchor-card anchor-card--avulso">
            <p className="anchor-card-title">Comprando avulso</p>
            <div className="anchor-item"><svg viewBox="0 0 24 24" className="anchor-x"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg><span>Legging: R$ 190</span></div>
            <div className="anchor-item"><svg viewBox="0 0 24 24" className="anchor-x"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg><span>Top: R$ 85</span></div>
            <div className="anchor-item"><svg viewBox="0 0 24 24" className="anchor-x"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg><span>Short: R$ 80</span></div>
            <div className="anchor-item"><svg viewBox="0 0 24 24" className="anchor-x"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg><span>Blusa: R$ 60</span></div>
            <p className="anchor-card-total">+de R$ 415,00</p>
          </div>
          <div className="anchor-card anchor-card--vive">
            <p className="anchor-card-title">Na VIVE FIT BOX</p>
            <div className="anchor-item"><svg viewBox="0 0 24 24" className="anchor-check"><polyline points="20 6 9 17 4 12"/></svg><span>Leggings premium</span></div>
            <div className="anchor-item"><svg viewBox="0 0 24 24" className="anchor-check"><polyline points="20 6 9 17 4 12"/></svg><span>Tops premium</span></div>
            <div className="anchor-item"><svg viewBox="0 0 24 24" className="anchor-check"><polyline points="20 6 9 17 4 12"/></svg><span>Shorts e outros</span></div>
            <div className="anchor-item"><svg viewBox="0 0 24 24" className="anchor-check"><polyline points="20 6 9 17 4 12"/></svg><span>Bônus todos os meses</span></div>
            <p className="anchor-card-total">R$ 199,90</p>
          </div>
        </div>
        <p className="anchor-daily">Menos de <strong>R$ 7,00 por dia.</strong> O preço de uma água de coco.</p>
      </div>
    </section>
  )
}