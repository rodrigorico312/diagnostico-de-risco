import { useState, useEffect } from 'react'

const API = 'https://api.ogestordolucro.site'

interface UserData {
  id: number
  nome: string
  email: string
  telefone: string | null
  plano: string | null
  status: string
}

const TAMANHOS = ['36', '38', '40', '42', '44', '46']

const CORES = [
  { val: 'preto', label: 'Preto', color: '#1E1E1C' },
  { val: 'branco', label: 'Branco', color: '#F0EDE8' },
  { val: 'cinza', label: 'Cinza', color: '#9CA3AF' },
  { val: 'nude', label: 'Nude', color: '#D4A985' },
  { val: 'azul', label: 'Azul', color: '#1E3A8A' },
  { val: 'azul-claro', label: 'Azul claro', color: '#7EC8E3' },
  { val: 'verde', label: 'Verde', color: '#4A5D23' },
  { val: 'terra', label: 'Terra', color: '#8B6F4E' },
  { val: 'bordo', label: 'Bordô', color: '#7A1A1A' },
  { val: 'vermelho', label: 'Vermelho', color: '#DC2626' },
  { val: 'rosa', label: 'Rosa', color: '#EC4899' },
  { val: 'rosa-bebe', label: 'Rosa bebê', color: '#FBCFE8' },
  { val: 'magenta', label: 'Magenta', color: '#C026D3' },
  { val: 'coral', label: 'Coral', color: '#FF5A5F' },
  { val: 'laranja', label: 'Laranja', color: '#F97316' },
  { val: 'lilas', label: 'Lilás', color: '#A78BFA' },
]

const TREINOS = ['Musculação', 'Funcional', 'Yoga', 'Corrida', 'Pilates', 'CrossFit']
const PECAS = ['Legging', 'Top', 'Short', 'Corta Vento', 'Body', 'Macaquinho', 'Cropped', 'Regata']
const MODELAGENS = ['Cintura alta', 'Com compressão', 'Soltinho', 'Justo no corpo']
const BLACKLIST_OPTS = ['Cores neon', 'Estampas', 'Shorts curtos', 'Transparência', 'Animal print', 'Tie-dye', 'Brilho / Glitter', 'Logos grandes', 'Rosa pink']

type TabType = 'perfil' | 'endereco' | 'box' | 'plano'

function formatCep(val: string): string {
  const nums = val.replace(/\D/g, '').slice(0, 8)
  if (nums.length > 5) return nums.slice(0, 5) + '-' + nums.slice(5)
  return nums
}

