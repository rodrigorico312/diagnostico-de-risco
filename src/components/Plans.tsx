import { useEffect, useRef } from 'react'

const plans = [
  {
    id: 'anual',
    name: 'Plano Anual',
    sub: '4 peças por mês',
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
    sub: '4 peças por mês',
    oldPrice: 'R$199,90',
    price: 'R$189,90',
    per: '/mês',
    desc: 'cobrança semestral parcelada',
    pop: false,
  },
  {
    id: 'mensal',
    name: 'Plano Mensal',
    sub: '4 peças por mês',
    oldPrice: null,
    price: 'R$199,90',
    per: '/mês',
    desc: 'recorrência mensal sem fidelidade',
    pop: false,
  },
]

async function irParaPagamento(plano: string) {
  try {
    const res = await fetch('https://api.vivefit.site/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plano }),
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      alert('Erro ao gerar pagamento. Tente novamente.')
    }
  } catch {
    alert('Erro de conexão. Tente novamente.')
  }
}

function handlePlanClick(planoId: string) {
  const token = localStorage.getItem('vivefit_token')
  const fezQuiz = localStorage.getItem('vivefit_quiz_done')

  if (!token) {
    window.location.hash = '#/cadastro'
    return
  }

  if (!fezQuiz) {
    window.location.hash = `#/perfil-de-look?plano=${planoId}`
    return
  }

  // Tem conta + fez quiz → tela de checkout com frete
  window.location.hash = `#/checkout?plano=${planoId}`
}

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
            <button
              className="plan-btn"
              onClick={() => handlePlanClick(plan.id)}
              style={{ cursor: 'pointer' }}
            >
              quero assinar
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}