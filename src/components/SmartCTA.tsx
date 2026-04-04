import { useState, useEffect } from 'react'

export default function SmartCTA() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let timerDone = false
    let pastHero = false
    let lastY = 0
    let direction: 'up' | 'down' = 'down'
    let visible = false

    const check = () => {
      const shouldShow = timerDone && pastHero && direction === 'down'
      if (shouldShow !== visible) {
        visible = shouldShow
        setShow(shouldShow)
      }
    }

    const timer = setTimeout(() => { timerDone = true; check() }, 120000)

    const heroEl = document.getElementById('hero')
    const obs = heroEl
      ? new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; check() }, { threshold: 0 })
      : null
    if (heroEl && obs) obs.observe(heroEl)

    const onScroll = () => {
      const y = window.scrollY
      const newDir = y > lastY ? 'down' : 'up'
      if (newDir !== direction) { direction = newDir; check() }
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => { clearTimeout(timer); obs?.disconnect(); window.removeEventListener('scroll', onScroll) }
  }, [])

  return (
    <div className={`smart-cta${show ? ' show' : ''}`}>
      <a href="#/perfil-de-look" className="btn btn-coral">crie seu perfil de look</a>
    </div>
  )
}