export default function ClientArea() {
  const [user, setUser] = useState<UserData | null>(null)
  const [tab, setTab] = useState<TabType>('perfil')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  // Perfil state
  const [tamanho, setTamanho] = useState('')
  const [treinos, setTreinos] = useState<string[]>([])
  const [cores, setCores] = useState<string[]>([])
  const [pecas, setPecas] = useState<string[]>([])
  const [modelagem, setModelagem] = useState<string[]>([])
  const [blacklist, setBlacklist] = useState<string[]>([])

  // Endereco state
  const [cep, setCep] = useState('')
  const [rua, setRua] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [buscandoCep, setBuscandoCep] = useState(false)

  const token = localStorage.getItem('vivefit_token')
  const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }

  useEffect(() => {
    if (!token) return
    Promise.all([
      fetch(API + '/auth/me', { headers }).then(r => r.json()),
      fetch(API + '/perfil', { headers }).then(r => r.json()),
      fetch(API + '/endereco', { headers }).then(r => r.json()),
    ]).then(([userData, perfilData, enderecoData]) => {
      setUser(userData)
      if (perfilData.perfil) {
        setTamanho(perfilData.perfil.tamanho || '')
        setTreinos(perfilData.perfil.treinos || [])
        setCores(perfilData.perfil.cores || [])
        setPecas(perfilData.perfil.pecas || [])
        setModelagem(perfilData.perfil.modelagem || [])
        setBlacklist(perfilData.perfil.blacklist || [])
      }
      if (enderecoData.endereco) {
        const e = enderecoData.endereco
        if (e.endereco_cep) setCep(formatCep(e.endereco_cep))
        if (e.endereco_rua) setRua(e.endereco_rua)
        if (e.endereco_numero) setNumero(e.endereco_numero)
        if (e.endereco_complemento) setComplemento(e.endereco_complemento)
        if (e.endereco_bairro) setBairro(e.endereco_bairro)
        if (e.endereco_cidade) setCidade(e.endereco_cidade)
        if (e.endereco_estado) setEstado(e.endereco_estado)
      }
      setLoading(false)
    }).catch(() => {
      localStorage.removeItem('vivefit_token')
      localStorage.removeItem('vivefit_nome')
      window.location.hash = '#/login'
    })
  }, [])

  const toggleArr = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val])
  }

  const buscarCep = async (cepVal: string) => {
    const cepLimpo = cepVal.replace(/\D/g, '')
    if (cepLimpo.length !== 8) return
    setBuscandoCep(true)
    try {
      const res = await fetch('https://viacep.com.br/ws/' + cepLimpo + '/json/')
      const data = await res.json()
      if (!data.erro) {
        setRua(data.logradouro || '')
        setBairro(data.bairro || '')
        setCidade(data.localidade || '')
        setEstado(data.uf || '')
      }
    } catch {}
    setBuscandoCep(false)
  }

  const handleCepChange = (val: string) => {
    const formatted = formatCep(val)
    setCep(formatted)
    if (formatted.replace(/\D/g, '').length === 8) buscarCep(formatted)
  }

  const salvarPerfil = async () => {
    setSaving(true)
    setMsg('')
    try {
      const res = await fetch(API + '/perfil', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ tamanho, treinos, cores, pecas, modelagem, blacklist }),
      })
      if (res.ok) { setMsg('Perfil atualizado!'); setTimeout(() => setMsg(''), 3000) }
    } catch { setMsg('Erro ao salvar. Tente novamente.') }
    setSaving(false)
  }

  const salvarEndereco = async () => {
    const cepLimpo = cep.replace(/\D/g, '')
    if (!cepLimpo || !rua || !numero || !bairro || !cidade || !estado) {
      setMsg('Preencha todos os campos obrigatórios')
      setTimeout(() => setMsg(''), 3000)
      return
    }
    setSaving(true)
    setMsg('')
    try {
      const res = await fetch(API + '/endereco', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ cep: cepLimpo, rua, numero, complemento, bairro, cidade, estado }),
      })
      if (res.ok) { setMsg('Endereço salvo!'); setTimeout(() => setMsg(''), 3000) }
    } catch { setMsg('Erro ao salvar. Tente novamente.') }
    setSaving(false)
  }

  const logout = () => {
    localStorage.removeItem('vivefit_token')
    localStorage.removeItem('vivefit_nome')
    localStorage.removeItem('vivefit_quiz_done')
    window.location.hash = '#/'
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gelo)' }}>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--cinza-mudo)' }}>Carregando...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gelo)' }}>
      <div className="q-hdr" style={{ justifyContent: 'space-between' }}>
        <span className="q-logo">
          <img src="https://i.postimg.cc/CLyDrrMm/logo-vivefit-turquesa.png" alt="VIVE FIT" style={{ height: '220px' }} />
        </span>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a href="#/" style={{ fontSize: '.72rem', color: 'var(--cinza-mudo)', textDecoration: 'none' }}>site</a>
          <span onClick={logout} style={{ fontSize: '.72rem', color: 'var(--coral)', cursor: 'pointer' }}>sair</span>
        </div>
      </div>

      <div style={{ padding: '1.5rem 5% .5rem', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--azul-noite)', margin: 0 }}>
          Olá, {user?.nome?.split(' ')[0]}
        </h2>
        <p style={{ fontSize: '.75rem', color: 'var(--cinza-mudo)', margin: '.2rem 0 0' }}>
          {user?.plano ? `Plano ${user.plano}` : 'Nenhum plano ativo'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0', maxWidth: '600px', margin: '1rem auto 0', padding: '0 5%', overflowX: 'auto' }}>
        {(['perfil', 'endereco', 'box', 'plano'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1,
            padding: '.6rem .3rem',
            fontSize: '.65rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: tab === t ? 700 : 400,
            letterSpacing: '.04em',
            textTransform: 'uppercase' as const,
            background: tab === t ? '#fff' : 'transparent',
            color: tab === t ? 'var(--azul-noite)' : 'var(--cinza-mudo)',
            border: 'none',
            borderBottom: tab === t ? '2px solid var(--coral)' : '2px solid transparent',
            cursor: 'pointer',
            whiteSpace: 'nowrap' as const,
          }}>
            {t === 'perfil' ? 'Meu Look' : t === 'endereco' ? 'Endereço' : t === 'box' ? 'Minha Box' : 'Meu Plano'}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1.5rem 5% 3rem' }}>

        {tab === 'perfil' && (
          <div>
            <SectionTitle>Tamanho</SectionTitle>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
              {TAMANHOS.map(t => (
                <Chip key={t} selected={tamanho === t} onClick={() => setTamanho(t)}>{t}</Chip>
              ))}
            </div>

            <SectionTitle>Treinos</SectionTitle>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
              {TREINOS.map(t => (
                <Chip key={t} selected={treinos.includes(t)} onClick={() => toggleArr(treinos, t, setTreinos)}>{t}</Chip>
              ))}
            </div>

            <SectionTitle>Cores preferidas</SectionTitle>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
              {CORES.map(c => (
                <div key={c.val} onClick={() => toggleArr(cores, c.val, setCores)} style={{ textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ width: '36px', height: '220px', borderRadius: '50%', background: c.color, border: cores.includes(c.val) ? '3px solid var(--coral)' : '2px solid #ddd', transition: 'all .2s' }} />
                  <span style={{ fontSize: '.55rem', color: 'var(--cinza-mudo)' }}>{c.label}</span>
                </div>
              ))}
            </div>

            <SectionTitle>Peças preferidas</SectionTitle>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
              {PECAS.map(p => (
                <Chip key={p} selected={pecas.includes(p)} onClick={() => toggleArr(pecas, p, setPecas)}>{p}</Chip>
              ))}
            </div>

            <SectionTitle>Modelagem</SectionTitle>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
              {MODELAGENS.map(m => (
                <Chip key={m} selected={modelagem.includes(m)} onClick={() => toggleArr(modelagem, m, setModelagem)}>{m}</Chip>
              ))}
            </div>

            <SectionTitle>Não quero receber</SectionTitle>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
              {BLACKLIST_OPTS.map(b => (
                <Chip key={b} selected={blacklist.includes(b)} onClick={() => toggleArr(blacklist, b, setBlacklist)} variant="outline">{b}</Chip>
              ))}
            </div>

            {msg && tab === 'perfil' && <p style={{ textAlign: 'center', fontSize: '.75rem', color: msg.includes('Erro') ? 'var(--coral)' : '#16a34a', marginTop: '1rem' }}>{msg}</p>}

            <button onClick={salvarPerfil} disabled={saving} style={{ ...actionBtnStyle, opacity: saving ? 0.6 : 1 }}>
              {saving ? 'salvando...' : 'salvar perfil'}
            </button>
          </div>
        )}

        {tab === 'endereco' && (
          <div>
            <SectionTitle>Endereço de entrega</SectionTitle>
            <p style={{ fontSize: '.72rem', color: 'var(--cinza-mudo)', marginBottom: '1rem' }}>Este é o endereço onde suas boxes serão entregues. Atualize sempre que mudar.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
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

            {msg && tab === 'endereco' && <p style={{ textAlign: 'center', fontSize: '.75rem', color: msg.includes('Erro') || msg.includes('Preencha') ? 'var(--coral)' : '#16a34a', marginTop: '1rem' }}>{msg}</p>}

            <button onClick={salvarEndereco} disabled={saving} style={{ ...actionBtnStyle, opacity: saving ? 0.6 : 1 }}>
              {saving ? 'salvando...' : 'salvar endereço'}
            </button>
          </div>
        )}

        {tab === 'box' && (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📦</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--azul-noite)', fontSize: '1rem' }}>Sua box está sendo preparada</h3>
            <p style={{ fontSize: '.78rem', color: 'var(--cinza-mudo)', maxWidth: '300px', margin: '.5rem auto' }}>Quando enviarmos, o código de rastreio aparece aqui automaticamente.</p>
          </div>
        )}

        {tab === 'plano' && (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
              <p style={{ fontSize: '.7rem', color: 'var(--cinza-mudo)', textTransform: 'uppercase' as const, letterSpacing: '.06em', margin: '0 0 .5rem' }}>Plano atual</p>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--azul-noite)', margin: '0 0 .3rem' }}>
                {user?.plano ? 'Plano ' + user.plano.charAt(0).toUpperCase() + user.plano.slice(1) : 'Nenhum plano ativo'}
              </h3>
              <p style={{ fontSize: '.75rem', color: 'var(--cinza-mudo)' }}>4 peças por mês</p>

              {!user?.plano && (
                <a href="#/" style={{ display: 'inline-block', marginTop: '1rem', padding: '.7rem 1.5rem', borderRadius: '60px', background: 'var(--coral)', color: '#fff', fontSize: '.75rem', fontFamily: 'var(--font-heading)', fontWeight: 700, textDecoration: 'none', letterSpacing: '.05em', textTransform: 'uppercase' as const }} onClick={() => { setTimeout(() => { const el = document.getElementById('planos'); if (el) el.scrollIntoView({ behavior: 'smooth' }) }, 100) }}>escolher plano</a>
              )}

              <p style={{ fontSize: '.65rem', color: 'var(--cinza-mudo)', marginTop: '1rem' }}>Precisa de ajuda? Fale pelo WhatsApp</p>
              <a href="https://wa.me/5593992101980" target="_blank" rel="noopener" style={{ fontSize: '.72rem', color: 'var(--turquesa)', textDecoration: 'none' }}>(93) 99210-1980</a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '.82rem', color: 'var(--azul-noite)', margin: '1.5rem 0 .5rem' }}>{children}</h3>
}

