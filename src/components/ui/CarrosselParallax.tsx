import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import type { Projeto } from '../../data/projetos'
import { useViewport } from '../../lib/useViewport'
import { AnuncioModal } from './AnuncioModal'

/**
 * Carrossel infinito com autoplay (referência: referencias/video/carrossel.mp4).
 * Tudo depende de UMA posição contínua (`pos`), que segue o dedo/mouse e encaixa com mola:
 * - card do centro: altura normal · vizinhos: um pouco mais altos (todos coloridos);
 * - a imagem desliza dentro da moldura no sentido contrário ao card (parallax) e o título acompanha a base.
 * Desktop: 3 cards à vista · celular: 1 card, com as pontas dos vizinhos nas laterais.
 * Clique no card: painel com o que é o projeto e o botão "Visualizar". Card lateral: vem para o centro já
 * com o painel aberto. Fecha com ✕, Esc, clique fora ou ao trocar.
 * `anuncios`: cards de vídeo (só o do centro toca); o clique abre a janela com o vídeo e o Instagram do cliente.
 */

const GAP = 24 // espaço entre cards (px)
const AUTOPLAY_S = 3.5
const PROPORCAO = 1.25 // altura/largura da imagem no centro (4:5)
const CRESCE = 0.1 // quanto a altura do card cresce ao virar vizinho
const ZOOM = 0.45 // zoom da imagem no vizinho: cria a sobra para ela deslizar
const DESLIZA = 0.2 // quanto a imagem desliza (fração da largura); precisa ser menor que ZOOM / 2
const RODAPE_CARD = 76 // título + tipo abaixo da imagem (px, aproximado)
const mola = { type: 'spring', stiffness: 170, damping: 26, mass: 0.9 } as const
const mod = (a: number, n: number) => ((a % n) + n) % n
const isVideoMedia = (media: string) => /\.mp4(?:$|\?)/i.test(media)
const limita = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export function CarrosselParallax({
  projetos,
  rotulo,
  anuncios = false,
}: {
  projetos: Projeto[]
  rotulo: string
  anuncios?: boolean
}) {
  const reduce = useReducedMotion()
  const area = useRef<HTMLDivElement>(null)
  const inView = useInView(area, { amount: 0.3 })
  const [larguraArea, setLarguraArea] = useState(1000)
  // card do centro, em numeração sem fim: o projeto do card v é projetos[mod(v, n)]
  const [passo, setPasso] = useState(0)
  const pos = useMotionValue(0)
  const [pausado, setPausado] = useState(false)
  const [arrastando, setArrastando] = useState(false)
  // card com o painel de descrição aberto — pausa o autoplay
  const [detalhe, setDetalhe] = useState<number | null>(null)
  // anúncio aberto na janela — também pausa o autoplay
  const [janela, setJanela] = useState<Projeto | null>(null)
  const fecharJanela = useCallback(() => setJanela(null), [])
  const n = projetos.length

  const { vh } = useViewport()
  const celular = larguraArea < 640
  // a altura da tela também limita: título do bloco + cards + legenda + setas cabem juntos na tela
  const porAltura = Math.max(200, (vh - 290) / (PROPORCAO * (1 + CRESCE)))
  const cardW = Math.floor(
    celular ? larguraArea * 0.76 : Math.min(420, porAltura, (larguraArea - GAP * 2) / 3),
  )
  // celular: card com 76% da tela — as pontas dos vizinhos aparecem nas laterais
  const distCards = cardW + (celular ? 16 : GAP)
  const alturaImg = Math.round(cardW * PROPORCAO)
  const folga = Math.round((alturaImg * CRESCE) / 2)

  useLayoutEffect(() => {
    const el = area.current
    if (!el) return
    const ro = new ResizeObserver(() => setLarguraArea(el.clientWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // encaixe no card do centro
  useEffect(() => {
    if (arrastando) return
    const c = animate(pos, passo, reduce ? { duration: 0 } : mola)
    return () => c.stop()
  }, [passo, arrastando, reduce, pos])

  const ir = useCallback((dir: number) => {
    setDetalhe(null)
    setPasso((p) => p + dir)
  }, [])

  // autoplay
  useEffect(() => {
    if (reduce || pausado || arrastando || !inView || detalhe !== null || janela || n < 2) return
    const t = window.setTimeout(() => ir(1), AUTOPLAY_S * 1000)
    return () => window.clearTimeout(t)
  }, [passo, reduce, pausado, arrastando, inView, detalhe, janela, n, ir])

  // painel aberto: fecha com Esc ou clique fora do card
  useEffect(() => {
    if (detalhe === null) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDetalhe(null)
    const onFora = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest('[data-card-projeto]')) setDetalhe(null)
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onFora)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onFora)
    }
  }, [detalhe])

  // arrasto horizontal; o clique que vem logo depois dele não abre o painel
  const arrastou = useRef(false)
  const inicioArrasto = useRef<number | null>(null)

  const alternar = (v: number) => {
    if (arrastou.current) return
    if (anuncios) {
      setPasso(v)
      setJanela(projetos[mod(v, n)])
      return
    }
    if (v !== passo) {
      setPasso(v)
      setDetalhe(v)
      return
    }
    setDetalhe((d) => (d === v ? null : v))
  }

  const cards: number[] = []
  for (let v = passo - 3; v <= passo + 3; v++) cards.push(v)

  return (
    <>
    <div
      ref={area}
      role="region"
      aria-roledescription="carrossel"
      aria-label={rotulo}
      className="-mx-6 mt-8 sm:mx-0 sm:mt-12 baixa:mt-6"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setPausado(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setPausado(false)}
      onFocus={(e) => (e.target as HTMLElement).matches(':focus-visible') && setPausado(true)}
      onBlur={() => setPausado(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') ir(1)
        if (e.key === 'ArrowLeft') ir(-1)
      }}
    >
      <motion.div
        className="relative cursor-grab touch-pan-y select-none active:cursor-grabbing"
        style={{ height: alturaImg + folga * 2 + RODAPE_CARD, overflowX: 'clip' }}
        onPointerDown={() => (arrastou.current = false)}
        onPanStart={(_, info) => {
          arrastou.current = true
          if (n < 2 || Math.abs(info.offset.x) <= Math.abs(info.offset.y)) return
          inicioArrasto.current = pos.get()
          setDetalhe(null)
          setArrastando(true)
        }}
        onPan={(_, info) => {
          if (inicioArrasto.current === null) return
          pos.set(limita(inicioArrasto.current - info.offset.x / distCards, passo - 1.2, passo + 1.2))
        }}
        onPanEnd={(_, info) => {
          if (inicioArrasto.current === null) return
          inicioArrasto.current = null
          const andou = Math.abs(info.offset.x) > distCards * 0.18 || Math.abs(info.velocity.x) > 350
          if (andou) setPasso((p) => p + (info.offset.x < 0 ? 1 : -1))
          setArrastando(false)
        }}
      >
        {cards.map((v) => (
          <Card
            key={v}
            v={v}
            pos={pos}
            projeto={projetos[mod(v, n)]}
            esquerda={(larguraArea - cardW) / 2}
            largura={cardW}
            altura={alturaImg}
            topo={folga}
            distCards={distCards}
            parallax={!reduce}
            focavel={Math.abs(v - passo) <= 1}
            anuncio={anuncios}
            tocando={v === passo && inView && !janela}
            aberto={detalhe === v}
            onAlternar={() => alternar(v)}
            onFechar={() => setDetalhe(null)}
          />
        ))}
      </motion.div>

      {/* controles */}
      {n > 1 && (
        <div className="mt-4 baixa:mt-2 flex items-center justify-center gap-5">
          <BotaoSeta direcao="anterior" onClick={() => ir(-1)} />
          <div className="flex items-center gap-2" aria-hidden>
            {projetos.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === mod(passo, n) ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
          <BotaoSeta direcao="próximo" onClick={() => ir(1)} />
        </div>
      )}
    </div>

    {/* fora da região: o teclado na janela não mexe no carrossel */}
    {anuncios && <AnuncioModal projeto={janela} onClose={fecharJanela} />}
    </>
  )
}

function Card({
  v,
  pos,
  projeto: p,
  esquerda,
  largura,
  altura,
  topo,
  distCards,
  parallax,
  focavel,
  anuncio,
  tocando,
  aberto,
  onAlternar,
  onFechar,
}: {
  v: number
  pos: MotionValue<number>
  projeto: Projeto
  esquerda: number
  largura: number
  altura: number
  topo: number
  distCards: number
  parallax: boolean
  focavel: boolean
  anuncio: boolean
  tocando: boolean
  aberto: boolean
  onAlternar: () => void
  onFechar: () => void
}) {
  // anúncios: nome do cliente e o que ele faz · projetos: título e tipo
  const titulo = anuncio ? p.cliente : p.titulo
  const legenda = anuncio ? p.atuacao : p.tipo

  const video = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const el = video.current
    if (!el) return
    if (tocando) el.play().catch(() => {})
    else el.pause()
  }, [tocando])

  // v - q = distância até o centro, em cards (-1 = vizinho da esquerda)
  const x = useTransform(pos, (q) => (v - q) * distCards)
  const alturaCard = useTransform(pos, (q) => altura * (1 + CRESCE * Math.min(1, Math.abs(v - q))))
  const y = useTransform(pos, (q) => -(altura * CRESCE * Math.min(1, Math.abs(v - q))) / 2)
  // só 3 cards à mostra: além do vizinho imediato, o card some aos poucos
  const opacity = useTransform(pos, (q) => limita((1.5 - Math.abs(v - q)) / 0.45, 0, 1))
  const visibility = useTransform(opacity, (o) => (o === 0 ? 'hidden' : 'visible'))
  const transform = useTransform(pos, (q) => {
    const d = limita(v - q, -1, 1)
    return `translateX(${parallax ? -d * DESLIZA * largura : 0}px) scale(${1 + ZOOM * Math.abs(d)})`
  })

  return (
    <motion.div
      data-card-projeto
      role="button"
      tabIndex={focavel ? 0 : -1}
      aria-hidden={!focavel}
      aria-expanded={anuncio ? undefined : aberto}
      aria-haspopup={anuncio ? 'dialog' : undefined}
      aria-label={`${titulo}${legenda ? ` — ${legenda}` : ''}: ${anuncio ? 'ver vídeo' : 'ver descrição'}`}
      onClick={onAlternar}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onAlternar()
        }
      }}
      onDragStartCapture={(e) => e.preventDefault()}
      className="absolute flex cursor-pointer flex-col gap-4 rounded-[22px] outline-offset-4"
      style={{ left: esquerda, top: topo, width: largura, x, y, opacity, visibility }}
    >
      <motion.div
        className="relative overflow-hidden rounded-[22px] bg-[#0b0d12] shadow-[0_24px_48px_-24px_rgba(0,0,0,0.7)]"
        style={{ height: alturaCard }}
      >
        {/* no centro a imagem preenche a moldura; no vizinho ela amplia e desliza no sentido contrário */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-x-0 top-1/2"
            style={{ height: altura, marginTop: -altura / 2, transform }}
          >
            {p.media && isVideoMedia(p.media) ? (
              <video
                ref={video}
                src={`${p.media}#t=0.1`}
                muted
                loop
                playsInline
                preload="metadata"
                className="pointer-events-none size-full object-cover object-center"
              />
            ) : p.media ? (
              <img
                src={p.media}
                alt=""
                draggable={false}
                decoding="async"
                className="pointer-events-none size-full object-cover object-center"
              />
            ) : (
              <div className="size-full bg-gradient-to-br from-[#16181f] to-[#0b2a6b]" />
            )}
          </motion.div>
        </div>

        {/* painel de descrição: surge sobre a imagem */}
        <AnimatePresence>
          {aberto && (
            <motion.div
              className="absolute inset-0 flex flex-col justify-end gap-3 bg-[#0b0d12]/80 p-5 text-left text-[#f3f0ea] backdrop-blur-md sm:p-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={onFechar}
                aria-label="Fechar descrição"
                className="absolute top-3 right-3 grid size-10 place-items-center rounded-full border border-white/25 font-mono text-[13px] transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink"
              >
                ✕
              </button>
              {p.tipo && <span className="font-mono text-[10px] tracking-[0.18em] text-[#a9c8ff] uppercase">{p.tipo}</span>}
              <span className="font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-none uppercase">{p.titulo}</span>
              <p className="max-h-[45%] overflow-y-auto pr-1 text-[14px] leading-relaxed text-white/85">
                {p.descricao ?? '[DESCRIÇÃO DO PROJETO — o que é e o que resolve, em 2 a 3 frases.]'}
              </p>
              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-white px-5 font-mono text-[12px] tracking-[0.14em] text-[#264b76] uppercase transition-colors duration-300 hover:bg-brand hover:text-white"
                >
                  Visualizar <span aria-hidden>↗</span>
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* título + o que é, abaixo do card */}
      <div className="flex flex-col items-center gap-1.5 px-2 text-center">
        <span className="font-display text-[clamp(1.25rem,2.2vw,1.75rem)] leading-none uppercase">{titulo}</span>
        {legenda && <span className="font-mono text-[11px] tracking-[0.16em] text-white/75 uppercase">{legenda}</span>}
      </div>
    </motion.div>
  )
}

function BotaoSeta({ direcao, onClick }: { direcao: 'anterior' | 'próximo'; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Projeto ${direcao}`}
      className="grid size-11 place-items-center rounded-full border border-white/30 text-[16px] transition-colors duration-300 hover:border-white hover:bg-white hover:text-[#264b76]"
    >
      <span aria-hidden>{direcao === 'anterior' ? '←' : '→'}</span>
    </button>
  )
}
