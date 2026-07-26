# HKI's VibeCoding — Awwwards 级 UI 重构规划

> 版本: v2.0（已经过可行性评审并修订）| 日期: 2026-07-26 | 状态: 待选定方向后执行
>
> 产出方式：7 智能体工作流——4 个研究员（个人作品集 / 年度趋势 / 动效模式 / 编辑部内容站四视角，共调研 32 个获奖与标杆站点）+ 1 个代码审计员 + 1 个设计总监合成 + 1 个可行性批评者。批评者提出的 12 个问题与 8 个遗漏项已全部修订进本文。

## 硬约束

- Next.js `output: 'export'` 纯静态，无服务端
- CSS Modules + 原生 CSS 变量；不引入 Tailwind/Sass/运行时 UI 库
- 已装 Lenis 1.3 / GSAP 3.15（ScrambleText、SplitText 已免费内置）/ framer-motion 12
- 保留陶土红 + 羊皮纸色系的品牌底色
- 中文站不可全量加载中文 webfont（体积数 MB 级）
- 动手前按 AGENTS.md 要求先读 `node_modules/next/dist/docs/` 中路由与静态导出相关章节

## 现状核心问题（摘自代码审计）

Hero 无记忆点、卡片是 AI 模板脸、排版层级扁平、除 Footer 外零滚动入场、五个内容页是 Markdown 倾倒、无动效/间距 token、无暗色、无 reduced-motion、JetBrains Mono 声明了却从未加载、无 404 页。

---

## 一、三个设计方向

### 方向 A：「暖纸书房」（Book-as-Website 编辑部）

| 维度 | 方案 |
|---|---|
| 一句话概念 | 把整个站做成一本可翻阅的中文「数字书」：封面、章节、序言、边注、页码俱全，动效克制到几乎不可见，全部表现力交给排版与纸的质感。 |
| 参照获奖站 | Poor Charlie's Almanack（Awwwards SOTD，双色纪律 + 章节侧栏）、Lynn Fisher 2025 平装书版、Daylight（暖纸 + 单点缀色）、Exo Ape（逐行遮罩文字）、Quanta / gwern.net（边注 + 阅读装置） |
| 字体排印 | 衬线大标题 × 系统黑体正文 × 少量 mono 页码；正文 18px / 行高 1.9 / 版心约 34em；标点悬挂 + 着重号 |
| 色彩 | 保留陶土红，执行双色纪律：只出现在链接、当前章节、着重号三处 |
| 标志性动效 | 仅两种：逐行遮罩文字升起、图片 clip-path 揭示；外加全站纸纹噪点层 |
| 改动量 | 中 |
| 风险 | 「安静」过头，缺 3 秒记忆点；vibe coding 的技术人格不可见，主题与皮囊脱节 |

### 方向 B：「终端杂志」（衬线编辑部 × 等宽工程附录，双人格系统）★推荐

| 维度 | 方案 |
|---|---|
| 一句话概念 | 一本印在羊皮纸上的杂志，但每一处元数据、每一次转场、每一个彩蛋都是终端语言——「书房里的一台旧终端」，站点自身就是 vibe coding 的证明。 |
| 参照获奖站 | Gianluca Gradogna（SOTD，双身份双字体）、basement.studio（衬线大标题 × mono 元数据 + 噪点）、Obys（编号系统 + hover 字体瞬切）、p5aholic（Monospaced 主题）、U.S. Graphics / Departure Mono（datasheet 美学）、Exo Ape（逐行遮罩）、Brittany Chiang（阅读架构 + colophon）、Trionn（Lenis/GSAP 单时钟地基） |
| 字体排印 | 三层分工：衬线管标题引块（Georgia + 系统宋体 + 标题子集字体兜底 Windows）、系统黑体管正文、真加载的 JetBrains Mono（拉丁子集）管编号/日期/标签/代码/命令；字号对比拉悬殊（13px mono 标签 vs 8vw 衬线标题） |
| 色彩 | 陶土红为唯一点缀色（链接/hover/编号/关键数值）；新增「暖暗色」映射（深褐底琥珀字）；创意实验区独立暖 CRT 色板 |
| 标志性动效 | 一套动效签名：逐行遮罩为唯一文字入场；转场 = 陶土红帘上 mono 打出目标路径 `~/projects`；导航 hover 衬线瞬切 mono；终端区 boot 序列 + 可玩 mini shell |
| 改动量 | 中大，但全部复用现有三件动效库与组件骨架 |
| 风险 | 双人格的「度」需设计判断（mono 过量吃掉编辑部气质）；终端彩蛋有工时黑洞倾向（需锁 scope） |

