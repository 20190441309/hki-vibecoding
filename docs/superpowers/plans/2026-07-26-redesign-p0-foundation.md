# P0 地基阶段 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 落地「终端杂志」重构的全局地基——设计 token、对比度体系、字体加载、噪点层、动效单时钟、reduced-motion、无障碍与包体积基线——全程除正文排版与噪点外零视觉回归。

**Architecture:** 全部改动集中在 globals.css（token/字体/焦点态）、layout.js（skip-link/噪点/字体 preload/MotionProvider）、三个现有动效组件的内部升级；新增两个构建期脚本（对比度核算、噪点生成）与一个体积测量脚本。不新增运行时依赖。

**Tech Stack:** Next.js 16 静态导出、CSS Modules + 原生 CSS 变量、Lenis 1.3 / GSAP 3.15 / framer-motion 12（LazyMotion 化）、Node 内置模块写构建脚本（零新依赖）。

## Global Constraints

- `output: 'export'` 纯静态，一切方案不得依赖服务端
- 动画只允许 `transform` / `opacity` / `clip-path`
- 不引入 Tailwind/Sass/运行时 UI 库/three.js
- 中文字体零下载；本阶段唯一下载字体为 JetBrains Mono Latin 子集 400+700（~90KB）
- 小字号（≤14px）文字色对比度必须 ≥4.5:1（WCAG AA）
- 首页 JS gzip 总量红线 ≤130KB
- 暗色 token 本阶段**只定义不启用**（不接 prefers-color-scheme，ThemeToggle 在 P4）
- 本阶段允许的视觉变化仅两项：正文 18px/1.9、全站噪点纹理；其余页面必须与改动前截图一致
- 动手改路由/布局相关代码前先读 `node_modules/next/dist/docs/01-app/` 对应章节

---

### Task 1: 对比度核算脚本与色值定稿

**Files:**
- Create: `scripts/contrast-audit.mjs`
- Create: `docs/contrast-audit.md`（脚本产出）

**Interfaces:**
- Produces: 定稿色值 `--accent-terracotta-text: #a8492a`（预核算 5.2:1，脚本复核）；后续任务的 token 定义引用本任务结论

- [ ] **Step 1: 写核算脚本**

```js
// scripts/contrast-audit.mjs — WCAG 对比度核算，node scripts/contrast-audit.mjs
import { writeFileSync } from 'node:fs'

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
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
  // [用途, 前景, 背景组, 最小字号场景, 要求]
  ['正文/次级', '#5e5d59', LIGHT_BG, '小字', 4.5],
  ['三级灰(仅装饰/大字)', '#87867f', LIGHT_BG, '大字', 3.0],
  ['陶土红(仅≥22px装饰)', '#c96442', LIGHT_BG, '大字', 3.0],
  ['深陶土(小字强调)', '#a8492a', LIGHT_BG, '小字', 4.5],
  ['主文字', '#141413', LIGHT_BG, '小字', 4.5],
  ['暗色主文字', '#ece7df', DARK_BG, '小字', 4.5],
  ['暗色次级', '#b8b0a4', DARK_BG, '小字', 4.5],
  ['暗色陶土(大字)', '#d97757', DARK_BG, '大字', 3.0],
]

let md = '# 对比度核算表（P0）\n\n由 `scripts/contrast-audit.mjs` 生成，改色后必须重跑。\n\n| 用途 | 前景 | 背景 | 比值 | 要求 | 结果 |\n|---|---|---|---|---|---|\n'
let fail = 0
for (const [use, fg, bgs, , min] of pairs)
  for (const bg of bgs) {
    const r = ratio(fg, bg)
    const ok = r >= min
    if (!ok) fail++
    md += `| ${use} | ${fg} | ${bg} | ${r.toFixed(2)}:1 | ≥${min}:1 | ${ok ? '✅' : '❌'} |\n`
    console.log(`${ok ? 'PASS' : 'FAIL'} ${use} ${fg} on ${bg} = ${r.toFixed(2)}:1`)
  }
writeFileSync('docs/contrast-audit.md', md)
if (fail) { console.error(`${fail} 项不达标`); process.exit(1) }
```

- [ ] **Step 2: 运行并确认全过**

