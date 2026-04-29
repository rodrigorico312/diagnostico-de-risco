import { useState, useEffect } from 'react'
import ModalTermos from './ModalTermos'

const API = 'https://api.vivefit.site'

interface Props {
  plano: string
}

interface FreteOpcao {
  nome: string
  empresa: string
  preco: number
  prazo: number
}

type MetodoPagamento = 'PIX' | 'BOLETO' | 'CREDIT_CARD' | null

interface PlanInfo {
  nome: string
  valorPrimeira: number          // valor cobrado na primeira fatura (mensalidade no semestral, lump sum no anual)
  meses: number                  // duracao em meses
  maxParcelas: number            // para dropdown cartao (apenas anual usa)
  metodosPermitidos: ('PIX' | 'BOLETO' | 'CREDIT_CARD')[]
  modeloLabel: string            // texto curto explicativo no resumo
}

const PLAN_INFO: Record<string, PlanInfo> = {
  mensal: {
    nome: 'Plano Mensal',
    valorPrimeira: 199.90,
    meses: 1,
    maxParcelas: 1,
    metodosPermitidos: ['PIX', 'BOLETO', 'CREDIT_CARD'],
    modeloLabel: 'avulso · sem fidelidade',
  },
  semestral: {
    nome: 'Plano Semestral',
    valorPrimeira: 189.90,
    meses: 6,
    maxParcelas: 1,
    metodosPermitidos: ['CREDIT_CARD'],
    modeloLabel: 'cobrança recorrente · 6 meses',
  },
  anual: {
    nome: 'Plano Anual',
    valorPrimeira: 2158.80,
    meses: 12,
    maxParcelas: 12,
    metodosPermitidos: ['PIX', 'BOLETO', 'CREDIT_CARD'],
    modeloLabel: 'pagamento único · até 12x no cartão',
  },
}