### 方向 C：「磁场剧场」（Snellenberg 派高互动个人秀）

| 维度 | 方案 |
|---|---|
| 一句话概念 | 全套 2021 后获奖个人站「公共词汇」的高完成度执行：preloader、SVG 曲线帘转场、悬停跟随浮图、sticky footer reveal、自定义语义光标、Flip 共享元素转场。 |
| 参照获奖站 | Dennis Snellenberg（范式定义者）、REJOUICE（光标即界面）、K72（方向感知 marquee）、Podium（Flip 共享元素转场） |
| 字体排印 | 维持 Georgia + 一款拉丁展示字体，排版不是主角 |
| 色彩 | 陶土红作帘幕/浮层/光标主色，出现频率显著提高 |
| 改动量 | 大。转场架构、光标状态机、浮图系统都是新造 |
| 风险 | 最高。这套词汇已模板化（教程生态导致辨识度稀释）；App Router 静态导出下 exit 动画有已知坑；动效喧宾夺主，长文读者是受害者 |

**三者差异**：A 押注排版与安静，B 押注「主题自证」的双人格系统，C 押注交互密度。分别对应「读者优先 / 身份优先 / 观感优先」。

---

## 二、推荐方向：B「终端杂志」

1. **主题自证**。一个讲 vibe coding 的站，转场打出 shell 路径、页脚署名「与 Claude 结对写成」、实验区能敲命令，本身就是最强的内容。A 丢掉这个人格，C 的词汇与主题无关。
2. **与内容结构匹配**。站点 80% 是万字长文与对比表，B 的基底仍是编辑部排版，mono 只做元数据层——长文可读性不受损，这是 C 做不到的。
3. **与现有资产匹配**。TerminalTyping、MagneticField、陶土红、Georgia、Lenis/GSAP/framer-motion 全部原地升级复用。
4. **差异化安全**。「羊皮纸 × 终端」的对撞在参照库里没有现成同款；C 的全套技法已是模板。
5. **改动量可控**。四条工作线可独立提交验收，无单点风险。

方向 A 的 CJK 排版地基不作为独立方向落地，而是作为 B 的 P0 全量吸收。

---

## 三、实施级规格（方向 B）

### 3.0 全局设计系统

#### 3.0.1 Token 扩展（globals.css）

```css
:root {
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
  --text-label: 13px;   /* mono 标签（评审修订：12px 中文偏小且对比度难达标） */
  --text-body: 18px;
  --text-h3: 22px;
  --text-h2: clamp(28px, 3.5vw, 40px);
  --text-h1: clamp(36px, 5vw, 56px);
  --text-hero: clamp(44px, 8vw, 104px);

  /* 新增边框与文字色（评审修订） */
  --border-light: rgba(20, 20, 19, 0.08);
  --accent-terracotta-text: #a8492a; /* 小字号(≤14px)专用深陶土，实测对比度 ≥4.5:1 后方可定稿 */
}
```

- 动效纪律：全站动画只允许 `transform` / `opacity` / `clip-path`。
- JS 侧建 `src/lib/motion.js` 导出同一组常量（`DUR`, `EASE`, `STAGGER = 0.08`），framer-motion / GSAP 共用。
- **对比度核算表（P0 第一件事，评审 high）**：对所有「颜色 × 字号」组合列表核算 WCAG AA。已知问题：`--text-tertiary #87867f`（3.3:1）与 `--accent-terracotta #c96442`（3.5:1）不得用于 ≤14px 正文性文字；`.meta` 默认色用 `--text-secondary`（约 7:1），小字号强调用 `--accent-terracotta-text`，装饰性大号数字才用原陶土红。

