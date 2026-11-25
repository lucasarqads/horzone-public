import { motion, useReducedMotion } from 'framer-motion'
import { linkWhatsapp } from '../../data/contato'

const LADO = 52 // tamanho do cubo (px)
// transform e tom de verde de cada face (tons diferentes dão o volume)
const FACES = [
  { t: 'rotateY(0deg)', cor: '#25d366' },
  { t: 'rotateY(90deg)', cor: '#1fbd5a' },
  { t: 'rotateY(180deg)', cor: '#25d366' },
  { t: 'rotateY(-90deg)', cor: '#1fbd5a' },
  { t: 'rotateX(90deg)', cor: '#4be384' },
  { t: 'rotateX(-90deg)', cor: '#17a34a' },
]
const ICONE =
  'M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.85 9.85 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 8.24 8.25c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.29z'

/** Botão fixo do WhatsApp (canto inferior direito, sempre visível): um cubo 3D girando. */
export function WhatsappFlutuante() {
  const reduce = useReducedMotion()
  const href = linkWhatsapp()
  const externo = href.startsWith('http')

  return (
    <motion.a
      href={href}
      {...(externo ? { target: '_blank', rel: 'noreferrer' } : {})}
      aria-label="Conversar pelo WhatsApp"
      title="Conversar pelo WhatsApp"
      initial={reduce ? false : { opacity: 0, y: 16, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1], delay: reduce ? 0 : 2.4 }}
      whileHover={reduce ? undefined : { scale: 1.1 }}
      whileTap={reduce ? undefined : { scale: 0.94 }}
      className="fixed right-5 bottom-10 z-40 grid size-[72px] place-items-center sm:right-7"
      style={{ perspective: 420 }}
    >
      {/* sombra no chão */}
      <span aria-hidden className="pointer-events-none absolute -bottom-2 h-3 w-12 rounded-[50%] bg-black/35 blur-[6px]" />
      <motion.span
        aria-hidden
        className="pointer-events-none relative block"
        style={{ width: LADO, height: LADO, transformStyle: 'preserve-3d', rotateX: -20, rotateY: -32 }}
        animate={reduce ? undefined : { rotateY: [-32, 328], y: [0, -4, 0] }}
        transition={{
          rotateY: { duration: 9, ease: 'linear', repeat: Infinity },
          y: { duration: 3, ease: 'easeInOut', repeat: Infinity },
        }}
      >
        {FACES.map((face) => (
          <span
            key={face.t}
            className="absolute inset-0 grid place-items-center text-white"
            style={{
              transform: `${face.t} translateZ(${LADO / 2 - 0.5}px)`,
              backgroundColor: face.cor,
              backfaceVisibility: 'hidden',
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
              <path d={ICONE} />
            </svg>
          </span>
        ))}
      </motion.span>
    </motion.a>
  )
}
