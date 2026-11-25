// Gera o fundo do Repertório para telas deitadas a partir da imagem horizontal 3840×2160:
//  - desktop (16:9) e iPad deitado (recorte 4:3 centrado no pódio).
// Telas em pé usam referencias/repertorio-bg-retrato.png (versão vertical enviada pelo usuário).
import sharp from 'sharp'

const src = process.argv[2] ?? 'referencias/repertorio-bg-fonte.png'
const CX = 1920 // centro do pódio no original

await sharp(src).resize({ width: 2560 }).webp({ quality: 84 }).toFile('src/assets/repertorio-bg-desktop.webp')
await sharp(src)
  .extract({ left: CX - 1440, top: 0, width: 2880, height: 2160 })
  .resize({ width: 2048 })
  .webp({ quality: 84 })
  .toFile('src/assets/repertorio-bg-tablet-l.webp')
console.log('ok')
