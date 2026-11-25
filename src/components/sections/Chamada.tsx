import { motion, useReducedMotion } from 'framer-motion'
import { CHAMADA } from '../../data/chamada'
import { Reveal } from '../ui/Reveal'
import logo from '../../assets/logo-horzone.svg'

/** Chamada para ação — mesmo fundo do rodapé, com a logo flutuando. */
export function Chamada() {
  const reduce = useReducedMotion()
  const externo = CHAMADA.botao.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {}

  return (
    <section
      id="chamada"
      aria-labelledby="chamada-titulo"
      className="bg-[#03050f] px-6 py-20 text-white sm:px-8 sm:py-28 lg:px-12 baixa:py-14"
    >
      <Reveal className="mx-auto max-w-[1280px]">
          <div className="flex flex-col items-center gap-10 text-center lg:flex-row lg:justify-between lg:text-left">
            <div className="flex flex-col items-center lg:items-start">
              <h2
                id="chamada-titulo"
                className="max-w-[14ch] font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] uppercase baixa:text-[3.5rem]"
              >
                {CHAMADA.titulo}.
              </h2>
              <p className="mt-5 max-w-[44ch] text-[16px] leading-relaxed text-white/90 sm:text-[17px]">
                {CHAMADA.descricao}
              </p>

              <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <a
                  href={CHAMADA.botao.href}
                  {...externo}
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#25d366] px-7 font-mono text-[12px] font-semibold tracking-[0.14em] text-white uppercase transition-colors duration-300 hover:bg-[#4be384] focus-visible:outline-white"
                >
                  {CHAMADA.botao.rotulo} <span aria-hidden>↗</span>
                </a>
                <a
                  href={CHAMADA.secundario.href}
                  className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/50 px-7 font-mono text-[12px] tracking-[0.14em] uppercase transition-colors duration-300 hover:border-white hover:bg-white/10 focus-visible:outline-white"
                >
                  {CHAMADA.secundario.rotulo}
                </a>
              </div>
            </div>

            {/* logo flutuando */}
            <div aria-hidden className="hidden shrink-0 flex-col items-center pr-4 lg:flex xl:pr-12">
              <motion.img
                src={logo}
                alt=""
                draggable={false}
                className="h-52 w-auto select-none baixa:h-40"
                animate={reduce ? undefined : { y: [0, -12, 0] }}
                transition={{ duration: 3.4, ease: 'easeInOut', repeat: Infinity }}
              />
              <motion.span
                className="mt-5 h-3 w-28 rounded-[50%] bg-brand/50 blur-[5px]"
                animate={reduce ? undefined : { scaleX: [1, 0.75, 1], opacity: [0.9, 0.5, 0.9] }}
                transition={{ duration: 3.4, ease: 'easeInOut', repeat: Infinity }}
              />
            </div>
          </div>
      </Reveal>
    </section>
  )
}