#### 3.0.2 暖暗色映射（评审修订：补全 token，延后开启）

```css
:root[data-theme="dark"] {
  --bg-parchment: #221a14;  --bg-ivory: #2a211b;  --bg-warm-sand: #33281f;
  --text-primary: #ece7df;  --text-secondary: #b8b0a4;  --text-tertiary: #8a8175;
  --accent-terracotta: #d97757;
  --border-cream: rgba(236, 231, 223, 0.08);  --border-warm: rgba(236, 231, 223, 0.12);
  --border-light: rgba(236, 231, 223, 0.06);
  color-scheme: dark; /* 表单控件/滚动条 */
}
::selection { background: var(--accent-terracotta); color: var(--bg-ivory); }
```

- **Rollout（评审修订）**：P0 只落变量定义，**不接** `prefers-color-scheme`；P4 做 ThemeToggle 时一并开启（避免系统深色用户提前看到半成品暗色）。首帧防闪烁脚本（`<head>` 内联，同时给 `<html>` 加 `.js` class——见 3.0.6）写进 `layout.js`。
- TerminalTyping 硬编码的 `#1a1a18/#242320` 改读暗色 token。

#### 3.0.3 噪点层（评审修订：去 blend-mode）

新增 `NoiseOverlay` 组件挂 `layout.js`：噪点纹理**构建期预染成带米色底的半透明 PNG**（feTurbulence 生成、128px 平铺、导出时叠好底色），运行时只用 `opacity: 0.05`，**不用 mix-blend-mode**（评审：blend-mode 全屏层在低端 Android 上掉滚动帧率）。暗色版单独一张预染纹理 `opacity: 0.03`。静态噪点，不做 steps() 跳动。

#### 3.0.4 动效地基（Trionn 单时钟）

`SmoothScroll.js`：

```js
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((t) => lenis.raf(t * 1000))
gsap.ticker.lagSmoothing(0)
```

- **删除 globals.css 的 `scroll-behavior: smooth`（评审修订：与 Lenis 冲突）**；页内锚点统一走 `lenis.scrollTo`（含 sticky nav 高度偏移补偿）；带 `#hash` 直达页面时在 Lenis 初始化后手动定位一次。
- `prefers-reduced-motion`：`gsap.matchMedia()` 分支——文字入场改纯 opacity 300ms、Lenis 回原生滚动、marquee 静止、终端打字直出全文；framer-motion 侧 `useReducedMotion()` 同步。

#### 3.0.5 mono 元数据系统

凡是**编号、日期、标签、字数、路径、快捷键提示、页码**一律 JetBrains Mono 13px / `letter-spacing: 0.08em` / `--text-secondary` 色；编号（`01` `EXP-003`）用 `--accent-terracotta-text`（小字）或陶土红（≥22px 装饰数字）。

```css
.meta { font-family: var(--font-mono); font-size: var(--text-label);
  letter-spacing: 0.08em; color: var(--text-secondary); text-transform: uppercase; }
.meta em { color: var(--accent-terracotta-text); font-style: normal; }
```

#### 3.0.6 唯一文字入场组件 Reveal（评审修订：LCP 保护）

framer-motion 实现（不引 SplitText 省包体；中文按行 `display:block` 手动分行或整块单行）：

- 结构：外层 `overflow: hidden`，内层 `y: '100%' → 0`；`duration: 0.9s`、`ease: EASE.out`、多行 `stagger: 0.08`、`useInView({ once: true, margin: '-10%' })`。
- **LCP 保护（评审 high）**：初始隐藏态 CSS 仅在 `html.js` 下生效（`.js` class 由 head 内联脚本第一行添加，与主题防闪脚本合并）——no-JS/爬虫/JS 失败时标题完整可见。**首屏 Hero 标题与各页 H1 不等 IntersectionObserver**，用纯 CSS animation 立即播放；仅视口外元素走 useInView。
- 用途白名单：Hero 标题、页面 H1、阅读页 H2、索引列表行、页脚大字。**正文段落永远不动。**

