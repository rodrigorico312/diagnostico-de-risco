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

const PLAN_INFO: Record<string, { nome: string; valorMes: string; valorTotal: number; parcelas: string; meses: number }> = {
  mensal: { nome: 'Plano Mensal', valorMes: 'R$199,90/mês', valorTotal: 199.90, parcelas: 'recorrência mensal no cartão', meses: 1 },
  semestral: { nome: 'Plano Semestral', valorMes: 'R$189,90/mês', valorTotal: 1139.40, parcelas: '6x no cartão', meses: 6 },
  anual: { nome: 'Plano Anual', valorMes: 'R$179,90/mês', valorTotal: 2158.80, parcelas: '12x no cartão', meses: 12 },
}

function formatBRL(val: number): string {
  return 'R$' + val.toFixed(2).replace('.', ',')
}

function formatCpf(val: string): string {
  const nums = val.replace(/\D/g, '').slice(0, 11)
  if (nums.length <= 3) return nums
  if (nums.length <= 6) return nums.slice(0, 3) + '.' + nums.slice(3)
  if (nums.length <= 9) return nums.slice(0, 3) + '.' + nums.slice(3, 6) + '.' + nums.slice(6)
  return nums.slice(0, 3) + '.' + nums.slice(3, 6) + '.' + nums.slice(6, 9) + '-' + nums.slice(9)
}

function formatCep(val: string): string {
  const nums = val.replace(/\D/g, '').slice(0, 8)
  if (nums.length > 5) return nums.slice(0, 5) + '-' + nums.slice(5)
  return nums
}

function filtrarFreteOpcoes(opcoes: FreteOpcao[]): FreteOpcao[] {
  if (opcoes.length === 0) return []
  const barato = opcoes[0]
  const rapido = [...opcoes].sort((a, b) => a.prazo - b.prazo)[0]
  if (barato.nome === rapido.nome && barato.empresa === rapido.empresa) return [barato]
  return [barato, rapido]
}

