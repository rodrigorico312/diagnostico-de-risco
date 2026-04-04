import { useState, useCallback } from 'react'

/*
  PERFIL DE LOOK — Quiz + fluxo duplo
  
  FLUXO 1 (perfil primeiro):
    Pessoa clica "crie seu perfil de look" → Quiz → Tela final → "escolher meu plano" → volta pra #planos
    
  FLUXO 2 (plano primeiro):
    Pessoa clica "quero assinar" num plano → Quiz → Tela final → "ir pro pagamento" → vai pro checkout
    O plano já vem pré-selecionado via ?plano=anual|semestral|mensal
*/

interface Props {
  planoPreSelecionado?: string | null
}

interface QuizStep {
  id: string
  title: string
  sub: string
  type: 'single' | 'multi'
  style: 'pill' | 'card' | 'swatch' | 'tag'
  skippable?: boolean
  options: { val: string; label: string; icon?: string; color?: string }[]
}

const STEPS: QuizStep[] = [
  {
    id: 'tamanho',
    title: 'Qual o seu tamanho?',
    sub: 'Escolha uma opção',
    type: 'single',
    style: 'pill',
    options: [
      { val: 'PP', label: 'PP' },
      { val: 'P', label: 'P' },
      { val: 'M', label: 'M' },
      { val: 'G', label: 'G' },
      { val: 'GG', label: 'GG' },
      { val: 'XG', label: 'XG' },
    ],
  },
  {
    id: 'treino',
    title: 'Que tipo de treino você faz?',
    sub: 'Pode marcar mais de um',
    type: 'multi',
    style: 'card',
    options: [
      { val: 'musculacao', label: 'Musculação', icon: '🏋️' },
      { val: 'funcional', label: 'Funcional', icon: '🔥' },
      { val: 'yoga', label: 'Yoga', icon: '🧘' },
      { val: 'corrida', label: 'Corrida', icon: '🏃' },
      { val: 'pilates', label: 'Pilates', icon: '💪' },
      { val: 'crossfit', label: 'CrossFit', icon: '⚡' },
    ],
  },
  {
    id: 'cores',
    title: 'Que cores você curte?',
    sub: 'Escolha as que mais combinam com você',
    type: 'multi',
    style: 'swatch',
    options: [
      { val: 'preto', label: 'Preto', color: '#1E1E1C' },
      { val: 'branco', label: 'Branco', color: '#F0EDE8' },
      { val: 'cinza', label: 'Cinza', color: '#9CA3AF' },
      { val: 'verde', label: 'Verde', color: '#4A5D23' },
      { val: 'azul', label: 'Azul', color: '#1E3A8A' },
      { val: 'terra', label: 'Terra', color: '#8B6F4E' },
      { val: 'bordo', label: 'Bordô', color: '#7A1A1A' },
      { val: 'rosa', label: 'Rosa', color: '#EC4899' },
      { val: 'coral', label: 'Coral', color: '#FF5A5F' },
      { val: 'lilas', label: 'Lilás', color: '#A78BFA' },
    ],
  },
  {
    id: 'pecas',
    title: 'Que peças você mais usa?',
    sub: 'Pode marcar mais de uma',
    type: 'multi',
    style: 'card',
    options: [
      { val: 'legging', label: 'Legging', icon: '👖' },
      { val: 'top', label: 'Top', icon: '👙' },
      { val: 'short', label: 'Short', icon: '🩳' },
      { val: 'jaqueta', label: 'Jaqueta', icon: '🧥' },
      { val: 'body', label: 'Body', icon: '👗' },
      { val: 'macaquinho', label: 'Macaquinho', icon: '🎽' },
      { val: 'cropped', label: 'Cropped', icon: '👚' },
      { val: 'regata', label: 'Regata', icon: '🏃' },
    ],
  },
  {
    id: 'modelagem',
    title: 'Que modelagem prefere?',
    sub: 'Pode marcar mais de uma',
    type: 'multi',
    style: 'card',
    options: [
      { val: 'cintura-alta', label: 'Cintura alta', icon: '⬆️' },
      { val: 'compressao', label: 'Com compressão', icon: '💎' },
      { val: 'soltinho', label: 'Soltinho', icon: '🌊' },
      { val: 'justo', label: 'Justo no corpo', icon: '🎯' },
    ],
  },
  {
    id: 'blacklist',
    title: 'O que NÃO quer receber?',
    sub: 'Selecione tudo que prefere evitar',
    type: 'multi',
    style: 'tag',
    skippable: true,
    options: [
      { val: 'neon', label: 'Cores neon' },
      { val: 'estampas', label: 'Estampas' },
      { val: 'shorts-curtos', label: 'Shorts curtos' },
      { val: 'transparencia', label: 'Transparência' },
      { val: 'animal-print', label: 'Animal print' },
      { val: 'tie-dye', label: 'Tie-dye' },
      { val: 'brilho', label: 'Brilho / Glitter' },
      { val: 'logos-grandes', label: 'Logos grandes' },
      { val: 'rosa-pink', label: 'Rosa pink' },
    ],
  },
]

