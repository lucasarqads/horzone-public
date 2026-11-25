import logo from '../assets/logo-horzone.svg'
import type { SecaoTermos } from '../data/termos'
import { EMAIL, linkWhatsapp } from '../data/contato'

const ANO = new Date().getFullYear()

/**
 * Modelo das páginas legais (Termos de Uso, Política de Privacidade): topo escuro com título e data,
 * índice fixo ao lado (desktop) e seções numeradas. Os textos vêm de src/data/termos.ts e privacidade.ts.
 */
export function PaginaLegal({
  titulo,
  atualizacao,
  secoes,
}: {
  titulo: string
  atualizacao: string
  secoes: SecaoTermos[]
}) {
  const whatsapp = linkWhatsapp()

  return (
    <>
      <header className="bg-[#03050f] px-6 pt-6 pb-16 text-[#f3f0ea] sm:px-8 sm:pb-24 lg:px-12">
        <nav aria-label="Principal" className="mx-auto flex max-w-[960px] items-center justify-between">
          <a href="/" aria-label="Horzone — voltar ao site" className="inline-flex min-h-11 items-center rounded-md">
            <img src={logo} alt="" className="h-9 w-auto" />
          </a>
          <a
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 font-mono text-[12px] tracking-[0.14em] uppercase transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink"
          >
            <span aria-hidden>←</span> Voltar ao site
          </a>
        </nav>

        <div className="mx-auto mt-16 max-w-[960px] sm:mt-24">
          <p className="font-mono text-[11px] tracking-[0.22em] text-[#a9c8ff] uppercase sm:text-[12px]">Legal</p>
          <h1 className="mt-4 font-display text-[clamp(3rem,9vw,6.5rem)] leading-[0.9] uppercase">
            {titulo}<span className="text-brand">.</span>
          </h1>
          <p className="mt-5 font-mono text-[12px] tracking-[0.12em] text-white/60 uppercase">
            Última atualização: {atualizacao}
          </p>
        </div>
      </header>

      <main className="px-6 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-[960px] grid-cols-1 gap-12 lg:grid-cols-[220px_1fr] lg:gap-16">
          {/* índice */}
          <nav aria-label={`Seções: ${titulo}`} className="lg:sticky lg:top-8 lg:self-start">
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">Nesta página</p>
            <ol className="mt-4 flex flex-col gap-2.5 text-[14px]">
              {secoes.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-ink/70 transition-colors duration-300 hover:text-brand">
                    {i + 1}. {s.titulo}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* seções */}
          <article className="flex flex-col gap-12">
            {secoes.map((s, i) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-titulo`} className="scroll-mt-8">
                <h2 id={`${s.id}-titulo`} className="flex items-baseline gap-3 font-display text-[clamp(1.5rem,3vw,2rem)] leading-none uppercase">
                  <span className="font-mono text-[13px] text-brand">{String(i + 1).padStart(2, '0')}</span>
                  {s.titulo}
                </h2>
                <div className="mt-5 flex flex-col gap-4 text-[16px] leading-relaxed text-ink/80">
                  {s.paragrafos?.map((p) => <p key={p}>{p}</p>)}
                  {s.itens && (
                    <ul className="flex flex-col gap-3">
                      {s.itens.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-brand" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}

            <div className="flex flex-wrap gap-3 border-t border-line pt-8">
              <a
                href={whatsapp}
                {...(whatsapp.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 font-mono text-[12px] tracking-[0.14em] text-white uppercase transition-colors duration-300 hover:bg-brand"
              >
                Falar no WhatsApp <span aria-hidden>↗</span>
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/20 px-5 font-mono text-[12px] tracking-[0.14em] uppercase transition-colors duration-300 hover:border-ink"
              >
                {EMAIL}
              </a>
            </div>
          </article>
        </div>
      </main>

      <footer className="bg-[#03050f] px-6 py-8 text-[12px] text-[#7d879c] sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[960px] flex-wrap items-center justify-between gap-3">
          <span>© {ANO} Horzone Tecnologia</span>
          <a href="/" className="transition-colors duration-300 hover:text-white">
            Voltar ao site
          </a>
        </div>
      </footer>
    </>
  )
}
