import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { formatTelefoneLocal, normalizarTelefone } from '../lib/utils'

const API = 'https://api.vivefit.site'
const ACCENT = '#040861'
const ERROR = '#DC2626'

const emailValido = (v: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

interface Props {
  onAuth: (token: string, nome: string) => void
  planoPreSelecionado?: string | null
}

type AuthMode = 'login' | 'register' | 'forgot'

export default function AuthPage({ onAuth, planoPreSelecionado }: Props) {
  const [mode, setMode] = useState<AuthMode>('register')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [telefone, setTelefone] = useState('')
  const [contatoRecuperacao, setContatoRecuperacao] = useState('')
  const [verSenha, setVerSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(false)

  const mudarModo = (novoModo: AuthMode) => {
    setMode(novoModo)
    setErro('')
    setMensagem('')
  }

  const submit = async () => {
    setErro('')
    setMensagem('')
    if (mode === 'register' && !nome.trim()) return setErro('Preencha seu nome')
    if (mode === 'register' && nome.trim().length < 2) return setErro('Nome muito curto')
    if (!email.trim()) return setErro('Preencha seu e-mail')
    if (!emailValido(email.trim())) return setErro('E-mail invalido')
    if (mode === 'register') {
      if (!telefone.trim()) return setErro('Preencha seu WhatsApp')
      const telDig = normalizarTelefone(telefone)
      if (telDig.length !== 10 && telDig.length !== 11) return setErro('WhatsApp invalido. Digite com DDD (10 ou 11 digitos)')
      const ddd = parseInt(telDig.substring(0, 2))
      if (ddd < 11 || ddd > 99) return setErro('DDD invalido')
    }
    if (!senha || senha.length < 6) return setErro('Senha precisa ter pelo menos 6 caracteres')

    setLoading(true)
    try {
      const endpoint = mode === 'register' ? '/auth/register' : '/auth/login'
      const body = mode === 'register'
        ? { nome: nome.trim(), email: email.trim().toLowerCase(), senha, telefone: normalizarTelefone(telefone) }
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
      setErro('Erro de conexao. Tente novamente.')
    }
    setLoading(false)
  }

  const submitRecuperacao = async () => {
    setErro('')
    setMensagem('')
    const contato = contatoRecuperacao.trim()
    if (!contato) return setErro('Informe seu e-mail ou WhatsApp')

    setLoading(true)
    try {
      const res = await fetch(API + '/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identificador: contato }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErro(data.error || 'Erro ao solicitar recuperacao')
        setLoading(false)
        return
      }

      setMensagem(data.message || 'Se existir uma conta com esse contato, enviamos um link pelo WhatsApp.')
    } catch {
      setErro('Erro de conexao. Tente novamente.')
    }
    setLoading(false)
  }

  const titulo = mode === 'register'
    ? 'Pronta para comecar?'
    : mode === 'login'
      ? 'Entrar na minha conta'
      : 'Recuperar senha'

  const subtitulo = mode === 'register'
    ? 'Cadastro rapido, sua box e unica'
    : mode === 'login'
      ? 'Use o e-mail e senha do seu cadastro'
      : 'Informe seu e-mail ou WhatsApp cadastrado'

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--gelo)', overflow: 'auto' }}>
      <div className="q-hdr auth-hdr">
        <span className="q-logo auth-logo">
          <img src="https://i.postimg.cc/CLyDrrMm/logo-vivefit-turquesa.png" alt="VIVE FIT" />
        </span>
        <a href="#/" className="q-close">voltar ao site</a>
      </div>

      {planoPreSelecionado && (
        <div style={{ textAlign: 'center', padding: '.4rem 5%', background: 'var(--cobalto-soft)', fontSize: '.68rem', color: 'var(--cobalto)', fontFamily: 'var(--font-heading)', letterSpacing: '.04em' }}>
          Pronta para comecar? Em poucos passos sua box e unica
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem 5% 1.5rem', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', textAlign: 'center', marginBottom: '.3rem', color: 'var(--azul-noite)' }}>
            {titulo}
          </h2>
          <p style={{ textAlign: 'center', fontSize: '.78rem', color: 'var(--cinza-mudo)', marginBottom: '1.5rem' }}>
            {subtitulo}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
            {mode === 'forgot' ? (
              <input
                type="text"
                placeholder="E-mail ou WhatsApp"
                value={contatoRecuperacao}
                onChange={e => setContatoRecuperacao(e.target.value)}
                style={inputStyle}
              />
            ) : (
              <>
                {mode === 'register' && (
                  <input type="text" placeholder="Seu nome" value={nome} onChange={e => setNome(e.target.value)} style={inputStyle} />
                )}

                <input type="email" placeholder="Seu e-mail" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />

                <div style={{ position: 'relative' }}>
                  <input type={verSenha ? 'text' : 'password'} placeholder="Senha (min. 6 caracteres)" value={senha} onChange={e => setSenha(e.target.value)} style={{ ...inputStyle, paddingRight: '3rem' }} />
                  <button type="button" onClick={() => setVerSenha(!verSenha)} aria-label={verSenha ? 'Ocultar senha' : 'Mostrar senha'} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--cinza-mudo)' }}>
                    {verSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {mode === 'register' && (
                  <div style={{ display: 'flex', width: '100%', alignItems: 'stretch' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '.75rem .9rem', border: '1px solid #ddd', borderRight: 'none', borderRadius: '12px 0 0 12px', background: 'rgba(4,8,97,.04)', color: 'var(--azul-noite)', fontFamily: 'var(--font-heading)', fontSize: '.82rem', fontWeight: 700 }}>+55</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="off"
                      autoFocus={false}
                      placeholder="(93) 99999-9999"
                      value={formatTelefoneLocal(telefone)}
                      onChange={e => setTelefone(normalizarTelefone(e.target.value))}
                      style={{ ...inputStyle, flex: 1, borderRadius: '0 12px 12px 0', borderLeft: 'none' }}
                    />
                  </div>
                )}
              </>
            )}

            {erro && <p style={{ color: ERROR, fontSize: '.75rem', textAlign: 'center', margin: 0 }}>{erro}</p>}
            {mensagem && <p style={{ color: 'var(--cobalto)', fontSize: '.75rem', textAlign: 'center', margin: 0, lineHeight: 1.5 }}>{mensagem}</p>}

            <button onClick={mode === 'forgot' ? submitRecuperacao : submit} disabled={loading} style={btnStyle}>
              {loading ? 'aguarde...' : mode === 'register' ? 'criar conta' : mode === 'login' ? 'entrar' : 'enviar link no WhatsApp'}
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: '.75rem', marginTop: '1.2rem', color: 'var(--cinza-mudo)' }}>
            {mode === 'register' ? (
              <span>Ja tem conta? <span onClick={() => mudarModo('login')} style={linkStyle}>Entrar</span></span>
            ) : mode === 'login' ? (
              <span>Nao tem conta? <span onClick={() => mudarModo('register')} style={linkStyle}>Criar conta</span></span>
            ) : (
              <span>Lembrou a senha? <span onClick={() => mudarModo('login')} style={linkStyle}>Entrar</span></span>
            )}
          </p>

          {mode === 'login' && (
            <p style={{ textAlign: 'center', fontSize: '.75rem', marginTop: '.6rem' }}>
              <span onClick={() => mudarModo('forgot')} style={linkStyle}>Esqueci minha senha</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '.75rem 1rem', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px', fontFamily: 'var(--font-body)', background: '#fff', outline: 'none', boxSizing: 'border-box' as const }

const btnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '.82rem', letterSpacing: '.06em', textTransform: 'uppercase' as const, padding: '.9rem 2.2rem', borderRadius: '60px', background: ACCENT, color: '#fff', boxShadow: '0 2px 12px rgba(4,8,97,.25)', border: 'none', cursor: 'pointer', width: '100%', marginTop: '.5rem' }

const linkStyle: React.CSSProperties = { color: 'var(--turquesa)', cursor: 'pointer', textDecoration: 'underline' }
