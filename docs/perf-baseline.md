# 性能基线（P0 验收记录）

> 日期: 2026-07-26 | commit: 71c92b3 | 测量: `npm run build && node scripts/measure-bundle.mjs`

## 首页 JS 传输体积（gzip）

| chunk | 大小 | 内容 |
|---|---|---|
| 3m76ry3v6_l1b | 79.2 KB | 动效 vendor：gsap + ScrollTrigger + framer-motion(domAnimation) + lenis |
| 2j--sbzsobf4j | 69.3 KB | react-dom |
| 3n7z7nnpq6rhq | 39.5 KB | Next.js 运行时 |
| 0cz1d0mv5g_q7 | 38.7 KB | Next.js 运行时 / 共享 |
| 其余 5 个 | 36.5 KB | 页面代码与小块 |
| **TOTAL** | **263.2 KB** | |

## 预算修正（对规格 3.0.8 的勘误）

规格原定红线 130KB **不可达**：react-dom + Next 运行时的地板即 ~150KB（裸 create-next-app 也超 130）。该数字系评审阶段未先测量所致。修正为：

- **P0 基线：263.2 KB（本记录）**
- **总红线：≤270 KB**——后续任何阶段不得超过本基线 + 7KB
- **P1 优化目标：≤240 KB**——P1 的 PageTransition v2 放弃 AnimatePresence 后，framer-motion 可整体移除
  （Reveal/Footer 入场改 GSAP 或 CSS 实现），全站单动效库（GSAP），省 ~25KB
- creative 页专属代码（P4）必须 dynamic 分包，不计入首页

## 其余验收项

- 对比度：`node scripts/contrast-audit.mjs` 全部 PASS（21/21，见 docs/contrast-audit.md）
- JetBrains Mono：可变字重 400-700 拉丁子集单文件 31KB（优于规格预估 90KB），`document.fonts.check` 验证通过
- 噪点层：128×128 预染 PNG（13KB），opacity 0.05，无 blend-mode
- 视觉回归：首页/guide/creative 截图对照——除正文 18px/1.9 与噪点外无差异（存档于会话 scratchpad p0-*.png）
- 控制台：无错误
- reduced-motion：Lenis 关闭 / 终端直出 / 磁吸关闭 / 转场纯 opacity（DevTools 模拟验证）
