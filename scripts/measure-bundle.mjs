// 首页引用 JS 的 gzip 总量：npm run build 后运行 node scripts/measure-bundle.mjs
// 红线 270KB（P0 基线 263.2KB + 7KB，见 docs/perf-baseline.md；原 130KB 系规格误设——React+Next 地板即 ~150KB）
import { readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'

const html = readFileSync('out/index.html', 'utf8')
const srcs = [...html.matchAll(/src="(\/_next\/[^"]+\.js)"/g)].map((m) => m[1])
let total = 0
for (const s of [...new Set(srcs)]) {
  const gz = gzipSync(readFileSync(`out${s}`)).length
  total += gz
  console.log(`${(gz / 1024).toFixed(1).padStart(7)} KB  ${s}`)
}
console.log(`TOTAL ${(total / 1024).toFixed(1)} KB gzip（红线 270KB）`)
if (total > 270 * 1024) process.exit(1)
