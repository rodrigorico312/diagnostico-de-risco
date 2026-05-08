import { useState, useEffect } from 'react'

const API = 'https://api.vivefit.site'
const POLLING_INTERVAL_MS = 5000
const POLLING_TIMEOUT_MS = 5 * 60 * 1000

interface UserData {
  id: number
  nome: string
  email: string
  telefone: string | null
  status: string
  plano: string | null
}

export default function Sucesso() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [temPerfil, setTemPerfil] = useState(false)
  const [copiado, setCopiado] = useState(false)
  const [pagamentoConfirmado, setPagamentoConfirmado] = useState(false)
  const [pollingExpirado, setPollingExpirado] = useState(false)

  const token = localStorage.getItem('vivefit_token')
  const primeiroNome = user?.nome?.split(' ')[0] || 'amiga'

  useEffect(() => {
    if (!token) {
      window.location.hash = '#/'
      return
    }

    let cancelado = false
    let intervalId: ReturnType<typeof setInterval> | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    const pararPolling = () => {
      if (intervalId) clearInterval(intervalId)
      if (timeoutId) clearTimeout(timeoutId)
    }

    const tratarUsuario = (userData: UserData) => {
      if (cancelado) return false
      setUser(userData)

      if (userData?.status === 'ativo') {
        setPagamentoConfirmado(true)
        setPollingExpirado(false)
        localStorage.removeItem('vivefit_payment_url')
        localStorage.removeItem('vivefit_payment_at')
        pararPolling()
        return true
      }

      return false
    }

    const buscarUsuario = async () => {
      const res = await fetch(API + '/auth/me', { headers: { 'Authorization': 'Bearer ' + token } })
      if (!res.ok) throw new Error('Falha ao carregar usuario')
      return res.json() as Promise<UserData>
    }

    const carregarPerfil = async () => {
      try {
        const res = await fetch(API + '/perfil', { headers: { 'Authorization': 'Bearer ' + token } })
        const data = await res.json()
        if (!cancelado) setTemPerfil(!!(data?.perfil?.tamanho))
      } catch (e) {
        if (!cancelado) setTemPerfil(false)
      }
    }

    const iniciar = async () => {
      setLoading(true)
      try {
        const [userData] = await Promise.all([buscarUsuario(), carregarPerfil()])
        const confirmado = tratarUsuario(userData)
        if (!cancelado) setLoading(false)
        if (confirmado || cancelado) return

        intervalId = setInterval(() => {
          buscarUsuario()
            .then(tratarUsuario)
            .catch(() => {})
        }, POLLING_INTERVAL_MS)

        timeoutId = setTimeout(() => {
          if (cancelado || pagamentoConfirmado) return
          setPollingExpirado(true)
          if (intervalId) clearInterval(intervalId)
        }, POLLING_TIMEOUT_MS)
      } catch (e) {
        if (!cancelado) setLoading(false)
      }
    }

    iniciar()

    return () => {
      cancelado = true
      pararPolling()
    }
  }, [token])

  const compartilhar = async () => {
    const url = 'https://vivefit.site'
    const texto = 'Conhece a VIVE FIT? Clube de assinatura de moda fitness, peças selecionadas pra você todo mês'

    if (navigator.share) {
      try {
        await navigator.share({ title: 'VIVE FIT', text: texto, url })
      } catch (e) {}
    } else {
      try {
        await navigator.clipboard.writeText(url)
        setCopiado(true)
        setTimeout(() => setCopiado(false), 2500)
      } catch (e) {}
    }
  }

  const renderCards = (mostrarPerfil: boolean) => (
    <div className="sucesso-cards">
      {mostrarPerfil && !temPerfil && (
        <div className="sucesso-card sucesso-card-perfil">
          <div className="sucesso-card-label sucesso-card-label-marinho">Passo opcional</div>
          <div className="sucesso-card-title sucesso-card-title-marinho">Complete seu perfil</div>
          <div className="sucesso-card-sub">Pra box ficar ainda mais sua.</div>
          <a href="#/perfil-de-look" className="sucesso-card-link sucesso-card-link-turquesa">
            preencher agora
          </a>
        </div>
      )}

      <a href="https://instagram.com/vivefitstm" target="_blank" rel="noopener noreferrer" className="sucesso-card sucesso-card-insta">
        <div className="sucesso-insta-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </div>
        <div className="sucesso-insta-text">
          <div className="sucesso-insta-label">Instagram</div>
          <div className="sucesso-insta-user">Seguir @vivefitstm</div>
        </div>
        <div className="sucesso-insta-arrow">›</div>
      </a>

      <div className="sucesso-card sucesso-card-share">
        <div className="sucesso-card-label">Compartilhe</div>
        <div className="sucesso-card-title">Conta pra uma amiga</div>
        <div className="sucesso-card-sub sucesso-card-sub-light">que também merece se cuidar</div>
        <button onClick={compartilhar} className="sucesso-card-link sucesso-card-link-white">
          {copiado ? 'link copiado ✓' : 'compartilhar link'}
        </button>
      </div>
    </div>
  )

  const renderRodape = () => (
    <div className="sucesso-rodape">
      <div className="sucesso-rodape-label">Dúvidas?</div>
      <a href="https://wa.me/5593991129194" target="_blank" rel="noopener noreferrer" className="sucesso-rodape-wpp">
        WhatsApp (93) 99112-9194
      </a>
    </div>
  )

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ color: '#64748B', fontSize: '13px', fontFamily: 'Arial, sans-serif' }}>carregando...</div>
      </div>
    )
  }

  if (!pagamentoConfirmado) {
    return (
      <>
        <style>{css}</style>
        <div className="sucesso-page">
          <div className="sucesso-container">
            <div className="sucesso-pill sucesso-pill-pendente">
              <span className="sucesso-pill-dot sucesso-pill-dot-pendente"></span>
              AGUARDANDO PAGAMENTO
            </div>

            <h1 className="sucesso-h1-1">Quase lá,</h1>
            <h1 className="sucesso-h1-2">{primeiroNome}.</h1>

            <p className="sucesso-desc">
              Assim que o pagamento for confirmado, sua assinatura é ativada e começamos a preparar sua primeira box.
            </p>
            <p className="sucesso-desc sucesso-desc-secundario">
              Se já pagou, aguarde alguns instantes — a confirmação pode levar até 2 minutos.
            </p>

            {pollingExpirado && (
              <p className="sucesso-timeout">
                Não identificamos seu pagamento ainda. Se já pagou, pode levar alguns minutos. Se precisar de ajuda, fale pelo WhatsApp.
              </p>
            )}

            <a href="#/minha-conta" className="sucesso-cta-primary">
              ACESSAR MINHA CONTA
            </a>

            {renderCards(false)}
            {renderRodape()}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{css}</style>
      <div className="sucesso-page">
        <div className="sucesso-container">
          <div className="sucesso-pill sucesso-pill-confirmado">
            <span className="sucesso-pill-dot sucesso-pill-dot-confirmado"></span>
            PAGAMENTO CONFIRMADO
          </div>

          <h1 className="sucesso-h1-1">Bem-vinda,</h1>
          <h1 className="sucesso-h1-2">{primeiroNome}.</h1>

          <p className="sucesso-desc">
            Sua assinatura está ativa. A gente começa a preparar sua primeira box em breve.
          </p>

          <a href="#/minha-conta" className="sucesso-cta-primary">
            ACESSAR MINHA CONTA
          </a>

          {renderCards(true)}
          {renderRodape()}
        </div>
      </div>
    </>
  )
}

