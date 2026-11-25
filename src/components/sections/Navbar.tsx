import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import logo from '../../assets/logo-horzone.svg'
import { linkWhatsapp } from '../../data/contato'

const links = [
  { href: '#repertorio', label: 'Serviços' },
  { href: '#sobre', label: 'Sobre mim' },
]

const ease = [0.2, 0.7, 0.2, 1] as const

/** Barra sem fundo, sobreposta à Hero — parece fazer parte dela. */
export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease, delay: 1.6 }}
      className="absolute inset-x-0 top-0 z-20"
    >
      <nav
        aria-label="Principal"
        className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 sm:px-8 sm:py-7 lg:px-12"
      >
        <a href="#top" aria-label="Horzone — voltar ao início" className="group inline-flex min-h-11 items-center rounded-md">
          <img
            src={logo}
            alt=""
            draggable={false}
            className="h-9 w-auto transition-transform duration-500 ease-out-soft group-hover:-translate-y-0.5 sm:h-10"
          />
        </a>

        <div className="flex items-center gap-2 sm:gap-5 lg:gap-8">
          <ul className="hidden items-center gap-5 sm:flex lg:gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative inline-flex min-h-11 items-center font-mono text-[12px] tracking-[0.14em] uppercase"
                >
                  <span className="text-muted">[</span>&nbsp;{l.label}&nbsp;<span className="text-muted">]</span>
                  <span className="absolute bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-brand transition-transform duration-500 ease-out-soft group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <a
            href={linkWhatsapp()}
            {...(linkWhatsapp().startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 font-mono text-[12px] tracking-[0.14em] text-paper uppercase transition-colors duration-300 hover:bg-brand"
          >
            Contato <span aria-hidden>↗</span>
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            className="relative grid size-11 place-items-center rounded-full sm:hidden"
          >
            <span
              className={`absolute h-px w-5 bg-ink transition-transform duration-300 ${open ? 'rotate-45' : '-translate-y-1'}`}
            />
            <span
              className={`absolute h-px w-5 bg-ink transition-transform duration-300 ${open ? '-rotate-45' : 'translate-y-1'}`}
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            id="menu-mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease }}
            className="mx-6 flex flex-col items-end sm:hidden"
          >
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="group flex min-h-12 items-center justify-end gap-3 font-mono text-[13px] tracking-[0.14em] uppercase"
                >
                  {l.label}
                  <span aria-hidden className="text-muted transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
