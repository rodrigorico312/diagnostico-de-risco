import { useEffect, useRef } from 'react'

const plans = [
  {
    id: 'anual',
    name: 'Plano Anual',
    sub: '3 peças por mês',
    oldPrice: 'R$199,90',
    price: 'R$179,90',
    per: '/mês',
    desc: 'cobrança anual parcelada',
    pop: true,
    badge: 'melhor opção',
  },
  {
    id: 'semestral',
    name: 'Plano Semestral',
    sub: '3 peças por mês',
    oldPrice: 'R$199,90',
    price: 'R$189,90',
    per: '/mês',
    desc: 'cobrança semestral parcelada',
    pop: false,
  },
  {
    id: 'mensal',
    name: 'Plano Mensal',
    sub: '3 peças por mês',
    oldPrice: null,
    price: 'R$199,90',
    per: '/mês',
    desc: 'recorrência mensal sem fidelidade',
    pop: false,
  },
]

export default function Plans() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add('visible') },
      { threshold: 0.06 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="plans" id="planos">
      <div className="plans-hdr" ref={ref}>
        <h2>Escolha seu plano</h2>
      </div>
      <div className="plans-grid">
        {plans.map((plan) => (
          <div className={`plan${plan.pop ? ' plan--pop' : ''}`} key={plan.id}>
            {plan.badge && <span className="plan-badge">{plan.badge}</span>}
            <p className="plan-name">{plan.name}</p>
            <p className="plan-sub">{plan.sub}</p>
            <div className="plan-pricing">
              {plan.oldPrice && <span className="plan-old">{plan.oldPrice}</span>}
              <span className="plan-price">{plan.price}</span>
              <span className="plan-per">{plan.per}</span>
            </div>
            <p className="plan-desc">{plan.desc}</p>
            <a href={`#/perfil-de-look?plano=${plan.id}`} className="plan-btn">
              quero assinar
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}