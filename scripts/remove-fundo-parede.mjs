// Remove um fundo de parede neutra (branco → cinza, com degradê de sombra) de um retrato sem transparência.
// "Cresce" o fundo a partir das bordas da imagem: aceita o vizinho se ele for neutro (pouca saturação)
// e parecido com o pixel atual (degradê suave). Para no contorno da pessoa, onde a cor muda bruscamente.
// Uso: node scripts/remove-fundo-parede.mjs <entrada> <saida.png>
//      variáveis opcionais: SATURACAO (máx. r/g/b − mín.), PASSO (diferença entre vizinhos), CLARO_MIN, EROSAO (px)
import sharp from 'sharp'

const [entrada, saida] = process.argv.slice(2)
const SATURACAO = Number(process.env.SATURACAO ?? 22)
const PASSO = Number(process.env.PASSO ?? 9)
// ATENÇÃO: neste sharp, dilate(n) ENCOLHE áreas brancas em n px e erode(n) as AUMENTA (convenção invertida).
const EROSAO = Number(process.env.EROSAO ?? 2) // px tirados da borda
const DEFRANJA = Number(process.env.DEFRANJA ?? 6) // faixa (px) da borda cuja cor é refeita a partir do interior
const CLARO_MIN = Number(process.env.CLARO_MIN ?? 85) // parede nunca é mais escura que isso (dobras escuras da roupa ficam)

const { data, info } = await sharp(entrada).removeAlpha().raw().toBuffer({ resolveWithObject: true })
const { width: W, height: H } = info
const N = W * H
const neutro = (i) => {
  const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2]
  return Math.max(r, g, b) >= CLARO_MIN && Math.max(r, g, b) - Math.min(r, g, b) <= SATURACAO
}
// quase branco e neutro: sempre é parede (inclui o brilho claro que o filtro da foto deixa no contorno)
const quaseBranco = (i) => {
  const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2]
  return Math.min(r, g, b) >= 200 && Math.max(r, g, b) - Math.min(r, g, b) <= 18
}
const parecido = (a, b) =>
  Math.abs(data[a * 3] - data[b * 3]) <= PASSO &&
  Math.abs(data[a * 3 + 1] - data[b * 3 + 1]) <= PASSO &&
  Math.abs(data[a * 3 + 2] - data[b * 3 + 2]) <= PASSO

const fundo = new Uint8Array(N)
const fila = new Int32Array(N)
let ini = 0
let fim = 0
const marcar = (i) => {
  fundo[i] = 1
  fila[fim++] = i
}
for (let x = 0; x < W; x++) {
  for (const i of [x, (H - 1) * W + x]) if (!fundo[i] && neutro(i)) marcar(i)
}
for (let y = 0; y < H; y++) {
  for (const i of [y * W, y * W + W - 1]) if (!fundo[i] && neutro(i)) marcar(i)
}
while (ini < fim) {
  const i = fila[ini++]
  const x = i % W
  const viz = []
  if (x > 0) viz.push(i - 1)
  if (x < W - 1) viz.push(i + 1)
  if (i >= W) viz.push(i - W)
  if (i < N - W) viz.push(i + W)
  for (const j of viz) if (!fundo[j] && ((neutro(j) && parecido(i, j)) || quaseBranco(j))) marcar(j)
}

const mascara = Buffer.alloc(N)
for (let i = 0; i < N; i++) mascara[i] = fundo[i] ? 0 : 255
const paraBuffer = (s) => s.extractChannel(0).raw().toBuffer()
const suave = await paraBuffer(
  sharp(mascara, { raw: { width: W, height: H, channels: 1 } }).dilate(EROSAO).blur(1) // dilate = encolhe (ver nota acima),
)

// tira a "franja" clara: na faixa junto à borda, a cor vira a média das cores do interior da pessoa
// (convolução normalizada: blur(cor × interior) / blur(interior)), sem o branco da parede misturado
const interior = await paraBuffer(sharp(mascara, { raw: { width: W, height: H, channels: 1 } }).dilate(DEFRANJA)) // encolhe a máscara: o "miolo" da pessoa
const corInterior = Buffer.alloc(N * 3)
for (let i = 0; i < N; i++) {
  const k = interior[i] > 127 ? 1 : 0
  corInterior[i * 3] = data[i * 3] * k
  corInterior[i * 3 + 1] = data[i * 3 + 1] * k
  corInterior[i * 3 + 2] = data[i * 3 + 2] * k
}
const sigma = DEFRANJA * 0.9
const somaCor = await sharp(corInterior, { raw: { width: W, height: H, channels: 3 } }).blur(sigma).raw().toBuffer()
const somaPeso = await paraBuffer(sharp(interior, { raw: { width: W, height: H, channels: 1 } }).blur(sigma))

const rgba = Buffer.alloc(N * 4)
for (let i = 0; i < N; i++) {
  const naFaixa = mascara[i] && interior[i] <= 127 && somaPeso[i] > 4
  for (let c = 0; c < 3; c++) {
    rgba[i * 4 + c] = naFaixa ? Math.min(255, Math.round((somaCor[i * 3 + c] * 255) / somaPeso[i])) : data[i * 3 + c]
  }
  rgba[i * 4 + 3] = suave[i]
}
await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).png().toFile(saida)
const pessoa = mascara.reduce((s, v) => s + (v ? 1 : 0), 0)
console.log(`ok · ${W}×${H} · pessoa ${((100 * pessoa) / N).toFixed(1)}%`)
