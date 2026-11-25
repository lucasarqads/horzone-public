import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { CONTEUDO, FRAME, LETTERS, LOGO, PERSONA } from '../../data/horzone'

/**
 * Hero + encaixe no Sobre:
 *  1. na Hero, só as letras de HORZONE caem e formam a palavra;
 *  2. ao rolar, o palco fica fixo e a seção Sobre sobe por cima dele, já trazendo a persona no lugar dela;
 *  3. a palavra desce e encolhe junto com a rolagem e para ATRÁS da persona, na janela do Sobre.
 */

type Geo = {
  k: number // escala px-do-quadro → px-da-tela
  frameLeft: number
  frameTop: number
  // estado "palavra recém-formada", relativo à posição final do logo
  dx: number
  dy: number
  s: number
}

function computeGeo(vw: number, vh: number): Geo {
  const pad = vw >= 1024 ? 48 : vw >= 640 ? 32 : 24
  const reserveTop = vw >= 640 ? 64 : 56
  const logoFrac = LOGO.w / FRAME.w

  // quadro final: o logo cabe na largura (com margem) e o quadro cabe na altura
  const F = Math.min((vw - 2 * pad) / logoFrac, ((vh - reserveTop) * FRAME.w) / FRAME.h)
  const k = F / FRAME.w
  const FH = FRAME.h * k
  const frameLeft = (vw - F) / 2
  const free = vh - FH
  // telas largas: quadro apoiado no rodapé (a cadeira "sai" da tela); telas altas: centralizado
  const frameTop = free < vh * 0.25 ? free : free * 0.5

  const finalLeft = frameLeft + LOGO.x * k
  const finalTop = frameTop + LOGO.y * k
  const finalW = LOGO.w * k

  // onde a palavra se forma: centralizada, cabendo na largura e na altura livre abaixo do menu
  const topoLivre = vw >= 640 ? 96 : 80
  const baseLivre = vh < 720 ? 96 : 120
  const alturaLivre = Math.max(120, vh - topoLivre - baseLivre)
  const heroW = Math.min(vw - 2 * pad, 1280, (alturaLivre * LOGO.w) / LOGO.h)
  const heroH = (heroW * LOGO.h) / LOGO.w
  const heroLeft = (vw - heroW) / 2
  const heroTop = topoLivre + (alturaLivre - heroH) / 2

  return { k, frameLeft, frameTop, dx: heroLeft - finalLeft, dy: heroTop - finalTop, s: heroW / finalW }
}

// linha do tempo (segundos)
const QUEDA_INICIO = 0.25
const QUEDA_PASSO = 0.13
const COBRE_INICIO = 15 / 115 // o Sobre só entra na tela após 15svh de rolagem

