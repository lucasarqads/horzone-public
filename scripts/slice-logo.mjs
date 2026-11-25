// Corta o logo HORZONE em letras individuais (WebP, fundo transparente).
import sharp from 'sharp';
const src = process.argv[2] ?? 'referencias/horzone-logo.png';
const out = 'src/assets/horzone';
const img = sharp(src).ensureAlpha();
const { data, info } = await img.clone().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
// "tinta" = pixel azul (não branco, não transparente)
const ink = (x, y) => { const i = (y * W + x) * C; const [r, g, b, a] = [data[i], data[i+1], data[i+2], data[i+3]]; return a > 40 && b - r > 60; };
const cols = []; let y0 = H, y1 = 0;
for (let x = 0; x < W; x++) { let any = false; for (let y = 0; y < H; y++) if (ink(x, y)) { any = true; if (y < y0) y0 = y; if (y > y1) y1 = y; } cols.push(any); }
const runs = []; let s = -1;
cols.forEach((v, x) => { if (v && s < 0) s = x; if (!v && s >= 0) { runs.push([s, x - 1]); s = -1; } });
if (s >= 0) runs.push([s, W - 1]);
console.log({ W, H, y0, y1, runs });
// pixels de tinta → azul puro; fundo → transparente
const rgba = Buffer.alloc(W * H * 4);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = (y * W + x) * C, o = (y * W + x) * 4; const a = data[i+3] > 40 ? Math.max(0, Math.min(255, (data[i+2] - data[i]) * 255 / 190)) : 0; rgba[o]=4; rgba[o+1]=80; rgba[o+2]=230; rgba[o+3]=a; }
const base = sharp(rgba, { raw: { width: W, height: H, channels: 4 } });
const meta = [];
for (const [i, [a, b]] of runs.entries()) {
  const w = b - a + 1, h = y1 - y0 + 1;
  await base.clone().extract({ left: a, top: y0, width: w, height: h }).webp({ quality: 92, alphaQuality: 100 }).toFile(`${out}/l${i}.webp`);
  meta.push({ w, h, gap: i ? a - runs[i-1][1] - 1 : 0 });
}
console.log(JSON.stringify(meta));
