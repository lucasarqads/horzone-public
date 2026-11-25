import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { PLANO } from '../../data/plano'
import { Reveal } from '../ui/Reveal'
import cubo from '../../assets/cubo-passo.webp'

/**
 * Plano — antes de Adicionais. Fundo azul-marinho com brilho e UM card (o "Ecossistema Horzone" da
 * referência): selo "Recomendado", lista de benefícios com check e a área de valores + chamada.
 */
export function Plano() {
  const reduce = useReducedMotion()
  // um único cubo, que passa de passo em passo (1 → 2 → 3 → 1…) enquanto a lista está à vista
  const passosRef = useRef<HTMLOListElement>(null)
  const passosVisiveis = useInView(passosRef)
  const [passoDoCubo, setPassoDoCubo] = useState(0)
  useEffect(() => {
    if (reduce || !passosVisiveis) return
    const t = window.setInterval(() => setPassoDoCubo((p) => (p + 1) % PLANO.passos.length), 2200)
    return () => window.clearInterval(t)
  }, [reduce, passosVisiveis])
  const externo = PLANO.link.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {}

  return (
    <section
      id="plano"
      aria-labelledby="plano-titulo"
      className="relative overflow-hidden bg-[#050816] px-6 py-24 text-[#f3f0ea] sm:px-8 sm:py-32 lg:px-12 baixa:py-9"
    >
      {/* brilhos do fundo */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute top-1/2 left-1/2 size-[640px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#3b3df2]/25 blur-[140px]" />
        <span className="absolute -bottom-40 -left-40 size-[420px] rounded-full bg-[#0450e6]/20 blur-[120px]" />
      </div>

      {/* celular/tablet: coluna centralizada · desktop: título à esquerda, card à direita */}
      <div className="relative mx-auto flex max-w-[1280px] flex-col items-center lg:grid lg:grid-cols-[1fr_minmax(0,560px)] lg:items-stretch lg:gap-16 xl:gap-24">
        <Reveal className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <p className="font-mono text-[11px] tracking-[0.22em] text-[#a9a4ff] uppercase sm:text-[12px]">
            Transformação digital
          </p>
          <h2
            id="plano-titulo"
            className="mt-4 max-w-[16ch] font-display text-[clamp(2.5rem,6vw,4.75rem)] baixa:max-w-[26ch] baixa:text-[2.75rem] leading-[0.95] uppercase"
          >
            Crie sua estrutura digital com a Horzone<span className="text-[#a9a4ff]">.</span>
          </h2>
          <p className="mt-5 baixa:mt-3 max-w-[52ch] text-[16px] leading-relaxed text-white/70 baixa:text-[15px]">
            Veja o que muda no dia a dia de quem tem um ecossistema digital com a Horzone.
          </p>

          {/* 3 passos, em coluna */}
          <ol ref={passosRef} className="mt-10 baixa:mt-5 flex w-full max-w-[560px] flex-col gap-3 baixa:gap-2 text-left">
            {PLANO.passos.map((p, i) => (
              <li
                key={p.titulo}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 baixa:p-3"
              >
                {/* lugar do cubo (o espaço fica reservado nos 3 cards) */}
                <span aria-hidden className="relative z-10 size-11 shrink-0">
                  {i === passoDoCubo && (
                    <motion.span
                      layoutId="cubo-passos"
                      className="block size-full"
                      transition={{ type: 'spring', stiffness: 140, damping: 18 }}
                    >
                      <motion.img
                        src={cubo}
                        alt=""
                        draggable={false}
                        className="size-full object-contain select-none"
                        animate={reduce ? undefined : { y: [0, -5, 0], rotate: [0, 4, 0] }}
                        transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
                      />
                    </motion.span>
                  )}
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-[16px] font-semibold text-white">{p.titulo}</span>
                  <span className="text-[14px] leading-relaxed baixa:leading-snug text-white/65">{p.descricao}</span>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.1} className="mt-14 w-full max-w-[560px] sm:mt-16 lg:mt-0 lg:h-full">
          <article className="relative flex flex-col rounded-[22px] lg:h-full border border-[#6f6cf5]/60 bg-gradient-to-br from-[#2a2c7a] via-[#22256a] to-[#1a1d55] p-5 shadow-[0_0_60px_-10px_rgba(99,96,245,0.55)] sm:p-8 baixa:p-6">
            {/* selo */}
            <span className="absolute -top-3.5 right-6 rounded-full bg-[#c9c3ff] px-3.5 py-1.5 font-mono text-[10px] font-semibold tracking-[0.16em] text-[#1a1d55] uppercase shadow-[0_6px_20px_-6px_rgba(201,195,255,0.8)]">
              {PLANO.selo}
            </span>

            <div className="flex items-start justify-between gap-4">
              <span className="font-mono text-[11px] tracking-[0.18em] text-[#a9a4ff] uppercase">{PLANO.rotulo}</span>
              <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-lg sm:size-9 bg-[#2dd4bf]/15 text-[#2dd4bf]">
                <Check tamanho={18} />
              </span>
            </div>

            <h3 className="mt-1.5 text-[19px] leading-tight sm:mt-3 font-semibold text-white sm:text-[24px]">{PLANO.titulo}</h3>

            {/* benefícios */}
            <ul className="mt-3.5 flex flex-col gap-2 sm:mt-6 sm:gap-3.5 baixa:mt-4 baixa:gap-2.5">
              {PLANO.beneficios.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-[14px] leading-snug text-white/90 sm:gap-3 sm:text-[15px]">
                  <span aria-hidden className="mt-[1px] shrink-0 text-[#2dd4bf]">
                    <Check tamanho={18} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            {/* valores */}
            {/* celular: os dois valores lado a lado */}
            <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-white/15 pt-4 sm:mt-8 sm:gap-3 sm:pt-6 lg:mt-auto baixa:pt-4">
              {PLANO.valores.map((v) => (
                <div key={v.rotulo} className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 sm:p-4">
                  <dt className="font-mono text-[10px] tracking-[0.18em] text-white/60 uppercase">{v.rotulo}</dt>
                  {v.prefixo && <dd className="mt-2 text-[12px] leading-none text-white/65">{v.prefixo}</dd>}
                  <dd className={`${v.prefixo ? 'mt-1' : 'mt-2'} font-display text-[24px] sm:text-[28px] leading-none text-white uppercase`}>
                    {v.valor}
                    {v.sufixo && <span className="ml-1 font-sans text-[14px] text-white/65 normal-case">{v.sufixo}</span>}
                  </dd>
                  <dd className="mt-1.5 text-[12px] leading-snug text-white/65 sm:mt-2 sm:text-[13px]">{v.detalhe}</dd>
                </div>
              ))}
            </dl>

            <a
              href={PLANO.link}
              {...externo}
              className="mt-4 sm:mt-6 baixa:mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25d366] font-mono text-[12px] font-semibold tracking-[0.14em] text-white uppercase transition-colors duration-300 hover:bg-[#4be384]"
            >
              {PLANO.chamada} <span aria-hidden>↗</span>
            </a>
          </article>
        </Reveal>
      </div>
    </section>
  )
}

function Check({ tamanho }: { tamanho: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 12.3l2.7 2.7L16 9.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
