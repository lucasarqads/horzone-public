// Remove fundo preto sólido de uma foto recortada (sem canal alfa útil).
// O cabelo escuro pode ter pixels tão pretos quanto o fundo, então não dá para separar só por cor:
//  1. marca como "pessoa" tudo que não é preto;
//  2. FECHA pequenas falhas (dilata e depois encolhe) — une os fios de cabelo;
//  3. preenche buracos internos (só é fundo o preto ligado às bordas da imagem);
//  4. encolhe a borda e suaviza, para não sobrar contorno escuro sobre fundo claro.
// Uso: node scripts/remove-fundo-preto.mjs <entrada.png> <saida.png> [largura-final] [altura-final]
//      variáveis opcionais: LIMIAR (preto), FECHAMENTO (px), EROSAO (px)
import sharp from 'sharp'

const [entrada, saida, larguraFinal = '5504', alturaFinal = '3072'] = process.argv.slice(2)
const LIMIAR = Number(process.env.LIMIAR ?? 18) // max(r,g,b) <= LIMIAR conta como preto
const FECHAMENTO = Number(process.env.FECHAMENTO ?? 7) // raio que une falhas entre fios
const EROSAO = Number(process.env.EROSAO ?? 2) // px tirados da borda final

const { data, info } = await sharp(entrada).removeAlpha().raw().toBuffer({ resolveWithObject: true })
const { width: W, height: H } = info
const N = W * H

const mascaraSharp = (buf) => sharp(buf, { raw: { width: W, height: H, channels: 1 } })
// o sharp devolve 3 canais após operações; a máscara precisa de 1
const paraBuffer = (s) => s.extractChannel(0).raw().toBuffer()

// 1. não-preto = pessoa
const base = Buffer.alloc(N)
for (let i = 0; i < N; i++) base[i] = Math.max(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]) > LIMIAR ? 255 : 0

// 2. fechamento morfológico
// ATENÇÃO: neste sharp, erode(n) AUMENTA áreas brancas e dilate(n) as ENCOLHE (convenção invertida)
const dilatada = await paraBuffer(mascaraSharp(base).erode(FECHAMENTO))
const fechada = await paraBuffer(mascaraSharp(dilatada).dilate(FECHAMENTO))

// 3. fundo = preto ligado às bordas (flood fill); o resto (incluindo buracos internos) é pessoa
const fundo = new Uint8Array(N)
const fila = new Int32Array(N)
let ini = 0
let fim = 0
const semear = (i) => {
  if (!fundo[i] && fechada[i] < 128) {
    fundo[i] = 1
    fila[fim++] = i
  }
}
for (let x = 0; x < W; x++) {
  semear(x)
  semear((H - 1) * W + x)
}
for (let y = 0; y < H; y++) {
  semear(y * W)
  semear(y * W + W - 1)
}
while (ini < fim) {
  const i = fila[ini++]
  const x = i % W
  if (x > 0) semear(i - 1)
  if (x < W - 1) semear(i + 1)
  if (i >= W) semear(i - W)
  if (i < W * (H - 1)) semear(i + W)
}
const mascara = Buffer.alloc(N)
for (let i = 0; i < N; i++) mascara[i] = fundo[i] ? 0 : 255

// 4. encolhe a borda e suaviza
const mascaraSuave = await paraBuffer(mascaraSharp(mascara).dilate(EROSAO).blur(1.1))

const rgba = Buffer.alloc(N * 4)
for (let i = 0; i < N; i++) {
  rgba[i * 4] = data[i * 3]
  rgba[i * 4 + 1] = data[i * 3 + 1]
  rgba[i * 4 + 2] = data[i * 3 + 2]
  rgba[i * 4 + 3] = mascaraSuave[i]
}
await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
  .resize(Number(larguraFinal), Number(alturaFinal), { fit: 'fill', kernel: 'lanczos3' })
  .png()
  .toFile(saida)

const pessoa = mascara.reduce((s, v) => s + (v ? 1 : 0), 0)
console.log(`ok · ${W}×${H} → ${larguraFinal}×${alturaFinal} · pessoa ${((100 * pessoa) / N).toFixed(1)}% da imagem`)
