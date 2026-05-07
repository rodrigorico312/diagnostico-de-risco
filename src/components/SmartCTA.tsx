import { useState, useEffect } from 'react'

export default function SmartCTA() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 600)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={'smart-cta' + (show ? ' show' : '')}>
      <a href="#/perfil-de-look" className="btn btn-hero">
        Criar meu perfil de look
      </a>
    </div>
  )
}