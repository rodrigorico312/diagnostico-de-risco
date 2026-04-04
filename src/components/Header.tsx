import { useState, useEffect } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastY = 0
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > 120 && y > lastY)
      if (menuOpen) setMenuOpen(false)
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className={`hdr${hidden ? ' hide' : ''}`}>
        <div className="hdr-in">
          <a href="#/" className="logo">
 <img src="/img/logo.svg" alt="VIVE FIT" style={{ height: '110px' }} />
</a>
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
      </header>
      {menuOpen && <div className="mob-overlay" onClick={closeMenu} />}
      <nav className={`mob-nav${menuOpen ? ' open' : ''}`}>
        <a href="#como" onClick={closeMenu}>Como funciona</a>
        <a href="#planos" onClick={closeMenu}>Planos</a>
        <a href="#faq" onClick={closeMenu}>Dúvidas</a>
        <a href="#/perfil-de-look" className="mob-nav-cta" onClick={closeMenu}>Criar meu perfil de look</a>
      </nav>
    </>
  )
}