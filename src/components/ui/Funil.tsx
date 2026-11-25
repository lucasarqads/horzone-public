import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import type { Etapa } from '../../data/projetos'
import logo from '../../assets/logo-horzone.svg'
import { useViewport } from '../../lib/useViewport'

/**
 * Funil AIDA.
 * Entrada: os 4 módulos chegam espalhados (alternando esquerda/direita, girados) e se ENCAIXAM
 * um a um no lugar conforme o scroll, com um leve "tranco" de encaixe.
 * Montado: leads (pontos) descem pelo funil até a conversão; a etapa em destaque acompanha o scroll.
 * Clique numa etapa: abre um cartão SOBREPOSTO à seção explicando como ela funciona
 * (ao lado do módulo em telas largas; sobre o funil em telas menores).
 */

// larguras das bordas (topo do 1º módulo → base do último), em fração da largura do funil
const BORDAS = [1, 0.79, 0.59, 0.41, 0.25]
const CORES = ['#262a34', '#3a3f4c', '#3d7bff', '#0450e6']
const ATRASO = 0.14 // diferença de chegada entre módulos
const DURACAO = 0.5
const PROPORCAO_LOGO = 420 / 530 // largura/altura do logo-horzone.svg
const GAP_CARTAO = 36 // distância entre o funil e o cartão (telas largas)

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/** caminho SVG de um polígono com os cantos arredondados (raio r), para usar em clip-path: path() */
function poligonoArredondado(pontos: [number, number][], r: number) {
  const n = pontos.length
  let d = ''
  for (let i = 0; i < n; i++) {
    const [px, py] = pontos[(i - 1 + n) % n]
    const [cx, cy] = pontos[i]
    const [nx, ny] = pontos[(i + 1) % n]
    const dist1 = Math.hypot(cx - px, cy - py)
    const dist2 = Math.hypot(nx - cx, ny - cy)
    const r1 = Math.min(r, dist1 / 2)
    const r2 = Math.min(r, dist2 / 2)
    // ponto antes e depois do canto, sobre as arestas
    const ax = cx + ((px - cx) / dist1) * r1
    const ay = cy + ((py - cy) / dist1) * r1
    const bx = cx + ((nx - cx) / dist2) * r2
    const by = cy + ((ny - cy) / dist2) * r2
    d += `${i === 0 ? 'M' : 'L'} ${ax.toFixed(2)} ${ay.toFixed(2)} Q ${cx} ${cy} ${bx.toFixed(2)} ${by.toFixed(2)} `
  }
  return d + 'Z'
}

/** easeOutBack: passa um pouco do ponto e volta — sensação de encaixe */
const encaixe = (x: number) => {
  const c1 = 1.5
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}
const ease = [0.2, 0.7, 0.2, 1] as const

