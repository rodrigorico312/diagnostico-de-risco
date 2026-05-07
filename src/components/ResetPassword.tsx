import { useMemo, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const API = 'https://api.vivefit.site'
const ACCENT = '#040861'
const ERROR = '#DC2626'

export default function ResetPassword() {
  const token = useMemo(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '')
    return params.get('token') || ''
  }, [])

  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [verSenha, setVerSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(false)
  const [concluido, setConcluido] = useState(false)

  const submit = async () => {
    setErro('')
    setMensagem('')
    if (!token) return setErro('Link invalido ou expirado. Solicite outro link.')
    if (senha.length < 6) return setErro('Senha precisa ter pelo menos 6 caracteres')
    if (senha !== confirmacao) return setErro('As senhas nao conferem')

    setLoading(true)
    try {
      const res = await fetch(API + '/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, senha }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErro(data.error || 'Erro ao redefinir senha')
        setLoading(false)
        return
      }

      localStorage.removeItem('vivefit_token')
      localStorage.removeItem('vivefit_nome')
      setConcluido(true)
      setMensagem(data.message || 'Senha redefinida com sucesso.')
    } catch {
      setErro('Erro de conexao. Tente novamente.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--gelo)', overflow: 'auto' }}>
      <div className="q-hdr auth-hdr">
        <span className="q-logo auth-logo">
          <img src="https://i.postimg.cc/CLyDrrMm/logo-vivefit-turquesa.png" alt="VIVE FIT" />
        </span>
        <a href="#/" className="q-close">voltar ao site</a>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem 5% 1.5rem', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', textAlign: 'center', marginBottom: '.3rem', color: 'var(--azul-noite)' }}>
            Criar nova senha
          </h2>
          <p style={{ textAlign: 'center', fontSize: '.78rem', color: 'var(--cinza-mudo)', marginBottom: '1.5rem' }}>
            Digite uma senha nova para acessar sua conta.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
            {!concluido && (
              <>
                <div style={{ position: 'relative' }}>
                  <input
                    type={verSenha ? 'text' : 'password'}
                    placeholder="Nova senha"
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    style={{ ...inputStyle, paddingRight: '3rem' }}
                  />
                  <button type="button" onClick={() => setVerSenha(!verSenha)} aria-label={verSenha ? 'Ocultar senha' : 'Mostrar senha'} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--cinza-mudo)' }}>
                    {verSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <input
                  type={verSenha ? 'text' : 'password'}
                  placeholder="Confirmar nova senha"
                  value={confirmacao}
                  onChange={e => setConfirmacao(e.target.value)}
                  style={inputStyle}
                />
              </>
            )}

            {erro && <p style={{ color: ERROR, fontSize: '.75rem', textAlign: 'center', margin: 0 }}>{erro}</p>}
            {mensagem && <p style={{ color: 'var(--cobalto)', fontSize: '.75rem', textAlign: 'center', margin: 0, lineHeight: 1.5 }}>{mensagem}</p>}

            {concluido ? (
              <button onClick={() => { window.location.hash = '#/login' }} style={btnStyle}>entrar</button>
            ) : (
              <button onClick={submit} disabled={loading} style={btnStyle}>{loading ? 'aguarde...' : 'salvar nova senha'}</button>
            )}

            {!concluido && (
              <p style={{ textAlign: 'center', fontSize: '.75rem', margin: '.3rem 0 0', color: 'var(--cinza-mudo)' }}>
                Link expirado? <span onClick={() => { window.location.hash = '#/login' }} style={linkStyle}>Solicitar outro</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '.75rem 1rem', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px', fontFamily: 'var(--font-body)', background: '#fff', outline: 'none', boxSizing: 'border-box' as const }

const btnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '.82rem', letterSpacing: '.06em', textTransform: 'uppercase' as const, padding: '.9rem 2.2rem', borderRadius: '60px', background: ACCENT, color: '#fff', boxShadow: '0 2px 12px rgba(4,8,97,.25)', border: 'none', cursor: 'pointer', width: '100%', marginTop: '.5rem' }

const linkStyle: React.CSSProperties = { color: 'var(--turquesa)', cursor: 'pointer', textDecoration: 'underline' }
