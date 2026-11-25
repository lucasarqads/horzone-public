import { useEffect, useState } from 'react'

/**
 * Largura e altura útil da janela.
 * A altura é medida em `svh` (viewport pequeno): não muda quando a barra do navegador do celular
 * aparece/some, então os componentes não "pulam" durante a rolagem.
 */
function medirSvh() {
  const d = document.createElement('div')
  d.style.cssText = 'position:fixed;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none'
  document.body.appendChild(d)
  const h = d.offsetHeight
  d.remove()
  return h || window.innerHeight
}

/** largura sem a barra de rolagem (igual à das seções) */
const largura = () => document.documentElement.clientWidth || window.innerWidth

export function useViewport() {
  const [v, setV] = useState(() => ({ vw: largura(), vh: medirSvh() }))
  useEffect(() => {
    const on = () => {
      const n = { vw: largura(), vh: medirSvh() }
      setV((a) => (a.vw === n.vw && a.vh === n.vh ? a : n))
    }
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return v
}
