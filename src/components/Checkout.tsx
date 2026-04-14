import { useState, useEffect } from 'react'

const API = 'https://api.ogestordolucro.site'

interface Props {
  plano: string
}

interface FreteOpcao {
  nome: string
  empresa: string
  preco: number
  prazo: number
}

const PLAN_INFO: Record<string, { nome: string; valor: string; valorNum: number }> = {
  mensal: { nome: 'Plano Mensal', valor: 'R$199,90/mês', valorNum: 199.9 },
  semestral: { nome: 'Plano Semestral', valor: 'R$189,90/mês (6x de R$189,90)', valorNum: 1139.4 },
  anual: { nome: 'Plano Anual', valor: 'R$179,90/mês (12x de R$179,90)', valorNum: 2158.8 },
}

async function criarCheckout(plano: string): Promise<string | null> {
  try {
    const res = await fetch(API + '/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plano }),
    })
    const data = await res.json()
    return data.url || null
  } catch {
    return null
  }
}

export default function Checkout({ plano }: Props) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cep, setCep] = useState('')
  const [buscandoFrete, setBuscandoFrete] = useState(false)
  const [freteOpcoes, setFreteOpcoes] = useState<FreteOpcao[]>([])
  const [freteSelecionado, setFreteSelecionado] = useState<FreteOpcao | null>(null)
  const [erroFrete, setErroFrete] = useState('')
  const [pagando, setPagando] = useState(false)

  const info = PLAN_INFO[plano] || PLAN_INFO.mensal

  useEffect(() => {
    const token = localStorage.getItem('vivefit_token')
    if (!token) return
    fetch(API + '/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.nome) setNome(data.nome)
        if (data.email) setEmail(data.email)
      })
      .catch(() => {})
  }, [])

  const formatCep = (val: string) => {
    const nums = val.replace(/\D/g, '').slice(0, 8)
    if (nums.length > 5) return nums.slice(0, 5) + '-' + nums.slice(5)
    return nums
  }

  const calcularFrete = async () => {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) {
      setErroFrete('Digite um CEP válido com 8 dígitos')
      return
    }

    setErroFrete('')
    setBuscandoFrete(true)
    setFreteOpcoes([])
    setFreteSelecionado(null)

    try {
      const res = await fetch(API + '/frete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep: cepLimpo }),
      })
      const data = await res.json()

      if (data.opcoes && data.opcoes.length > 0) {
        setFreteOpcoes(data.opcoes)
        setFreteSelecionado(data.opcoes[0])
      } else {
        setErroFrete(data.error || 'Nenhuma opção de frete encontrada')
      }
    } catch {
      setErroFrete('Erro ao calcular frete. Tente novamente.')
    }
    setBuscandoFrete(false)
  }

  const total = freteSelecionado
    ? (plano === 'mensal' ? 199.9 : info.valorNum) + freteSelecionado.preco
    : null

  const irParaPagamento = async () => {
    setPagando(true)
    const url = await criarCheckout(plano)
    setPagando(false)
    if (url) {
      window.location.href = url
    } else {
      alert('Erro ao gerar pagamento. Tente novamente ou fale pelo WhatsApp.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--gelo)' }}>
      <div className="q-hdr">
        <span className="q-logo">
          <img src="https://i.postimg.cc/CLyDrrMm/logo-vivefit-turquesa.png" alt="VIVE FIT" style={{ height: '44px' }} />
        </span>
        <a href="#/" className="q-close">voltar ao site</a>
      </div>

      <div style={{ flex: 1, padding: '1.5rem 5%', maxWidth: '500px', margin: '0 auto', width: '100%' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--azul-noite)', marginBottom: '.3rem' }}>
          Resumo do pedido
        </h2>
        <p style={{ fontSize: '.78rem', color: 'var(--cinza-mudo)', marginBottom: '1.5rem' }}>
          Confira seus dados antes de finalizar
        </p>

        {/* Dados da assinante */}
        <Card>
          <CardLabel>Assinante</CardLabel>
          <p style={dataText}>{nome}</p>
          <p style={{ ...dataText, fontSize: '.72rem', color: 'var(--cinza-mudo)' }}>{email}</p>
        </Card>

        {/* Plano */}
        <Card>
          <CardLabel>Plano escolhido</CardLabel>
          <p style={{ ...dataText, fontWeight: 700 }}>{info.nome}</p>
          <p style={{ ...dataText, fontSize: '.75rem' }}>{info.valor}</p>
          <p style={{ ...dataText, fontSize: '.68rem', color: 'var(--cinza-mudo)' }}>4 peças por mês</p>
        </Card>

        {/* Frete */}
        <Card>
          <CardLabel>Calcular frete</CardLabel>
          <div style={{ display: 'flex', gap: '.5rem', marginTop: '.4rem' }}>
            <input
              type="text"
              placeholder="00000-000"
              value={cep}
              onChange={e => setCep(formatCep(e.target.value))}
              style={inputStyle}
            />
            <button
              onClick={calcularFrete}
              disabled={buscandoFrete}
              style={calcBtnStyle}
            >
              {buscandoFrete ? '...' : 'calcular'}
            </button>
          </div>

          {erroFrete && (
            <p style={{ fontSize: '.72rem', color: 'var(--coral)', marginTop: '.4rem' }}>{erroFrete}</p>
          )}

          {freteOpcoes.length > 0 && (
            <div style={{ marginTop: '.8rem', display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
              {freteOpcoes.map((op, i) => (
                <div
                  key={i}
                  onClick={() => setFreteSelecionado(op)}
                  style={{
                    padding: '.6rem .8rem',
                    borderRadius: '10px',
                    border: freteSelecionado === op ? '2px solid var(--coral)' : '1px solid #ddd',
                    background: freteSelecionado === op ? 'rgba(255,90,95,.05)' : '#fff',
                    cursor: 'pointer',
                    transition: 'all .2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--azul-noite)' }}>
                        {op.empresa} — {op.nome}
                      </span>
                      <span style={{ fontSize: '.68rem', color: 'var(--cinza-mudo)', marginLeft: '.4rem' }}>
                        {op.prazo} dias úteis
                      </span>
                    </div>
                    <span style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--azul-noite)' }}>
                      R${op.preco.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Total */}
        {freteSelecionado && total && (
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <CardLabel>Total</CardLabel>
                <p style={{ fontSize: '.68rem', color: 'var(--cinza-mudo)', margin: '.2rem 0 0' }}>
                  {info.nome} + frete ({freteSelecionado.empresa})
                </p>
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--azul-noite)',
              }}>
                R${total.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </Card>
        )}

        {/* Botão pagar */}
        <button
          onClick={irParaPagamento}
          disabled={!freteSelecionado || pagando}
          style={{
            ...pagarBtnStyle,
            opacity: !freteSelecionado || pagando ? 0.5 : 1,
            cursor: !freteSelecionado || pagando ? 'not-allowed' : 'pointer',
          }}
        >
          {pagando ? 'gerando link de pagamento...' : 'finalizar pagamento'}
        </button>

        {!freteSelecionado && (
          <p style={{ textAlign: 'center', fontSize: '.7rem', color: 'var(--cinza-mudo)', marginTop: '.5rem' }}>
            Calcule o frete pra liberar o pagamento
          </p>
        )}

        <p style={{ textAlign: 'center', fontSize: '.65rem', color: 'var(--cinza-mudo)', marginTop: '1.5rem' }}>
          Pagamento seguro via InfinitePay. Plano mensal sem fidelidade.
        </p>
      </div>
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '14px',
      padding: '1rem 1.2rem',
      marginBottom: '.8rem',
      boxShadow: '0 1px 4px rgba(0,0,0,.05)',
    }}>
      {children}
    </div>
  )
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '.65rem',
      fontFamily: 'var(--font-heading)',
      textTransform: 'uppercase',
      letterSpacing: '.06em',
      color: 'var(--cinza-mudo)',
      margin: '0 0 .3rem',
    }}>
      {children}
    </p>
  )
}

