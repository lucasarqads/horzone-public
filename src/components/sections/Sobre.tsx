import { useLayoutEffect, useRef, useState } from 'react'
import { Reveal } from '../ui/Reveal'
import { CONTEUDO } from '../../data/horzone'
import { useViewport } from '../../lib/useViewport'

/**
 * Sobre — sobe por cima do palco da Hero (fixo nos últimos 100svh dele): uma seção dentro da outra.
 * Texto em cima e, logo abaixo, #sobre-janela: o lugar onde a foto da Hero (HORZONE + persona) se
 * encaixa ao final da rolagem. A foto é desenhada pelo palco da Hero (acima desta seção), então
 * desliza sem nunca ser coberta. Texto + foto ficam centralizados na tela.
 */
const PROPORCAO = CONTEUDO.w / CONTEUDO.h // largura/altura da parte visível da foto
const ESPACO = 20 // entre o texto e a foto (px)

export function Sobre() {
  const { vh } = useViewport()
  const textoRef = useRef<HTMLDivElement>(null)
  const janelaRef = useRef<HTMLDivElement>(null)
  const [alturaJanela, setAlturaJanela] = useState(200)

  // a foto ocupa a largura disponível, mas nunca passa da altura que sobra na tela
  useLayoutEffect(() => {
    const texto = textoRef.current
    const janela = janelaRef.current
    if (!texto || !janela) return
    const medir = () => {
      const porLargura = janela.clientWidth / PROPORCAO
      const sobra = vh - texto.offsetHeight - ESPACO - 48
      setAlturaJanela(Math.round(Math.max(150, Math.min(porLargura, sobra))))
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(texto)
    ro.observe(janela)
    return () => ro.disconnect()
  }, [vh])

  return (
    <section
      id="sobre"
      aria-labelledby="sobre-titulo"
      className="relative z-10 -mt-[100svh] flex min-h-svh flex-col justify-center rounded-t-[28px] bg-wall px-6 py-10 baixa:py-6 shadow-[0_-30px_70px_-20px_rgba(11,13,18,0.35)] sm:rounded-t-[44px] sm:px-8 lg:px-12"
    >
      <div ref={textoRef} className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-5 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
        <Reveal>
          <h2
            id="sobre-titulo"
            className="font-display text-[clamp(2.25rem,4.6vw,4.75rem)] baixa:text-[clamp(2.25rem,3.6vw,3.25rem)] leading-[0.92] tracking-[-0.01em] uppercase"
          >
            Tecnologia, estratégia e mídia digital <br />
            <br />
            <span className="text-brand">quem é o Lucas na horzone ?</span>
          </h2>
        </Reveal>

        <div className="flex flex-col justify-end">
          <Reveal delay={0.09}>
            <p className="max-w-[46ch] text-[17px] leading-relaxed text-ink/80">
              Sou o Lucas, fundador da Horzone e Analista de Sistemas. Minha missão é criar estruturas digitais que posicionam sua empresa na internet e sistemas que gerenciam seu negócio.
            </p>
          </Reveal>
        </div>
      </div>

      {/* lugar da foto da Hero (desenhada pelo palco da Hero, por cima desta seção) */}
      <div
        ref={janelaRef}
        id="sobre-janela"
        aria-hidden
        className="mx-auto w-full max-w-[1280px]"
        style={{ height: alturaJanela, marginTop: ESPACO }}
      />
    </section>
  )
}
