const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID?.trim() || '1757524701885185'

declare global {
  interface Window {
    fbq?: ((...args: any[]) => void) & {
      callMethod?: (...args: any[]) => void
      queue?: any[]
      loaded?: boolean
      version?: string
      push?: (...args: any[]) => void
    }
    _fbq?: any
    _fbqLoaded?: boolean
  }
}

function loadMetaPixelScript() {
  if (window.fbq) return

  ;(function (f: Window, b: Document, e: string, v: string, n?: any, t?: HTMLScriptElement, s?: HTMLScriptElement) {
    if (f.fbq) return
    n = f.fbq = function (...args: any[]) {
      n.callMethod ? n.callMethod(...args) : n.queue.push(args)
    }
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = true
    n.version = '2.0'
    n.queue = []
    t = b.createElement(e) as HTMLScriptElement
    t.async = true
    t.src = v
    s = b.getElementsByTagName(e)[0] as HTMLScriptElement
    s.parentNode?.insertBefore(t, s)
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
}

export function initMetaPixel() {
  if (!META_PIXEL_ID || window._fbqLoaded) return
  loadMetaPixelScript()
  window.fbq?.('init', META_PIXEL_ID)
  window._fbqLoaded = true
}

export function trackMetaPixelPageView() {
  if (!META_PIXEL_ID) return
  window.fbq?.('track', 'PageView')
}