Run: `node scripts/contrast-audit.mjs`
Expected: 全部 PASS，exit 0，产出 `docs/contrast-audit.md`。若 `#a8492a` 不达 4.5:1，逐步加深（`#9e4427` → `#943f24`）直到达标，并把定稿值同步进 Task 2 的 token。

- [ ] **Step 3: Commit**

```bash
git add scripts/contrast-audit.mjs docs/contrast-audit.md
git commit -m "feat(p0): add WCAG contrast audit script, finalize text-terracotta"
```

### Task 2: Token 体系扩展 + motion.js 常量库

**Files:**
- Modify: `src/app/globals.css`（`:root` 块扩展；删除 `scroll-behavior: smooth`；新增 focus-visible、::selection、.meta、暗色 token）
- Create: `src/lib/motion.js`

**Interfaces:**
- Produces: CSS 变量 `--space-1..8`、`--dur-fast/base/slow/reveal`、`--ease-out/inout`、`--z-content/nav/veil/noise`、`--text-label/body/h3/h2/h1/hero`、`--border-light`、`--accent-terracotta-text`、`--font-serif/body/mono`；JS 常量 `DUR = {fast:0.15, base:0.3, slow:0.6, reveal:0.9}`、`EASE = {out:[0.22,1,0.36,1], inout:[0.76,0,0.24,1]}`、`STAGGER = 0.08`。P1+ 所有组件引用这些名字。

- [ ] **Step 1: globals.css 的 `:root` 追加 token（在现有颜色 token 之后）**

```css
  /* 间距刻度 */
  --space-1: 4px;  --space-2: 8px;   --space-3: 16px; --space-4: 24px;
  --space-5: 40px; --space-6: 64px;  --space-7: 96px; --space-8: 160px;
  /* 动效签名（全站唯一来源，禁止散写数值） */
  --dur-fast: 150ms; --dur-base: 300ms; --dur-slow: 600ms; --dur-reveal: 900ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-inout: cubic-bezier(0.76, 0, 0.24, 1);
  /* z-index 刻度 */
  --z-content: 1; --z-nav: 100; --z-veil: 200; --z-noise: 300;
  /* 字号刻度 */
  --text-label: 13px; --text-body: 18px; --text-h3: 22px;
  --text-h2: clamp(28px, 3.5vw, 40px);
  --text-h1: clamp(36px, 5vw, 56px);
  --text-hero: clamp(44px, 8vw, 104px);
  /* 补充色 */
  --border-light: rgba(20, 20, 19, 0.08);
  --accent-terracotta-text: #a8492a; /* Task 1 定稿值 */
  /* 字体栈（§四） */
  --font-serif: Georgia, 'Times New Roman', 'Songti SC', STSong, 'Noto Serif CJK SC', serif;
  --font-body: -apple-system, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, Menlo, monospace;
```

- [ ] **Step 2: 同文件追加暗色 token（只定义，不接 media query）、focus-visible、selection、.meta 工具类；删除 `scroll-behavior: smooth` 一行**

```css
:root[data-theme='dark'] {
  --bg-parchment: #221a14; --bg-ivory: #2a211b; --bg-warm-sand: #33281f;
  --text-primary: #ece7df; --text-secondary: #b8b0a4; --text-tertiary: #8a8175;
  --accent-terracotta: #d97757;
  --border-cream: rgba(236, 231, 223, 0.08);
  --border-warm: rgba(236, 231, 223, 0.12);
  --border-light: rgba(236, 231, 223, 0.06);
  color-scheme: dark;
}

::selection { background: var(--accent-terracotta); color: var(--bg-ivory); }

:focus-visible {
  outline: 2px solid var(--accent-terracotta);
  outline-offset: 2px;
}

.meta {
  font-family: var(--font-mono);
  font-size: var(--text-label);
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  text-transform: uppercase;
}
.meta em { color: var(--accent-terracotta-text); font-style: normal; }
```

- [ ] **Step 3: 创建 src/lib/motion.js**

```js
// 动效常量唯一来源，与 globals.css 的 --dur-* / --ease-* 保持同值
export const DUR = { fast: 0.15, base: 0.3, slow: 0.6, reveal: 0.9 }
export const EASE = { out: [0.22, 1, 0.36, 1], inout: [0.76, 0, 0.24, 1] }
export const STAGGER = 0.08
```

- [ ] **Step 4: 验证**