const METODO_LABELS: Record<string, { label: string; sub: string }> = {
  PIX: { label: 'Pix', sub: 'à vista' },
  BOLETO: { label: 'Boleto', sub: 'à vista' },
  CREDIT_CARD: { label: 'Cartão', sub: '' },
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
  const [aceiteTermos, setAceiteTermos] = useState(false)
  const [modalTermosAberto, setModalTermosAberto] = useState(false)
  const [cupomInput, setCupomInput] = useState('')
  const [cupomAplicado, setCupomAplicado] = useState<any>(null)
  const [cupomErro, setCupomErro] = useState('')
  const [validandoCupom, setValidandoCupom] = useState(false)
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
  const [metodo, setMetodo] = useState<MetodoPagamento>(null)
  const [parcelas, setParcelas] = useState(1)
  const [erroFrete, setErroFrete] = useState('')
  const [erroCpf, setErroCpf] = useState('')
  const [erroEndereco, setErroEndereco] = useState('')
  const [pagando, setPagando] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)
  const [linkPagamento, setLinkPagamento] = useState<string | null>(null)
  const [erroGeral, setErroGeral] = useState('')

  const info = PLAN_INFO[plano] || PLAN_INFO.mensal
  const token = localStorage.getItem('vivefit_token')
  const isSemestral = plano === 'semestral'
  const isAnual = plano === 'anual'

  // Auto-seleciona o metodo quando ha apenas uma opcao (ex: semestral)
  useEffect(() => {
    if (info.metodosPermitidos.length === 1) {
      setMetodo(info.metodosPermitidos[0] as MetodoPagamento)
    }
  }, [plano])

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
      if (data.erro) { setErroEndereco('CEP não encontrado') } else {
        setRua(data.logradouro || '')
        setBairro(data.bairro || '')
        setCidade(data.localidade || '')
        setEstado(data.uf || '')
      }
    } catch { setErroEndereco('Erro ao buscar CEP') }
    setBuscandoCep(false)
  }

  const handleCepChange = (val: string) => {
    const formatted = formatCep(val)
    setCep(formatted)
    if (formatted.replace(/\D/g, '').length === 8) buscarCep(formatted)
  }

  const calcularFrete = async () => {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) { setErroFrete('Digite um CEP válido'); return }
    if (!numero.trim()) { setErroEndereco('Preencha o número'); return }
    setErroFrete('')
    setErroEndereco('')
    setBuscandoFrete(true)
    setFreteOpcoes([])
    setFreteSelecionado(null)
    try {
      await fetch(API + '/endereco', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ cep: cepLimpo, rua, numero, complemento, bairro, cidade, estado }),
      })
    } catch {}
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
      } else { setErroFrete(data.error || 'Nenhuma opção de frete encontrada') }
    } catch { setErroFrete('Erro ao calcular frete. Tente novamente.') }
    setBuscandoFrete(false)
  }

  // Calculo do total varia por plano:
  // - mensal: valorPrimeira (199.90) + frete x 1 = primeira fatura
  // - semestral: valorPrimeira (189.90) + frete x 1 = primeira mensalidade (cobrada x 6)
  // - anual: valorPrimeira (2158.80) + frete x 12 = lump sum total
  const freteTotal = freteSelecionado
    ? freteSelecionado.preco * (isSemestral ? 1 : info.meses)
    : 0
  const descontoCupom = cupomAplicado ? cupomAplicado.desconto : 0
  const subtotal = freteSelecionado ? info.valorPrimeira + freteTotal : null
  const total = subtotal !== null ? Math.max(0, subtotal - descontoCupom) : null
  const valorParcela = total && parcelas > 1 ? total / parcelas : null

  async function validarCupom() {
    if (!cupomInput.trim()) return
    setValidandoCupom(true)
    setCupomErro('')
    try {
      const r = await fetch(API + '/cupons/validar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: cupomInput.trim(), plano, valor: info.valorPrimeira }),
      })
      const d = await r.json()
      if (!d.valido) {
        setCupomErro(d.erro || 'Cupom invalido')
        setCupomAplicado(null)
      } else {
        setCupomAplicado(d)
        setCupomErro('')
      }
    } catch (err) {
      setCupomErro('Erro ao validar cupom')
    } finally {
      setValidandoCupom(false)
    }
  }

  function removerCupom() {
    setCupomAplicado(null)
    setCupomInput('')
    setCupomErro('')
  }

  const irParaPagamento = async () => {
    setErroCpf('')
    setErroGeral('')
    setErroEndereco('')
    const cpfLimpo = cpf.replace(/\D/g, '')
    if (cpfLimpo.length !== 11) { setErroCpf('CPF precisa ter 11 dígitos'); return }
    if (!rua || !numero || !bairro || !cidade || !estado) { setErroEndereco('Preencha o endereço completo'); return }
    if (!freteSelecionado || !token || !metodo) return
    setPagando(true)

    // Body adaptado por plano:
    // - parcelas so faz sentido em anual com cartao (1-12)
    // - mensal/semestral: parcelas sempre 1
    const parcelasEnvio = (isAnual && metodo === 'CREDIT_CARD') ? parcelas : 1

    try {
      const res = await fetch(API + '/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({
          plano,
          frete: freteSelecionado.preco,
          cpf: cpfLimpo,
          metodoPagamento: metodo,
          parcelas: parcelasEnvio,
          cupom_id: cupomAplicado?.cupom?.id || null,
          desconto_cupom: descontoCupom,
        }),
      })
      const data = await res.json()
      if (data.url) {
        localStorage.setItem('vivefit_payment_url', data.url)
        localStorage.setItem('vivefit_payment_at', String(Date.now()))
        setLinkPagamento(data.url)
        setModalAberto(true)
      } else {
        setErroGeral(data.error || 'Erro ao gerar pagamento. Tente novamente.')
      }
    } catch { setErroGeral('Erro de conexão. Tente novamente.') }
    setPagando(false)
  }

  const enderecoPreenchido = rua && numero && bairro && cidade && estado
  const cpfValido = cpf.replace(/\D/g, '').length === 11
  const podePagar = freteSelecionado && cpfValido && enderecoPreenchido && metodo && aceiteTermos && !pagando

  const opcoesParcelamento: number[] = []
  for (let i = 1; i <= info.maxParcelas; i++) opcoesParcelamento.push(i)

  // Helpers de label para cada metodo no contexto deste plano
  function getMetodoSub(m: 'PIX' | 'BOLETO' | 'CREDIT_CARD'): string {
    if (m === 'CREDIT_CARD') {
      if (isSemestral) return 'recorrente'
      if (isAnual) return 'até 12x'
      return 'à vista'
    }
    return METODO_LABELS[m].sub
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--gelo)' }}>
      <div className="q-hdr">
        <span className="q-logo">
          <img src="https://i.postimg.cc/CLyDrrMm/logo-vivefit-turquesa.png" alt="VIVE FIT" style={{ height: '220px' }} />
        </span>
        <a href="#/" className="q-close">voltar ao site</a>
      </div>

      <div style={{ flex: 1, padding: '1.5rem 5%', maxWidth: '500px', margin: '0 auto', width: '100%' }}>
        <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.3rem', color: 'var(--azul-noite)', marginBottom: '.3rem' }}>Resumo do pedido</h2>
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
              <p style={{ ...dataText, fontSize: '.68rem', color: 'var(--cinza-mudo)' }}>4 peças por mês — {info.modeloLabel}</p>
            </div>
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1rem', fontWeight: 700, color: 'var(--azul-noite)' }}>
              {formatBRL(info.valorPrimeira)}{isSemestral ? '/mês' : ''}
            </span>
          </div>
        </Card>

        <Card>
          <CardLabel>Endereço de entrega</CardLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginTop: '.3rem' }}>
            <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
              <input type="text" placeholder="CEP" value={cep} onChange={e => handleCepChange(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              {buscandoCep && <span style={{ fontSize: '.7rem', color: 'var(--cinza-mudo)' }}>buscando...</span>}
            </div>
            <input type="text" placeholder="Rua / Avenida" value={rua} onChange={e => setRua(e.target.value)} style={{ ...inputStyle, background: rua ? '#fff' : '#f8f8f8' }} />
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <input type="text" placeholder="Número" value={numero} onChange={e => setNumero(e.target.value)} style={{ ...inputStyle, width: '35%' }} />
              <input type="text" placeholder="Complemento (opcional)" value={complemento} onChange={e => setComplemento(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            </div>
            <input type="text" placeholder="Bairro" value={bairro} onChange={e => setBairro(e.target.value)} style={{ ...inputStyle, background: bairro ? '#fff' : '#f8f8f8' }} />
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <input type="text" placeholder="Cidade" value={cidade} onChange={e => setCidade(e.target.value)} style={{ ...inputStyle, flex: 1, background: cidade ? '#fff' : '#f8f8f8' }} />
              <input type="text" placeholder="UF" value={estado} onChange={e => setEstado(e.target.value)} maxLength={2} style={{ ...inputStyle, width: '60px', textAlign: 'center' as const, background: estado ? '#fff' : '#f8f8f8' }} />
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

        {freteSelecionado && total !== null && (
          <Card>
            <CardLabel>Forma de pagamento</CardLabel>
            <div style={{ display: 'flex', gap: '.4rem', marginTop: '.4rem' }}>
              {info.metodosPermitidos.map(val => {
                const labelInfo = METODO_LABELS[val]
                const sub = getMetodoSub(val)
                return (
                  <div
                    key={val}
                    onClick={() => {
                      setMetodo(val as MetodoPagamento)
                      if (val !== 'CREDIT_CARD') setParcelas(1)
                      else setParcelas(isAnual ? info.maxParcelas : 1)
                    }}
                    style={{
                      flex: 1,
                      padding: '.6rem .4rem',
                      borderRadius: '10px',
                      border: metodo === val ? '2px solid var(--coral)' : '1px solid #ddd',
                      background: metodo === val ? 'rgba(255,90,95,.05)' : '#fff',
                      cursor: 'pointer',
                      textAlign: 'center' as const,
                      transition: 'all .2s',
                    }}
                  >
                    <span style={{ fontSize: '.75rem', fontWeight: 600, color: metodo === val ? 'var(--coral)' : 'var(--azul-noite)' }}>{labelInfo.label}</span>
                    <div style={{ fontSize: '.6rem', color: 'var(--cinza-mudo)', marginTop: '.15rem' }}>{sub}</div>
                  </div>
                )
              })}
            </div>

            {/* Aviso semestral */}
            {metodo === 'CREDIT_CARD' && isSemestral && (
              <div style={{ marginTop: '.6rem', padding: '.5rem .7rem', borderRadius: '8px', background: 'rgba(6,182,212,.08)', fontSize: '.7rem', color: 'var(--azul-noite)', lineHeight: 1.4 }}>
                Cobrança recorrente de {total ? formatBRL(total) : ''}/mês no cartão por 6 meses. O limite só é bloqueado mês a mês.
              </div>
            )}

            {/* Aviso mensal cartao (avulso) */}
            {metodo === 'CREDIT_CARD' && plano === 'mensal' && (
              <div style={{ marginTop: '.6rem', padding: '.5rem .7rem', borderRadius: '8px', background: 'rgba(6,182,212,.08)', fontSize: '.7rem', color: 'var(--azul-noite)', lineHeight: 1.4 }}>
                Cobrança única no cartão. Próxima box você adquire quando quiser.
              </div>
            )}

            {/* Select de parcelas (apenas anual cartao) */}
            {metodo === 'CREDIT_CARD' && isAnual && info.maxParcelas > 1 && (
              <div style={{ marginTop: '.8rem' }}>
                <p style={{ fontSize: '.7rem', color: 'var(--cinza-mudo)', marginBottom: '.4rem' }}>Em quantas vezes?</p>
                <select
                  value={parcelas}
                  onChange={e => setParcelas(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '.7rem .8rem',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    background: '#fff',
                    fontSize: '.85rem',
                    color: 'var(--azul-noite)',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                  }}
                >
                  {opcoesParcelamento.map(n => (
                    <option key={n} value={n}>
                      {n}x de {formatBRL(total / n)} sem juros
                    </option>
                  ))}
                </select>
              </div>
            )}
          </Card>
        )}

        {freteSelecionado && metodo && (
          <Card>
            <p style={{ fontSize: '.72rem', color: 'var(--cinza-mudo)', margin: '0 0 .5rem', textTransform: 'uppercase', letterSpacing: '.04em', fontWeight: 600 }}>Cupom de desconto</p>
            {!cupomAplicado ? (
              <div style={{ display: 'flex', gap: '.5rem' }}>
                <input
                  type="text"
                  value={cupomInput}
                  onChange={e => { setCupomInput(e.target.value.toUpperCase()); setCupomErro('') }}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); validarCupom() } }}
                  placeholder="Digite seu cupom"
                  style={{ flex: 1, padding: '.6rem .8rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '.85rem', fontFamily: 'inherit', textTransform: 'uppercase' }}
                />
                <button
                  onClick={validarCupom}
                  disabled={!cupomInput.trim() || validandoCupom}
                  style={{ padding: '.6rem 1rem', borderRadius: '8px', border: '1px solid var(--coral)', background: 'var(--coral)', color: '#fff', cursor: cupomInput.trim() && !validandoCupom ? 'pointer' : 'not-allowed', fontSize: '.82rem', fontWeight: 600, opacity: cupomInput.trim() && !validandoCupom ? 1 : 0.5 }}
                >
                  {validandoCupom ? '...' : 'Aplicar'}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.6rem .8rem', background: 'rgba(22,163,74,.08)', border: '1px solid rgba(22,163,74,.3)', borderRadius: '8px' }}>
                <div>
                  <p style={{ fontSize: '.85rem', color: '#15803D', margin: 0, fontWeight: 600 }}>✓ {cupomAplicado.cupom.codigo} aplicado</p>
                  <p style={{ fontSize: '.7rem', color: '#166534', margin: '.15rem 0 0' }}>Desconto de {formatBRL(descontoCupom)}</p>
                </div>
                <button onClick={removerCupom} style={{ padding: '.3rem .7rem', borderRadius: '6px', border: '1px solid #DC2626', background: 'transparent', color: '#DC2626', cursor: 'pointer', fontSize: '.75rem', fontWeight: 500 }}>remover</button>
              </div>
            )}
            {cupomErro && <p style={{ fontSize: '.75rem', color: 'var(--coral)', margin: '.4rem 0 0' }}>{cupomErro}</p>}
          </Card>
        )}

        {freteSelecionado && total !== null && metodo && (
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.75rem', color: 'var(--azul-noite)' }}>
                <span>{info.nome}{isSemestral ? ' (mensalidade)' : ''}</span>
                <span>{formatBRL(info.valorPrimeira)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.75rem', color: 'var(--azul-noite)' }}>
                <span>
                  Frete ({freteSelecionado.empresa})
                  {isSemestral ? ' (mensal)' : isAnual ? ' x 12 meses' : ''}
                </span>
                <span>{formatBRL(freteTotal)}</span>
              </div>
              {cupomAplicado && descontoCupom > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.75rem', color: '#16a34a', fontWeight: 600 }}>
                  <span>🎟️ Cupom {cupomAplicado.cupom.codigo}</span>
                  <span>-{formatBRL(descontoCupom)}</span>
                </div>
              )}
              <div style={{ borderTop: '1px solid #eee', paddingTop: '.4rem', marginTop: '.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '.8rem', fontWeight: 700, color: 'var(--azul-noite)' }}>
                  {isSemestral ? 'Por mês' : 'Total'}
                </span>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.2rem', fontWeight: 700, color: 'var(--azul-noite)' }}>{formatBRL(total)}</span>
              </div>

              {/* Texto explicativo abaixo do total, varia por plano/metodo */}
              {isSemestral && (
                <p style={{ fontSize: '.68rem', color: 'var(--cinza-mudo)', textAlign: 'right' as const, margin: '.1rem 0 0' }}>
                  cobrado todo mês no cartão · 6 meses
                </p>
              )}
              {isAnual && metodo === 'CREDIT_CARD' && parcelas > 1 && valorParcela && (
                <p style={{ fontSize: '.68rem', color: 'var(--cinza-mudo)', textAlign: 'right' as const, margin: '.1rem 0 0' }}>
                  {parcelas}x de {formatBRL(valorParcela)} sem juros
                </p>
              )}
              {isAnual && metodo === 'CREDIT_CARD' && parcelas === 1 && (
                <p style={{ fontSize: '.68rem', color: 'var(--cinza-mudo)', textAlign: 'right' as const, margin: '.1rem 0 0' }}>
                  à vista no cartão
                </p>
              )}
              {plano === 'mensal' && metodo === 'CREDIT_CARD' && (
                <p style={{ fontSize: '.68rem', color: 'var(--cinza-mudo)', textAlign: 'right' as const, margin: '.1rem 0 0' }}>
                  pagamento único no cartão
                </p>
              )}
              {metodo === 'PIX' && (
                <p style={{ fontSize: '.68rem', color: '#16a34a', textAlign: 'right' as const, margin: '.1rem 0 0' }}>
                  pagamento instantâneo via Pix
                </p>
              )}
              {metodo === 'BOLETO' && (
                <p style={{ fontSize: '.68rem', color: 'var(--cinza-mudo)', textAlign: 'right' as const, margin: '.1rem 0 0' }}>
                  boleto à vista — vence em 3 dias úteis
                </p>
              )}
            </div>
          </Card>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '.6rem', padding: '.8rem 1rem', background: 'rgba(6,182,212,.06)', border: '1px solid rgba(6,182,212,.2)', borderRadius: '10px', marginBottom: '.8rem' }}>
          <input
            type="checkbox"
            checked={aceiteTermos}
            readOnly
            onClick={(e) => { e.preventDefault(); if (!aceiteTermos) setModalTermosAberto(true) }}
            style={{ marginTop: '.25rem', width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--turquesa, #06B6D4)' }}
          />
          <label style={{ fontSize: '.82rem', color: '#334155', lineHeight: 1.5, cursor: 'pointer' }} onClick={() => { if (!aceiteTermos) setModalTermosAberto(true) }}>
            Li e aceito os{' '}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setModalTermosAberto(true) }}
              style={{ color: 'var(--turquesa, #06B6D4)', textDecoration: 'underline', fontWeight: 500 }}
            >
              Termos de uso
            </a>{' '}
            da VIVE FIT BOX.
          </label>
        </div>

        <ModalTermos
          aberto={modalTermosAberto}
          onConfirmar={async () => {
            try {
              const t = localStorage.getItem('vivefit_token')
              const r = await fetch(API + '/aceite-termos', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + t, 'Content-Type': 'application/json' },
              })
              if (!r.ok) throw new Error('Falha ao registrar aceite')
              setAceiteTermos(true)
              setModalTermosAberto(false)
            } catch (err) {
              alert('Nao foi possivel registrar seu aceite. Tente novamente.')
              console.error('[aceite-termos]', err)
            }
          }}
          onCancelar={() => setModalTermosAberto(false)}
        />

        {erroGeral && <p style={{ textAlign: 'center', fontSize: '.75rem', color: 'var(--coral)', marginBottom: '.5rem' }}>{erroGeral}</p>}

        <button onClick={irParaPagamento} disabled={!podePagar} style={{ ...pagarBtnStyle, opacity: podePagar ? 1 : 0.5, cursor: podePagar ? 'pointer' : 'not-allowed' }}>
          {pagando ? 'gerando pagamento...' : 'finalizar pagamento'}
        </button>

        {!metodo && freteSelecionado && <p style={{ textAlign: 'center', fontSize: '.7rem', color: 'var(--cinza-mudo)', marginTop: '.5rem' }}>Escolha a forma de pagamento</p>}
        {!freteSelecionado && <p style={{ textAlign: 'center', fontSize: '.7rem', color: 'var(--cinza-mudo)', marginTop: '.5rem' }}>Preencha o endereço e calcule o frete</p>}

        <p style={{ textAlign: 'center', fontSize: '.65rem', color: 'var(--cinza-mudo)', marginTop: '1.5rem' }}>
          {plano === 'mensal' && 'Pagamento seguro. Plano mensal sem fidelidade — cancele quando quiser.'}
          {isSemestral && 'Pagamento seguro. Plano semestral: cancelamento antes de 6 meses tem multa de 10% sobre o saldo.'}
          {isAnual && 'Pagamento seguro. Plano anual: cancelamento tem multa de 10% sobre o saldo restante.'}
        </p>
      </div>

      {modalAberto && (
        <div onClick={() => setModalAberto(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 9999 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px', padding: '2rem 1.5rem', maxWidth: '420px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,.3)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>🎉</div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: 'var(--azul-noite)', margin: '0 0 1rem', fontWeight: 400 }}>Tudo pronto.</h3>
            <p style={{ fontSize: '.92rem', color: 'var(--cinza-mudo)', lineHeight: 1.6, margin: '0 0 .8rem' }}>
              Por motivos de segurança, o link de pagamento também foi enviado pro seu WhatsApp.
            </p>
            <p style={{ fontSize: '.82rem', color: 'var(--cinza-mudo)', lineHeight: 1.5, margin: '0 0 1.8rem', fontStyle: 'italic' }}>
              A cobrança aparece no nome de Débora Polla (CPF), nossa cofundadora — o CNPJ da VIVE FIT está em processo de abertura.
            </p>
            <a
              href={linkPagamento || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { setTimeout(() => { window.location.hash = '#/sucesso' }, 300) }}
              style={{ display: 'block', background: 'var(--coral)', color: '#fff', padding: '.95rem 1rem', borderRadius: '60px', textDecoration: 'none', fontFamily: 'Montserrat, sans-serif', fontSize: '.82rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: '.8rem', boxShadow: '0 6px 18px rgba(255,90,95,.35)' }}
            >
              Pagar agora
            </a>
            <button
              onClick={() => setModalAberto(false)}
              style={{ width: '100%', background: 'transparent', color: 'var(--cinza-mudo)', padding: '.7rem', border: '1px solid #ddd', borderRadius: '60px', fontFamily: 'Montserrat, sans-serif', fontSize: '.78rem', fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', cursor: 'pointer' }}
            >
              Voltar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return <div style={{ background: '#fff', borderRadius: '14px', padding: '1rem 1.2rem', marginBottom: '.8rem', boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}>{children}</div>
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: '.65rem', fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase' as const, letterSpacing: '.06em', color: 'var(--cinza-mudo)', margin: '0 0 .3rem' }}>{children}</p>
}

const dataText: React.CSSProperties = { fontSize: '.82rem', color: 'var(--azul-noite)', margin: '.1rem 0', fontFamily: 'Montserrat, sans-serif' }
const inputStyle: React.CSSProperties = { padding: '.65rem .8rem', borderRadius: '10px', border: '1px solid #ddd', fontSize: '.82rem', fontFamily: 'Montserrat, sans-serif', background: '#fff', outline: 'none', boxSizing: 'border-box' as const, width: '100%' }
const calcBtnStyle: React.CSSProperties = { padding: '.7rem 1rem', borderRadius: '10px', border: 'none', background: 'var(--cobalto)', color: '#fff', fontSize: '.75rem', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase' as const, cursor: 'pointer' }
const pagarBtnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '.82rem', letterSpacing: '.06em', textTransform: 'uppercase' as const, padding: '1rem 2rem', borderRadius: '60px', background: 'var(--coral)', color: '#fff', boxShadow: '0 2px 12px rgba(255,90,95,.25)', border: 'none', marginTop: '1rem', transition: 'all .3s' }
const erroStyle: React.CSSProperties = { fontSize: '.7rem', color: 'var(--coral)', marginTop: '.3rem' }