#### 3.0.7 页面转场重做 PageTransition v2（评审修订：补导航拦截机制）

现有 transform 祖先杀死 sticky，且 App Router 下 AnimatePresence exit 不可靠（需 FrozenRouter hack）——**明确放弃 AnimatePresence exit 路线**。机制规格：

- 新增 `TransitionLink` 组件包装 `next/link`：点击 → `preventDefault` → 播「盖帘」（300ms）→ `router.push` → 新页挂载后播「掀帘」。全站站内链接（Nav/IndexList/卡片/页脚）替换为 TransitionLink。
- 用 `template.js` 保证每次导航重挂载并播入场（页面本体只做 `opacity: 0 → 1` 300ms，**不套 transform**，完成后移除内联 style——sticky 由此解锁）。
- 帘层：独立 `fixed` 层（`z-index: var(--z-veil)`）陶土红色块 `clip-path: inset(0 0 100% 0) → inset(0) → inset(100% 0 0 0)`，单程 300ms、总时长 ≤600ms；帘中央 mono 白字打出目标路径 `~ /projects`（路径→中文名映射表写死在组件里）。
- **浏览器前进/后退（popstate 无法拦截）：不播帘，降级为 150ms 纯 opacity。**
- reduced-motion：帘退化为 150ms 纯 opacity。
- 验收（评审修订）：任意路由互跳帘效果正确 ≤600ms；**浏览器后退/前进不卡帘、不重复播帘**；转场后 sticky 元素可用（用临时 sticky div 验证）。

#### 3.0.8 无障碍与包体积纪律（评审新增）

- **skip-to-content**：`layout.js` 首个可聚焦元素为「跳到正文」链接（视觉隐藏、聚焦显形），长文站键盘用户必备。
- `:focus-visible`：2px 陶土红 outline + 2px offset，全站统一。
- **JS 体积预算**：P0 记录首页 gzip 传输体积基线，红线 ≤130KB；framer-motion 全站改 `LazyMotion` + `m` 组件（省约 15KB）；creative 专属代码（ScrambleText/shell/boot/CRT 光标）一律 `next/dynamic` 按路由分包。CWV 预算：LCP <2.5s（中端 Android + Fast 4G）、CLS <0.1。

### 3.1 导航（Nav 升级，不重写）

- 保留滚动感知毛玻璃与汉堡结构。
- 链接 hover：衬线瞬切 JetBrains Mono + 前缀 `./` 淡入（两层 span 叠放切 opacity）；移除现有下划线动效避免双重反馈。
- 当前路由指示：链接前置 mono 编号 `01–05`，当前项编号用深陶土。
- 移动端菜单：`AnimatePresence` + `clip-path inset` 展开 300ms，菜单项逐行升起 stagger 0.06。

### 3.2 首页 Hero（重写 Hero.js）

- `100svh`，左对齐。
- 主标题：衬线 `var(--text-hero)`、字重 500、行高 1.05、两行文案（如「把想法说给 AI 听，/ 然后一起把它写成。」），Reveal 立即播放（不等 IO）。
- kicker：`.meta` 一行 `HKI · VIBE CODING · EST. 2025`。
- 标题下 mono 命令打字：`$ vibe --with claude`——从 TerminalTyping 抽出的轻量版 `TypeLine`（单行、播一次、█ 光标 `steps(2)` 闪烁；**首帧输出确定性内容防水合不匹配**）。
- 证据行：`.meta` 排 `N 篇指南 · N 个项目 · N 万字`，数字衬线 22px 陶土红；数据从 `lib/content.js` 构建时统计，不手写。
- CTA：陶土红实底按钮「从指南读起」套 Magnetic（补内外双层偏移：外层 `pos*0.35`、内层文字再偏移一半）。
- 右下角 `.meta` 本地时间 `LOCAL 21:36 GMT+8`（**mounted 后再渲染，首帧占位**）；左下角 `scroll ↓`。