// EDITAR: links reais de checkout por plano
const CHECKOUT_LINKS: Record<string, string> = {
  anual: '#', // link real de pagamento anual
  semestral: '#', // link real de pagamento semestral
  mensal: '#', // link real de pagamento mensal
}

const PLAN_NAMES: Record<string, string> = {
  anual: 'Plano Anual',
  semestral: 'Plano Semestral',
  mensal: 'Plano Mensal',
}

export default function PerfilDeLook({ planoPreSelecionado }: Props) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [done, setDone] = useState(false)

  const step = STEPS[current]
  const total = STEPS.length
  const progress = ((current + 1) / total) * 100

  // Fluxo: veio de um plano ou veio do "crie seu perfil"?
  const veioDoPlano = !!planoPreSelecionado
  const nomePlano = planoPreSelecionado ? PLAN_NAMES[planoPreSelecionado] || planoPreSelecionado : ''
  const checkoutLink = planoPreSelecionado ? CHECKOUT_LINKS[planoPreSelecionado] || '#' : '#'

  const toggle = useCallback(
    (val: string) => {
      if (!step) return
      const { id, type } = step
      setAnswers((prev) => {
        if (type === 'single') return { ...prev, [id]: val }
        const arr = (prev[id] as string[]) || []
        return {
          ...prev,
          [id]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val],
        }
      })
    },
    [step]
  )

  const isSelected = (val: string) => {
    if (!step) return false
    const a = answers[step.id]
    if (step.type === 'single') return a === val
    return Array.isArray(a) && a.includes(val)
  }

  const canAdvance = () => {
    if (!step) return false
    if (step.skippable) return true
    const a = answers[step.id]
    if (step.type === 'single') return !!a
    return Array.isArray(a) && a.length > 0
  }

  const next = () => {
    if (current >= total - 1) {
      // EDITAR: aqui manda as respostas pro backend
      console.log('Perfil de Look:', JSON.stringify(answers, null, 2))
      setDone(true)
      window.scrollTo(0, 0)
      return
    }
    setCurrent((c) => c + 1)
    window.scrollTo(0, 0)
  }

  const prev = () => {
    if (current > 0) setCurrent((c) => c - 1)
  }

  /* ═══════════════════════════════════
     TELA FINAL — muda conforme o fluxo
     ═══════════════════════════════════ */
  if (done) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--gelo)' }}>
        <div className="q-hdr">
          <span className="q-logo">VIVE FIT</span>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 5%' }}>
          <div className="done">
            {/* EDITAR: substituir emoji por imagem → <img src="/img/done-check.png" ... /> */}
            <div className="done-ico">✨</div>
            <h2>Seu perfil de look tá pronto.</h2>
            <p className="editorial">"Agora a gente cuida do resto."</p>

            {veioDoPlano ? (
              <>
                {/* FLUXO 2: veio do plano → vai pro pagamento */}
                <p>Tudo certo com o seu perfil. Agora é só finalizar o pagamento do <strong>{nomePlano}</strong>.</p>
                <a href={checkoutLink} className="btn btn-coral" style={btnStyle}>
                  ir pro pagamento
                </a>
              </>
            ) : (
              <>
                {/* FLUXO 1: veio do perfil → vai escolher plano */}
                <p>Com base nas suas escolhas, vamos selecionar peças que combinam com o seu estilo. Agora escolha seu plano.</p>
                <a href="#/" className="btn btn-coral" style={btnStyle} onClick={() => {
                  // Volta pra landing e scrolla pros planos
                  setTimeout(() => {
                    const el = document.getElementById('planos')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }, 100)
                }}>
                  escolher meu plano
                </a>
              </>
            )}

            <p style={{ marginTop: '1rem', fontSize: '.72rem', color: 'var(--cinza-mudo)' }}>
              Você pode alterar seu perfil a qualquer momento.
            </p>
          </div>
        </div>
      </div>
    )
  }

  /* ═══════════════════════════════════
     QUIZ — perguntas
     ═══════════════════════════════════ */
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--gelo)' }}>
      {/* Header mini */}
      <div className="q-hdr">
        <span className="q-logo">VIVE FIT</span>
        <a href="#/" className="q-close">voltar ao site</a>
      </div>

      {/* Info do plano pré-selecionado */}
      {veioDoPlano && (
        <div style={{
          textAlign: 'center',
          padding: '.4rem 5%',
          background: 'var(--cobalto-soft)',
          fontSize: '.68rem',
          color: 'var(--cobalto)',
          fontFamily: 'var(--font-heading)',
          letterSpacing: '.04em',
        }}>
          {nomePlano} selecionado — preencha seu perfil pra continuar
        </div>
      )}

      {/* Conteúdo da pergunta */}
      <div className="q-wrap">
        <h2 className="q-title">{step.title}</h2>
        <p className="q-sub">{step.sub}</p>
        {step.type === 'multi' && <div className="multi-hint">seleção múltipla</div>}

        {step.style === 'pill' && (
          <div className="opts">
            {step.options.map((o) => (
              <div key={o.val} className={`pill${isSelected(o.val) ? ' sel' : ''}`} onClick={() => toggle(o.val)}>
                {o.label}
              </div>
            ))}
          </div>
        )}

        {step.style === 'card' && (
          <div className="opts" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.6rem' }}>
            {step.options.map((o) => (
              <div key={o.val} className={`card-opt${isSelected(o.val) ? ' sel' : ''}`} onClick={() => toggle(o.val)}>
                <div className="card-ico">{o.icon}</div>
                <div className="card-label">{o.label}</div>
              </div>
            ))}
          </div>
        )}

        {step.style === 'swatch' && (
          <div className="swatches">
            {step.options.map((o) => (
              <div className="swatch-wrap" key={o.val} onClick={() => toggle(o.val)}>
                <div className={`swatch${isSelected(o.val) ? ' sel' : ''}`} style={{ background: o.color }} />
                <span className="swatch-name">{o.label}</span>
              </div>
            ))}
          </div>
        )}

        {step.style === 'tag' && (
          <div className="opts">
            {step.options.map((o) => (
              <div key={o.val} className={`tag${isSelected(o.val) ? ' sel' : ''}`} onClick={() => toggle(o.val)}>
                {o.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer fixo */}
      <div className="q-footer">
        <div className="q-footer-in">
          <button className={`q-back${current === 0 ? ' hidden' : ''}`} onClick={prev}>
            ← voltar
          </button>
          <div className="q-progress">
            <div className="q-progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <button className="q-next" onClick={next} disabled={!canAdvance()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// Estilo inline pro btn da tela final (pra não depender de classe externa)
const btnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'var(--font-heading)',
  fontWeight: 400,
  fontSize: '.82rem',
  letterSpacing: '.08em',
  textTransform: 'uppercase',
  padding: '.9rem 2.2rem',
  borderRadius: '60px',
  background: 'var(--coral)',
  color: '#fff',
  boxShadow: '0 2px 12px rgba(255,90,95,.25)',
  textDecoration: 'none',
  transition: 'all .3s',
}