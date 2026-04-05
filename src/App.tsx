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

export default function App() {
  const [hash, setHash] = useState(window.location.hash)

  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  if (hash.startsWith('#/perfil-de-look')) {
    const params = new URLSearchParams(hash.split('?')[1] || '')
    const planoEscolhido = params.get('plano')
    return <PerfilDeLook planoPreSelecionado={planoEscolhido} />
  }

  return (
    <>
      <Header />
      <Hero />
      <HowItWorks />
      <Brands />
      <Personalization />

<div className="editorial-break">
      <p className="editorial">"Menos tempo escolhendo. Mais tempo treinando."</p>
      </div>

      <Plans />
      <FAQ />

      <Footer />
      <SmartCTA />
    </>
  )
}