function Chip({ children, selected, onClick, variant }: { children: React.ReactNode; selected: boolean; onClick: () => void; variant?: 'outline' }) {
  const isOutline = variant === 'outline'
  return (
    <div onClick={onClick} style={{ padding: '.4rem .8rem', borderRadius: '20px', fontSize: '.72rem', fontFamily: 'var(--font-body)', cursor: 'pointer', transition: 'all .2s', background: selected ? (isOutline ? 'var(--coral)' : 'var(--cobalto)') : (isOutline ? 'transparent' : '#fff'), color: selected ? '#fff' : 'var(--azul-noite)', border: selected ? (isOutline ? '1px solid var(--coral)' : '1px solid var(--cobalto)') : '1px solid #ddd' }}>{children}</div>
  )
}

const inputStyle: React.CSSProperties = { padding: '.65rem .8rem', borderRadius: '10px', border: '1px solid #ddd', fontSize: '.82rem', fontFamily: 'var(--font-body)', background: '#fff', outline: 'none', boxSizing: 'border-box' as const, width: '100%' }

const actionBtnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '.82rem', letterSpacing: '.06em', textTransform: 'uppercase' as const, padding: '.9rem 2.2rem', borderRadius: '60px', background: 'var(--coral)', color: '#fff', boxShadow: '0 2px 12px rgba(255,90,95,.25)', border: 'none', cursor: 'pointer', width: '100%', marginTop: '1.5rem' }