export function Funil({ etapas, rotulo }: { etapas: Etapa[]; rotulo: string }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const funilRef = useRef<HTMLDivElement>(null)
  const palcoRef = useRef<HTMLDivElement>(null)
  const artigoRef = useRef<HTMLElement | null>(null)
  // posição do palco do funil na PÁGINA (para a logo poder partir do topo da TELA)
  const [palcoNaPagina, setPalcoNaPagina] = useState(0)
  useLayoutEffect(() => {
    const medir = () => {
      const palco = palcoRef.current
      const artigo = ref.current?.closest('article') as HTMLElement | null
      if (!palco || !artigo) return
      artigoRef.current = artigo
      setPalcoNaPagina(palco.getBoundingClientRect().top + window.scrollY)
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(document.body)
    return () => ro.disconnect()
  }, [])
  const cartaoRef = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.2 })
  const [larguraArea, setLarguraArea] = useState(320)

  useLayoutEffect(() => {
    const el = funilRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setLarguraArea(el.clientWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { vh } = useViewport()
  const wc = Math.min(560, larguraArea)
  const compacto = wc < 440
  // módulos mais baixos em telas baixas (notebook 1366×768, iPad deitado)
  const h = compacto ? 68 : vh < 680 ? 68 : vh < 800 ? 78 : 92
  const gap = compacto ? 6 : 8
  const alturaTotal = etapas.length * h + (etapas.length - 1) * gap

  // FASE 1 — encaixe dos módulos
  const { scrollYProgress: entrada } = useScroll({ target: ref, offset: ['start end', 'start 0.25'] })
  const montagem = useTransform(entrada, (v) => (reduce ? 1 : v))
  const [montado, setMontado] = useState(false)
  useMotionValueEvent(montagem, 'change', (v) => setMontado(v >= 0.999))

  // FASE 2 — etapa em destaque acompanha o scroll
  const [destaque, setDestaque] = useState(0)
  const { scrollYProgress: passo } = useScroll({ target: ref, offset: ['start 0.25', 'end 0.6'] })
  useMotionValueEvent(passo, 'change', (v) =>
    setDestaque(Math.min(etapas.length - 1, Math.floor(clamp01(v) * etapas.length))),
  )

  // LOGO que atravessa o funil: cai do TOPO DA TELA quando o bloco aparece, passa POR DENTRO do funil
  // (atrás dos módulos — aparece nas frestas) e pousa embaixo, flutuando.
  // ≈0.23 da largura do funil (entre 72 e 130px de altura)
  const logoH = Math.round(Math.min(!compacto && vh < 800 ? 96 : 130, Math.max(72, wc * 0.23)))
  const logoW = Math.round(logoH * PROPORCAO_LOGO)
  const yPouso = alturaTotal + 48 // folga entre a base do funil e a logo pousada
  const alturaPalco = yPouso + logoH + 28 // espaço do pouso (a logo flutua solta, sem disco)
  // progresso próprio da logo: começa quando o bloco entra pela base da tela e termina com o pouso visível
  const { scrollYProgress: pLogo } = useScroll({ target: artigoRef, offset: ['start 0.9', 'end 0.85'] })
  const { scrollY } = useScroll()
  const tLogo = useTransform(pLogo, (v) => (reduce ? 1 : clamp01(v)))
  const flutua = useMotionValue(0)
  useAnimationFrame((ms) => {
    // só flutua depois de pousar
    const pousado = clamp01((tLogo.get() - 0.92) / 0.08)
    flutua.set(reduce ? 0 : Math.sin((ms / 1000) * ((2 * Math.PI) / 3)) * 5 * pousado)
  })
  const logoY = useTransform(() => {
    const t = tLogo.get()
    const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    // início: logo acima do topo da tela (convertido para a posição dentro do palco, que rola)
    const topoDoPalcoNaTela = palcoNaPagina - scrollY.get()
    const inicio = -logoH - 24 - topoDoPalcoNaTela
    return inicio * (1 - e) + yPouso * e + flutua.get()
  })
  const logoRot = useTransform(tLogo, (t) => Math.sin(t * Math.PI) * 10)
  // aparece assim que começa a cair (lê motion values, não estado do React)
  const logoOpacity = useTransform(() =>
    reduce ? 1 : clamp01(tLogo.get() / 0.05),
  )

  // cartão da etapa clicada
  const [aberta, setAberta] = useState<number | null>(null)
  const alternar = (i: number) => setAberta((a) => (a === i ? null : i))

  useEffect(() => {
    if (aberta === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAberta(null)
    }
    const onFora = (e: PointerEvent) => {
      const alvo = e.target as HTMLElement
      if (cartaoRef.current?.contains(alvo) || alvo.closest('[data-modulo]')) return
      setAberta(null)
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onFora)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onFora)
    }
  }, [aberta])

  // posição do cartão: ao lado do funil se couber; senão, sobre o funil, logo abaixo do módulo clicado
  const cartaoW = Math.min(360, larguraArea - 16)
  const lateral = larguraArea >= wc + 2 * (cartaoW + GAP_CARTAO)
  const posCartao = (i: number) => {
    const topo = i * (h + gap)
    if (lateral) {
      const larguraMeio = ((BORDAS[i] + BORDAS[i + 1]) / 2) * wc
      const bordaDireita = wc / 2 + larguraMeio / 2
      return { left: wc + GAP_CARTAO, top: topo - 8, linhaX: bordaDireita as number | null, linhaY: topo + h / 2 }
    }
    return { left: (wc - cartaoW) / 2, top: topo + h + 10, linhaX: null as number | null, linhaY: 0 }
  }

  const ativa = aberta ?? destaque
  const etapaAberta = aberta === null ? null : etapas[aberta]
  const pos = aberta === null ? null : posCartao(aberta)

  return (
    <div ref={ref} role="region" aria-label={`${rotulo} — funil AIDA`} className="mt-8 sm:mt-12 baixa:mt-6">
      <div ref={funilRef} className="relative flex w-full min-w-0 flex-col items-center">
        <div ref={palcoRef} className="relative" style={{ width: wc, height: alturaPalco }}>
          {/* logo atravessando o funil (z-0: fica atrás dos módulos) */}
          <motion.img
            src={logo}
            alt=""
            aria-hidden
            draggable={false}
            className="pointer-events-none absolute left-1/2 z-0 select-none"
            style={{ top: 0, width: logoW, height: logoH, marginLeft: -logoW / 2, y: logoY, rotate: logoRot, opacity: logoOpacity }}
          />


          {etapas.map((e, i) => (
            <Modulo
              key={i}
              i={i}
              etapa={e}
              wc={wc}
              h={h}
              top={i * (h + gap)}
              montagem={montagem}
              ativo={i === ativa}
              aberto={i === aberta}
              compacto={compacto}
              onClick={() => alternar(i)}
            />
          ))}

          {/* leads descendo pelo funil */}
          {montado && inView && !reduce && <Leads wc={wc} altura={alturaTotal} />}

          {/* cartão sobreposto explicando a etapa */}
          <AnimatePresence>
            {etapaAberta && pos && aberta !== null && (
              <motion.div
                key={aberta}
                className="absolute z-30"
                style={{ left: pos.left, top: pos.top, width: cartaoW }}
                initial={{ opacity: 0, x: lateral ? -16 : 0, y: lateral ? 0 : -10, scale: 0.96, filter: 'blur(6px)' }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.97, filter: 'blur(4px)' }}
                transition={{ duration: 0.35, ease }}
              >
                {/* ligação tracejada com o módulo (telas largas) */}
                {pos.linhaX !== null && (
                  <span
                    aria-hidden
                    className="absolute border-t border-dashed border-white/50"
                    style={{ left: pos.linhaX - pos.left, width: pos.left - pos.linhaX, top: pos.linhaY - pos.top }}
                  />
                )}
                <div
                  ref={cartaoRef}
                  role="dialog"
                  aria-label={`Etapa ${etapaAberta.nome}: como funciona`}
                  className="relative rounded-2xl border border-white/15 bg-[#0b0d12]/80 p-5 text-[#f3f0ea] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] backdrop-blur-md sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-white/70 uppercase sm:text-[11px]">
                      [ etapa {String(aberta + 1).padStart(2, '0')} / {String(etapas.length).padStart(2, '0')} — como
                      funciona ]
                    </span>
                    <button
                      type="button"
                      onClick={() => setAberta(null)}
                      aria-label="Fechar"
                      className="-mt-2 -mr-2 grid size-11 shrink-0 place-items-center rounded-full font-mono text-[13px] transition-colors duration-300 hover:bg-white/10"
                    >
                      ✕
                    </button>
                  </div>
                  <h4 className="mt-1 flex items-baseline gap-3 font-display leading-[0.9] uppercase">
                    <span className="text-[56px] text-[#a9c8ff]">{etapaAberta.letra}</span>
                    <span className="text-[32px]">{etapaAberta.nome}</span>
                  </h4>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/80">{etapaAberta.descricao}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function Modulo({
  i,
  etapa,
  wc,
  h,
  top,
  montagem,
  ativo,
  aberto,
  compacto,
  onClick,
}: {
  i: number
  etapa: Etapa
  wc: number
  h: number
  top: number
  montagem: MotionValue<number>
  ativo: boolean
  aberto: boolean
  compacto: boolean
  onClick: () => void
}) {
  const topoW = BORDAS[i] * wc
  const baseW = BORDAS[i + 1] * wc
  const recuoPx = (topoW - baseW) / 2
  // trapézio com as pontas arredondadas
  const recorte = `path("${poligonoArredondado(
    [
      [0, 0],
      [topoW, 0],
      [topoW - recuoPx, h],
      [recuoPx, h],
    ],
    Math.min(14, h * 0.18),
  )}")`
  const lado = i % 2 === 0 ? -1 : 1 // alterna: vem da esquerda / da direita

  const p = useTransform(montagem, (t) => clamp01((t - i * ATRASO) / DURACAO))
  const e = useTransform(p, encaixe)
  const x = useTransform(e, (v) => (1 - v) * lado * wc * 0.75)
  const y = useTransform(e, (v) => (1 - v) * -260)
  const rotate = useTransform(e, (v) => (1 - v) * lado * 16)
  const opacity = useTransform(p, [0, 0.25], [0, 1])

  return (
    <motion.div
      className="absolute left-1/2"
      style={{
        top,
        width: topoW,
        height: h,
        marginLeft: -topoW / 2,
        x,
        y,
        rotate,
        opacity,
        zIndex: ativo ? 2 : 1,
        filter: ativo ? 'drop-shadow(0 0 22px rgba(4,80,230,0.55))' : 'none',
      }}
    >
      <motion.button
        type="button"
        data-modulo
        onClick={onClick}
        aria-expanded={aberto}
        aria-label={`Etapa ${etapa.nome}: ver como funciona`}
        animate={{ scale: ativo ? 1.04 : 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className={`relative flex size-full cursor-pointer items-center justify-center text-[#f3f0ea] ${compacto ? 'flex-col gap-1' : 'gap-4'}`}
        style={{
          background: CORES[i],
          clipPath: recorte,
          WebkitClipPath: recorte,
        }}
      >
        <span className={`font-display leading-none uppercase ${compacto ? 'text-[28px]' : 'text-[40px]'}`}>
          {etapa.letra}
        </span>
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase sm:text-[11px]">{etapa.nome}</span>
        {/* escurece as etapas não ativas */}
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 bg-black transition-opacity duration-300 ${ativo ? 'opacity-0' : 'opacity-30'}`}
        />
      </motion.button>
    </motion.div>
  )
}

/** Pontos (leads) entrando pelo topo e afunilando até a saída. */
function Leads({ wc, altura }: { wc: number; altura: number }) {
  const n = 9
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
      {Array.from({ length: n }, (_, i) => {
        const inicioX = ((i / (n - 1)) * 2 - 1) * wc * 0.4
        return (
          <motion.span
            key={i}
            className="absolute top-0 left-1/2 -ml-1 size-2 rounded-full bg-white"
            initial={{ x: inicioX, y: -28, opacity: 0 }}
            animate={{
              x: [inicioX, inicioX * 0.5, inicioX * 0.08],
              y: [-28, altura * 0.5, altura + 14],
              opacity: [0, 0.9, 0],
              scale: [1, 0.85, 0.6],
            }}
            transition={{ duration: 2.6, delay: (i * 2.6) / n, repeat: Infinity, ease: 'easeIn' }}
          />
        )
      })}
    </div>
  )
}