### 3.3 首页卡片区（CardGrid → IndexList 索引列表）

- 每行：`01`（mono 深陶土）+ 栏目名（衬线 `clamp(28px, 4vw, 44px)`）+ 右侧 `.meta`（`4 篇 · 2026-07` + `↗`）；行间 1px `--border-light`，上下 padding `--space-4`。
- hover：兄弟行降 opacity 0.4（`ul:hover li:not(:hover)`）；当前行 `translateX(12px)` + 栏目名变陶土红，`--dur-fast --ease-out`。
- 桌面端（`pointer: fine`）：悬停浮出 240×160 预览图跟随光标（`useMotionValue` + `useSpring({ damping: 20, stiffness: 300 })`）；预览图构建期静态资源，**首次 hover 前预加载 + decode**；移动端不挂载该组件。
- 入场：行作为 Reveal 目标 stagger 0.08。Card/CardGrid 文件位置保留改内部实现，删 emoji 图标与「了解更多 ->」。

### 3.4 页脚（Footer → sticky reveal + 转化位）

- Sticky footer reveal：footer `position: sticky; bottom: 0; z-index: 0`，主内容 `z-index: var(--z-content)`——**依赖 3.0.7 去掉祖先 transform，顺序不可颠倒**。
- 顶边 marquee：陶土红底米白 mono 字循环 vibe coding 口头禅；纯 CSS 双份内容 `translateX(-50%)` 20s 循环，**第二份 `aria-hidden="true"`（评审修订）**；桌面端 `timeScale` 绑 Lenis velocity，移动端定速。
- 主体：超大衬线「一起来 Vibe Coding」`clamp(40px, 8vw, 96px)` Reveal 入场 + 陶土红圆形磁性 CTA「写信给我」。
- 状态行：`.meta`「正在写：xxx / 可约聊：是」。
- colophon：`.meta`「Georgia 排版 · Lenis 滚动 · Next.js 静态导出 · 与 Claude 结对写成」。
- 社交链接改真实 URL。

### 3.5 长文阅读页（guide / workflow / tools / insights 共用模板）

**版式（评审修订断点）：**

- **≥1200px** 三栏 grid `[220px | minmax(0, 680px) | 180px]` + gap 实算；**1080–1200px 两栏**（TOC + 正文）；<1080px 单栏，TOC 收顶部折叠。
- 正文：18px / line-height 1.9 / 段间距 1em 无缩进 / 每行约 34–37 汉字。
- CJK 渐进增强：`hanging-punctuation: first allow-end`（仅 Safari）、`text-spacing-trim: space-all`（仅 Chromium）、构建期 pangu 式中西文间隙——均静默降级，见第五节基线表。
- 强调：Markdown `*强调*` → `<em class="dot">`，`text-emphasis: filled dot var(--accent-terracotta)`（着重号）。
- 页头去 emoji：`.meta` kicker `GUIDE / 01 · 约 25 分钟 · 2026-07` + 衬线 H1 左对齐 + hairline。
- 章节编号：H2 前置 mono `01 /`，H2 上 `--space-7` 下 `--space-4`，配 24px 陶土红短分隔线。
- 首章首字：`::first-letter` 2.2em 衬线陶土红下沉。

**阅读装置：**

- 左栏 sticky TOC：mono 13px 编号 + 章节名；当前章节深陶土 + 前置横线 12px→24px 伸长；IntersectionObserver 驱动。**锚点点击走 `lenis.scrollTo`（含 nav 偏移补偿）；`#hash` 直达在初始化后定位（评审修订）**。
- 顶部阅读进度条：3px 陶土红 `animation-timeline: scroll()`，不支持则无进度条。
- 文末方法论折叠：`:::method` 容器 → `<details>`，由内容管线转换。

**内容管线迁移（评审修订，P3a 首项）：**

