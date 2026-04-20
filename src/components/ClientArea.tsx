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

const PLANOS_INFO: Record<string, { nome: string; valor: string; desc: string }> = {
  mensal: { nome: 'Plano Mensal', valor: 'R$199,90/mês', desc: 'Recorrência mensal — cancele quando quiser' },
  semestral: { nome: 'Plano Semestral', valor: 'R$189,90/mês', desc: '6 meses — economia de R$60' },
  anual: { nome: 'Plano Anual', valor: 'R$179,90/mês', desc: '12 meses — maior economia' },
}

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

  const [editPerfil, setEditPerfil] = useState(false)
  const [editEndereco, setEditEndereco] = useState(false)

  const [tamanho, setTamanho] = useState('')
  const [treinos, setTreinos] = useState<string[]>([])
  const [cores, setCores] = useState<string[]>([])
  const [pecas, setPecas] = useState<string[]>([])
  const [modelagem, setModelagem] = useState<string[]>([])
  const [blacklist, setBlacklist] = useState<string[]>([])
  const [perfilCarregado, setPerfilCarregado] = useState(false)

  const [cep, setCep] = useState('')
  const [rua, setRua] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [buscandoCep, setBuscandoCep] = useState(false)
  const [enderecoCarregado, setEnderecoCarregado] = useState(false)

  const [showTrocarPlano, setShowTrocarPlano] = useState(false)
  const [showCancelar, setShowCancelar] = useState(false)

  // BOXES
  const [boxes, setBoxes] = useState<any[]>([])
  const [loadingBoxes, setLoadingBoxes] = useState(false)

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
        setPerfilCarregado(true)
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
        setEnderecoCarregado(true)
      }
      setLoading(false)
    }).catch(() => {
      localStorage.removeItem('vivefit_token')
      localStorage.removeItem('vivefit_nome')
      window.location.hash = '#/login'
    })
  }, [])

  // Busca boxes quando abre a aba
  useEffect(() => {
    if (!token || tab !== 'box') return
    setLoadingBoxes(true)
    fetch(API + '/minhas-boxes-v2', { headers })
      .then(r => r.json())
      .then(d => { setBoxes(d.boxes || []); setLoadingBoxes(false) })
      .catch(() => setLoadingBoxes(false))
  }, [tab])

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
      if (!data.erro) { setRua(data.logradouro || ''); setBairro(data.bairro || ''); setCidade(data.localidade || ''); setEstado(data.uf || '') }
    } catch {}
    setBuscandoCep(false)
  }

  const handleCepChange = (val: string) => { const formatted = formatCep(val); setCep(formatted); if (formatted.replace(/\D/g, '').length === 8) buscarCep(formatted) }

  const salvarPerfil = async () => {
    setSaving(true); setMsg('')
    try {
      const res = await fetch(API + '/perfil', { method: 'PUT', headers, body: JSON.stringify({ tamanho, treinos, cores, pecas, modelagem, blacklist }) })
      if (res.ok) { setMsg('Perfil atualizado!'); setEditPerfil(false); setPerfilCarregado(true); setTimeout(() => setMsg(''), 3000) }
    } catch { setMsg('Erro ao salvar. Tente novamente.') }
    setSaving(false)
  }

  const salvarEndereco = async () => {
    const cepLimpo = cep.replace(/\D/g, '')
    if (!cepLimpo || !rua || !numero || !bairro || !cidade || !estado) { setMsg('Preencha todos os campos obrigatórios'); setTimeout(() => setMsg(''), 3000); return }
    setSaving(true); setMsg('')
    try {
      const res = await fetch(API + '/endereco', { method: 'PUT', headers, body: JSON.stringify({ cep: cepLimpo, rua, numero, complemento, bairro, cidade, estado }) })
      if (res.ok) { setMsg('Endereço salvo!'); setEditEndereco(false); setEnderecoCarregado(true); setTimeout(() => setMsg(''), 3000) }
    } catch { setMsg('Erro ao salvar. Tente novamente.') }
    setSaving(false)
  }

  const logout = () => { localStorage.removeItem('vivefit_token'); localStorage.removeItem('vivefit_nome'); localStorage.removeItem('vivefit_quiz_done'); window.location.hash = '#/' }

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gelo)' }}><p style={{ fontFamily: 'Montserrat, sans-serif', color: 'var(--cinza-mudo)' }}>Carregando...</p></div>

  const planoAtual = user?.plano ? PLANOS_INFO[user.plano] : null
  const outrosPlanos = Object.entries(PLANOS_INFO).filter(([key]) => key !== user?.plano)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gelo)' }}>
      <div className="q-hdr" style={{ justifyContent: 'space-between' }}>
        <span className="q-logo"><img src="https://i.postimg.cc/CLyDrrMm/logo-vivefit-turquesa.png" alt="VIVE FIT" style={{ height: '220px' }} /></span>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a href="#/" style={{ fontSize: '.82rem', color: 'var(--cinza-mudo)', textDecoration: 'none' }}>site</a>
          <span onClick={logout} style={{ fontSize: '.82rem', color: 'var(--coral)', cursor: 'pointer' }}>sair</span>
        </div>
      </div>

      <div style={{ padding: '1.5rem 5% .5rem', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.4rem', color: 'var(--azul-noite)', margin: 0 }}>Olá, {user?.nome?.split(' ')[0]}</h2>
        <p style={{ fontSize: '.85rem', color: 'var(--cinza-mudo)', margin: '.2rem 0 0' }}>{planoAtual ? planoAtual.nome : 'Nenhum plano ativo'}</p>
      </div>

      <div style={{ display: 'flex', gap: '0', maxWidth: '600px', margin: '1rem auto 0', padding: '0 5%', overflowX: 'auto' }}>
        {(['perfil', 'endereco', 'box', 'plano'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setMsg('') }} style={{
            flex: 1, padding: '.6rem .3rem', fontSize: '.75rem', fontFamily: 'Montserrat, sans-serif',
            fontWeight: tab === t ? 700 : 400, letterSpacing: '.04em', textTransform: 'uppercase' as const,
            background: tab === t ? '#fff' : 'transparent', color: tab === t ? 'var(--azul-noite)' : 'var(--cinza-mudo)',
            border: 'none', borderBottom: tab === t ? '2px solid var(--coral)' : '2px solid transparent',
            cursor: 'pointer', whiteSpace: 'nowrap' as const,
          }}>
            {t === 'perfil' ? 'Meu Look' : t === 'endereco' ? 'Endereço' : t === 'box' ? 'Minha Box' : 'Meu Plano'}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1.5rem 5% 3rem' }}>

        {/* ═══ PERFIL ═══ */}
        {tab === 'perfil' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
              <SectionTitle style={{ margin: 0 }}>Meu perfil de look</SectionTitle>
              {perfilCarregado && !editPerfil && <span onClick={() => setEditPerfil(true)} style={editLinkStyle}>editar</span>}
              {editPerfil && <span onClick={() => setEditPerfil(false)} style={{ ...editLinkStyle, color: 'var(--cinza-mudo)' }}>cancelar</span>}
            </div>
            {!perfilCarregado && !editPerfil ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <p style={{ fontSize: '.88rem', color: 'var(--cinza-mudo)', marginBottom: '1rem' }}>Você ainda não preencheu seu perfil de look.</p>
                <button onClick={() => setEditPerfil(true)} style={actionBtnStyle}>preencher perfil</button>
              </div>
            ) : !editPerfil ? (
              <div>
                <InfoRow label="Tamanho" value={tamanho || '—'} />
                <InfoRow label="Treinos" value={treinos.length > 0 ? treinos.join(', ') : '—'} />
                <InfoRow label="Cores" value={cores.length > 0 ? cores.map(c => CORES.find(x => x.val === c)?.label || c).join(', ') : '—'} />
                <InfoRow label="Peças" value={pecas.length > 0 ? pecas.join(', ') : '—'} />
                <InfoRow label="Modelagem" value={modelagem.length > 0 ? modelagem.join(', ') : '—'} />
                <InfoRow label="Não quer receber" value={blacklist.length > 0 ? blacklist.join(', ') : 'Nenhuma restrição'} />
              </div>
            ) : (
              <div>
                <MiniTitle>Tamanho</MiniTitle>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>{TAMANHOS.map(t => <Chip key={t} selected={tamanho === t} onClick={() => setTamanho(t)}>{t}</Chip>)}</div>
                <MiniTitle>Treinos</MiniTitle>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>{TREINOS.map(t => <Chip key={t} selected={treinos.includes(t)} onClick={() => toggleArr(treinos, t, setTreinos)}>{t}</Chip>)}</div>
                <MiniTitle>Cores preferidas</MiniTitle>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.7rem' }}>
                  {CORES.map(c => (
                    <div key={c.val} onClick={() => toggleArr(cores, c.val, setCores)} style={{ textAlign: 'center', cursor: 'pointer' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0, background: c.color, border: cores.includes(c.val) ? '3px solid var(--coral)' : '2px solid #ddd', transition: 'all .2s' }} />
                      <span style={{ fontSize: '.7rem', color: 'var(--cinza-mudo)', display: 'block', marginTop: '.2rem' }}>{c.label}</span>
                    </div>
                  ))}
                </div>
                <MiniTitle>Peças preferidas</MiniTitle>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>{PECAS.map(p => <Chip key={p} selected={pecas.includes(p)} onClick={() => toggleArr(pecas, p, setPecas)}>{p}</Chip>)}</div>
                <MiniTitle>Modelagem</MiniTitle>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>{MODELAGENS.map(m => <Chip key={m} selected={modelagem.includes(m)} onClick={() => toggleArr(modelagem, m, setModelagem)}>{m}</Chip>)}</div>
                <MiniTitle>Não quero receber</MiniTitle>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>{BLACKLIST_OPTS.map(b => <Chip key={b} selected={blacklist.includes(b)} onClick={() => toggleArr(blacklist, b, setBlacklist)} variant="outline">{b}</Chip>)}</div>
                {msg && <p style={{ textAlign: 'center', fontSize: '.85rem', color: msg.includes('Erro') ? 'var(--coral)' : '#16a34a', marginTop: '1rem' }}>{msg}</p>}
                <button onClick={salvarPerfil} disabled={saving} style={{ ...actionBtnStyle, opacity: saving ? 0.6 : 1 }}>{saving ? 'salvando...' : 'salvar perfil'}</button>
              </div>
            )}
          </div>
        )}

        {/* ═══ ENDEREÇO ═══ */}
        {tab === 'endereco' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
              <SectionTitle style={{ margin: 0 }}>Endereço de entrega</SectionTitle>
              {enderecoCarregado && !editEndereco && <span onClick={() => setEditEndereco(true)} style={editLinkStyle}>editar</span>}
              {editEndereco && <span onClick={() => setEditEndereco(false)} style={{ ...editLinkStyle, color: 'var(--cinza-mudo)' }}>cancelar</span>}
            </div>
            <p style={{ fontSize: '.82rem', color: 'var(--cinza-mudo)', marginBottom: '1rem' }}>Endereço onde suas boxes serão entregues.</p>
            {!enderecoCarregado && !editEndereco ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <p style={{ fontSize: '.88rem', color: 'var(--cinza-mudo)', marginBottom: '1rem' }}>Você ainda não cadastrou seu endereço.</p>
                <button onClick={() => setEditEndereco(true)} style={actionBtnStyle}>cadastrar endereço</button>
              </div>
            ) : !editEndereco ? (
              <div style={{ background: '#fff', borderRadius: '14px', padding: '1.2rem', boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}>
                <p style={{ fontSize: '.9rem', color: 'var(--azul-noite)', margin: '0 0 .2rem', fontWeight: 600 }}>{rua}, {numero}{complemento ? ' — ' + complemento : ''}</p>
                <p style={{ fontSize: '.85rem', color: 'var(--cinza-chumbo)', margin: '0 0 .2rem' }}>{bairro}</p>
                <p style={{ fontSize: '.85rem', color: 'var(--cinza-chumbo)', margin: '0 0 .2rem' }}>{cidade} — {estado}</p>
                <p style={{ fontSize: '.85rem', color: 'var(--cinza-chumbo)', margin: 0 }}>CEP: {cep}</p>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                  <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                    <input type="text" placeholder="CEP" value={cep} onChange={e => handleCepChange(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                    {buscandoCep && <span style={{ fontSize: '.8rem', color: 'var(--cinza-mudo)' }}>buscando...</span>}
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
                {msg && <p style={{ textAlign: 'center', fontSize: '.85rem', color: msg.includes('Erro') || msg.includes('Preencha') ? 'var(--coral)' : '#16a34a', marginTop: '1rem' }}>{msg}</p>}
                <button onClick={salvarEndereco} disabled={saving} style={{ ...actionBtnStyle, opacity: saving ? 0.6 : 1 }}>{saving ? 'salvando...' : 'salvar endereço'}</button>
              </div>
            )}
          </div>
        )}

        {/* ═══ MINHA BOX ═══ */}
        {tab === 'box' && (
          <div>
            {loadingBoxes ? (
              <p style={{ textAlign: 'center', padding: '2rem 0', fontSize: '.85rem', color: 'var(--cinza-mudo)' }}>Carregando suas boxes...</p>
            ) : boxes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', color: 'var(--azul-noite)', fontSize: '1.1rem', margin: '0 0 .5rem' }}>Sua box está sendo preparada</h3>
                <p style={{ fontSize: '.88rem', color: 'var(--cinza-mudo)', maxWidth: '300px', margin: '0 auto' }}>Quando enviarmos, o código de rastreio aparece aqui automaticamente.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
                {boxes.map((b: any) => {
                  const statusCor: Record<string, string> = {
                    pendente: '#A78BFA',
                    preparando: '#F97316',
                    enviada: '#3B82F6',
                    entregue: '#16A34A',
                    cancelada: '#94A3B8',
                  }
                  const statusTexto: Record<string, string> = {
                    pendente: 'Separando suas peças',
                    preparando: 'Preparando sua box',
                    enviada: 'Box enviada',
                    entregue: 'Box entregue',
                    cancelada: 'Cancelada',
                  }
                  const cor = statusCor[b.status] || '#94A3B8'
                  const texto = statusTexto[b.status] || b.status

                  const formatarMes = (mes: string) => {
                    if (!mes) return ''
                    const [ano, m] = mes.split('-')
                    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
                    const nomeM = meses[parseInt(m) - 1]
                    return nomeM ? `${nomeM} ${ano}` : mes
                  }

                  return (
                    <div key={b.id} style={{
                      background: '#fff',
                      borderRadius: '14px',
                      padding: '1.2rem',
                      boxShadow: '0 1px 4px rgba(0,0,0,.05)',
                      borderLeft: '4px solid ' + cor,
                      opacity: b.status === 'cancelada' ? 0.7 : 1,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.6rem' }}>
                        <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '.95rem', fontWeight: 700, color: 'var(--azul-noite)', textTransform: 'capitalize' as const }}>
                          Box de {formatarMes(b.mes_ref)}
                        </span>
                        <span style={{ fontSize: '.72rem', fontWeight: 600, color: cor, background: cor + '15', padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase' as const, letterSpacing: '.04em' }}>
                          {texto}
                        </span>
                      </div>

                      {b.rastreio && (
                        <div style={{ background: 'rgba(6,182,212,.08)', borderRadius: '8px', padding: '.7rem .9rem', marginBottom: '.7rem' }}>
                          <p style={{ fontSize: '.7rem', color: 'var(--cinza-mudo)', margin: '0 0 .2rem', letterSpacing: '.04em', textTransform: 'uppercase' as const }}>Código de rastreio</p>
                          <p style={{ fontSize: '.9rem', fontWeight: 600, color: '#06B6D4', margin: 0, fontFamily: 'monospace' }}>{b.rastreio}</p>
                          {b.transportadora && <p style={{ fontSize: '.7rem', color: 'var(--cinza-mudo)', margin: '.2rem 0 0' }}>via {b.transportadora}</p>}
                        </div>
                      )}

                      {b.pecas && b.pecas.length > 0 && (
                        <div style={{ marginTop: '.2rem' }}>
                          <p style={{ fontSize: '.68rem', color: 'var(--cinza-mudo)', margin: '0 0 .5rem', textTransform: 'uppercase' as const, letterSpacing: '.06em', fontWeight: 600 }}>
                            {b.pecas.length} {b.pecas.length === 1 ? 'peça' : 'peças'} desta box
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                            {b.pecas.map((p: any, i: number) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.7rem', background: '#F8FAFC', padding: '.5rem .7rem', borderRadius: '8px' }}>
                                {p.foto_url && (
                                  <img src={API + p.foto_url} alt="" style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover' as const, background: '#fff', flexShrink: 0 }} />
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <p style={{ fontSize: '.82rem', color: 'var(--azul-noite)', margin: 0, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{p.descricao}</p>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginTop: '.15rem' }}>
                                    {p.cor_hex && <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: p.cor_hex, border: '1px solid rgba(0,0,0,.1)', flexShrink: 0 }} />}
                                    <p style={{ fontSize: '.7rem', color: 'var(--cinza-mudo)', margin: 0 }}>
                                      {[p.tipo_nome, p.tamanho_nome, p.marca_nome].filter(Boolean).join(' · ')}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {b.tem_brinde && (b.status === 'enviada' || b.status === 'entregue') && (
                        <div style={{ marginTop: '.7rem', padding: '.6rem .8rem', background: 'linear-gradient(135deg, rgba(10,154,168,.08) 0%, rgba(12,187,204,.12) 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                          <span style={{ fontSize: '.8rem', fontWeight: 600, color: '#0A9AA8' }}>Inclui brinde surpresa</span>
                        </div>
                      )}

                      {(b.status === 'pendente' || b.status === 'preparando') && !b.rastreio && (
                        <p style={{ fontSize: '.78rem', color: 'var(--cinza-mudo)', margin: '.6rem 0 0', fontStyle: 'italic' }}>
                          {b.status === 'pendente'
                            ? 'Separando suas peças especialmente pra você. Em breve começamos a preparar.'
                            : 'Estamos selecionando e embalando sua box com carinho. O rastreio aparece assim que enviarmos.'}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══ PLANO ═══ */}
        {tab === 'plano' && (
          <div>
            <SectionTitle>Plano atual</SectionTitle>
            {planoAtual ? (
              <div style={{ background: '#fff', borderRadius: '14px', padding: '1.2rem', boxShadow: '0 1px 4px rgba(0,0,0,.05)', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--azul-noite)', margin: '0 0 .2rem', fontFamily: 'Montserrat, sans-serif' }}>{planoAtual.nome}</p>
                    <p style={{ fontSize: '.82rem', color: 'var(--cinza-mudo)', margin: 0 }}>4 peças por mês</p>
                  </div>
                  <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: 'var(--azul-noite)' }}>{planoAtual.valor}</span>
                </div>
                <p style={{ fontSize: '.78rem', color: 'var(--cinza-mudo)', margin: '.5rem 0 0' }}>{planoAtual.desc}</p>
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,.05)', textAlign: 'center', marginBottom: '1rem' }}>
                <p style={{ fontSize: '.95rem', color: 'var(--cinza-mudo)', margin: '0 0 1rem' }}>Você ainda não tem um plano ativo.</p>
                <a href="#/" style={{ ...actionBtnStyle, display: 'inline-flex', width: 'auto', textDecoration: 'none' }}>escolher plano</a>
              </div>
            )}
            {planoAtual && (
              <div>
                <button onClick={() => { setShowTrocarPlano(!showTrocarPlano); setShowCancelar(false) }} style={secondaryBtnStyle}>{showTrocarPlano ? 'fechar' : 'trocar de plano'}</button>
                {showTrocarPlano && (
                  <div style={{ marginTop: '.8rem', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                    <p style={{ fontSize: '.82rem', color: 'var(--cinza-mudo)', margin: '0 0 .3rem' }}>Escolha o novo plano:</p>
                    {outrosPlanos.map(([key, info]) => (
                      <div key={key} onClick={() => { window.location.hash = '#/checkout?plano=' + key }} style={{ background: '#fff', borderRadius: '12px', padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,.05)', cursor: 'pointer', border: '1px solid #ddd', transition: 'all .2s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <p style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--azul-noite)', margin: 0, fontFamily: 'Montserrat, sans-serif' }}>{info.nome}</p>
                            <p style={{ fontSize: '.75rem', color: 'var(--cinza-mudo)', margin: '.1rem 0 0' }}>{info.desc}</p>
                          </div>
                          <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '.9rem', fontWeight: 700, color: 'var(--coral)' }}>{info.valor}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => { setShowCancelar(!showCancelar); setShowTrocarPlano(false) }} style={{ ...secondaryBtnStyle, color: 'var(--cinza-mudo)', borderColor: 'var(--cinza-mudo)', marginTop: '.5rem' }}>{showCancelar ? 'voltar' : 'cancelar assinatura'}</button>
                {showCancelar && (
                  <div style={{ marginTop: '.8rem', background: '#FEF2F2', borderRadius: '12px', padding: '1.2rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '.9rem', color: 'var(--azul-noite)', fontWeight: 600, margin: '0 0 .5rem' }}>Tem certeza que deseja cancelar?</p>
                    <p style={{ fontSize: '.8rem', color: 'var(--cinza-mudo)', margin: '0 0 1rem' }}>Você pode reativar quando quiser. Sua box atual continua sendo enviada até o fim do período.</p>
                    <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'center' }}>
                      <button onClick={() => setShowCancelar(false)} style={{ ...secondaryBtnStyle, flex: 1, margin: 0, fontSize: '.8rem' }}>manter plano</button>
                      <a href="https://wa.me/5593992101980?text=Olá, gostaria de cancelar minha assinatura VIVE FIT BOX" target="_blank" rel="noopener" style={{ ...actionBtnStyle, flex: 1, margin: 0, fontSize: '.8rem', background: '#DC2626', textDecoration: 'none' }}>confirmar cancelamento</a>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <p style={{ fontSize: '.78rem', color: 'var(--cinza-mudo)' }}>Precisa de ajuda? Fale pelo WhatsApp</p>
              <a href="https://wa.me/5593992101980" target="_blank" rel="noopener" style={{ fontSize: '.85rem', color: 'var(--turquesa)', textDecoration: 'none', fontWeight: 600 }}>(93) 99210-1980</a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionTitle({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1rem', fontWeight: 700, color: 'var(--azul-noite)', margin: '1.5rem 0 .5rem', ...style }}>{children}</h3>
}
function MiniTitle({ children }: { children: React.ReactNode }) {
  return <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '.88rem', fontWeight: 600, color: 'var(--azul-noite)', margin: '1.2rem 0 .4rem' }}>{children}</p>
}
function InfoRow({ label, value }: { label: string; value: string }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', padding: '.6rem 0', borderBottom: '1px solid #f0f0f0' }}>
    <span style={{ fontSize: '.85rem', color: 'var(--cinza-mudo)', fontFamily: 'Montserrat, sans-serif' }}>{label}</span>
    <span style={{ fontSize: '.85rem', color: 'var(--azul-noite)', fontFamily: 'Montserrat, sans-serif', fontWeight: 500, textAlign: 'right' as const, maxWidth: '60%' }}>{value}</span>
  </div>
}
function Chip({ children, selected, onClick, variant }: { children: React.ReactNode; selected: boolean; onClick: () => void; variant?: 'outline' }) {
  const isOutline = variant === 'outline'
  return <div onClick={onClick} style={{ padding: '.5rem 1rem', borderRadius: '20px', fontSize: '.85rem', fontFamily: 'Montserrat, sans-serif', cursor: 'pointer', transition: 'all .2s', background: selected ? (isOutline ? 'var(--coral)' : 'var(--cobalto)') : (isOutline ? 'transparent' : '#fff'), color: selected ? '#fff' : 'var(--azul-noite)', border: selected ? (isOutline ? '1px solid var(--coral)' : '1px solid var(--cobalto)') : '1px solid #ddd' }}>{children}</div>
}

const editLinkStyle: React.CSSProperties = { fontSize: '.82rem', color: 'var(--turquesa)', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }
const inputStyle: React.CSSProperties = { padding: '.65rem .8rem', borderRadius: '10px', border: '1px solid #ddd', fontSize: '.88rem', fontFamily: 'Montserrat, sans-serif', background: '#fff', outline: 'none', boxSizing: 'border-box' as const, width: '100%' }
const actionBtnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '.88rem', letterSpacing: '.06em', textTransform: 'uppercase' as const, padding: '.9rem 2.2rem', borderRadius: '60px', background: 'var(--coral)', color: '#fff', boxShadow: '0 2px 12px rgba(255,90,95,.25)', border: 'none', cursor: 'pointer', width: '100%', marginTop: '1.5rem' }
const secondaryBtnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '.82rem', letterSpacing: '.04em', textTransform: 'uppercase' as const, padding: '.7rem 1.5rem', borderRadius: '60px', background: 'transparent', color: 'var(--cobalto)', border: '1.5px solid var(--cobalto)', cursor: 'pointer', width: '100%', marginTop: '.8rem', transition: 'all .2s' }
