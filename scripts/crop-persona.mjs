// Recorta horzone-persona.png pelo bbox do alfa e exporta WebP (mantém o enquadramento 5504×3072 como referência).
import sharp from 'sharp';
const src = process.argv[2] ?? 'referencias/horzone-persona.png';
const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
let x0 = W, y0 = H, x1 = 0, y1 = 0;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (data[(y * W + x) * 4 + 3] > 10) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
const w = x1 - x0 + 1, h = y1 - y0 + 1;
console.log(JSON.stringify({ W, H, x: x0, y: y0, w, h }));
await sharp(src).extract({ left: x0, top: y0, width: w, height: h }).resize({ width: 1400 }).webp({ quality: 86, alphaQuality: 90 }).toFile('src/assets/persona.webp');