现有「remark-html 输出后正则注入锚点」的后处理与 Shiki 的嵌套 span 输出互相踩踏。**P3a 把管线迁移为 `remark → remark-gfm → remark-rehype → rehype 插件链`**（锚点、章节编号、着重号、`:::method` 容器、代码块全部走 AST 插件），MarkdownRenderer 的 `dangerouslySetInnerHTML` 注入方式不变。迁移工作量 0.5–1 天计入 P3a。

**代码块（Josh Comeau 全套）：**

- Shiki 构建时高亮（rehype 插件，运行时 0 成本）；自定义暖色主题：底 `#2a211b`、注释 `#87867f`、字符串琥珀 `#d9a05b`、关键字陶土红。
- 文件名标签、行高亮（\`\`\`js {3-5}\`\`\`）、一键复制（事件委托挂 MarkdownRenderer）、diff 样式用于「好 prompt vs 坏 prompt」。

**表格（tools 对比页）：**

- mono 数据 + 1px 细边框高密度 datasheet 样式，关键数值深陶土；行 hover 兄弟变暗。
- 宽表 breakout：`width: min(880px, calc(100vw - 48px))` 居中 + overflow-x。

**动效边界：** 只有 H2 走 Reveal，正文、表格、代码块永远静止。

**配套（评审新增，各半小时级）：** `@media print`（去噪点/去动效/展开 details）；RSS 静态生成（构建脚本产出 `out/rss.xml`）。

### 3.6 项目列表与详情

**列表页：** 复用 IndexList：项目名衬线 + `.meta`（年份 · 技术栈 · `AI 参与度 80%`）+ 悬停跟随浮图。键盘导航：roving tabindex，`↑↓` 移动 `Enter` 进入，右下角 `.meta` 明示 `[↑↓] 选择 · [↵] 打开`。

**详情页：** 清除内联 style；页头 `.meta` kicker + 衬线标题 + datasheet 参数表（1px 边框两列：模型/工具链/耗时/结论/repo ↗，数据来自 frontmatter 补字段）；封面 `clip-path inset` 揭示 600ms + 滚动 ±20px 轻视差（移动端关视差留揭示）；全站截图统一暖滤镜 `sepia(8%) saturate(105%)`。内容按「背景 → 我与 AI 的分工 → 过程（含翻车）→ 结果」重写。

### 3.7 创意实验页（creative → 「工程附录」暖 CRT 区）

- 整页深褐 `#2a211b` 底、琥珀 `#e0b184` 字、陶土红强调，全页 mono；该页专属代码全部 `next/dynamic` 分包。
- CRT：`repeating-linear-gradient` 2px 扫描线 opacity 0.06（fixed 伪元素）+ 噪点加强 0.08。
- boot 序列：3 行逐行打印，播一次，reduced-motion 直出。
- 实验卡 → datasheet 卡：`EXP-001` 编号 + 参数行 + 内嵌可玩本体（MagneticField = EXP-001、TerminalTyping = EXP-002）。
- **mini shell（镇站之宝，约 150 行）**：命令表写死——`help` / `ls` / `cd projects` / `open guide`（`router.push` 真跳转）/ `vibe`（随机心得）/ `sudo rm -rf /`（彩蛋拒绝）。**a11y 规格（评审修订）：容器 `role="log"` + `aria-label="交互终端"`；只在获得焦点时监听键盘，Esc 退出焦点；不监听全局键盘。**
- 链接 hover scramble 落位（GSAP ScrambleTextPlugin，触屏自动失效）。
- 插入符光标（仅此页、仅 `pointer: fine`）：`cursor: none` + 12px mono █ fixed div 跟随，`steps(2)` 闪烁（评审修订：明确 cursor:none 防双光标）。

### 3.8 404 页（评审新增）

`not-found.js`（静态导出产出 `404.html`）：方向 B 的白送题材——mono 大字 `404: command not found`，下方 mini shell 提示 `试试：ls / cd ~ / open guide`（可复用 shell 组件或纯静态提示 + 链接）。列入 P1。

### 3.9 图片资产规范（评审新增）