Run: `npm run build`
Expected: 构建通过。浏览器打开首页与 guide 页：视觉与改动前一致（token 只定义未消费）；锚点点击变为瞬时跳转（scroll-behavior 移除的预期变化，P3a 换 lenis.scrollTo）。

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/lib/motion.js
git commit -m "feat(p0): design tokens, dark palette (defined), focus-visible, motion constants"
```

### Task 3: JetBrains Mono 加载

**Files:**
- Create: `public/fonts/jbm-latin-400.woff2`、`public/fonts/jbm-latin-700.woff2`（下载）
- Modify: `src/app/globals.css`（文件顶部加 @font-face ×2）
- Modify: `src/app/layout.js`（head 内 preload 400）

**Interfaces:**
- Produces: `font-family: 'JetBrains Mono'` 可用（经 `--font-mono` 引用），unicode-range 限拉丁+箭头+box-drawing，汉字自动回落系统黑体

- [ ] **Step 1: 下载 latin 子集 woff2**

```bash
mkdir -p public/fonts
UA="Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/120 Safari/537.36"
CSS=$(curl -s -A "$UA" "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap")
# 从返回 CSS 中取 latin 子集块（各字重最后一个 latin 块）的 woff2 URL 分别存为 400/700
echo "$CSS" | grep -A5 'latin' | grep -o 'https://[^)]*woff2' | head -20  # 人工比对挑出 400 与 700 的 latin URL
curl -s -o public/fonts/jbm-latin-400.woff2 "<400 的 latin URL>"
curl -s -o public/fonts/jbm-latin-700.woff2 "<700 的 latin URL>"
ls -la public/fonts/  # 两个文件各约 40-50KB；若 >60KB 说明抓错了非子集版本
```

- [ ] **Step 2: globals.css 顶部加 @font-face**

```css
@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/jbm-latin-400.woff2') format('woff2');
  font-weight: 400;
  unicode-range: U+0000-00FF, U+2010-2027, U+2190-21FF, U+2500-257F;
  font-display: swap;
  size-adjust: 104%;
}
@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/jbm-latin-700.woff2') format('woff2');
  font-weight: 700;
  unicode-range: U+0000-00FF, U+2010-2027, U+2190-21FF, U+2500-257F;
  font-display: swap;
  size-adjust: 104%;
}
```

- [ ] **Step 3: layout.js 的 `<html>` 内加 preload（Next 16 metadata 不管 preload，直接在 layout JSX 的 head 用法：在 RootLayout 返回的 `<html>` 里加 `<head>` 子节点是允许的）**

```jsx
<head>
  <link rel="preload" href="/fonts/jbm-latin-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
</head>
```

- [ ] **Step 4: 验证**

Run: `npm run build`，起本地服务，浏览器执行 `document.fonts.check('13px "JetBrains Mono"')`
Expected: `true`；Network 面板确认 woff2 从本站加载且仅在页面含拉丁 mono 文字时请求。

- [ ] **Step 5: Commit**

```bash
git add public/fonts src/app/globals.css src/app/layout.js
git commit -m "feat(p0): load JetBrains Mono latin subset with unicode-range"
```

### Task 4: 噪点层

**Files:**
- Create: `scripts/gen-noise.mjs`
- Create: `public/textures/noise.png`（脚本产出，128×128 RGBA）
- Create: `src/components/NoiseOverlay.js`、`src/components/NoiseOverlay.module.css`
- Modify: `src/app/layout.js`（body 内挂载）

**Interfaces:**
- Produces: `<NoiseOverlay />` 无 props 服务端组件；`--z-noise` 层、`pointer-events: none`、纯 opacity 无 blend-mode

- [ ] **Step 1: 写噪点生成脚本（node 内置 zlib 手写 PNG，零依赖）**

```js
// scripts/gen-noise.mjs — 生成 128x128 灰度颗粒 RGBA PNG
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'

