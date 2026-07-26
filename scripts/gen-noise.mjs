// 生成 128x128 灰度颗粒 RGBA PNG（零依赖，手写 PNG 编码）
// 运行：node scripts/gen-noise.mjs
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'

const W = 128
const H = 128

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
const crc32 = (buf) => {
  let c = 0xffffffff
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
const chunk = (type, data) => {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

// 固定种子保证产物可复现（Date/Math.random 不进产物）
let seed = 42
const rand = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff

// 每行前置 filter byte 0；像素 = 深/浅颗粒 + 随机低 alpha（预染，运行时纯 opacity 叠加）
const raw = Buffer.alloc(H * (1 + W * 4))
for (let y = 0; y < H; y++) {
  const row = y * (1 + W * 4) + 1
  for (let x = 0; x < W; x++) {
    const v = rand() < 0.5 ? 20 : 245
    const a = Math.floor(rand() * 255)
    raw.writeUInt8(v, row + x * 4)
    raw.writeUInt8(v, row + x * 4 + 1)
    raw.writeUInt8(v, row + x * 4 + 2)
    raw.writeUInt8(a, row + x * 4 + 3)
  }
}

const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(W, 0)
ihdr.writeUInt32BE(H, 4)
ihdr.writeUInt8(8, 8) // bit depth
ihdr.writeUInt8(6, 9) // color type RGBA

mkdirSync('public/textures', { recursive: true })
writeFileSync(
  'public/textures/noise.png',
  Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
)
console.log('public/textures/noise.png written')
