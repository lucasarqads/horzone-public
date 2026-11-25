import { BLOCOS, type Bloco } from '../../data/projetos'
import { CarrosselParallax } from '../ui/CarrosselParallax'
import { Funil } from '../ui/Funil'
import { Reveal } from '../ui/Reveal'
import { FundoRepertorio } from '../ui/FundoRepertorio'

/** Repertório — fundo preto com vídeo de película colorida (fixo na tela enquanto os 3 blocos rolam por cima). */
export function Repertorio() {
  return (
    <section
      id="repertorio"
      aria-labelledby="repertorio-titulo"
      className="relative overflow-x-clip bg-black px-6 pt-24 pb-32 text-[#f3f0ea] sm:px-8 sm:pt-32 sm:pb-40 lg:px-12 baixa:pt-16 baixa:pb-20"
    >
      {/* Fundo: sticky dentro da seção (funciona no iOS, ao contrário de background-attachment: fixed) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="sticky top-0 h-svh w-full overflow-hidden">
          <FundoRepertorio />
          {/* leve escurecida para os textos claros manterem contraste */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/30" />
        </div>
      </div>

      <div className="relative mx-auto max-w-[1280px]">
        <header>
          <Reveal>
            <h2 id="repertorio-titulo" className="font-display text-[clamp(3rem,10vw,8.5rem)] baixa:text-[4.5rem] leading-[0.88] uppercase">
              Repertório<span className="text-[#a9c8ff]">.</span>
            </h2>
          </Reveal>
        </header>

        <div className="mt-20 flex flex-col gap-28 sm:mt-28 sm:gap-36 baixa:mt-8 baixa:gap-20">
          {BLOCOS.map((b) => (
            <BlocoRepertorio key={b.id} bloco={b} />
          ))}
        </div>
      </div>
    </section>
  )
}

function BlocoRepertorio({ bloco }: { bloco: Bloco }) {
  return (
    <article id={bloco.id} aria-labelledby={`${bloco.id}-titulo`} className="scroll-mt-8 baixa:scroll-mt-5">
      <Reveal className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[1fr_minmax(0,380px)] lg:gap-10">
        <h3
          id={`${bloco.id}-titulo`}
          className="font-display text-[clamp(2.25rem,5.5vw,4.5rem)] baixa:text-[3rem] leading-[0.92] uppercase"
        >
          {bloco.titulo}
        </h3>
        <p className="text-[16px] leading-relaxed text-white/70 lg:pt-2 baixa:pt-0 baixa:leading-snug">{bloco.descricao}</p>
      </Reveal>

      {/* o carrossel fica fora do Reveal: o blur/filtro de entrada pegaria a área inteira (o azul em volta
          dos cards mudava de tom); os efeitos ficam só nos cards */}
      {bloco.exibicao === 'funil' ? (
        <Reveal delay={0.12}>
          <Funil etapas={bloco.etapas} rotulo={bloco.titulo} />
        </Reveal>
      ) : (
        <CarrosselParallax
          projetos={bloco.projetos}
          rotulo={bloco.titulo}
          anuncios={bloco.exibicao === 'anuncios'}
        />
      )}
    </article>
  )
}

