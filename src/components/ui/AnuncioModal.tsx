import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { Projeto } from '../../data/projetos'
import { travarRolagem } from '../../lib/useLenis'
import iconeInstagram from '../../assets/icone-instagram.webp'

const ease = [0.2, 0.7, 0.2, 1] as const

/** Janela do anúncio: vídeo, nome do cliente e botão do Instagram. Fecha com Esc, clique fora ou botão. */
export function AnuncioModal({
  projeto,
  onClose,
}: {
  projeto: Projeto | null
  onClose: () => void
}) {
  const fechar = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!projeto) return
    travarRolagem(true)
    const anterior = document.activeElement as HTMLElement | null
    fechar.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      travarRolagem(false)
      window.removeEventListener('keydown', onKey)
      anterior?.focus()
    }
  }, [projeto, onClose])

  return createPortal(
    <AnimatePresence>
      {projeto && (
        <motion.div
          // card transparente sobre um véu azul, o mesmo azul da seção
          className="fixed inset-0 z-50 grid place-items-center bg-[#1f4268]/80 p-3 backdrop-blur-md sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          data-lenis-prevent
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="anuncio-modal-titulo"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 24, scale: 0.97, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 16, scale: 0.98, filter: 'blur(6px)' }}
            transition={{ duration: 0.5, ease }}
            className="relative grid max-h-[92svh] w-full max-w-[1040px] overflow-y-auto overscroll-contain rounded-2xl border border-white/20 bg-transparent text-[#f3f0ea] md:grid-cols-[1.1fr_1fr]"
          >
            {/* no celular/tablet o vídeo ocupa a maior parte da janela */}
            <div className="relative h-[64svh] md:h-auto md:min-h-[min(460px,70svh)]">
              <video
                src={projeto.media}
                controls
                autoPlay
                muted
                playsInline
                className="absolute inset-0 size-full object-cover"
              />
            </div>

              <div className="flex flex-col gap-3 px-5 py-4 md:gap-6 md:p-10">
                <div className="flex w-full items-start justify-between gap-4">
                  <h4 id="anuncio-modal-titulo" className="font-display text-[clamp(1.75rem,4vw,3rem)] leading-[0.95] uppercase">
                    {projeto.cliente}
                  </h4>
                  <button
                    ref={fechar}
                    type="button"
                    onClick={onClose}
                    aria-label="Fechar vídeo"
                    className="-mt-2 -mr-2 grid size-11 shrink-0 place-items-center rounded-full border border-white/20 font-mono text-[14px] transition-colors duration-300 hover:border-brand hover:bg-brand"
                  >
                    ✕
                  </button>
                </div>
                {/* botão de vidro grande, centralizado no espaço que sobra */}
                {projeto.instagram && (
                  <div className="flex flex-1 items-center justify-center gap-4 md:flex-col">
                    <a
                      href={projeto.instagram}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Instagram de ${projeto.cliente} (abre em nova aba)`}
                      className="group relative isolate grid size-18 place-items-center rounded-[20px] md:rounded-[36px] border border-white/20 bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.28),inset_0_-1px_0_rgba(255,255,255,0.06),0_30px_60px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-[transform,background-color,box-shadow] duration-500 ease-out-soft hover:-translate-y-1 hover:bg-white/[0.1] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(255,255,255,0.08),0_40px_70px_-24px_rgba(0,0,0,0.9)] active:scale-[0.98] md:size-44"
                    >
                      {/* brilho colorido atrás do vidro */}
                      <span
                        aria-hidden
                        className="absolute -inset-2 -z-10 md:-inset-6 rounded-full bg-gradient-to-br from-[#f58529]/30 via-[#dd2a7b]/30 to-[#8134af]/30 opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                      />
                      {/* reflexo do vidro */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-[20px] md:rounded-[36px] bg-gradient-to-b from-white/20 via-transparent to-transparent"
                      />
                      <img
                        src={iconeInstagram}
                        alt=""
                        draggable={false}
                        className="relative h-11 w-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)] transition-transform duration-500 ease-out-soft select-none group-hover:scale-105 md:h-24"
                      />
                    </a>
                    <span className="font-mono text-[11px] tracking-[0.16em] text-white/85 uppercase">
                      @{projeto.instagram.replace(/\/+$/, '').split('/').pop()}
                    </span>
                  </div>
                )}
              </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
