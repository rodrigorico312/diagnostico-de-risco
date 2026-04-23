import { useState, useEffect } from 'react'

const API = 'https://api.vivefit.site'

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
  const [showModalCancelar, setShowModalCancelar] = useState(false)
  const [motivoCancelar, setMotivoCancelar] = useState<string>('')
  const [detalhesCancelar, setDetalhesCancelar] = useState('')
  const [enviandoCancelar, setEnviandoCancelar] = useState(false)
  const [solicitacaoAtiva, setSolicitacaoAtiva] = useState<any>(null)
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

  // Carrega solicitacao de cancelamento ativa
  useEffect(() => {
    const token = localStorage.getItem('vivefit_token')
    if (!token || tab !== 'plano') return
    fetch(API + '/minha-solicitacao-cancelamento', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json())
      .then(d => setSolicitacaoAtiva(d.solicitacao))
      .catch(() => {})
  }, [tab])

  async function enviarCancelamento() {
    if (!motivoCancelar) return
    setEnviandoCancelar(true)
    try {
      const token = localStorage.getItem('vivefit_token')
      const r = await fetch(API + '/solicitar-cancelamento', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivo: motivoCancelar, motivo_detalhes: detalhesCancelar || null }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Erro')
      setShowModalCancelar(false)
      setMotivoCancelar('')
      setDetalhesCancelar('')
      // Recarrega solicitacao ativa
      const r2 = await fetch(API + '/minha-solicitacao-cancelamento', { headers: { Authorization: 'Bearer ' + token } })
      const d2 = await r2.json()
      setSolicitacaoAtiva(d2.solicitacao)
      setMsg('Solicitação registrada! Nossa equipe processará em até 10 dias úteis.')
    } catch (err: any) {
      alert('Erro: ' + err.message)
    } finally {
      setEnviandoCancelar(false)
    }
  }

  async function retirarCancelamento() {
    if (!solicitacaoAtiva) return
    if (!confirm('Tem certeza que deseja retirar sua solicitação de cancelamento?')) return
    try {
      const token = localStorage.getItem('vivefit_token')
      const r = await fetch(API + '/minha-solicitacao-cancelamento/' + solicitacaoAtiva.id, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token },
      })
      if (!r.ok) throw new Error('Erro')
      setSolicitacaoAtiva(null)
      setMsg('Solicitação retirada. Sua assinatura continua ativa.')
    } catch (err: any) {
      alert('Erro: ' + err.message)
    }
  }

  function renderBotaoCancelar() {
    if (solicitacaoAtiva && solicitacaoAtiva.status === 'pendente') {
      return (
        <div style={{ marginTop: '.8rem', background: '#FEF3C7', border: '1px solid #FBBF24', borderRadius: '12px', padding: '1rem' }}>
          <p style={{ fontSize: '.85rem', color: '#92400E', fontWeight: 600, margin: '0 0 .4rem' }}>📋 Solicitação de cancelamento em andamento</p>
          <p style={{ fontSize: '.75rem', color: '#78350F', margin: '0 0 .6rem', lineHeight: 1.5 }}>
            Recebemos sua solicitação em {new Date(solicitacaoAtiva.solicitado_em).toLocaleDateString('pt-BR')}.
            Nossa equipe processará em até 10 dias úteis e pode entrar em contato com você.
          </p>
          <button onClick={retirarCancelamento} style={{ ...secondaryBtnStyle, margin: 0, fontSize: '.8rem', borderColor: '#B45309', color: '#92400E' }}>
            retirar solicitação
          </button>
        </div>
      )
    }
    return (
      <button
        onClick={() => { setShowModalCancelar(true); setShowTrocarPlano(false) }}
        style={{ ...secondaryBtnStyle, color: 'var(--cinza-mudo)', borderColor: 'var(--cinza-mudo)', marginTop: '.5rem' }}
      >
        cancelar assinatura
      </button>
    )
  }

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
                <h3 style={{ fontFamily: 'Georgia, serif', color: '#040861', fontSize: '1.3rem', margin: '0 0 .5rem', fontWeight: 400 }}>Sua box está sendo preparada</h3>
                <p style={{ fontSize: '.88rem', color: 'var(--cinza-mudo)', maxWidth: '300px', margin: '0 auto', lineHeight: 1.5 }}>Quando enviarmos, o código de rastreio aparece aqui automaticamente.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {boxes.map((b: any) => <BoxTimelineCard key={b.id} box={b} />)}
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
                {renderBotaoCancelar()}
              </div>
            )}
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <p style={{ fontSize: '.78rem', color: 'var(--cinza-mudo)' }}>Precisa de ajuda? Fale pelo WhatsApp</p>
              <a href="https://wa.me/5593991201036" target="_blank" rel="noopener" style={{ fontSize: '.85rem', color: 'var(--turquesa)', textDecoration: 'none', fontWeight: 600 }}>(93) 99120-1036</a>
            </div>
          </div>
        )}
      </div>

      {showModalCancelar && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }} onClick={() => setShowModalCancelar(false)}>
          <div style={{ background: '#fff', borderRadius: '14px', width: '100%', maxWidth: '460px', padding: '1.5rem', boxShadow: '0 20px 60px rgba(0,0,0,.3)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 .4rem', fontFamily: 'Georgia, serif', fontSize: '1.3rem', color: 'var(--azul-noite)' }}>Antes de você ir...</h2>
            <p style={{ fontSize: '.88rem', color: 'var(--cinza-mudo)', margin: '0 0 1rem', lineHeight: 1.5 }}>Nos conta o motivo? Às vezes a gente encontra uma solução que você nem sabia que tinha.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem', marginBottom: '1rem' }}>
              {['Preço alto', 'Não gostei das peças', 'Problemas financeiros', 'Vou pausar por enquanto', 'Não uso mais', 'Outro motivo'].map(m => (
                <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '.6rem', padding: '.7rem .9rem', border: motivoCancelar === m ? '2px solid var(--coral)' : '1px solid #ddd', borderRadius: '10px', cursor: 'pointer', background: motivoCancelar === m ? 'rgba(255,90,95,.05)' : '#fff', transition: 'all .2s' }}>
                  <input type="radio" name="motivo" value={m} checked={motivoCancelar === m} onChange={e => setMotivoCancelar(e.target.value)} style={{ accentColor: 'var(--coral)' }} />
                  <span style={{ fontSize: '.88rem', color: 'var(--azul-noite)' }}>{m}</span>
                </label>
              ))}
            </div>

            {motivoCancelar === 'Outro motivo' && (
              <textarea
                value={detalhesCancelar}
                onChange={e => setDetalhesCancelar(e.target.value)}
                placeholder="Conta pra gente..."
                rows={3}
                style={{ width: '100%', padding: '.7rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '.88rem', fontFamily: 'inherit', resize: 'vertical', marginBottom: '1rem', boxSizing: 'border-box' }}
              />
            )}

            <div style={{ padding: '.8rem 1rem', background: 'rgba(6,182,212,.06)', border: '1px solid rgba(6,182,212,.2)', borderRadius: '10px', marginBottom: '1rem' }}>
              <p style={{ fontSize: '.78rem', color: '#334155', margin: 0, lineHeight: 1.5 }}>💬 Nossa equipe pode entrar em contato em até 10 dias úteis. Se você ainda quiser cancelar, é só aguardar — efetivaremos automaticamente.</p>
            </div>

            <div style={{ display: 'flex', gap: '.6rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModalCancelar(false)} style={{ padding: '.7rem 1.2rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: 'var(--cinza-mudo)', cursor: 'pointer', fontSize: '.88rem', fontWeight: 500 }}>Continuar assinante</button>
              <button
                onClick={enviarCancelamento}
                disabled={!motivoCancelar || enviandoCancelar}
                style={{ padding: '.7rem 1.2rem', borderRadius: '8px', border: 'none', background: '#DC2626', color: '#fff', cursor: motivoCancelar && !enviandoCancelar ? 'pointer' : 'not-allowed', fontSize: '.88rem', fontWeight: 600, opacity: motivoCancelar && !enviandoCancelar ? 1 : 0.5 }}
              >
                {enviandoCancelar ? 'enviando...' : 'Solicitar cancelamento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function montarUrlRastreio(codigo: string, transportadora: string | null): string {
  if (!codigo) return ''
  const t = (transportadora || '').toLowerCase().trim()
  const cod = encodeURIComponent(codigo)

  // Correios (inclui variacoes: ECT, sedex, pac)
  if (t.includes('correio') || t === 'ect' || t.includes('sedex') || t.includes('pac')) {
    return `https://rastreamento.correios.com.br/app/index.php?codigo=${cod}`
  }
  // Jadlog
  if (t.includes('jad')) {
    return `https://www.jadlog.com.br/tracking?cte=${cod}`
  }
  // Loggi
  if (t.includes('loggi')) {
    return `https://www.loggi.com/rastreador/?code=${cod}`
  }
  // Azul (Azul Cargo, Azul Logistica, Azul Express)
  if (t.includes('azul')) {
    return `https://www.azulcargo.com.br/RasteioEncomendas?numero=${cod}`
  }
  // Sequoia
  if (t.includes('sequoia')) {
    return `https://tracking.sequoialog.com.br/?codigo=${cod}`
  }
  // Total Express
  if (t.includes('total')) {
    return `https://tracking.totalexpress.com.br/poupup_track.php?reqTS=&pedWeb=${cod}`
  }
  // Latam Cargo
  if (t.includes('latam')) {
    return `https://www.latamcargo.com/en/track?awb=${cod}`
  }
  // Mercado Envios / Mercado Livre
  if (t.includes('mercado') || t === 'ml' || t.includes('envios')) {
    return `https://www.mercadolivre.com.br/gz/shipping-tracker/${cod}`
  }
  // J&T Express
  if (t.includes('j&t') || t.includes('jt ') || t === 'jt' || t.includes('jtexpress')) {
    return `https://www.jtexpress.com.br/#/track?bills=${cod}`
  }
  // Braspress
  if (t.includes('braspress')) {
    return `https://www.braspress.com/rastreamento/?nro=${cod}`
  }
  // TNT (Mercurio)
  if (t.includes('tnt') || t.includes('mercurio') || t.includes('mercúrio')) {
    return `https://rastreamento.tntbrasil.com.br/?nfs=${cod}`
  }
  // DHL
  if (t.includes('dhl')) {
    return `https://www.dhl.com/br-pt/home/rastreamento.html?tracking-id=${cod}`
  }
  // FedEx
  if (t.includes('fedex')) {
    return `https://www.fedex.com/fedextrack/?tracknumbers=${cod}`
  }
  // Gol Log
  if (t.includes('gol') && t.includes('log')) {
    return `https://rastreio.gollog.com.br/?awb=${cod}`
  }
  // Fallback: pesquisa Google com o codigo + transportadora
  return `https://www.google.com/search?q=${encodeURIComponent(codigo + ' rastreio ' + (transportadora || ''))}`
}

function BoxTimelineCard({ box }: { box: any }) {
  const API_URL = 'https://api.vivefit.site'

  const formatarMes = (mes: string) => {
    if (!mes) return { mes: '', ano: '' }
    const [ano, m] = mes.split('-')
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    const nomeM = meses[parseInt(m) - 1]
    return { mes: nomeM || mes, ano: ano || '' }
  }

  const formatarData = (dt: string | null) => {
    if (!dt) return null
    try {
      // Backend retorna em UTC (CURRENT_TIMESTAMP do SQLite).
      // Adiciona 'Z' pra forcar interpretacao como UTC;
      // o navegador converte automaticamente pro fuso local da cliente.
      const isoString = dt.includes('T') ? dt : dt.replace(' ', 'T')
      const utcString = isoString.endsWith('Z') ? isoString : isoString + 'Z'
      const d = new Date(utcString)
      const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
      return `${d.getDate()} ${meses[d.getMonth()]}`
    } catch { return null }
  }

  const { mes, ano } = formatarMes(box.mes_ref)
  const urlRastreio = box.rastreio ? montarUrlRastreio(box.rastreio, box.transportadora) : ''

  const statusOrdem = ['pendente', 'preparando', 'enviada', 'entregue']
  const statusAtual = box.status
  const indiceAtual = statusOrdem.indexOf(statusAtual)
  const cancelada = statusAtual === 'cancelada'

  const passos = [
    { key: 'pendente', label: 'Separando peças', data: formatarData(box.criado_em), subtexto: 'selecionando pra você' },
    { key: 'preparando', label: 'Box preparada', data: formatarData(box.preparando_em), subtexto: 'embalada com cuidado' },
    { key: 'enviada', label: 'Box enviada', data: formatarData(box.enviado_em), subtexto: 'a caminho da sua casa' },
    { key: 'entregue', label: 'Box entregue', data: formatarData(box.entregue_em), subtexto: 'aproveite!' },
  ]

  const headerBg = cancelada
    ? 'linear-gradient(135deg, #64748B 0%, #475569 100%)'
    : 'linear-gradient(135deg, #040861 0%, #0A2171 100%)'

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E4E8EE',
      borderRadius: '18px',
      overflow: 'hidden',
      opacity: cancelada ? 0.75 : 1,
    }}>

      {/* HEADER */}
      <div style={{ padding: '1.1rem 1.3rem', background: headerBg, color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap' as const, gap: '.6rem' }}>
          <div>
            <div style={{ fontSize: '.58rem', letterSpacing: '.22em', textTransform: 'uppercase' as const, opacity: 0.75, fontWeight: 700, marginBottom: '.2rem' }}>Box</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', lineHeight: 1, letterSpacing: '-.01em' }}>
              {mes} <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic' as const, color: '#0CBBCC', fontWeight: 300 }}>{ano}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' as const }}>
            <div style={{ fontSize: '.58rem', opacity: 0.75, letterSpacing: '.14em', textTransform: 'uppercase' as const, marginBottom: '.15rem' }}>
              {box.quantidade_pecas} {box.quantidade_pecas === 1 ? 'peça' : 'peças'}
            </div>
            {box.tem_brinde && !cancelada && (
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic' as const, fontSize: '.78rem', color: '#0CBBCC' }}>+ surpresa</div>
            )}
            {cancelada && (
              <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: '#fff' }}>cancelada</div>
            )}
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      {!cancelada && (
        <div style={{ padding: '1.1rem 1.3rem', borderBottom: '1px solid #F0F4F6' }}>
          <div style={{ position: 'relative' as const, paddingLeft: '1.6rem' }}>

            <div style={{
              position: 'absolute' as const,
              left: '7px',
              top: '8px',
              bottom: '8px',
              width: '2px',
              background: '#E4E8EE',
            }} />

            {indiceAtual > 0 && (
              <div style={{
                position: 'absolute' as const,
                left: '7px',
                top: '8px',
                height: `${(indiceAtual / (statusOrdem.length - 1)) * 100}%`,
                width: '2px',
                background: 'linear-gradient(180deg, #16A34A 0%, #3B82F6 100%)',
              }} />
            )}

            {passos.map((p, idx) => {
              const concluido = idx < indiceAtual
              const ativo = idx === indiceAtual
              const futuro = idx > indiceAtual

              const corBolinha = concluido ? '#16A34A' : ativo ? (p.key === 'enviada' ? '#3B82F6' : '#F97316') : '#fff'
              const bordaBolinha = futuro ? '2px solid #E4E8EE' : '3px solid #fff'
              const boxShadowBolinha = futuro ? 'none' : `0 0 0 2px ${corBolinha}`

              return (
                <div key={p.key} style={{ position: 'relative' as const, marginBottom: idx === passos.length - 1 ? 0 : '.9rem' }}>
                  <div style={{
                    position: 'absolute' as const,
                    left: '-1.6rem',
                    top: '2px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: corBolinha,
                    border: bordaBolinha,
                    boxShadow: boxShadowBolinha,
                  }} />
                  <div style={{
                    fontSize: '.78rem',
                    color: futuro ? '#94A3B8' : '#040861',
                    fontWeight: ativo ? 700 : 500,
                    lineHeight: 1.2,
                  }}>{p.label}</div>
                  <div style={{
                    fontSize: '.68rem',
                    color: ativo ? (p.key === 'enviada' ? '#3B82F6' : '#F97316') : '#94A3B8',
                    marginTop: '.15rem',
                    fontWeight: ativo ? 600 : 400,
                  }}>
                    {p.data ? p.data : (ativo ? 'em andamento' : (concluido ? 'concluído' : 'aguardando'))}
                    {ativo && p.subtexto && ` · ${p.subtexto}`}
                  </div>

                  {/* Rastreio clicavel dentro do passo "enviada" */}
                  {p.key === 'enviada' && (concluido || ativo) && box.rastreio && (
                    <a
                      href={urlRastreio}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'block',
                        marginTop: '.5rem',
                        padding: '.7rem .9rem',
                        background: 'rgba(6,182,212,.08)',
                        borderRadius: '8px',
                        textDecoration: 'none' as const,
                        border: '1px solid rgba(6,182,212,.2)',
                        transition: 'all .2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(6,182,212,.14)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(6,182,212,.08)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '.5rem' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '.58rem', color: '#64748B', letterSpacing: '.2em', textTransform: 'uppercase' as const, fontWeight: 700, marginBottom: '.2rem' }}>Rastreio · toque para rastrear</div>
                          <div style={{ fontFamily: 'monospace', fontSize: '.82rem', color: '#0A9AA8', fontWeight: 700, overflow: 'hidden' as const, textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{box.rastreio}</div>
                          {box.transportadora && (
                            <div style={{ fontSize: '.65rem', color: '#94A3B8', marginTop: '.15rem' }}>via {box.transportadora}</div>
                          )}
                        </div>
                        <div style={{ color: '#0A9AA8', fontSize: '1.3rem', lineHeight: 1, flexShrink: 0 }}>›</div>
                      </div>
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {cancelada && (
        <div style={{ padding: '1rem 1.3rem', borderBottom: '1px solid #F0F4F6', textAlign: 'center' as const }}>
          <p style={{ fontSize: '.82rem', color: '#64748B', margin: 0, fontStyle: 'italic' as const }}>
            Esta box foi cancelada{box.cancelada_em ? ` em ${formatarData(box.cancelada_em)}` : ''}.
          </p>
        </div>
      )}


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