`images.unoptimized` 下自建构建期管线：原图放 `assets/`，构建脚本（sharp）产出 WebP 两档（1x/2x）到 `public/images/`；所有 `<img>` 写死 `width/height` 或 `aspect-ratio` 占位防 CLS；悬停浮图首次 hover 前 `new Image()` 预加载 + `decode()`。

---

## 四、中文字体策略

原则：**不下载任何全量中文字体**。

1. **中文正文**：系统黑体栈，零下载。
   `--font-body: -apple-system, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;`
2. **标题衬线 + Windows 修正（评审 medium，已修订）**：
   `--font-serif: Georgia, "Times New Roman", "Songti SC", STSong, "Noto Serif CJK SC", serif;`
   Windows 无可用中文衬线（SimSun 单字重、大字发虚），**采用方案 (a)：思源宋体标题子集化提为 P2 必做**——用 cn-font-split 按 Hero + 各页 H1 + IndexList 栏目名实际用字（约 60–100 字）子集化 SemiBold，产物 <60KB 仅标题层引用，`font-display: swap`。内容更新流程中「新增页面标题」需重跑子集脚本（写进 package.json scripts）。
3. **等宽（品牌字体，必须真加载）**：JetBrains Mono woff2，Latin 子集 400 + 700，合计约 90KB，`public/fonts/` + preload：
   ```css
   @font-face {
     font-family: 'JetBrains Mono';
     src: url('/fonts/jbm-latin-400.woff2') format('woff2');
     unicode-range: U+0000-00FF, U+2010-2027, U+2190-21FF, U+2500-257F;
     font-display: swap; size-adjust: 104%;
   }
   ```
4. **可选增强（P4.5）**：Fraunces variable（Latin ~60KB）替换 Georgia 拉丁部分，hero 数字/英文获得 wght 轴滚动渐变；不引入则跳过对应动效。

---

## 五、浏览器支持基线（评审新增）

目标基线：**Chrome/Edge/Safari 近两年 + Firefox ESR + 微信内置浏览器（X5/XWeb）**。

| 特性 | 支持情况 | 降级行为（均为预期，非 bug） |
|---|---|---|
| `100svh` | 现代浏览器 | 老 X5 回退 `100vh`（写两行） |
| `animation-timeline: scroll()` | Chromium | 无阅读进度条 |
| `hanging-punctuation` | 仅 Safari | 无标点悬挂 |
| `text-spacing-trim` | 仅 Chromium | 无标点挤压 |
| `text-emphasis` | 全绿 | — |
| `clip-path` 动画 | 全绿 | — |
| `position: sticky` | 全绿（X5 需实测） | P2 验收含微信真机 |
| `backdrop-filter` | 全绿（X5 部分） | 毛玻璃退纯色半透明 |

**各阶段验收必须包含：桌面 Chrome/Safari/Firefox + iOS Safari + 微信内置浏览器（Android X5）真机走查。**

---

## 六、分阶段实施（评审修订：P3 拆分、估期 +30% buffer、验收可判定）

