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

interface PerfilData {
  tamanho: string | null
  treinos: string[]
  cores: string[]
  pecas: string[]
  modelagem: string[]
  blacklist: string[]
  atualizado_em: string | null
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
const BLACKLIST = ['Cores neon', 'Estampas', 'Shorts curtos', 'Transparência', 'Animal print', 'Tie-dye', 'Brilho / Glitter', 'Logos grandes', 'Rosa pink']

export default function ClientArea() {
  const [user, setUser] = useState<UserData | null>(null)
  const [perfil, setPerfil] = useState<PerfilData | null>(null)
  const [tab, setTab] = useState<'perfil' | 'box' | 'plano'>('perfil')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  // Editable perfil state
  const [tamanho, setTamanho] = useState('')
  const [treinos, setTreinos] = useState<string[]>([])
  const [cores, setCores] = useState<string[]>([])
  const [pecas, setPecas] = useState<string[]>([])
  const [modelagem, setModelagem] = useState<string[]>([])
  const [blacklist, setBlacklist] = useState<string[]>([])

  const token = localStorage.getItem('vivefit_token')

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }

  useEffect(() => {
    if (!token) return
    Promise.all([
      fetch(API + '/auth/me', { headers }).then(r => r.json()),
      fetch(API + '/perfil', { headers }).then(r => r.json()),
    ]).then(([userData, perfilData]) => {
      setUser(userData)
      if (perfilData.perfil) {
        setPerfil(perfilData.perfil)
        setTamanho(perfilData.perfil.tamanho || '')
        setTreinos(perfilData.perfil.treinos || [])
        setCores(perfilData.perfil.cores || [])
        setPecas(perfilData.perfil.pecas || [])
        setModelagem(perfilData.perfil.modelagem || [])
        setBlacklist(perfilData.perfil.blacklist || [])
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

  const salvarPerfil = async () => {
    setSaving(true)
    setMsg('')
    try {
      const res = await fetch(API + '/perfil', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ tamanho, treinos, cores, pecas, modelagem, blacklist }),
      })
      if (res.ok) {
        setMsg('Perfil atualizado!')
        setTimeout(() => setMsg(''), 3000)
      }
    } catch {
      setMsg('Erro ao salvar. Tente novamente.')
    }
    setSaving(false)
  }

  const logout = () => {
    localStorage.removeItem('vivefit_token')
    localStorage.removeItem('vivefit_nome')
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
      {/* Header */}
      <div className="q-hdr" style={{ justifyContent: 'space-between' }}>
        <span className="q-logo">
          <img src="https://i.postimg.cc/CLyDrrMm/logo-vivefit-turquesa.png" alt="VIVE FIT" style={{ height: '44px' }} />
        </span>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a href="#/" style={{ fontSize: '.72rem', color: 'var(--cinza-mudo)', textDecoration: 'none' }}>site</a>
          <span onClick={logout} style={{ fontSize: '.72rem', color: 'var(--coral)', cursor: 'pointer' }}>sair</span>
        </div>
      </div>

      {/* Welcome */}
      <div style={{ padding: '1.5rem 5% .5rem', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--azul-noite)', margin: 0 }}>
          Olá, {user?.nome?.split(' ')[0]}
        </h2>
        <p style={{ fontSize: '.75rem', color: 'var(--cinza-mudo)', margin: '.2rem 0 0' }}>
          {user?.plano ? `Plano ${user.plano}` : 'Nenhum plano ativo'}
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', maxWidth: '600px', margin: '1rem auto 0', padding: '0 5%' }}>
        {(['perfil', 'box', 'plano'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: '.6rem',
              fontSize: '.7rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: tab === t ? 700 : 400,
              letterSpacing: '.05em',
              textTransform: 'uppercase',
              background: tab === t ? '#fff' : 'transparent',
              color: tab === t ? 'var(--azul-noite)' : 'var(--cinza-mudo)',
              border: 'none',
              borderBottom: tab === t ? '2px solid var(--coral)' : '2px solid transparent',
              cursor: 'pointer',
            }}
          >
            {t === 'perfil' ? 'Meu Perfil' : t === 'box' ? 'Minha Box' : 'Meu Plano'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1.5rem 5% 3rem' }}>

        {/* ── TAB PERFIL ── */}
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
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: c.color,
                    border: cores.includes(c.val) ? '3px solid var(--coral)' : '2px solid #ddd',
                    transition: 'all .2s',
                  }} />
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
              {BLACKLIST.map(b => (
                <Chip key={b} selected={blacklist.includes(b)} onClick={() => toggleArr(blacklist, b, setBlacklist)} variant="outline">{b}</Chip>
              ))}
            </div>

            {msg && (
              <p style={{ textAlign: 'center', fontSize: '.75rem', color: msg.includes('Erro') ? 'var(--coral)' : '#16a34a', marginTop: '1rem' }}>
                {msg}
              </p>
            )}

            <button onClick={salvarPerfil} disabled={saving} style={{
              ...saveBtnStyle,
              opacity: saving ? 0.6 : 1,
            }}>
              {saving ? 'salvando...' : 'salvar perfil'}
            </button>
          </div>
        )}

        {/* ── TAB BOX ── */}
        {tab === 'box' && (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📦</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--azul-noite)', fontSize: '1rem' }}>
              Sua box está sendo preparada
            </h3>
            <p style={{ fontSize: '.78rem', color: 'var(--cinza-mudo)', maxWidth: '300px', margin: '.5rem auto' }}>
              Quando enviarmos, o código de rastreio aparece aqui automaticamente.
            </p>
          </div>
        )}

        {/* ── TAB PLANO ── */}
        {tab === 'plano' && (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 1px 4px rgba(0,0,0,.06)',
            }}>
              <p style={{ fontSize: '.7rem', color: 'var(--cinza-mudo)', textTransform: 'uppercase', letterSpacing: '.06em', margin: '0 0 .5rem' }}>
                Plano atual
              </p>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--azul-noite)', margin: '0 0 .3rem' }}>
                {user?.plano ? `Plano ${user.plano.charAt(0).toUpperCase() + user.plano.slice(1)}` : 'Nenhum plano ativo'}
              </h3>
              <p style={{ fontSize: '.75rem', color: 'var(--cinza-mudo)' }}>
                4 peças por mês
              </p>

