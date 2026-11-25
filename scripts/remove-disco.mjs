// Gera os fundos do Repertório SEM o disco e SEM a sombra dele (o disco agora é desenhado embaixo
// da logo, no fim do funil). Preenche cada área linha a linha, interpolando entre as cores à esquerda
// e à direita (o fundo é um degradê suave), suaviza e mescla com borda esfumada.
import sharp from 'sharp'

async function semDisco(src, areas, saida, { extrair, largura } = {}) {
  let img = sharp(src).removeAlpha()
  if (extrair) img = img.extract(extrair)
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
  const { width: W, height: H } = info
  const out = Buffer.from(data)
  const mascara = Buffer.alloc(W * H)

  for (const a of areas) {
    const x0 = Math.round(a.x0 * W), x1 = Math.round(a.x1 * W)
    const y0 = Math.round(a.y0 * H), y1 = Math.round(a.y1 * H)
    const amostra = Math.max(4, Math.round(W * 0.006))
    for (let y = y0; y <= y1; y++) {
      const media = (xa, xb) => {
        const c = [0, 0, 0]
        let n = 0
        for (let x = Math.max(0, xa); x <= Math.min(W - 1, xb); x++, n++)
          for (let k = 0; k < 3; k++) c[k] += data[(y * W + x) * 3 + k]
        return c.map((v) => v / Math.max(1, n))
      }
      const esq = media(x0 - amostra * 2, x0 - amostra)
      const dir = media(x1 + amostra, x1 + amostra * 2)
      for (let x = x0; x <= x1; x++) {
        const t = (x - x0) / Math.max(1, x1 - x0)
        for (let k = 0; k < 3; k++) out[(y * W + x) * 3 + k] = Math.round(esq[k] * (1 - t) + dir[k] * t)
        mascara[y * W + x] = 255
      }
    }
  }

  // suaviza a área preenchida e mescla com borda esfumada
  const sigma = Math.max(3, W * 0.006)
  const suave = await sharp(out, { raw: { width: W, height: H, channels: 3 } }).blur(sigma).raw().toBuffer()
  const borda = await sharp(mascara, { raw: { width: W, height: H, channels: 1 } })
    .blur(sigma * 1.5)
    .extractChannel(0)
    .raw()
    .toBuffer()
  const final = Buffer.alloc(W * H * 3)
  for (let i = 0; i < W * H; i++) {
    const a = borda[i] / 255
    for (let k = 0; k < 3; k++) final[i * 3 + k] = Math.round(data[i * 3 + k] * (1 - a) + suave[i * 3 + k] * a)
  }
  let r = sharp(final, { raw: { width: W, height: H, channels: 3 } })
  if (largura) r = r.resize({ width: largura })
  await r.webp({ quality: 84 }).toFile(saida)
  console.log('ok', saida)
}

// imagem horizontal 3840×2160: disco (x 38.7–61.3%, y 63.6–70.7%) e sombra (x 34.5–65.5%, y 83.5–88%)
const HORIZONTAL = 'referencias/repertorio-bg-fonte.png'
const areasH = [
  { x0: 0.37, x1: 0.63, y0: 0.615, y1: 0.725 },
  { x0: 0.325, x1: 0.675, y0: 0.82, y1: 0.895 },
]
await semDisco(HORIZONTAL, areasH, 'src/assets/repertorio-bg-desktop.webp', { largura: 2560 })
// iPad deitado: recorte 4:3 centrado (2880 de 3840) → frações de x reescaladas
const ajustaX = (v) => (v * 3840 - 480) / 2880
await semDisco(
  HORIZONTAL,
  areasH.map((a) => ({ ...a, x0: ajustaX(a.x0), x1: ajustaX(a.x1) })),
  'src/assets/repertorio-bg-tablet-l.webp',
  { extrair: { left: 480, top: 0, width: 2880, height: 2160 }, largura: 2048 },
)
// imagem vertical 1600×2948: disco (x 29–71%, y 79–83.6%) e sombra (x 18–82%, y 89–95%)
await semDisco(
  'referencias/repertorio-bg-retrato.png',
  [
    { x0: 0.27, x1: 0.73, y0: 0.775, y1: 0.85 },
    { x0: 0.16, x1: 0.84, y0: 0.885, y1: 0.955 },
  ],
  'src/assets/repertorio-bg-retrato.webp',
  { largura: 1200 },
)