| 阶段 | 内容 | 规格节 | 预估 | 验收标准 |
|---|---|---|---|---|
| **P0 地基** | 对比度核算表；token 扩展；单时钟 + 删 scroll-behavior；reduced-motion 分支；focus-visible + skip-link；JetBrains Mono；CJK 正文参数；NoiseOverlay（预染 PNG）；LazyMotion 改造；体积基线记录 | 3.0.1–3.0.5、3.0.8、四 | 1.5–2 天 | 除正文排版参数与噪点外无视觉回归（附前后截图对照清单）；Lighthouse a11y ≥95 且对比度零告警；首页 gzip ≤130KB 基线入档 |
| **P1 转场与导航** | Reveal（含 .js class LCP 保护）；TransitionLink + template.js 帘转场；Nav hover 瞬切与编号；移动端菜单动画；404 页 | 3.0.6、3.0.7、3.1、3.8 | 2–2.5 天 | 路由互跳帘 ≤600ms；**后退/前进不卡帘不重播**；转场后 sticky 可用；no-JS 下所有标题可见；reduced-motion 全降级；404.html 产出正确 |
| **P2 首页与页脚** | Hero 重写（含标题子集字体管线）；IndexList + 浮图（含预加载）；sticky footer + marquee + colophon；OG 卡与 favicon 换新 | 3.2–3.4、四.2 | 2.5–3 天 | 首屏 3 秒记忆点自查；**中端 Android + Fast 4G 下 LCP <2.5s**；Windows Chrome 标题衬线正常（子集字体生效）；footer 掀纸三浏览器 + 微信一致；移动端浮图不挂载 |
| **P3a 阅读版式** | rehype 管线迁移；三栏 TOC（lenis.scrollTo + hash 直达）；进度条；章节编号/着重号/首字/kicker；print 样式 | 3.5 前半 | 2–2.5 天 | 万字 guide 滚读 60fps（中端真机）；TOC 高亮/锚点/hash 直达全对；1080–1200px 无横向溢出；管线迁移后现有内容渲染零回归 |
| **P3b 代码块与项目区** | Shiki 暖主题 + 复制/行高亮/文件名标签；datasheet 表格；项目 IndexList + 键盘导航；详情页 datasheet + 封面揭示；图片管线；RSS | 3.5 后半、3.6、3.9 | 2–2.5 天 | 代码块四件套可用；`↑↓ Enter` 全键盘走通且读屏可用；图片零 CLS |
| **P4 实验区与主题** | creative 暖 CRT 化（dynamic 分包）；mini shell（a11y 规格）；scramble；插入符光标；ThemeToggle + 暗色开启（全量 token） | 3.7、3.0.2 | 2–2.5 天 | shell 六命令可用、Esc 退出、不劫持全局键盘；暗色全站走查（含代码块/终端/图片滤镜/selection）；creative JS 不进首页 bundle |
| **P4.5 可选** | Fraunces wght 轴；全站 Monospaced 主题彩蛋 | 四.4 | 1–2 天 | 独立开关，砍掉不影响前序 |

**总计：12.5–15 天**（原稿 9.5–12.5 天，评审 +30% buffer 后取整）。

**新增依赖：** `shiki`/`@shikijs/rehype`、`remark-rehype` + `rehype-stringify`（管线迁移）、`cn-font-split`（构建期）、`sharp`（构建期图片）、JetBrains Mono woff2 ×2（~90KB）、思源宋体标题子集（<60KB）。
**明确不引入：** three.js、Tailwind/Sass、View Transitions API、任何运行时 UI 库。

---

## 七、评审记录

可行性批评者提出 12 项问题（3 high / 6 medium / 3 low）与 8 项遗漏，全部处置如下：转场机制补 TransitionLink 规格（3.0.7）、对比度体系重定（3.0.1/3.0.5）、Reveal LCP 保护（3.0.6）、Windows 衬线取方案 a（四.2）、噪点去 blend-mode（3.0.3）、暗色 token 补全并延后开启（3.0.2）、管线迁移 rehype（3.5）、包体积纪律（3.0.8）、P3 拆分与估期修正（六）、断点算术修正（3.5）、scroll-behavior/水合冲突（3.0.4/3.2）、动效 a11y 细节（3.4/3.7）；遗漏项 404（3.8）、图片规范（3.9）、skip-link（3.0.8）、国内浏览器矩阵与基线表（五）、OG/favicon（P2）、TOC hash 规格（3.5）、print/RSS（3.5）全部入规格。

## 八、灵感来源索引（32 站）

**个人作品集**：Dennis Snellenberg、p5aholic（Keita Yamada）、Bruno Simon、Lynn Fisher、Henry Heffernan、Elliott Mangham、Gianluca Gradogna、Brittany Chiang
**年度与趋势**：Lando Norris（2025 SOTY）、Messenger、Louis Paquet、Daylight、by-kin、Obys、Mat Voyce、Departure Mono
**动效模式**：Dondre Green、Trionn、Podium、Exo Ape、basement.studio、REJOUICE、K72
**内容/编辑部**：Poor Charlie's Almanack（Stripe Press）、gwern.net、The Pudding、Quanta、Josh Comeau、The Type、U.S. Graphics
