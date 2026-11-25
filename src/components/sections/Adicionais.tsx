import { useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { ADICIONAIS, type Adicional } from '../../data/adicionais'
import { Reveal } from '../ui/Reveal'
import { useViewport } from '../../lib/useViewport'

/** Adicionais — cursos e e-books, com filtro. Fica depois de Serviços (Repertório). */

type Filtro = 'todos' | 'curso' | 'ebook'
const FILTROS: { id: Filtro; rotulo: string }[] = [
  { id: 'todos', rotulo: 'Todos' },
  { id: 'curso', rotulo: 'Cursos' },
  { id: 'ebook', rotulo: 'E-books' },
]
const ease = [0.2, 0.7, 0.2, 1] as const

export function Adicionais() {
  const reduce = useReducedMotion()
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const itens = ADICIONAIS.map((a, i) => ({ ...a, id: i })).filter((a) => filtro === 'todos' || a.tipo === filtro)
  const conta = (f: Filtro) => (f === 'todos' ? ADICIONAIS.length : ADICIONAIS.filter((a) => a.tipo === f).length)

  // celular: baralho de cartas empilhadas · tablet/desktop: grade
  const celular = useViewport().vw < 640

  return (
    <section
      id="adicionais"
      aria-labelledby="adicionais-titulo"
      className="relative bg-wall px-6 pt-24 pb-28 sm:px-8 sm:pt-32 sm:pb-36 lg:px-12 baixa:py-10"
    >
      <div className="mx-auto max-w-[1280px]">
        <header className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <Reveal>
            <h2
              id="adicionais-titulo"
              className="font-display text-[clamp(3rem,10vw,8.5rem)] baixa:text-[4rem] leading-[0.88] uppercase"
            >
              Adicionais<span className="text-brand">.</span>
            </h2>
            <p className="mt-5 baixa:mt-3 max-w-[48ch] text-[17px] baixa:text-[15px] leading-relaxed text-ink/75">
              Cursos e e-books para aplicar marketing, tráfego e vídeo no seu próprio ritmo.
            </p>
          </Reveal>

          {/* filtro */}
          <Reveal delay={0.09}>
            <div role="tablist" aria-label="Filtrar adicionais" className="flex flex-wrap gap-2">
              {FILTROS.map((f) => {
                const ativo = filtro === f.id
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="tab"
                    aria-selected={ativo}
                    onClick={() => setFiltro(f.id)}
                    className={`relative inline-flex min-h-11 items-center gap-2 rounded-full border px-4 font-mono text-[11px] tracking-[0.16em] uppercase transition-colors duration-300 ${
                      ativo ? 'border-ink text-paper' : 'border-ink/15 text-ink hover:border-ink/40'
                    }`}
                  >
                    {ativo && (
                      <motion.span
                        layoutId="filtro-adicionais"
                        className="absolute inset-0 -z-0 rounded-full bg-ink"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{f.rotulo}</span>
                    <span className={`relative ${ativo ? 'text-paper/60' : 'text-muted'}`}>{conta(f.id)}</span>
                  </button>
                )
              })}
            </div>
          </Reveal>
        </header>

        {celular ? (
          <Baralho key={filtro} itens={itens} />
        ) : (
        <ul
          aria-label="Cursos e e-books"
          className="mt-20 grid grid-cols-2 gap-5 lg:grid-cols-3 baixa:mt-6"
        >
          <AnimatePresence mode="popLayout">
            {itens.map((a, i) => (
              <motion.li
                key={a.id}
                layout
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
                transition={{ duration: 0.45, ease, delay: reduce ? 0 : i * 0.06 }}
              >
                <Cartao item={a} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        )}
      </div>
    </section>
  )
}

/**
 * Baralho (celular): cartas empilhadas, com as de trás aparecendo embaixo. Deslizar a carta de cima para
 * qualquer lado manda ela para o fundo da pilha; os pontos levam direto a uma carta.
 */
function Baralho({ itens }: { itens: (Adicional & { id: number })[] }) {
  const [topo, setTopo] = useState(0)
  const n = itens.length

  return (
    <>
      <ul aria-label="Cursos e e-books" className="mt-12 grid pb-8">
        {itens.map((a, i) => (
          <Carta key={a.id} item={a} ordem={(i - topo + n) % n} total={n} onEnviar={() => setTopo((t) => (t + 1) % n)} />
        ))}
      </ul>

      {n > 1 && (
        <div className="mt-2 flex justify-center gap-1">
          {itens.map((a, i) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setTopo(i)}
              aria-label={`Ir para o item ${i + 1}`}
              aria-current={i === topo}
              className="grid size-8 place-items-center"
            >
              <span
                className={`h-1.5 rounded-full transition-all duration-300 ${i === topo ? 'w-6 bg-ink' : 'w-1.5 bg-ink/25'}`}
              />
            </button>
          ))}
        </div>
      )}
    </>
  )
}

/** `ordem` 0 = carta de cima; as seguintes ficam atrás, um pouco menores, mais baixas e inclinadas */
function Carta({
  item,
  ordem,
  total,
  onEnviar,
}: {
  item: Adicional
  ordem: number
  total: number
  onEnviar: () => void
}) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-300, 300], [-14, 14])
  const arrastou = useRef(false)
  const voando = useRef(false)
  const deCima = ordem === 0
  const mola = { type: 'spring', stiffness: 260, damping: 26 } as const

  const soltar = async (desloc: number, velocidade: number) => {
    if (voando.current) return
    if (Math.abs(desloc) < 80 && Math.abs(velocidade) < 450) {
      animate(x, 0, mola)
      return
    }
    // voa para fora da tela, vai para o fundo da pilha e volta por trás das outras
    voando.current = true
    const lado = (Math.abs(desloc) < 80 ? velocidade : desloc) < 0 ? -1 : 1
    await animate(x, lado * window.innerWidth, { duration: reduce ? 0 : 0.28, ease: 'easeOut' })
    onEnviar()
    await animate(x, 0, reduce ? { duration: 0 } : { duration: 0.4, ease })
    voando.current = false
  }

  return (
    <motion.li
      inert={!deCima}
      className="origin-bottom [grid-area:1/1]"
      style={{ zIndex: total - ordem }}
      initial={false}
      animate={{
        y: Math.min(ordem, 2) * 14,
        scale: 1 - Math.min(ordem, 2) * 0.05,
        rotate: deCima || reduce ? 0 : ordem % 2 ? 1.6 : -1.6,
        opacity: ordem > 2 ? 0 : 1,
      }}
      transition={reduce ? { duration: 0 } : mola}
    >
      <motion.div
        drag={deCima && total > 1 ? 'x' : false}
        dragMomentum={false}
        onPointerDown={() => (arrastou.current = false)}
        onDragStart={() => (arrastou.current = true)}
        onDragEnd={(_, info) => soltar(info.offset.x, info.velocity.x)}
        onClickCapture={(e) => {
          // o toque que termina um arrasto não abre o link
          if (arrastou.current) {
            e.preventDefault()
            e.stopPropagation()
          }
        }}
        className="h-full rounded-[22px] shadow-[0_18px_40px_-22px_rgba(11,13,18,0.6)] select-none [&_a]:[-webkit-user-drag:none] [&_img]:pointer-events-none"
        style={{ x, rotate: reduce ? 0 : rotate }}
      >
        <Cartao item={item} />
      </motion.div>
    </motion.li>
  )
}

