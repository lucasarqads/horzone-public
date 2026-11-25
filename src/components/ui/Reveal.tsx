import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right'

const offset: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 28 },
  down: { y: -28 },
  left: { x: 28 },
  right: { x: -28 },
}

/** Entra e sai da tela com blur + fade. Só transform/opacity/filter. */
export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  className,
}: {
  children: ReactNode
  direction?: Direction
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, filter: 'blur(8px)', ...offset[direction] }}
      // ao terminar, tira o filtro de vez: `blur(0px)` parado ainda cria uma camada filtrada que altera o tom do fundo
      whileInView={{ opacity: 1, filter: 'blur(0px)', x: 0, y: 0, transitionEnd: { filter: 'none' } }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
