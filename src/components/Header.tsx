import { useState, useEffect } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastY = 0
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > 120 && y > lastY)
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={`hdr${hidden ? ' hide' : ''}`}>
      <div className="hdr-in">
        <a href="#/" className="logo">VIVE FIT</a>
        <nav className="nav-d">
          <a href="#como">Como funciona</a>
          <a href="#planos">Planos</a>
          <a href="#faq">Dúvidas</a>
          <a href="#/perfil-de-look" className="nav-pill">Criar meu perfil</a>
        </nav>
        <button
          className={`mob-btn${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>
      <nav className={`mob-nav${menuOpen ? ' open' : ''}`}>
        <a href="#como" onClick={closeMenu}>Como funciona</a>
        <a href="#planos" onClick={closeMenu}>Planos</a>
        <a href="#faq" onClick={closeMenu}>Dúvidas</a>
        <a href="#/perfil-de-look" onClick={closeMenu}>Criar meu perfil de look</a>
      </nav>
    </header>
  )
}