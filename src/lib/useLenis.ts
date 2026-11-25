import { useEffect } from 'react'
import Lenis from 'lenis'

let instancia: Lenis | null = null

/** Trava/destrava a rolagem da página (ex.: modal aberto). */
export function travarRolagem(travar: boolean) {
  if (instancia) {
    if (travar) instancia.stop()
    else instancia.start()
  }
  document.documentElement.style.overflow = travar ? 'hidden' : ''
}

/** Rolagem suave global; respeita prefers-reduced-motion. Links de âncora (#id) passam pelo Lenis. */
export function useLenis() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.09, anchors: { offset: 0 } })
    instancia = lenis
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      instancia = null
    }
  }, [])
}
