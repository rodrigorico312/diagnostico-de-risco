import { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Brands from './components/Brands'
import Personalization from './components/Personalization'
import Plans from './components/Plans'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import SmartCTA from './components/SmartCTA'
import PerfilDeLook from './components/PerfilDeLook'
import AuthPage from './components/AuthPage'
import ClientArea from './components/ClientArea'
import Checkout from './components/Checkout'

export default function App() {
  const [hash, setHash] = useState(window.location.hash)

  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-glow, .reveal-surprise, .reveal-price')

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible')
        })
      },
      { threshold: 0.3 }
    )

    const obsS = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible')
        })
      },
      { threshold: 0.6 }
    )

    els.forEach((el) => {
      if (el.classList.contains('reveal-surprise')) {
        obsS.observe(el)
      } else {
        obs.observe(el)
      }
    })

    return () => { obs.disconnect(); obsS.disconnect() }
  }, [hash])

  // ── ROTA: Checkout (resumo do pedido) ──
  if (hash.startsWith('#/checkout')) {
    const params = new URLSearchParams(hash.split('?')[1] || '')
    const plano = params.get('plano')
    if (!plano) { window.location.hash = '#/'; return null }
    if (!localStorage.getItem('vivefit_token')) {
      window.location.hash = '#/cadastro'
      return null
    }
    return <Checkout plano={plano} />
  }

  // ── ROTA: Área da cliente ──
  if (hash === '#/minha-conta') {
    const token = localStorage.getItem('vivefit_token')
    if (!token) { window.location.hash = '#/login'; return null }
    return <ClientArea />
  }

  // ── ROTA: Login/Cadastro ──
  if (hash.startsWith('#/login') || hash.startsWith('#/cadastro')) {
    const params = new URLSearchParams(hash.split('?')[1] || '')
    const plano = params.get('plano')
    return (
      <AuthPage
        planoPreSelecionado={plano}
        onAuth={() => {
          const fezQuiz = localStorage.getItem('vivefit_quiz_done')
          if (fezQuiz && plano) {
            window.location.hash = `#/checkout?plano=${plano}`
          } else {
            window.location.hash = '#/perfil-de-look'
          }
        }}
      />
    )
  }

  // ── ROTA: Quiz Perfil de Look ──
  if (hash.startsWith('#/perfil-de-look')) {
    const params = new URLSearchParams(hash.split('?')[1] || '')
    const planoEscolhido = params.get('plano')

    if (!localStorage.getItem('vivefit_token')) {
      window.location.hash = '#/cadastro'
      return null
    }

    return <PerfilDeLook planoPreSelecionado={planoEscolhido} />
  }

  // ── ROTA: Home ──
  return (
    <>
      <Header />
      <Hero />

     <HowItWorks />

      <div className="reveal">
        <Brands />
      </div>

      <div className="reveal-glow">
        <Personalization />
      </div>

      <div className="reveal" style={{ paddingTop: '0.5rem', paddingBottom: '2.5rem' }}>
        <div className="editorial-break">
          <p className="editorial">"Menos tempo escolhendo. Mais tempo treinando."</p>
        </div>
      </div>

      <div className="reveal-price">
        <Plans />
      </div>

      <div className="reveal">
        <FAQ />
      </div>

      <Footer />
      <SmartCTA />
    </>
  )
}