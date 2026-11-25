import l0 from '../assets/horzone/l0.webp'
import l1 from '../assets/horzone/l1.webp'
import l2 from '../assets/horzone/l2.webp'
import l3 from '../assets/horzone/l3.webp'
import l4 from '../assets/horzone/l4.webp'
import l5 from '../assets/horzone/l5.webp'
import l6 from '../assets/horzone/l6.webp'
import persona from '../assets/persona.webp'

/**
 * Logo e persona foram exportados no MESMO enquadramento (5504×3072).
 * Todas as medidas abaixo estão em px desse quadro — sobrepor = foto final (referencias/zone.jpg).
 * Gerado por scripts/slice-logo.mjs e scripts/crop-persona.mjs.
 */
export const FRAME = { w: 5504, h: 3072 }

export const LOGO = { x: 368, y: 608, w: 4808, h: 1852 }

/** x/w relativos ao início do logo. rot = giro inicial da queda. */
export const LETTERS = [
  { src: l0, x: 0, w: 616, rot: -14 },
  { src: l1, x: 720, w: 624, rot: 10 },
  { src: l2, x: 1444, w: 620, rot: -8 },
  { src: l3, x: 2152, w: 568, rot: 16 },
  { src: l4, x: 2800, w: 624, rot: -11 },
  { src: l5, x: 3528, w: 652, rot: 7 },
  { src: l6, x: 4288, w: 520, rot: -13 },
]

export const PERSONA = { src: persona, x: 1704, y: 175, w: 1995, h: 2897 }

/** parte visível da foto: da letra H à letra E (x) e do topo da cabeça à base (y) */
export const CONTEUDO = { x: LOGO.x, y: PERSONA.y, w: LOGO.w, h: FRAME.h - PERSONA.y }
