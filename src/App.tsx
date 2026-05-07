import { useState, useEffect } from 'react'
import VideoCarousel from './components/VideoCarousel'
import Header from './components/Header'
import Hero from './components/Hero'
import PainPoints from './components/PainPoints'
import HowItWorks from './components/HowItWorks'
import Brands from './components/Brands'
import ValueStack from './components/ValueStack'
import PriceAnchor from './components/PriceAnchor'
import Plans from './components/Plans'
import Objections from './components/Objections'
import FAQ from './components/FAQ'
import CTAFinal from './components/CTAFinal'
import Footer from './components/Footer'
import PerfilDeLook from './components/PerfilDeLook'
import AuthPage from './components/AuthPage'
import ClientArea from './components/ClientArea'
import Checkout from './components/Checkout'
import Sucesso from './components/Sucesso'
import Termos from './components/Termos'
import ResetPassword from './components/ResetPassword'

import { trackMetaPixelPageView } from './lib/metaPixel'

export default function App() {
  const [hash, setHash] = useState(window.location.hash)

  useEffect(() => {
    trackMetaPixelPageView()
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

  if (hash === '#/termos') return <Termos />

  if (hash.startsWith('#/resetar-senha')) return <ResetPassword />

  if (hash === '#/sucesso') {
    if (!localStorage.getItem('vivefit_token')) { window.location.hash = '#/'; return null }
    return <Sucesso />
  }

  if (hash.startsWith('#/checkout')) {
    const params = new URLSearchParams(hash.split('?')[1] || '')
    const plano = params.get('plano')
    if (!plano) { window.location.hash = '#/'; return null }
    if (!localStorage.getItem('vivefit_token')) { window.location.hash = '#/cadastro?plano=' + plano; return null }
    return <Checkout plano={plano} />
  }

  if (hash === '#/minha-conta') {
    const token = localStorage.getItem('vivefit_token')
    if (!token) { window.location.hash = '#/login'; return null }
    return <ClientArea />
  }

  if (hash.startsWith('#/login') || hash.startsWith('#/cadastro')) {
    const params = new URLSearchParams(hash.split('?')[1] || '')
    const plano = params.get('plano')
    return (
      <AuthPage
        planoPreSelecionado={plano}
        onAuth={async (token: string) => {
          const API = 'https://api.vivefit.site'
          try {
            const [meRes, perfilRes] = await Promise.all([
              fetch(API + '/auth/me', { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json()),
              fetch(API + '/perfil', { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json()).catch(() => ({ perfil: null }))
            ])
            const status = meRes?.status
            const temPerfil = !!(perfilRes?.perfil?.tamanho)
            if (status === 'ativo' || status === 'cortesia' || status === 'inadimplente') {
              window.location.hash = '#/minha-conta'; return
            }
            if (plano) {
              window.location.hash = temPerfil ? `#/checkout?plano=${plano}` : `#/perfil-de-look?plano=${plano}`; return
            }
            if (temPerfil) {
              window.location.hash = '#/'
              setTimeout(() => { document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' }) }, 200)
            } else {
              window.location.hash = '#/perfil-de-look'
            }
          } catch {
            window.location.hash = '#/perfil-de-look'
          }
        }}
      />
    )
  }

  if (hash.startsWith('#/perfil-de-look')) {
    const params = new URLSearchParams(hash.split('?')[1] || '')
    const planoEscolhido = params.get('plano')
    if (!localStorage.getItem('vivefit_token')) {
      window.location.hash = planoEscolhido ? `#/cadastro?plano=${planoEscolhido}` : '#/cadastro'
      return null
    }
    return <PerfilDeLook planoPreSelecionado={planoEscolhido} />
  }

  {/* ══════════════════════════════════════
      ORDEM DAS SEÇÕES (manual de marketing):
      1. O que é isso? → Hero
      2. Por que eu preciso? → PAS (dor)
      3. Como funciona? → Como Funciona
      4. Isso é real? → Prova Social
      5. O que eu recebo? → Stack de Valor + Marcas
      6. Quanto custa? → Ancoragem + Planos
      7. E se eu não gostar? → Garantia + Objeções
      8. Tá, quero. → CTA Final
      ══════════════════════════════════════ */}

  return (
    <>
      <Header />

      {/* 1. O que é isso? */}
      <Hero />

      {/* 2. Por que eu preciso disso? */}
      <PainPoints />

      {/* 3. Como funciona? */}
      <div className="reveal">
        <HowItWorks />
      </div>

      {/* 4. Isso é real? */}
      <VideoCarousel />

            {/* 5. O que eu recebo? */}
      <div className="reveal">
        <ValueStack />
      </div>

      <div className="reveal">
        <Brands />
      </div>

      {/* 6. Quanto custa? */}
      <div className="reveal">
        <PriceAnchor />
      </div>

      <div className="reveal-price">
        <Plans />
      </div>

      <div className="reveal">
        <Objections />
      </div>

      <div className="reveal">
        <FAQ />
      </div>

      {/* 8. Tá, quero. */}
      <CTAFinal />

      <Footer />
    </>
  )
}