const css = `
.sucesso-page {
  min-height: 100vh;
  background: #FFFFFF;
  padding: 32px 20px;
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
}

.sucesso-container {
  width: 100%;
  max-width: 420px;
}

.sucesso-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 9px;
  letter-spacing: .22em;
  text-transform: uppercase;
  padding: 7px 14px;
  border-radius: 60px;
  margin-bottom: 28px;
  font-weight: 700;
}
.sucesso-pill-pendente {
  background: #E0F2FE;
  color: #0369A1;
}
.sucesso-pill-confirmado {
  background: #DCFCE7;
  color: #15803D;
}
.sucesso-pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}
.sucesso-pill-dot-pendente {
  background: #0284C7;
}
.sucesso-pill-dot-confirmado {
  background: #22C55E;
}

.sucesso-h1-1 {
  font-family: Georgia, serif;
  font-size: 44px;
  font-weight: 400;
  color: #040861;
  margin: 0 0 4px;
  letter-spacing: 0;
  line-height: .92;
}
.sucesso-h1-2 {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-style: italic;
  font-size: 52px;
  font-weight: 300;
  color: #0A9AA8;
  margin: 0 0 24px;
  letter-spacing: 0;
  line-height: .9;
}

.sucesso-desc {
  font-family: Georgia, serif;
  font-size: 14px;
  color: #334155;
  line-height: 1.6;
  margin: 0 0 16px;
}
.sucesso-desc-secundario {
  color: #64748B;
  font-size: 13px;
  margin-bottom: 28px;
}
.sucesso-timeout {
  color: #B45309;
  background: #FEF3C7;
  border: 1px solid #FDE68A;
  border-radius: 10px;
  font-size: 12px;
  line-height: 1.5;
  padding: 12px 14px;
  margin: 0 0 22px;
}

.sucesso-cta-primary {
  display: block;
  text-align: center;
  background: #040861;
  color: #fff;
  padding: 16px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: 60px;
  box-shadow: 0 6px 20px rgba(4,8,97,.35), 0 2px 6px rgba(4,8,97,.2);
  margin-bottom: 28px;
  transition: transform .2s, box-shadow .2s;
}
.sucesso-cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(4,8,97,.45), 0 2px 6px rgba(4,8,97,.2);
}

.sucesso-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}

.sucesso-card {
  border-radius: 16px;
  padding: 16px 18px;
}

.sucesso-card-perfil {
  background: #F7F9FC;
  border: 1px solid #E4E8EE;
}

.sucesso-card-label {
  font-size: 8px;
  letter-spacing: .2em;
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 6px;
  color: #fff;
  opacity: .8;
}
.sucesso-card-label-marinho {
  color: #040861;
  opacity: 1;
}

.sucesso-card-title {
  font-family: Georgia, serif;
  font-size: 15px;
  margin-bottom: 3px;
  line-height: 1.3;
  font-weight: 500;
  color: #fff;
}
.sucesso-card-title-marinho {
  color: #040861;
}

.sucesso-card-sub {
  font-size: 11px;
  color: #64748B;
  line-height: 1.5;
  margin-bottom: 8px;
}
.sucesso-card-sub-light {
  color: #fff;
  opacity: .75;
}

.sucesso-card-link {
  font-size: 10px;
  letter-spacing: .14em;
  text-transform: uppercase;
  font-weight: 700;
  text-decoration: none;
  padding-bottom: 2px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: Arial, sans-serif;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  display: inline-block;
}
.sucesso-card-link-turquesa {
  color: #0A9AA8;
  border-bottom: 1px solid #0A9AA8;
}
.sucesso-card-link-white {
  color: #fff;
  border-bottom: 1px solid rgba(255,255,255,.5);
}

.sucesso-card-insta {
  background: linear-gradient(135deg, #0A9AA8 0%, #0CBBCC 100%);
  color: #fff;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  transition: transform .2s;
}
.sucesso-card-insta:hover {
  transform: translateY(-1px);
}
.sucesso-insta-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,.18);
  flex-shrink: 0;
}
.sucesso-insta-text {
  flex: 1;
}
.sucesso-insta-label {
  font-size: 8px;
  letter-spacing: .22em;
  text-transform: uppercase;
  opacity: .85;
  font-weight: 700;
  margin-bottom: 2px;
}
.sucesso-insta-user {
  font-family: Georgia, serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
}
.sucesso-insta-arrow {
  font-size: 18px;
  opacity: .8;
  line-height: 1;
}

.sucesso-card-share {
  background: #040861;
}

.sucesso-rodape {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0 4px;
  border-top: 1px solid #F0F4F6;
  margin-top: 8px;
}
.sucesso-rodape-label {
  font-size: 9px;
  color: #94A3B8;
  letter-spacing: .14em;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.sucesso-rodape-wpp {
  font-size: 11px;
  color: #0A9AA8;
  text-decoration: none;
  font-weight: 700;
}

@media (min-width: 720px) {
  .sucesso-page {
    padding: 60px 20px;
  }
  .sucesso-container {
    max-width: 480px;
  }
  .sucesso-h1-1 {
    font-size: 56px;
  }
  .sucesso-h1-2 {
    font-size: 68px;
    margin-bottom: 32px;
  }
  .sucesso-desc {
    font-size: 15px;
  }
  .sucesso-desc-secundario {
    font-size: 14px;
    margin-bottom: 36px;
  }
  .sucesso-cta-primary {
    padding: 18px;
    font-size: 12px;
    margin-bottom: 36px;
  }
  .sucesso-cards {
    gap: 12px;
    margin-bottom: 32px;
  }
  .sucesso-card {
    padding: 20px 22px;
  }
  .sucesso-card-insta {
    padding: 16px 22px;
  }
  .sucesso-card-title {
    font-size: 17px;
  }
  .sucesso-card-sub {
    font-size: 12px;
  }
  .sucesso-insta-user {
    font-size: 15px;
  }
  .sucesso-rodape {
    padding: 20px 0 4px;
    margin-top: 12px;
  }
  .sucesso-rodape-wpp {
    font-size: 12px;
  }
}
`