              {!user?.plano && (
                <a href="#/" style={{
                  display: 'inline-block',
                  marginTop: '1rem',
                  padding: '.7rem 1.5rem',
                  borderRadius: '60px',
                  background: 'var(--coral)',
                  color: '#fff',
                  fontSize: '.75rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  textDecoration: 'none',
                  letterSpacing: '.05em',
                  textTransform: 'uppercase',
                }} onClick={() => {
                  setTimeout(() => {
                    const el = document.getElementById('planos')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }, 100)
                }}>
                  escolher plano
                </a>
              )}

              <p style={{ fontSize: '.65rem', color: 'var(--cinza-mudo)', marginTop: '1rem' }}>
                Precisa de ajuda? Fale pelo WhatsApp
              </p>
              
                <a href="https://wa.me/5593992101980"
                target="_blank"
                rel="noopener"
                style={{ fontSize: '.72rem', color: 'var(--turquesa)', textDecoration: 'none' }}
              >
                (93) 99210-1980
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Sub-components ──
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{
      fontFamily: 'var(--font-heading)',
      fontSize: '.82rem',
      color: 'var(--azul-noite)',
      margin: '1.5rem 0 .5rem',
    }}>
      {children}
    </h3>
  )
}

function Chip({ children, selected, onClick, variant }: {
  children: React.ReactNode
  selected: boolean
  onClick: () => void
  variant?: 'outline'
}) {
  const isOutline = variant === 'outline'
  return (
    <div
      onClick={onClick}
      style={{
        padding: '.4rem .8rem',
        borderRadius: '20px',
        fontSize: '.72rem',
        fontFamily: 'var(--font-body)',
        cursor: 'pointer',
        transition: 'all .2s',
        background: selected
          ? isOutline ? 'var(--coral)' : 'var(--cobalto)'
          : isOutline ? 'transparent' : '#fff',
        color: selected ? '#fff' : 'var(--azul-noite)',
        border: selected
          ? isOutline ? '1px solid var(--coral)' : '1px solid var(--cobalto)'
          : '1px solid #ddd',
      }}
    >
      {children}
    </div>
  )
}

const saveBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'var(--font-heading)',
  fontWeight: 700,
  fontSize: '.82rem',
  letterSpacing: '.06em',
  textTransform: 'uppercase',
  padding: '.9rem 2.2rem',
  borderRadius: '60px',
  background: 'var(--coral)',
  color: '#fff',
  boxShadow: '0 2px 12px rgba(255,90,95,.25)',
  border: 'none',
  cursor: 'pointer',
  width: '100%',
  marginTop: '1.5rem',
}