const dataText: React.CSSProperties = {
  fontSize: '.82rem',
  color: 'var(--azul-noite)',
  margin: '.1rem 0',
  fontFamily: 'var(--font-body)',
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: '.65rem .8rem',
  borderRadius: '10px',
  border: '1px solid #ddd',
  fontSize: '.82rem',
  fontFamily: 'var(--font-body)',
  background: '#fff',
  outline: 'none',
}

const calcBtnStyle: React.CSSProperties = {
  padding: '.65rem 1rem',
  borderRadius: '10px',
  border: 'none',
  background: 'var(--cobalto)',
  color: '#fff',
  fontSize: '.72rem',
  fontFamily: 'var(--font-heading)',
  fontWeight: 700,
  letterSpacing: '.04em',
  textTransform: 'uppercase',
  cursor: 'pointer',
}

const pagarBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  fontFamily: 'var(--font-heading)',
  fontWeight: 700,
  fontSize: '.82rem',
  letterSpacing: '.06em',
  textTransform: 'uppercase',
  padding: '1rem 2rem',
  borderRadius: '60px',
  background: 'var(--coral)',
  color: '#fff',
  boxShadow: '0 2px 12px rgba(255,90,95,.25)',
  border: 'none',
  marginTop: '1rem',
  transition: 'all .3s',
}