export default function Checkout({ plano }: Props) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [cep, setCep] = useState('')
  const [buscandoFrete, setBuscandoFrete] = useState(false)
  const [freteOpcoes, setFreteOpcoes] = useState<FreteOpcao[]>([])
  const [freteSelecionado, setFreteSelecionado] = useState<FreteOpcao | null>(null)
  const [erroFrete, setErroFrete] = useState('')
  const [erroCpf, setErroCpf] = useState('')
  const [pagando, setPagando] = useState(false)
  const [erroGeral, setErroGeral] = useState('')

  const info = PLAN_INFO[plano] || PLAN_INFO.mensal
  const token = localStorage.getItem('vivefit_token')

  useEffect(() => {
    if (!token) return
    fetch(API + '/auth/me', {
      headers: { 'Authorization': 'Bearer ' + token },
    })
      .then(r => r.json())
      .then(data => {
        if (data.nome) setNome(data.nome)
        if (data.email) setEmail(data.email)
        if (data.cpf) setCpf(formatCpf(data.cpf))
      })
      .catch(() => {})
  }, [])

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
        const filtradas = filtrarFreteOpcoes(data.opcoes)
        setFreteOpcoes(filtradas)
        setFreteSelecionado(filtradas[0])
      } else {
        setErroFrete(data.error || 'Nenhuma opção de frete encontrada')
      }
    } catch {
      setErroFrete('Erro ao calcular frete. Tente novamente.')
    }
    setBuscandoFrete(false)
  }

  const freteTotal = freteSelecionado ? freteSelecionado.preco * info.meses : 0
  const total = freteSelecionado ? info.valorTotal + freteTotal : null

  const irParaPagamento = async () => {
    setErroCpf('')
    setErroGeral('')
    const cpfLimpo = cpf.replace(/\D/g, '')
    if (cpfLimpo.length !== 11) {
      setErroCpf('CPF precisa ter 11 dígitos')
      return
    }
    if (!freteSelecionado || !token) return
    setPagando(true)
    try {
      const res = await fetch(API + '/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          plano,
          frete: freteSelecionado.preco,
          cpf: cpfLimpo,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setErroGeral(data.error || 'Erro ao gerar pagamento. Tente novamente.')
      }
    } catch {
      setErroGeral('Erro de conexão. Tente novamente.')
    }
    setPagando(false)
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
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--azul-noite)', marginBottom: '.3rem' }}>Resumo do pedido</h2>
        <p style={{ fontSize: '.78rem', color: 'var(--cinza-mudo)', marginBottom: '1.5rem' }}>Confira seus dados antes de finalizar</p>

        <Card>
          <CardLabel>Assinante</CardLabel>
          <p style={dataText}>{nome}</p>
          <p style={{ ...dataText, fontSize: '.72rem', color: 'var(--cinza-mudo)' }}>{email}</p>
        </Card>

        <Card>
          <CardLabel>CPF (obrigatório para pagamento)</CardLabel>
          <input type="text" placeholder="000.000.000-00" value={cpf} onChange={e => setCpf(formatCpf(e.target.value))} style={{ ...inputStyle, width: '100%', marginTop: '.3rem' }} />
          {erroCpf && <p style={{ fontSize: '.7rem', color: 'var(--coral)', marginTop: '.3rem' }}>{erroCpf}</p>}
        </Card>

        <Card>
          <CardLabel>Plano escolhido</CardLabel>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ ...dataText, fontWeight: 700 }}>{info.nome}</p>
              <p style={{ ...dataText, fontSize: '.68rem', color: 'var(--cinza-mudo)' }}>4 peças por mês — {info.parcelas}</p>
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--azul-noite)' }}>{formatBRL(info.valorTotal)}</span>
          </div>
        </Card>

        <Card>
          <CardLabel>Calcular frete</CardLabel>
          <div style={{ display: 'flex', gap: '.5rem', marginTop: '.4rem' }}>
            <input type="text" placeholder="00000-000" value={cep} onChange={e => setCep(formatCep(e.target.value))} style={inputStyle} />
            <button onClick={calcularFrete} disabled={buscandoFrete} style={calcBtnStyle}>{buscandoFrete ? '...' : 'calcular'}</button>
          </div>
          {erroFrete && <p style={{ fontSize: '.72rem', color: 'var(--coral)', marginTop: '.4rem' }}>{erroFrete}</p>}
          {freteOpcoes.length > 0 && (
            <div style={{ marginTop: '.8rem', display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
              {freteOpcoes.map((op, i) => (
                <div key={i} onClick={() => setFreteSelecionado(op)} style={{ padding: '.6rem .8rem', borderRadius: '10px', border: freteSelecionado === op ? '2px solid var(--coral)' : '1px solid #ddd', background: freteSelecionado === op ? 'rgba(255,90,95,.05)' : '#fff', cursor: 'pointer', transition: 'all .2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--azul-noite)' }}>{op.empresa} — {op.nome}</span>
                      <div style={{ fontSize: '.65rem', color: 'var(--cinza-mudo)', marginTop: '.1rem' }}>{op.prazo} dias úteis {i === 0 && freteOpcoes.length > 1 ? '· mais econômico' : ''}{i === 1 ? '· mais rápido' : ''}</div>
                    </div>
                    <span style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--azul-noite)' }}>{formatBRL(op.preco)}/mês</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {freteSelecionado && total && (
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.75rem', color: 'var(--azul-noite)' }}>
                <span>{info.nome}</span>
                <span>{formatBRL(info.valorTotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.75rem', color: 'var(--azul-noite)' }}>
                <span>Frete ({freteSelecionado.empresa}) x {info.meses} {info.meses === 1 ? 'mês' : 'meses'}</span>
                <span>{formatBRL(freteTotal)}</span>
              </div>
              <div style={{ borderTop: '1px solid #eee', paddingTop: '.4rem', marginTop: '.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '.8rem', fontWeight: 700, color: 'var(--azul-noite)' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--azul-noite)' }}>{formatBRL(total)}</span>
              </div>
              {plano !== 'mensal' && (
                <p style={{ fontSize: '.65rem', color: 'var(--cinza-mudo)', textAlign: 'right', margin: '.1rem 0 0' }}>{info.parcelas}</p>
              )}
              {plano === 'mensal' && (
                <p style={{ fontSize: '.65rem', color: 'var(--cinza-mudo)', textAlign: 'right', margin: '.1rem 0 0' }}>{formatBRL(199.90 + freteSelecionado.preco)}/mês no cartão</p>
              )}
            </div>
          </Card>
        )}

        {erroGeral && <p style={{ textAlign: 'center', fontSize: '.75rem', color: 'var(--coral)', marginBottom: '.5rem' }}>{erroGeral}</p>}

        <button onClick={irParaPagamento} disabled={!freteSelecionado || pagando || cpf.replace(/\D/g, '').length !== 11} style={{ ...pagarBtnStyle, opacity: (!freteSelecionado || pagando || cpf.replace(/\D/g, '').length !== 11) ? 0.5 : 1, cursor: (!freteSelecionado || pagando) ? 'not-allowed' : 'pointer' }}>
          {pagando ? 'gerando pagamento...' : 'finalizar pagamento'}
        </button>

        {!freteSelecionado && <p style={{ textAlign: 'center', fontSize: '.7rem', color: 'var(--cinza-mudo)', marginTop: '.5rem' }}>Calcule o frete pra liberar o pagamento</p>}

        <p style={{ textAlign: 'center', fontSize: '.65rem', color: 'var(--cinza-mudo)', marginTop: '1.5rem' }}>Pagamento seguro. Plano mensal sem fidelidade — cancele quando quiser.</p>
      </div>
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return <div style={{ background: '#fff', borderRadius: '14px', padding: '1rem 1.2rem', marginBottom: '.8rem', boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}>{children}</div>
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: '.65rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase' as const, letterSpacing: '.06em', color: 'var(--cinza-mudo)', margin: '0 0 .3rem' }}>{children}</p>
}

const dataText: React.CSSProperties = { fontSize: '.82rem', color: 'var(--azul-noite)', margin: '.1rem 0', fontFamily: 'var(--font-body)' }

const inputStyle: React.CSSProperties = { flex: 1, padding: '.65rem .8rem', borderRadius: '10px', border: '1px solid #ddd', fontSize: '.82rem', fontFamily: 'var(--font-body)', background: '#fff', outline: 'none', boxSizing: 'border-box' as const }

const calcBtnStyle: React.CSSProperties = { padding: '.65rem 1rem', borderRadius: '10px', border: 'none', background: 'var(--cobalto)', color: '#fff', fontSize: '.72rem', fontFamily: 'var(--font-heading)', fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase' as const, cursor: 'pointer' }

const pagarBtnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '.82rem', letterSpacing: '.06em', textTransform: 'uppercase' as const, padding: '1rem 2rem', borderRadius: '60px', background: 'var(--coral)', color: '#fff', boxShadow: '0 2px 12px rgba(255,90,95,.25)', border: 'none', marginTop: '1rem', transition: 'all .3s' }