import { useState, useRef, useEffect } from 'react'

const faqs = [
  { 
    q: 'Como a VIVE FIT escolhe as peças certas pra mim?', 
    a: 'A VIVE FIT usa uma inteligência artificial treinada especificamente em moda fitness feminina. Quando você preenche seu perfil de look, nossa IA cruza seu tamanho, tipo de treino, preferências de cor e estilo com o nosso catálogo de peças. O resultado é uma seleção personalizada, sem achismo, sem erro. É como ter uma personal stylist fitness que conhece seu corpo e seu gosto.' 
  },
  { 
    q: 'Que tipo de tecido vem nas peças?', 
    a: 'Trabalhamos com os 3 tecidos mais usados pelas melhores marcas fitness do Brasil. Poliamida: toque gelado na pele, leveza absurda e secagem ultrarrápida, o mesmo tecido que marcas como Live!, Alto Giro e Colcci Fitness usam nas peças premium. Não marca, não transparece e mantém a forma lavagem após lavagem. Poliamida Canelada: a versão texturizada com efeito de linhas em relevo, caimento elegante e compressão suave, perfeita pra yoga e pilates. Suplex Premium: alta compressão, durabilidade extrema e resistência ao cloro. Aguenta treino pesado todo dia sem perder elasticidade. Nenhuma peça entra na sua box sem passar pela nossa curadoria de tecido, costura e caimento.' 
  },
  { 
    q: 'O que tá incluso na assinatura?', 
    a: 'Todo mês você recebe peças fitness selecionadas pro seu perfil de look, o VIVE Guide com ficha técnica do tecido, um mimo de experiência e o certificado de seleção.' 
  },
  { 
    q: 'VIVE FIT BOX vale a pena?', 
    a: 'A box é montada especialmente pra você. Peças com tecido premium, caimento testado e estética alinhada ao seu estilo. Sem surpresa ruim, sem genérico.' 
  },
  { 
    q: 'Que marcas vêm na box?', 
    a: 'Marca própria VIVE FIT e marcas parceiras selecionadas. Todas seguem o mesmo padrão de qualidade, tecido e estética.' 
  },
  { 
    q: 'Posso mudar meu perfil de look?', 
    a: 'Sim. Na sua área exclusiva, você atualiza cores, peças, tamanho e preferências quando quiser. Nossa IA recalcula suas próximas seleções automaticamente.' 
  },
  { 
    q: 'Quais são as formas de pagamento?', 
    a: 'Aceitamos Pix, boleto bancário e cartão de crédito. Pix e boleto são sempre à vista. No cartão, o plano semestral pode ser parcelado em até 6x e o anual em até 12x sem juros. O plano mensal funciona por recorrência automática no cartão.' 
  },
  { 
    q: 'Qual é o prazo de entrega?', 
    a: 'O prazo depende da sua região e da transportadora escolhida no checkout. Em Santarém-PA, em média 3 a 7 dias úteis. Para outras regiões, você vê o prazo exato ao digitar seu CEP. Despachamos de Santarém-PA para todo o Brasil.' 
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  const ansRef = useRef<HTMLDivElement>(null)

  return (
    <div className={`faq-item${open ? ' open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(!open)}>
        {q}
        <span className="faq-icon">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>
      <div className="faq-answer" ref={ansRef} style={{ maxHeight: open ? ansRef.current?.scrollHeight : 0 }}>
        <div className="faq-answer-inner">{a}</div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.classList.add('visible') }, { threshold: 0.06 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="faq-section" id="faq">
      <div className="wrap">
        <div className="reveal" ref={ref}><h2>Tire suas dúvidas</h2></div>
        <div className="faq-list">
          {faqs.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
        </div>
        <div style={{ marginTop: '1.25rem' }}>
          <a href="#" style={{ fontSize: '.78rem', color: 'var(--turquesa)', fontFamily: 'var(--font-body)', fontWeight: 500, textDecoration: 'underline' }}>
            outras dúvidas? clique aqui
          </a>
        </div>
      </div>
    </section>
  )
}