const W = 128, H = 128
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
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type), data])
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}
// 每行前置 filter byte 0；像素：黑或白颗粒 + 随机低 alpha
const raw = Buffer.alloc(H * (1 + W * 4))
let seed = 42
const rand = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff
for (let y = 0; y < H; y++) {
  const row = y * (1 + W * 4) + 1
  for (let x = 0; x < W; x++) {
    const v = rand() < 0.5 ? 20 : 245        // 深/浅颗粒（预染，不需 blend-mode）
    const a = Math.floor(rand() * 255)        // 随机透明度，整层再乘 0.05
    raw.writeUInt8(v, row + x * 4); raw.writeUInt8(v, row + x * 4 + 1)
    raw.writeUInt8(v, row + x * 4 + 2); raw.writeUInt8(a, row + x * 4 + 3)
  }
}
const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4)
ihdr.writeUInt8(8, 8); ihdr.writeUInt8(6, 9) // 8bit RGBA
mkdirSync('public/textures', { recursive: true })
writeFileSync('public/textures/noise.png', Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0)),
]))
console.log('public/textures/noise.png written')
```

- [ ] **Step 2: 运行生成**

Run: `node scripts/gen-noise.mjs && file public/textures/noise.png`
Expected: 输出 PNG image data, 128 x 128, 8-bit/color RGBA。

- [ ] **Step 3: 组件**

```jsx
// src/components/NoiseOverlay.js（服务端组件，无 'use client'）
import styles from './NoiseOverlay.module.css'

export default function NoiseOverlay() {
  return <div className={styles.noise} aria-hidden="true" />
}
```

```css
/* src/components/NoiseOverlay.module.css */
.noise {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: var(--z-noise);
  background-image: url('/textures/noise.png');
  background-repeat: repeat;
  opacity: 0.05;
}
```

- [ ] **Step 4: layout.js 的 `<body>` 首子节点挂 `<NoiseOverlay />`；验证**

Run: `npm run build` + 本地起服，截图对比改动前
Expected: 全站可感知的细腻纸感颗粒（放大截图可见噪点），滚动流畅无掉帧。

- [ ] **Step 5: Commit**

```bash
git add scripts/gen-noise.mjs public/textures src/components/NoiseOverlay.js src/components/NoiseOverlay.module.css src/app/layout.js
git commit -m "feat(p0): pre-rendered grain overlay, opacity-only (no blend-mode)"
```

### Task 5: 动效单时钟 + reduced-motion

**Files:**
- Modify: `src/components/SmoothScroll.js`（重写内部）
- Modify: `src/components/TerminalTyping.js`（reduced-motion 直出全文）
- Modify: `src/components/Magnetic.js`（reduced-motion 不做磁吸）

**Interfaces:**
- Produces: Lenis 与 GSAP ScrollTrigger 共用一个 ticker（P1 起一切滚动动效的前提）；`(prefers-reduced-motion: reduce)` 下 Lenis 关闭、打字直出、磁吸关闭

- [ ] **Step 1: SmoothScroll.js 重写**

```jsx
'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
```

- [ ] **Step 2: TerminalTyping.js——组件顶部检测，命中时静态渲染完整 script**

```jsx
// useEffect 外新增 state：
const [reduced, setReduced] = useState(false)
useEffect(() => {
  setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
}, [])
// 打字 useEffect 首行：if (reduced) return
// 渲染分支：reduced 时 lines 用完整 script 渲染、无光标
```

- [ ] **Step 3: Magnetic.js——useEffect 首行加 `if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return`**

- [ ] **Step 4: 验证**

Run: `npm run build` + 本地起服
Expected: 正常模式滚动平滑如前、磁吸如前、终端打字如前；DevTools Rendering 面板开 `prefers-reduced-motion: reduce` 后刷新——原生滚动、终端直出全文、磁吸无位移。

- [ ] **Step 5: Commit**

```bash
git add src/components/SmoothScroll.js src/components/TerminalTyping.js src/components/Magnetic.js
git commit -m "feat(p0): Lenis-GSAP single clock, reduced-motion branches"
```

### Task 6: LazyMotion 化

**Files:**
- Create: `src/components/MotionProvider.js`
- Modify: `src/app/layout.js`（body 内容包一层）
- Modify: `src/components/PageTransition.js`（motion → m，useReducedMotion）
- Modify: `src/components/Footer.js`（motion → m）

**Interfaces:**
- Produces: 全站 framer-motion 走 `LazyMotion strict + m`；此后任何组件禁用 `motion.*`（strict 模式会 throw，作为纪律）

- [ ] **Step 1: MotionProvider**

```jsx
'use client'

import { LazyMotion, domAnimation } from 'framer-motion'

