import { useState } from 'react'

const API = 'https://api.vivefit.site'

const mascaraTelefone = (v: string): string => {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

const emailValido = (v: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

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
  const [verSenha, setVerSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setErro('')
    if (mode === 'register' && !nome.trim()) return setErro('Preencha seu nome')
    if (mode === 'register' && nome.trim().length < 2) return setErro('Nome muito curto')
    if (!email.trim()) return setErro('Preencha seu e-mail')
    if (!emailValido(email.trim())) return setErro('E-mail invalido')
    if (mode === 'register' && !telefone.trim()) return setErro('Preencha seu WhatsApp')
    if (mode === 'register') {
      const telDigitos = telefone.replace(/\D/g, '')
      if (telDigitos.length !== 10 && telDigitos.length !== 11) {
        return setErro('WhatsApp invalido. Use DDD + numero')
      }
    }
    if (!senha || senha.length < 6) return setErro('Senha precisa ter pelo menos 6 caracteres')

    setLoading(true)
    try {
      const endpoint = mode === 'register' ? '/auth/register' : '/auth/login'
      const body = mode === 'register'
        ? { nome: nome.trim(), email: email.trim().toLowerCase(), senha, telefone: telefone.replace(/\D/g, '') }
        : { email: email.trim().toLowerCase(), senha }

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
          <img src="https://i.postimg.cc/CLyDrrMm/logo-vivefit-turquesa.png" alt="VIVE FIT" style={{ height: '44px' }} />
        </span>
        <a href="#/" className="q-close">voltar ao site</a>
      </div>

      {planoPreSelecionado && (
        <div style={{ textAlign: 'center', padding: '.4rem 5%', background: 'var(--cobalto-soft)', fontSize: '.68rem', color: 'var(--cobalto)', fontFamily: 'var(--font-heading)', letterSpacing: '.04em' }}>
          Crie sua conta pra continuar com a assinatura
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 5%' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', textAlign: 'center', marginBottom: '.3rem', color: 'var(--azul-noite)' }}>
            {mode === 'register' ? 'Crie sua conta' : 'Entrar na minha conta'}
          </h2>
          <p style={{ textAlign: 'center', fontSize: '.78rem', color: 'var(--cinza-mudo)', marginBottom: '1.5rem' }}>
            {mode === 'register' ? 'Preencha seus dados pra começar' : 'Use o e-mail e senha do seu cadastro'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
            {mode === 'register' && (
              <input type="text" placeholder="Seu nome" value={nome} onChange={e => setNome(e.target.value)} style={inputStyle} />
            )}
            <input type="email" placeholder="Seu e-mail" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />

            <div style={{ position: 'relative' }}>
              <input type={verSenha ? 'text' : 'password'} placeholder="Senha (mín. 6 caracteres)" value={senha} onChange={e => setSenha(e.target.value)} style={{ ...inputStyle, paddingRight: '3rem' }} />
              <button type="button" onClick={() => setVerSenha(!verSenha)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--cinza-mudo)', fontSize: '.85rem' }}>
                {verSenha ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {mode === 'register' && (
              <input type="tel" placeholder="WhatsApp (opcional)" value={telefone} onChange={e => setTelefone(e.target.value)} style={inputStyle} />
            )}

            {erro && <p style={{ color: 'var(--coral)', fontSize: '.75rem', textAlign: 'center', margin: 0 }}>{erro}</p>}

            <button onClick={submit} disabled={loading} style={btnStyle}>{loading ? 'aguarde...' : mode === 'register' ? 'criar conta' : 'entrar'}</button>
          </div>

          <p style={{ textAlign: 'center', fontSize: '.75rem', marginTop: '1.2rem', color: 'var(--cinza-mudo)' }}>
            {mode === 'register' ? (
              <span>Já tem conta? <span onClick={() => setMode('login')} style={linkStyle}>Entrar</span></span>
            ) : (
              <span>Não tem conta? <span onClick={() => setMode('register')} style={linkStyle}>Criar conta</span></span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '.75rem 1rem', borderRadius: '12px', border: '1px solid #ddd', fontSize: '.82rem', fontFamily: 'var(--font-body)', background: '#fff', outline: 'none', boxSizing: 'border-box' as const }

const btnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '.82rem', letterSpacing: '.06em', textTransform: 'uppercase' as const, padding: '.9rem 2.2rem', borderRadius: '60px', background: 'var(--coral)', color: '#fff', boxShadow: '0 2px 12px rgba(255,90,95,.25)', border: 'none', cursor: 'pointer', width: '100%', marginTop: '.5rem' }

const linkStyle: React.CSSProperties = { color: 'var(--turquesa)', cursor: 'pointer', textDecoration: 'underline' }