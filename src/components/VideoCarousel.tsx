import { useRef, useEffect, memo } from 'react'

const videos = [
  { src: 'https://vivefitcdn.b-cdn.net/Flavia10.mp4', caption: 'conferindo o look do mês' },
  { src: 'https://vivefitcdn.b-cdn.net/Flaviaambeitenexterno.mp4', caption: 'do treino pro dia a dia' },
  { src: 'https://vivefitcdn.b-cdn.net/Flaviabo.mp4', caption: 'textura e acabamento de perto' },
  { src: 'https://vivefitcdn.b-cdn.net/Flavioquartoroupa.mp4', caption: 'provando peça por peça' },
  { src: 'https://vivefitcdn.b-cdn.net/Isabela10.mp4', caption: 'caimento real no corpo' },
  { src: 'https://vivefitcdn.b-cdn.net/Nana.mp4', caption: 'primeira impressão ao vestir' },
  { src: 'https://vivefitcdn.b-cdn.net/Nanabox.mp4', caption: 'abrindo a box do mês' },
]

const VideoCard = memo(function VideoCard({ src, caption }: { src: string; caption: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const card = cardRef.current
    const video = videoRef.current
    if (!card || !video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (timerRef.current) clearTimeout(timerRef.current)
          timerRef.current = setTimeout(() => {
            video.preload = 'auto'
            video.play().catch(() => {})
          }, 150)
        } else {
          if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
          }
          video.pause()
          video.preload = 'none'
        }
      },
      { threshold: 0.6, rootMargin: '0px 100px 0px 100px' }
    )

    observer.observe(card)
    return () => {
      observer.disconnect()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div className="vid-card" ref={cardRef}>
      <div className="vid-player">
        <video
          ref={videoRef}
          src={src + '?v=2'}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
      </div>
      <p className="vid-caption">{caption}</p>
    </div>
  )
})

export default function VideoCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let paused = false
    let animId: number
    let resumeTimer: ReturnType<typeof setTimeout> | null = null

    const step = () => {
      if (!paused && track.scrollWidth > track.clientWidth) {
        track.scrollLeft += 1.5
        const half = track.scrollWidth / 2
        if (track.scrollLeft >= half) track.scrollLeft = 0
      }
      animId = requestAnimationFrame(step)
    }
    animId = requestAnimationFrame(step)

    const stop = () => {
      paused = true
      if (resumeTimer) { clearTimeout(resumeTimer); resumeTimer = null }
    }
    const resume = () => {
      if (resumeTimer) clearTimeout(resumeTimer)
      resumeTimer = setTimeout(() => { paused = false }, 2000)
    }

    track.addEventListener('pointerdown', stop)
    track.addEventListener('pointerup', resume)
    track.addEventListener('pointerleave', resume)
    track.addEventListener('touchstart', stop, { passive: true })
    track.addEventListener('touchend', resume, { passive: true })
    track.addEventListener('touchcancel', resume, { passive: true })

    return () => {
      cancelAnimationFrame(animId)
      if (resumeTimer) clearTimeout(resumeTimer)
      track.removeEventListener('pointerdown', stop)
      track.removeEventListener('pointerup', resume)
      track.removeEventListener('pointerleave', resume)
      track.removeEventListener('touchstart', stop)
      track.removeEventListener('touchend', resume)
      track.removeEventListener('touchcancel', resume)
    }
  }, [])

  return (
    <section className="vid-section">
      <div className="vid-inner">
        <p className="vid-tag">Direto do provador</p>
        <h2 className="vid-title">Veja a experiência completa.</h2>
        <p className="vid-sub">Da caixa chegando até o look pronto. Tecido, caimento e unboxing sem filtro.</p>
      </div>
      <div className="vid-track" ref={trackRef}>
        {videos.map((v, i) => (
          <VideoCard key={`a${i}`} src={v.src} caption={v.caption} />
        ))}
        {videos.map((v, i) => (
          <VideoCard key={`b${i}`} src={v.src} caption={v.caption} />
        ))}
      </div>
      <div style={{textAlign:'center', padding:'24px 20px 0'}}>
        <a href="#/perfil-de-look" className="btn btn-hero">Criar meu perfil de look</a>
      </div>
    </section>
  )
}