export default function MotionProvider({ children }) {
  return <LazyMotion features={domAnimation} strict>{children}</LazyMotion>
}
```

- [ ] **Step 2: layout.js 中 `<SmoothScroll>` 外（或内）包 `<MotionProvider>`；PageTransition.js 与 Footer.js 把 `import { motion }` 改为 `import { m }`、`motion.div/footer` 改 `m.div/footer`；PageTransition 加 `useReducedMotion()`——reduced 时 initial/animate/exit 全部只留 opacity、duration 0.15**

```jsx
// PageTransition.js 关键段
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { DUR, EASE } from '@/lib/motion'
// ...
const reduced = useReducedMotion()
const variants = reduced
  ? { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: DUR.fast } }, exit: { opacity: 0, transition: { duration: DUR.fast } } }
  : { initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE.out } },
      exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: EASE.out } } }
```

- [ ] **Step 3: 验证**

Run: `npm run build` + 本地起服
Expected: 路由切换过渡与页脚入场动画行为不变；控制台无 strict 模式报错。

- [ ] **Step 4: Commit**

```bash
git add src/components/MotionProvider.js src/app/layout.js src/components/PageTransition.js src/components/Footer.js
git commit -m "perf(p0): LazyMotion strict + m components"
```

### Task 7: skip-link + 正文排版参数

**Files:**
- Modify: `src/app/layout.js`（body 首子节点 skip-link，main 加 id）
- Modify: `src/app/globals.css`（skip-link 样式）
- Modify: `src/components/MarkdownRenderer.module.css`（正文 18px/1.9）

**Interfaces:**
- Produces: `#main` 锚点；`.skipLink` 全局类

- [ ] **Step 1: layout.js `<body>` 第一个可聚焦元素 + main id**

```jsx
<a href="#main" className="skipLink">跳到正文</a>
{/* ... */}
<main id="main">
```

- [ ] **Step 2: globals.css**

```css
.skipLink {
  position: fixed;
  top: -100%;
  left: var(--space-3);
  z-index: calc(var(--z-noise) + 1);
  padding: var(--space-2) var(--space-3);
  background: var(--accent-terracotta);
  color: var(--bg-ivory);
  border-radius: var(--radius-sm);
}
.skipLink:focus-visible { top: var(--space-3); }
```

- [ ] **Step 3: MarkdownRenderer.module.css——`.content p` 与 `.content li` 的字号行高改 `font-size: var(--text-body); line-height: 1.9;`（.content 自身 16px 声明同步改 18px）**

- [ ] **Step 4: 验证**

Run: 本地起服，键盘 Tab 第一次
Expected: 「跳到正文」浮现，Enter 后焦点落正文区；guide 页正文明显更舒展（这是本阶段允许的视觉变化）。

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.js src/app/globals.css src/components/MarkdownRenderer.module.css
git commit -m "feat(p0): skip-to-content link, 18px/1.9 CJK body typography"
```

### Task 8: 体积基线与验收

**Files:**
- Create: `scripts/measure-bundle.mjs`
- Create: `docs/perf-baseline.md`

**Interfaces:**
- Produces: `npm run build` 后可复跑的体积测量；`docs/perf-baseline.md` 记录 P0 基线，后续阶段对照

- [ ] **Step 1: 测量脚本**

```js
// scripts/measure-bundle.mjs — 首页引用 JS 的 gzip 总量
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
console.log(`TOTAL ${(total / 1024).toFixed(1)} KB gzip（红线 130KB）`)
if (total > 130 * 1024) process.exit(1)
```

- [ ] **Step 2: 跑完整验收**

Run: `npm run build && node scripts/measure-bundle.mjs && node scripts/contrast-audit.mjs`
Expected: 三者全过。把 TOTAL 数字与逐 chunk 清单写入 `docs/perf-baseline.md`（含日期、commit hash）。

- [ ] **Step 3: 截图对照清单**

对首页、guide、tools、projects、creative 五页各截整页图，与改动前对照：除正文排版与噪点外无差异。存档路径写进 `docs/perf-baseline.md`。

- [ ] **Step 4: Commit + push**

```bash
git add scripts/measure-bundle.mjs docs/perf-baseline.md
git commit -m "chore(p0): bundle size baseline and acceptance record"
git push
```
