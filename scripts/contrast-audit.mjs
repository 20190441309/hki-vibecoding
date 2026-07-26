// WCAG 对比度核算：node scripts/contrast-audit.mjs（改色后必须重跑）
import { writeFileSync } from 'node:fs'

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (fg, bg) => {
  const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x)
  return (a + 0.05) / (b + 0.05)
}

const LIGHT_BG = ['#f5f4ed', '#faf9f5', '#e8e6dc']
const DARK_BG = ['#221a14', '#2a211b']
const pairs = [
  ['正文/次级', '#5e5d59', LIGHT_BG, 4.5],
  ['三级灰(仅装饰/大字)', '#82817a', LIGHT_BG, 3.0], // P0 定稿：原 #87867f 在 warm-sand 上 2.92:1 不达标
  ['陶土红(仅≥22px装饰)', '#c96442', LIGHT_BG, 3.0],
  ['深陶土(小字强调)', '#a8492a', LIGHT_BG, 4.5],
  ['主文字', '#141413', LIGHT_BG, 4.5],
  ['暗色主文字', '#ece7df', DARK_BG, 4.5],
  ['暗色次级', '#b8b0a4', DARK_BG, 4.5],
  ['暗色陶土(大字)', '#d97757', DARK_BG, 3.0],
]

let md =
  '# 对比度核算表（P0）\n\n由 `scripts/contrast-audit.mjs` 生成，改色后必须重跑。\n\n| 用途 | 前景 | 背景 | 比值 | 要求 | 结果 |\n|---|---|---|---|---|---|\n'
let fail = 0
for (const [use, fg, bgs, min] of pairs)
  for (const bg of bgs) {
    const r = ratio(fg, bg)
    const ok = r >= min
    if (!ok) fail++
    md += `| ${use} | ${fg} | ${bg} | ${r.toFixed(2)}:1 | ≥${min}:1 | ${ok ? '✅' : '❌'} |\n`
    console.log(`${ok ? 'PASS' : 'FAIL'} ${use} ${fg} on ${bg} = ${r.toFixed(2)}:1`)
  }
writeFileSync('docs/contrast-audit.md', md)
if (fail) {
  console.error(`${fail} 项不达标`)
  process.exit(1)
}
