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
  const [rua, setRua] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [buscandoCep, setBuscandoCep] = useState(false)
  const [buscandoFrete, setBuscandoFrete] = useState(false)
  const [freteOpcoes, setFreteOpcoes] = useState<FreteOpcao[]>([])
  const [freteSelecionado, setFreteSelecionado] = useState<FreteOpcao | null>(null)
  const [erroFrete, setErroFrete] = useState('')
  const [erroCpf, setErroCpf] = useState('')
  const [erroEndereco, setErroEndereco] = useState('')
  const [pagando, setPagando] = useState(false)
  const [erroGeral, setErroGeral] = useState('')

  const info = PLAN_INFO[plano] || PLAN_INFO.mensal
  const token = localStorage.getItem('vivefit_token')

  useEffect(() => {
    if (!token) return
    fetch(API + '/auth/me', { headers: { 'Authorization': 'Bearer ' + token } })
      .then(r => r.json())
      .then(data => {
        if (data.nome) setNome(data.nome)
        if (data.email) setEmail(data.email)
        if (data.cpf) setCpf(formatCpf(data.cpf))
      })
      .catch(() => {})

    fetch(API + '/endereco', { headers: { 'Authorization': 'Bearer ' + token } })
      .then(r => r.json())
      .then(data => {
        if (data.endereco) {
          const e = data.endereco
          if (e.endereco_cep) setCep(formatCep(e.endereco_cep))
          if (e.endereco_rua) setRua(e.endereco_rua)
          if (e.endereco_numero) setNumero(e.endereco_numero)
          if (e.endereco_complemento) setComplemento(e.endereco_complemento)
          if (e.endereco_bairro) setBairro(e.endereco_bairro)
          if (e.endereco_cidade) setCidade(e.endereco_cidade)
          if (e.endereco_estado) setEstado(e.endereco_estado)
        }
      })
      .catch(() => {})
  }, [])

  const buscarCep = async (cepVal: string) => {
    const cepLimpo = cepVal.replace(/\D/g, '')
    if (cepLimpo.length !== 8) return

    setBuscandoCep(true)
    setErroEndereco('')
    try {
      const res = await fetch('https://viacep.com.br/ws/' + cepLimpo + '/json/')
      const data = await res.json()
      if (data.erro) {
        setErroEndereco('CEP não encontrado')
      } else {
        setRua(data.logradouro || '')
        setBairro(data.bairro || '')
        setCidade(data.localidade || '')
        setEstado(data.uf || '')
      }
    } catch {
      setErroEndereco('Erro ao buscar CEP')
    }
    setBuscandoCep(false)
  }

  const handleCepChange = (val: string) => {
    const formatted = formatCep(val)
    setCep(formatted)
    const limpo = formatted.replace(/\D/g, '')
    if (limpo.length === 8) buscarCep(limpo)
  }

  const calcularFrete = async () => {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) {
      setErroFrete('Digite um CEP válido com 8 dígitos')
      return
    }
    if (!numero.trim()) {
      setErroEndereco('Preencha o número do endereço')
      return
    }
    setErroFrete('')
    setErroEndereco('')
    setBuscandoFrete(true)
    setFreteOpcoes([])
    setFreteSelecionado(null)

    // Salva endereco no servidor
    try {
      await fetch(API + '/endereco', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ cep: cepLimpo, rua, numero, complemento, bairro, cidade, estado }),
      })
    } catch {}

    // Calcula frete
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
    setErroEndereco('')
    const cpfLimpo = cpf.replace(/\D/g, '')
    if (cpfLimpo.length !== 11) { setErroCpf('CPF precisa ter 11 dígitos'); return }
    if (!rua || !numero || !bairro || !cidade || !estado) { setErroEndereco('Preencha o endereço completo'); return }
    if (!freteSelecionado || !token) return

    setPagando(true)
    try {
      const res = await fetch(API + '/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ plano, frete: freteSelecionado.preco, cpf: cpfLimpo }),
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

  const enderecoPreenchido = rua && numero && bairro && cidade && estado
  const cpfValido = cpf.replace(/\D/g, '').length === 11
  const podePagar = freteSelecionado && cpfValido && enderecoPreenchido && !pagando

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
          <CardLabel>CPF</CardLabel>
          <input type="text" placeholder="000.000.000-00" value={cpf} onChange={e => setCpf(formatCpf(e.target.value))} style={{ ...inputStyle, width: '100%', marginTop: '.3rem' }} />
          {erroCpf && <p style={erroStyle}>{erroCpf}</p>}
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
          <CardLabel>Endereço de entrega</CardLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginTop: '.3rem' }}>
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <div style={{ flex: 1 }}>
                <input type="text" placeholder="CEP" value={cep} onChange={e => handleCepChange(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
              </div>
              {buscandoCep && <span style={{ fontSize: '.7rem', color: 'var(--cinza-mudo)', alignSelf: 'center' }}>buscando...</span>}
            </div>
            <input type="text" placeholder="Rua / Avenida" value={rua} onChange={e => setRua(e.target.value)} style={{ ...inputStyle, width: '100%', background: rua ? '#fff' : '#f8f8f8' }} />
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <input type="text" placeholder="Número" value={numero} onChange={e => setNumero(e.target.value)} style={{ ...inputStyle, width: '35%' }} />
              <input type="text" placeholder="Complemento (opcional)" value={complemento} onChange={e => setComplemento(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            </div>
            <input type="text" placeholder="Bairro" value={bairro} onChange={e => setBairro(e.target.value)} style={{ ...inputStyle, width: '100%', background: bairro ? '#fff' : '#f8f8f8' }} />
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <input type="text" placeholder="Cidade" value={cidade} onChange={e => setCidade(e.target.value)} style={{ ...inputStyle, flex: 1, background: cidade ? '#fff' : '#f8f8f8' }} />
              <input type="text" placeholder="UF" value={estado} onChange={e => setEstado(e.target.value)} maxLength={2} style={{ ...inputStyle, width: '60px', textAlign: 'center', background: estado ? '#fff' : '#f8f8f8' }} />
            </div>
          </div>
          {erroEndereco && <p style={erroStyle}>{erroEndereco}</p>}
        </Card>

        <Card>
          <CardLabel>Frete</CardLabel>
          <button onClick={calcularFrete} disabled={buscandoFrete || cep.replace(/\D/g, '').length !== 8} style={{ ...calcBtnStyle, width: '100%', marginTop: '.3rem', opacity: (buscandoFrete || cep.replace(/\D/g, '').length !== 8) ? 0.5 : 1 }}>
            {buscandoFrete ? 'calculando...' : 'calcular frete'}
          </button>
          {erroFrete && <p style={erroStyle}>{erroFrete}</p>}
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

        <button onClick={irParaPagamento} disabled={!podePagar} style={{ ...pagarBtnStyle, opacity: podePagar ? 1 : 0.5, cursor: podePagar ? 'pointer' : 'not-allowed' }}>
          {pagando ? 'gerando pagamento...' : 'finalizar pagamento'}
        </button>

        {!freteSelecionado && <p style={{ textAlign: 'center', fontSize: '.7rem', color: 'var(--cinza-mudo)', marginTop: '.5rem' }}>Preencha o endereço e calcule o frete pra liberar o pagamento</p>}

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

const inputStyle: React.CSSProperties = { padding: '.65rem .8rem', borderRadius: '10px', border: '1px solid #ddd', fontSize: '.82rem', fontFamily: 'var(--font-body)', background: '#fff', outline: 'none', boxSizing: 'border-box' as const }

const calcBtnStyle: React.CSSProperties = { padding: '.7rem 1rem', borderRadius: '10px', border: 'none', background: 'var(--cobalto)', color: '#fff', fontSize: '.75rem', fontFamily: 'var(--font-heading)', fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase' as const, cursor: 'pointer' }

const pagarBtnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '.82rem', letterSpacing: '.06em', textTransform: 'uppercase' as const, padding: '1rem 2rem', borderRadius: '60px', background: 'var(--coral)', color: '#fff', boxShadow: '0 2px 12px rgba(255,90,95,.25)', border: 'none', marginTop: '1rem', transition: 'all .3s' }

const erroStyle: React.CSSProperties = { fontSize: '.7rem', color: 'var(--coral)', marginTop: '.3rem' }