import { useState } from 'react'

const API = 'https://api.ogestordolucro.site'

interface Props {
  onAuth: (token: string, nome: string) => void
  planoPreSelecionado?: string | null
}

export default function AuthPage({ onAuth, planoPreSelecionado }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('register')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [telefone, setTelefone] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setErro('')
    if (mode === 'register' && !nome.trim()) return setErro('Preencha seu nome')
    if (!email.trim()) return setErro('Preencha seu e-mail')
    if (!senha || senha.length < 6) return setErro('Senha precisa ter pelo menos 6 caracteres')

    setLoading(true)
    try {
      const endpoint = mode === 'register' ? '/auth/register' : '/auth/login'
      const body = mode === 'register'
        ? { nome, email, senha, telefone }
        : { email, senha }

      const res = await fetch(API + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (!res.ok) {
        setErro(data.error || 'Erro ao processar')
        setLoading(false)
        return
      }

      localStorage.setItem('vivefit_token', data.token)
      localStorage.setItem('vivefit_nome', data.nome)
      onAuth(data.token, data.nome)
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--gelo)' }}>
      <div className="q-hdr">
        <span className="q-logo">
          <img src="/img/logo.svg" alt="VIVE FIT" style={{ height: '44px' }} />
        </span>
        <a href="#/" className="q-close">voltar ao site</a>
      </div>

      {planoPreSelecionado && (
        <div style={{
          textAlign: 'center',
          padding: '.4rem 5%',
          background: 'var(--cobalto-soft)',
          fontSize: '.68rem',
          color: 'var(--cobalto)',
          fontFamily: 'var(--font-heading)',
          letterSpacing: '.04em',
        }}>
          Crie sua conta pra continuar com a assinatura
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 5%' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.4rem',
            textAlign: 'center',
            marginBottom: '.3rem',
            color: 'var(--azul-noite)',
          }}>
            {mode === 'register' ? 'Crie sua conta' : 'Entrar na minha conta'}
          </h2>
          <p style={{
            textAlign: 'center',
            fontSize: '.78rem',
            color: 'var(--cinza-mudo)',
            marginBottom: '1.5rem',
          }}>
            {mode === 'register'
              ? 'Preencha seus dados pra começar'
              : 'Use o e-mail e senha do seu cadastro'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
            {mode === 'register' && (
              <input
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={e => setNome(e.target.value)}
                style={inputStyle}
              />
            )}
            <input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Senha (mín. 6 caracteres)"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              style={inputStyle}
            />
            {mode === 'register' && (
              <input
                type="tel"
                placeholder="WhatsApp (opcional)"
                value={telefone}
                onChange={e => setTelefone(e.target.value)}
                style={inputStyle}
              />
            )}

            {erro && (
              <p style={{ color: 'var(--coral)', fontSize: '.75rem', textAlign: 'center', margin: 0 }}>
                {erro}
              </p>
            )}

            <button onClick={submit} disabled={loading} style={btnStyle}>
              {loading ? 'aguarde...' : mode === 'register' ? 'criar conta' : 'entrar'}
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: '.75rem', marginTop: '1.2rem', color: 'var(--cinza-mudo)' }}>
            {mode === 'register' ? (
              <>Já tem conta? <span onClick={() => setMode('login')} style={linkStyle}>Entrar</span></>
            ) : (
              <>Não tem conta? <span onClick={() => setMode('register')} style={linkStyle}>Criar conta</span></>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '.75rem 1rem',
  borderRadius: '12px',
  border: '1px solid #ddd',
  fontSize: '.82rem',
  fontFamily: 'var(--font-body)',
  background: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
}

const btnStyle: React.CSSProperties = {
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
  marginTop: '.5rem',
}

const linkStyle: React.CSSProperties = {
  color: 'var(--turquesa)',
  cursor: 'pointer',
  textDecoration: 'underline',
}