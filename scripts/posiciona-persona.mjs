// Coloca um recorte de retrato (PNG com transparência) no quadro 5504×3072 da foto da Horzone:
// topo da pessoa em TOPO, base cortada no fim do quadro, centro horizontal em CX.
// Uso: node scripts/posiciona-persona.mjs <recorte.png> <saida.png>
import sharp from 'sharp'

const [src, saida] = process.argv.slice(2)
const TOPO = Number(process.env.TOPO ?? 175)
const BASE = 3072
const CX = Number(process.env.CX ?? 2700)

const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true })
const { width: W, height: H } = info
let x0 = W, x1 = 0, y0 = H
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++)
    if (data[(y * W + x) * 4 + 3] > 40) {
      if (x < x0) x0 = x
      if (x > x1) x1 = x
      if (y < y0) y0 = y
    }

const s = (BASE - TOPO) / (H - y0)
const nw = Math.round(W * s), nh = Math.round(H * s)
const img = await sharp(src).resize(nw, nh, { kernel: 'lanczos3' }).png().toBuffer()
const left = Math.round(CX - ((x0 + x1) / 2) * s), top = Math.round(TOPO - y0 * s)
const cl = Math.max(0, -left), ct = Math.max(0, -top)
const vw = Math.min(nw - cl, 5504 - Math.max(0, left)), vh = Math.min(nh - ct, 3072 - Math.max(0, top))
const parte = await sharp(img).extract({ left: cl, top: ct, width: vw, height: vh }).png().toBuffer()
await sharp({ create: { width: 5504, height: 3072, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite([{ input: parte, left: Math.max(0, left), top: Math.max(0, top) }])
  .png()
  .toFile(saida)
console.log('ok', { escala: s.toFixed(3), left, top })
