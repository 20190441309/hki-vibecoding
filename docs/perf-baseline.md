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

## P1+P2 更新（2026-07-26 晚）

- 移除 framer-motion 后首页 JS：**236.0 KB gzip**（P1 目标 ≤240KB 达成；全站单动效库 GSAP）
- 帘转场/后退不播帘/sticky footer/悬停浮图/404 均经无头浏览器验收（截图存档 scratchpad wow-*.png）
- 悬停浮图素材：6 张 960×640 JPEG（sips 压缩，共 ~700KB，仅桌面端预加载）
- Windows 中文衬线：采用临时方案 (c)——serif 栈显式回落 Microsoft YaHei；思源宋体标题子集化列 P2.5 待办

## P3 更新（2026-07-26 深夜）

- rehype 管线迁移完成（unified + remark-gfm + rehype-raw + Shiki），全部为构建期依赖，首页 JS 稳定在 **235.6 KB**
- 阅读页：三栏 sticky TOC（IO 高亮 + lenis.scrollTo 落位 -90px 实测精准）、CSS 滚动进度条、章节编号、首字下沉、datasheet 表格、代码块暖色高亮 + 复制按钮
- 项目区：↑↓/Enter 键盘导航实测通过；详情页 frontmatter 驱动 datasheet 参数表
- RSS：构建前置钩子生成 rss.xml（7 条），head 已挂 alternate；打印样式已加

## P4 更新（2026-07-26 收官）

- 暗色主题启用：ThemeToggle（--dark/--light）+ localStorage + prefers-color-scheme 默认 + 首帧防闪脚本；暗色下 Hero/文章/TOC/表格/进度条/毛玻璃导航全数走查通过
- creative 暖 CRT 区：#2a211b 底 + 扫描线 + boot 序列 + 三张 EXP datasheet 卡 + 插入符光标（cursor:none 仅 pointer:fine）+ ScrambleText hover
- mini shell 实测：help/ls/vibe/clear/sudo 彩蛋全部正确，`cd projects` 经帘转场真跳转；role="log"、聚焦才收键盘、Esc 退出
- creative 组件走路由级代码分割，不进首页 bundle（首页 JS 不变）

## 其余验收项

- 对比度：`node scripts/contrast-audit.mjs` 全部 PASS（21/21，见 docs/contrast-audit.md）
- JetBrains Mono：可变字重 400-700 拉丁子集单文件 31KB（优于规格预估 90KB），`document.fonts.check` 验证通过
- 噪点层：128×128 预染 PNG（13KB），opacity 0.05，无 blend-mode
- 视觉回归：首页/guide/creative 截图对照——除正文 18px/1.9 与噪点外无差异（存档于会话 scratchpad p0-*.png）
- 控制台：无错误
- reduced-motion：Lenis 关闭 / 终端直出 / 磁吸关闭 / 转场纯 opacity（DevTools 模拟验证）
