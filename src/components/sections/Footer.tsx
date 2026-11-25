import logo from '../../assets/logo-horzone.svg'
import { EMAIL, linkWhatsapp } from '../../data/contato'

/** Rodapé — fundo azul-marinho quase preto, 4 colunas (marca + Soluções + Suporte & Contato + Legal). */

type Link = { rotulo: string; href: string }

const COLUNAS: { titulo: string; links: Link[] }[] = [
  {
    titulo: 'Soluções',
    links: [
      { rotulo: 'BioWeb Express', href: '#tecnologia' },
      { rotulo: 'Sites Institucionais', href: '#tecnologia' },
      { rotulo: 'Sistemas Web Custom', href: '#tecnologia' },
      { rotulo: 'Tabela de Preços', href: linkWhatsapp() }, // TODO: página/tabela de preços
    ],
  },
  {
    titulo: 'Suporte & Contato',
    links: [
      { rotulo: 'Falar com especialista', href: linkWhatsapp() },
      { rotulo: 'Central de atendimento', href: linkWhatsapp() },
      { rotulo: 'Agendar reunião', href: linkWhatsapp() },
    ],
  },
]

const externo = (href: string) => (href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})

const estiloLink =
  'text-[13px] text-[#a3adc2] transition-colors duration-300 hover:text-white focus-visible:text-white'

export function Footer() {
  return (
    <footer className="bg-[#03050f] px-6 pt-16 pb-8 text-[#a3adc2] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[960px]">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr] lg:gap-10">
          {/* marca */}
          <div className="flex flex-col gap-5">
            <a href="#top" className="inline-flex w-fit items-center gap-3 rounded-md">
              <img src={logo} alt="" className="h-6 w-auto" />
              <span className="text-[15px] font-semibold text-white">Horzone</span>
            </a>
            <p className="max-w-[30ch] text-[13px] leading-relaxed">
              Sistemas web, landing pages e vitrines digitais sob medida para acelerar o seu negócio.
            </p>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#4b3df2]/40 bg-[#4b3df2]/10 px-3.5 py-2 text-[11px] font-semibold text-[#c9c3ff]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Desenvolvimento Web &amp; Sistemas
            </span>
            <div className="flex gap-2.5">
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram da Horzone"
                className="grid size-8 place-items-center rounded-lg border border-white/15 text-[#c9d1e3] transition-colors duration-300 hover:border-white/40 hover:text-white"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
                </svg>
              </a>
              <a
                href={`mailto:${EMAIL}`}
                aria-label="Enviar e-mail para a Horzone"
                className="grid size-8 place-items-center rounded-lg border border-white/15 text-[#c9d1e3] transition-colors duration-300 hover:border-white/40 hover:text-white"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M4 13h4l1.5 2.5h5L16 13h4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="M6.5 5h11l2.5 8v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5l2.5-8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>

          {/* Soluções · Suporte & Contato */}
          {COLUNAS.map((c) => (
            <nav key={c.titulo} aria-label={c.titulo} className="flex flex-col gap-4">
              <h3 className="font-display text-[11px] tracking-[0.12em] text-white uppercase">{c.titulo}</h3>
              <ul className="flex flex-col gap-3.5">
                {c.links.map((l) => (
                  <li key={l.rotulo}>
                    <a href={l.href} {...externo(l.href)} className={estiloLink}>
                      {l.rotulo}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Legal */}
          <nav aria-label="Legal" className="flex flex-col gap-4">
            <h3 className="font-display text-[11px] tracking-[0.12em] text-white uppercase">Legal</h3>
            <ul className="flex flex-col gap-3.5">
              <li>
                <a href="/termos.html" className={estiloLink}>
                  Termos de Serviço
                </a>
              </li>
              <li>
                <a href="/privacidade.html" className={estiloLink}>
                  Política de Privacidade
                </a>
              </li>
              <li className="text-[13px] leading-relaxed">
                Contato:
                <br />
                <a href={`mailto:${EMAIL}`} className={`${estiloLink} break-all`}>
                  {EMAIL}
                </a>
              </li>
              <li>
                <a href={linkWhatsapp()} {...externo(linkWhatsapp())} className={estiloLink}>
                  Suporte Técnico
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6 text-[11px] text-[#7d879c]">
          <a href="/termos.html" className="transition-colors duration-300 hover:text-white">
            Termos de Uso
          </a>{' '}
          · Versão 1.0
        </div>
      </div>
    </footer>
  )
}