export function HeroSobre() {
  const reduce = useReducedMotion()
  const outerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  const [geo, setGeo] = useState(() => computeGeo(window.innerWidth, window.innerHeight))
  const geoRef = useRef(geo)

  // progresso da palavra, ligado à rolagem (0 = centralizada na Hero · 1 = no lugar dela na foto)
  const montagem = useMotionValue(0)

  const logoX = useMotionValue(geo.dx * (1 - montagem.get()))
  const logoY = useMotionValue(geo.dy * (1 - montagem.get()))
  const logoScale = useMotionValue(geo.s + (1 - geo.s) * montagem.get())

  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return
    const apply = () => {
      const g = geoRef.current
      const t = montagem.get()
      logoX.set(g.dx * (1 - t))
      logoY.set(g.dy * (1 - t))
      logoScale.set(g.s + (1 - g.s) * t)
    }
    const update = () => {
      geoRef.current = computeGeo(el.clientWidth, el.clientHeight)
      setGeo(geoRef.current)
      apply()
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    const off = montagem.on('change', apply)
    return () => {
      ro.disconnect()
      off()
    }
  }, [montagem, logoX, logoY, logoScale])

  // cobertura: ao rolar, o palco fica fixo e o Sobre sobe por cima dele. A palavra vai até a janela do
  // Sobre (#sobre-janela); a persona acompanha essa janela o tempo todo.
  const { scrollYProgress: cobre } = useScroll({ target: outerRef, offset: ['start start', 'end end'] })
  const { scrollY } = useScroll()

  const compX = useMotionValue(0)
  const compY = useMotionValue(0)
  const compScale = useMotionValue(1)
  const persX = useMotionValue(0)
  const persY = useMotionValue(0)
  const persScale = useMotionValue(1)
  const personaOpacity = useTransform(montagem, [0.3, 0.7], reduce ? [1, 1] : [0, 1])
  const personaY = useTransform(montagem, [0.3, 0.9], reduce ? ['0%', '0%'] : ['14%', '0%'])
  const encaixar = useCallback(() => {
    const janela = document.getElementById('sobre-janela')
    const palco = stageRef.current
    if (!janela || !palco) return
    const g = geoRef.current
    const rj = janela.getBoundingClientRect()
    const rp = palco.getBoundingClientRect()
    // parte visível da foto (topo da cabeça → base, letra H → letra E) encaixada na janela,
    // centralizada e encostada no topo dela (logo abaixo do texto)
    const cw = CONTEUDO.w * g.k
    const ch = CONTEUDO.h * g.k
    const sc = Math.min(rj.width / cw, rj.height / ch)
    const alvoX = rj.left - rp.left + (rj.width - cw * sc) / 2 - CONTEUDO.x * g.k * sc
    const alvoY = rj.top - rp.top - CONTEUDO.y * g.k * sc
    // curva suave (seno): sem arrancos, acompanha o scroll do começo ao fim
    const c = Math.min(1, Math.max(0, (cobre.get() - COBRE_INICIO) / (1 - COBRE_INICIO)))
    const e = 0.5 - Math.cos(Math.PI * c) / 2
    compX.set((alvoX - g.frameLeft) * e)
    compY.set((alvoY - g.frameTop) * e)
    compScale.set(1 + (sc - 1) * e)
    montagem.set(e)
    persX.set(alvoX - g.frameLeft)
    persY.set(alvoY - g.frameTop)
    persScale.set(sc)
  }, [cobre, compX, compY, compScale, montagem, persX, persY, persScale])
  useMotionValueEvent(scrollY, 'change', encaixar)
  useEffect(() => {
    encaixar()
    window.addEventListener('resize', encaixar)
    return () => window.removeEventListener('resize', encaixar)
  }, [encaixar, geo])

  const { k, frameLeft, frameTop } = geo

  return (
    // 100svh de palco + 15svh de folga (a sombra do Sobre não aparece antes de rolar) + 100svh de cobertura
    <div ref={outerRef} id="top" className="relative h-[215svh] bg-wall">
      {/* palco transparente ACIMA do Sobre (z-20): a palavra nunca é coberta pela folha — desliza
          da Hero até o lugar dela no Sobre. Cliques passam para o que está embaixo. */}
      <div ref={stageRef} className="pointer-events-none sticky top-0 z-20 h-svh">
        <h1 className="sr-only">Horzone — marketing, tráfego pago e vídeo</h1>

        {/* quadro da palavra (5504×3072): ao rolar, desce até a janela do Sobre */}
        <motion.div
          className="absolute origin-top-left will-change-transform"
          style={{
            left: frameLeft,
            top: frameTop,
            width: FRAME.w * k,
            height: FRAME.h * k,
            x: compX,
            y: compY,
            scale: compScale,
          }}
        >
        {/* HORZONE — posicionado no destino final; o transform o leva até onde a palavra se forma */}
        <motion.div
          aria-hidden
          className="absolute origin-top-left will-change-transform"
          style={{
            left: LOGO.x * k,
            top: LOGO.y * k,
            width: LOGO.w * k,
            height: LOGO.h * k,
            x: logoX,
            y: logoY,
            scale: logoScale,
          }}
        >
          {LETTERS.map((l, i) => (
            <motion.img
              key={i}
              src={l.src}
              alt=""
              draggable={false}
              className="absolute top-0 h-full origin-bottom select-none"
              style={{ left: `${(l.x / LOGO.w) * 100}%`, width: `${(l.w / LOGO.w) * 100}%` }}
              initial={reduce ? { opacity: 0 } : { y: '-160svh', rotate: l.rot }}
              animate={reduce ? { opacity: 1 } : { y: 0, rotate: 0 }}
              transition={
                reduce
                  ? { duration: 0.6, delay: i * 0.05 }
                  : {
                      y: { type: 'spring', stiffness: 240, damping: 16, mass: 1.1, delay: QUEDA_INICIO + i * QUEDA_PASSO },
                      rotate: { type: 'spring', stiffness: 130, damping: 10, delay: QUEDA_INICIO + i * QUEDA_PASSO },
                    }
              }
            />
          ))}
        </motion.div>

        </motion.div>

        {/* Persona — mesmo quadro, por cima da palavra; presa à janela do Sobre, só aparece nessa seção */}
        <motion.div
          className="absolute origin-top-left will-change-transform"
          style={{
            left: frameLeft,
            top: frameTop,
            width: FRAME.w * k,
            height: FRAME.h * k,
            x: persX,
            y: persY,
            scale: persScale,
            opacity: personaOpacity,
          }}
        >
        <motion.img
          src={PERSONA.src}
          alt="Retrato do fundador da Horzone sentado em uma cadeira de diretor, segurando uma caneca azul"
          draggable={false}
          className="absolute origin-bottom select-none will-change-transform"
          style={{
            left: PERSONA.x * k,
            top: PERSONA.y * k,
            width: PERSONA.w * k,
            height: PERSONA.h * k,
            y: personaY,
            maskImage: 'linear-gradient(to bottom, #000 88%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, #000 88%, transparent)',
          }}
        />
        </motion.div>

      </div>
    </div>
  )
}