/** card em azul sólido da paleta do Contato (#264b76), sem o degradê/brilho do fundo dele */
function Cartao({ item }: { item: Adicional }) {
  const ebook = item.tipo === 'ebook'
  return (
    <article className="group flex h-full flex-col baixa:xl:flex-row rounded-[22px] border border-white/10 bg-[#264b76] p-3 text-[#f3f0ea] transition-[transform,box-shadow] duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(11,13,18,0.5)]">
      {/* notebook: capa ao lado do texto, para a seção caber na tela */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] sm:aspect-[4/5] baixa:xl:aspect-auto baixa:xl:w-[42%] baixa:xl:shrink-0">
        {item.capa ? (
          <img
            src={item.capa}
            alt={`Capa: ${item.titulo}`}
            className={`absolute inset-0 size-full ${item.capaFundo ? 'object-contain' : 'object-cover'}`}
            style={item.capaFundo ? { backgroundColor: item.capaFundo } : undefined}
          />
        ) : item.emBreve ? (
          <CapaEmBreve titulo={item.titulo} />
        ) : ebook ? (
          <CapaEbook titulo={item.titulo} />
        ) : (
          <CapaCurso titulo={item.titulo} detalhe={item.detalhe} />
        )}
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-ink uppercase shadow-sm">
          {ebook ? 'E-book' : 'Curso'}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 px-2 pt-3.5 pb-1 sm:gap-3 sm:pt-5 sm:pb-2 baixa:xl:gap-2 baixa:xl:py-1 baixa:xl:pr-1 baixa:xl:pl-3.5">
        <span className="font-mono text-[10px] tracking-[0.16em] text-white/65 uppercase">{item.detalhe}</span>
        <h3 className="font-display text-[22px] sm:text-[24px] baixa:xl:text-[20px] leading-[0.95] text-white uppercase">{item.titulo}</h3>
        <p className="text-[14px] leading-snug sm:leading-relaxed baixa:xl:text-[13px] baixa:xl:leading-snug text-white/80">{item.descricao}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-1.5 sm:pt-3 baixa:xl:flex-col baixa:xl:items-start baixa:xl:gap-2">
          <span className="font-mono text-[12px] tracking-[0.12em] text-white uppercase">{item.preco}</span>
          <a
            href={item.link}
            {...(item.link.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 font-mono text-[11px] tracking-[0.14em] text-[#264b76] uppercase transition-colors duration-300 hover:bg-ink hover:text-white"
          >
            {item.emBreve ? 'Quero ser avisado' : ebook ? 'Quero o e-book' : 'Quero o curso'} <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </article>
  )
}

/** Capa de e-book desenhada: livro azul com lombada, que gira um pouco no hover. */
function CapaEbook({ titulo }: { titulo: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-gradient-to-b from-[#e7eefc] to-[#f5f8ff] [perspective:900px]">
      <div className="relative aspect-[3/4] w-[58%] transition-transform duration-700 ease-out-soft [transform-style:preserve-3d] group-hover:[transform:rotateY(-18deg)_rotateX(4deg)]">
        <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-r-md rounded-l-sm bg-gradient-to-br from-[#3d7bff] via-[#0450e6] to-[#0336a8] p-4 text-white shadow-[18px_24px_40px_-18px_rgba(4,40,120,0.6)]">
          {/* lombada */}
          <span aria-hidden className="absolute inset-y-0 left-0 w-[7%] bg-black/20" />
          <span aria-hidden className="absolute inset-y-0 left-[7%] w-px bg-white/25" />
          <span className="pl-[8%] font-mono text-[9px] tracking-[0.2em] uppercase opacity-80">E-book</span>
          <span className="pl-[8%] font-display text-[clamp(1rem,2vw,1.35rem)] leading-[0.95] uppercase">{titulo}</span>
          <span className="pl-[8%] font-mono text-[9px] tracking-[0.24em] uppercase opacity-80">Horzone</span>
          {/* sol do horizonte */}
          <span aria-hidden className="absolute -right-6 -bottom-6 size-20 rounded-full bg-white/15" />
        </div>
      </div>
    </div>
  )
}

/** Capa de curso desenhada: miniatura de vídeo escura com botão de play. */
/** Capa "Disponível em breve": visor escuro com REC piscando, selo de lançamento e o nome do curso. */
function CapaEmBreve({ titulo }: { titulo: string }) {
  const reduce = useReducedMotion()
  return (
    <div className="absolute inset-0 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0b0d12] via-[#141a2a] to-[#0b2a6b] p-4 text-white">
      <span aria-hidden className="absolute -right-10 -bottom-10 size-48 rounded-full bg-[#0450e6]/40 blur-3xl" />
      {/* cantoneiras de visor */}
      {['top-3 left-3 border-t border-l', 'top-3 right-3 border-t border-r', 'bottom-3 left-3 border-b border-l', 'right-3 bottom-3 border-r border-b'].map((c) => (
        <span key={c} aria-hidden className={`absolute size-4 border-white/50 ${c}`} />
      ))}
      <span className="relative mt-7 ml-1 flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase">
        <motion.span
          className="size-2 rounded-full bg-[#ff2d20] shadow-[0_0_8px_2px_rgba(255,45,32,0.7)]"
          animate={reduce ? undefined : { opacity: [1, 0.25, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        Rec
      </span>
      <div className="relative flex flex-col gap-3">
        <span className="w-fit rounded-full border border-white/30 bg-white/10 px-3 py-1 font-mono text-[9px] tracking-[0.2em] uppercase backdrop-blur-sm">
          Lançamento
        </span>
        <span className="font-display text-[clamp(1.6rem,2.6vw,2.1rem)] leading-[0.9] uppercase">
          Disponível
          <br />
          <span className="text-[#8cb8ff]">em breve</span>
        </span>
        <span className="font-mono text-[10px] tracking-[0.18em] text-white/70 uppercase">{titulo}</span>
      </div>
    </div>
  )
}

function CapaCurso({ titulo, detalhe }: { titulo: string; detalhe: string }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-br from-[#16181f] via-[#1c2233] to-[#0b2a6b] p-4 text-white">
      <span aria-hidden className="absolute top-[18%] right-[-12%] size-40 rounded-full bg-[#0450e6]/40 blur-2xl" />
      <span
        aria-hidden
        className="absolute top-[40%] left-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-white/15 backdrop-blur-md transition-transform duration-500 ease-out-soft group-hover:scale-110"
      >
        <svg width="18" height="20" viewBox="0 0 20 22" fill="none">
          <path d="M3 2.5v17a1 1 0 0 0 1.5.86l14-8.5a1 1 0 0 0 0-1.72l-14-8.5A1 1 0 0 0 3 2.5z" fill="#ffffff" />
        </svg>
      </span>
      <span className="relative font-display text-[clamp(1.1rem,2vw,1.4rem)] leading-[0.95] uppercase">{titulo}</span>
      <span className="relative mt-2 font-mono text-[9px] tracking-[0.2em] uppercase opacity-70">{detalhe}</span>
      {/* barra de progresso decorativa de vídeo */}
      <span aria-hidden className="relative mt-3 h-[3px] w-full overflow-hidden rounded-full bg-white/15">
        <span className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-white/80" />
      </span>
    </div>
  )
}
