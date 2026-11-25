import { useEffect, useRef } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import video from '../../assets/repertorio-bg-pelicula.mp4'
import parado from '../../assets/repertorio-bg-pelicula.webp'

/**
 * Fundo em vídeo do Repertório (original: referencias/video/backgroundpelicula.mp4).
 * Só começa a carregar quando a seção se aproxima e pausa fora da tela; movimento reduzido = imagem parada.
 */
export function FundoRepertorio() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const perto = useInView(ref, { once: true, margin: '300px 0px' })
  const visivel = useInView(ref)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    if (visivel) el.play().catch(() => {})
    else el.pause()
  }, [visivel, perto, reduce])

  return (
    <div ref={ref} className="size-full bg-black">
      {perto &&
        (reduce ? (
          <img src={parado} alt="" className="size-full object-cover" />
        ) : (
          <video
            ref={videoRef}
            src={video}
            poster={parado}
            muted
            loop
            playsInline
            preload="auto"
            tabIndex={-1}
            className="size-full object-cover"
          />
        ))}
    </div>
  )
}
