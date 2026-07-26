# HKI VibeCoding 个人主页 — 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 搭建一个以 Claude 暖色调为视觉风格的个人 vibecoding 经验主页，包含首页总览卡片和 Markdown 驱动的详情页。

**架构：** Next.js 14 App Router，Markdown 内容存储在 `content/` 目录中，使用 CSS Modules 管理样式，gray-matter + remark 渲染 Markdown。

**技术栈：** Next.js 14+ (App Router)、CSS Modules、gray-matter、remark、Vercel 部署

---

## 文件结构

```
Hki-vibecoding/
├── content/
│   ├── workflow.md
│   ├── tools.md
│   ├── insights.md
│   ├── creative.md
│   └── projects/
│       ├── project-1.md
│       ├── project-2.md
│       └── project-3.md
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   ├── layout.js
│   │   ├── page.js
│   │   ├── page.module.css
│   │   ├── globals.css
│   │   ├── workflow/page.js
│   │   ├── workflow/page.module.css
│   │   ├── tools/page.js
│   │   ├── insights/page.js
│   │   ├── creative/page.js
│   │   ├── projects/page.js
│   │   └── projects/[slug]/page.js
│   ├── components/
│   │   ├── Nav.js
│   │   ├── Nav.module.css
│   │   ├── Hero.js
│   │   ├── Hero.module.css
│   │   ├── CardGrid.js
│   │   ├── CardGrid.module.css
│   │   ├── Card.js
│   │   ├── Card.module.css
│   │   ├── Footer.js
│   │   ├── Footer.module.css
│   │   ├── MarkdownRenderer.js
│   │   └── MarkdownRenderer.module.css
│   └── lib/
│       └── content.js
├── next.config.js
├── package.json
└── README.md
```

---

### 任务 1：初始化 Next.js 项目 + 安装依赖

**文件：**

- 创建：`Hki-vibecoding/`（项目根目录，已存在）
- 创建：`package.json`
- 创建：`next.config.js`
- 创建：`jsconfig.json`

- [ ] **步骤 1：初始化 Next.js 项目**

运行以下命令创建 Next.js 项目：

```bash
cd E:/hki/Hki-vibecoding
npx create-next-app@latest . --js --app --no-tailwind --src-dir --import-alias "@/*" --eslint --no-turbopack --yes
```

选择默认选项（JavaScript + App Router）。

- [ ] **步骤 2：安装额外依赖**

```bash
cd E:/hki/Hki-vibecoding
npm install gray-matter remark remark-html
```

- [ ] **步骤 3：创建 README.md**

```markdown
# HKI's VibeCoding

个人 vibecoding（AI 辅助开发）经验主页。

## 技术栈

- Next.js 14 (App Router)
- CSS Modules
- Markdown + gray-matter + remark
- Vercel 部署
```

- [ ] **步骤 4：将 `src/` 目录结构改为计划中的布局**

```bash
cd E:/hki/Hki-vibecoding
mkdir -p src/app src/components src/lib content/projects content/images
```

- [ ] **步骤 5：Commit**

```bash
git init
git add .
git commit -m "chore: init Next.js project with dependencies"
```

---

### 任务 2：创建全局样式（Claude 配色体系）

**文件：**

- 修改：`src/app/globals.css`
- 创建：`src/app/layout.js`（根布局，包含 Nav + Footer）

- [ ] **步骤 1：编写全局样式**

写入 `src/app/globals.css`：

```css
/* Claude 暖色调配色体系 */
:root {
  --bg-parchment: #f5f4ed;
  --bg-ivory: #faf9f5;
  --bg-warm-sand: #e8e6dc;
  --accent-terracotta: #c96442;
  --accent-coral: #d97757;
  --text-primary: #141413;
  --text-secondary: #5e5d59;
  --text-tertiary: #87867f;
  --text-on-dark: #b0aea5;
  --border-cream: #f0eee6;
  --border-warm: #e8e6dc;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--bg-parchment);
  color: var(--text-primary);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a {
  color: var(--accent-terracotta);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

img {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-md);
}

::selection {
  background: var(--accent-terracotta);
  color: var(--bg-ivory);
}
```

- [ ] **步骤 2：创建根布局 layout.js**

```jsx
import '@/app/globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata = {
  title: "HKI's VibeCoding",
  description: '用 AI 加速开发，从想法到产品 — 记录我的 vibecoding 之旅',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **步骤 3：Commit**

```bash
git add src/app/globals.css src/app/layout.js
git commit -m "feat: add global styles with Claude color palette and root layout"
```

---

### 任务 3：创建 Nav 组件

**文件：**

- 创建：`src/components/Nav.js`
- 创建：`src/components/Nav.module.css`

- [ ] **步骤 1：编写 Nav 样式**

`src/components/Nav.module.css`：

```css
.nav {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 14px 32px;
  background: var(--bg-ivory);
  border-bottom: 1px solid var(--border-cream);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 18px;
  font-weight: 500;
  color: var(--text-primary);
  margin-right: auto;
  text-decoration: none;
  letter-spacing: -0.3px;
}

.logo:hover {
  text-decoration: none;
  opacity: 0.8;
}

.link {
  font-size: 14px;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 4px 0;
  position: relative;
}

.link:hover {
  color: var(--accent-terracotta);
  text-decoration: none;
}

.active {
  color: var(--text-primary);
  font-weight: 500;
}

.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent-terracotta);
  border-radius: 1px;
}
```

- [ ] **步骤 2：编写 Nav 组件**

`src/components/Nav.js`：

```jsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Nav.module.css'

const links = [
  { href: '/workflow', label: '工作流' },
  { href: '/tools', label: '工具' },
  { href: '/insights', label: '心得' },
  { href: '/projects', label: '项目' },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>⚡ HKI</Link>
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`${styles.link} ${pathname.startsWith(href) ? styles.active : ''}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
```

- [ ] **步骤 3：Commit**

```bash
git add src/components/Nav.js src/components/Nav.module.css
git commit -m "feat: add sticky nav component with active state"
```

---

### 任务 4：创建 Footer 组件

**文件：**

- 创建：`src/components/Footer.js`
- 创建：`src/components/Footer.module.css`

- [ ] **步骤 1：编写 Footer 样式**

`src/components/Footer.module.css`：

```css
.footer {
  text-align: center;
  padding: 24px;
  border-top: 1px solid var(--border-warm);
  color: var(--text-tertiary);
  font-size: 13px;
  margin-top: 80px;
}
```

- [ ] **步骤 2：编写 Footer 组件**

`src/components/Footer.js`：

```jsx
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      © 2026 · Built with Hki
    </footer>
  )
}
```

- [ ] **步骤 3：Commit**

```bash
git add src/components/Footer.js src/components/Footer.module.css
git commit -m "feat: add footer component"
```

---

### 任务 5：创建 Hero 组件

**文件：**

- 创建：`src/components/Hero.js`
- 创建：`src/components/Hero.module.css`

- [ ] **步骤 1：编写 Hero 样式**

`src/components/Hero.module.css`：

```css
.hero {
  text-align: center;
  padding: 60px 24px 48px;
}

.title {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 32px;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.25;
  letter-spacing: -0.5px;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 15px;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.cta {
  display: inline-block;
  padding: 10px 24px;
  background: var(--accent-terracotta);
  color: var(--bg-ivory);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.2s;
}

.cta:hover {
  background: #b85a3d;
  text-decoration: none;
}
```

- [ ] **步骤 2：编写 Hero 组件**

`src/components/Hero.js`：

```jsx
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>我的 VibeCoding 之旅</h1>
      <p className={styles.subtitle}>用 AI 加速开发，从想法到产品</p>
      <a href="#modules" className={styles.cta}>开始阅读 ↓</a>
    </section>
  )
}
```

- [ ] **步骤 3：Commit**

```bash
git add src/components/Hero.js src/components/Hero.module.css
git commit -m "feat: add hero component with CTA"
```

---

### 任务 6：创建 Card 和 CardGrid 组件

**文件：**

- 创建：`src/components/Card.js`
- 创建：`src/components/Card.module.css`
- 创建：`src/components/CardGrid.js`
- 创建：`src/components/CardGrid.module.css`

- [ ] **步骤 1：编写 Card 样式**

`src/components/Card.module.css`：

```css
.card {
  background: var(--bg-ivory);
  border: 1px solid var(--border-cream);
  border-radius: var(--radius-lg);
  padding: 24px;
  transition: box-shadow 0.2s, transform 0.2s;
  display: block;
  text-decoration: none;
  color: inherit;
}

.card:hover {
  box-shadow: rgba(0, 0, 0, 0.05) 0px 4px 24px;
  transform: translateY(-2px);
  text-decoration: none;
}

.icon {
  font-size: 24px;
  display: block;
  margin-bottom: 10px;
}

.title {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 17px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.summary {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.link {
  display: inline-block;
  margin-top: 10px;
  font-size: 13px;
  font-weight: 500;
  color: var(--accent-terracotta);
}
```

- [ ] **步骤 2：编写 Card 组件**

`src/components/Card.js`：

```jsx
import Link from 'next/link'
import styles from './Card.module.css'

export default function Card({ href, icon, title, summary }) {
  return (
    <Link href={href} className={styles.card}>
      <span className={styles.icon}>{icon}</span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.summary}>{summary}</p>
      <span className={styles.link}>了解更多 →</span>
    </Link>
  )
}
```

- [ ] **步骤 3：编写 CardGrid 样式**

`src/components/CardGrid.module.css`：

```css
.section {
  padding: 0 24px;
  max-width: 800px;
  margin: 0 auto;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **步骤 4：编写 CardGrid 组件**

`src/components/CardGrid.js`：

```jsx
import Card from './Card'
import styles from './CardGrid.module.css'

const modules = [
  { href: '/workflow', icon: '⚡', title: 'AI 工作流', summary: '从 0 到 1 的提示词工程、迭代法与 AI 辅助调试的最佳实践' },
  { href: '/tools', icon: '🔧', title: '工具链', summary: 'Cursor · Claude · ChatGPT · Copilot，不同场景用什么最合适' },
  { href: '/insights', icon: '📝', title: '经验心得', summary: '避坑指南、效率翻倍的技巧、以及什么时候不该用 AI' },
  { href: '/projects', icon: '📦', title: '项目案例', summary: '用 AI 构建过的一些项目，以及每个项目的 takeaways' },
]

export default function CardGrid() {
  return (
    <section className={styles.section} id="modules">
      <div className={styles.grid}>
        {modules.map((m) => (
          <Card key={m.href} {...m} />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **步骤 5：Commit**

```bash
git add src/components/Card.js src/components/Card.module.css src/components/CardGrid.js src/components/CardGrid.module.css
git commit -m "feat: add card and card grid components"
```

---

### 任务 7：创建首页页面

**文件：**

- 创建：`src/app/page.js`
- 创建：`src/app/page.module.css`

- [ ] **步骤 1：编写首页样式**

`src/app/page.module.css`：

```css
.page {
  padding-bottom: 48px;
}

.creative {
  max-width: 800px;
  margin: 40px auto 0;
  padding: 24px;
  text-align: center;
  background: var(--bg-parchment);
  border: 1px dashed rgba(201, 100, 66, 0.3);
  border-radius: var(--radius-lg);
}

.creativeTitle {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 14px;
  color: var(--text-primary);
}

.chips {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.chip {
  padding: 6px 18px;
  border-radius: 999px;
  background: var(--accent-terracotta);
  color: var(--bg-ivory);
  font-size: 13px;
  text-decoration: none;
  transition: opacity 0.2s;
}

.chip:hover {
  opacity: 0.85;
  text-decoration: none;
  color: var(--bg-ivory);
}
```

- [ ] **步骤 2：编写首页页面**

`src/app/page.js`：

```jsx
import Hero from '@/components/Hero'
import CardGrid from '@/components/CardGrid'
import Link from 'next/link'
import styles from './page.module.css'

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Hero />
      <CardGrid />
      <section className={styles.creative}>
        <h2 className={styles.creativeTitle}>✨ 创意小实验</h2>
        <div className={styles.chips}>
          <Link href="/creative" className={styles.chip}>视觉实验 1</Link>
          <Link href="/creative" className={styles.chip}>视觉实验 2</Link>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **步骤 3：Commit**

```bash
git add src/app/page.js src/app/page.module.css
git commit -m "feat: add home page with hero, cards, and creative section"
```

---

### 任务 8：创建内容加载工具函数

**文件：**

- 创建：`src/lib/content.js`

- [ ] **步骤 1：编写 content.js**

`src/lib/content.js`：

```js
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const contentDir = path.join(process.cwd(), 'content')

export function getPageContent(slug) {
  const fullPath = path.join(contentDir, `${slug}.md`)
  if (!fs.existsSync(fullPath)) return null
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  return { meta: data, content }
}

export function getProjectList() {
  const projectsDir = path.join(contentDir, 'projects')
  if (!fs.existsSync(projectsDir)) return []
  const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.md'))
  return files.map((filename) => {
    const slug = filename.replace(/\.md$/, '')
    const fileContents = fs.readFileSync(path.join(projectsDir, filename), 'utf8')
    const { data } = matter(fileContents)
    return { slug, meta: data }
  }).sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date))
}

export function getProjectContent(slug) {
  const fullPath = path.join(contentDir, 'projects', `${slug}.md`)
  if (!fs.existsSync(fullPath)) return null
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  return { meta: data, content }
}

export async function markdownToHtml(markdown) {
  const result = await remark().use(html).process(markdown)
  return result.toString()
}
```

- [ ] **步骤 2：Commit**

```bash
git add src/lib/content.js
git commit -m "feat: add markdown content loader utility"
```

---

### 任务 9：创建 MarkdownRenderer 组件

**文件：**

- 创建：`src/components/MarkdownRenderer.js`
- 创建：`src/components/MarkdownRenderer.module.css`

- [ ] **步骤 1：编写 MarkdownRenderer 样式**

`src/components/MarkdownRenderer.module.css`：

```css
.content {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 24px;
  font-size: 16px;
  color: var(--text-primary);
}

.content h1 {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 28px;
  font-weight: 500;
  margin: 40px 0 12px;
  line-height: 1.3;
}

.content h2 {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 22px;
  font-weight: 500;
  margin: 32px 0 10px;
  line-height: 1.3;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-cream);
}

.content h3 {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 18px;
  font-weight: 500;
  margin: 24px 0 8px;
}

.content p {
  margin-bottom: 16px;
  line-height: 1.8;
  color: var(--text-secondary);
}

.content ul, .content ol {
  margin: 12px 0 20px;
  padding-left: 24px;
  color: var(--text-secondary);
}

.content li {
  margin-bottom: 6px;
  line-height: 1.7;
}

.content blockquote {
  border-left: 3px solid var(--accent-terracotta);
  padding: 12px 20px;
  margin: 20px 0;
  background: var(--bg-ivory);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  font-style: italic;
  color: var(--text-secondary);
}

.content code {
  background: var(--bg-warm-sand);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 14px;
  font-family: ui-monospace, 'JetBrains Mono', monospace;
}

.content pre {
  background: var(--text-primary);
  padding: 20px;
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin: 20px 0;
}

.content pre code {
  background: transparent;
  color: var(--text-on-dark);
  padding: 0;
}

.content img {
  margin: 24px 0;
  border-radius: var(--radius-md);
}

.content hr {
  border: none;
  border-top: 1px solid var(--border-cream);
  margin: 32px 0;
}
```

- [ ] **步骤 2：编写 MarkdownRenderer 组件**

`src/components/MarkdownRenderer.js`：

```jsx
import styles from './MarkdownRenderer.module.css'

export default function MarkdownRenderer({ html }) {
  return (
    <div
      className={styles.content}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
```

- [ ] **步骤 3：Commit**

```bash
git add src/components/MarkdownRenderer.js src/components/MarkdownRenderer.module.css
git commit -m "feat: add markdown renderer component with styling"
```

---

### 任务 10：创建内容型详情页（workflow / tools / insights / creative）

**文件：**

- 创建：`content/workflow.md`
- 创建：`content/tools.md`
- 创建：`content/insights.md`
- 创建：`content/creative.md`
- 创建：`src/app/workflow/page.js`
- 创建：`src/app/workflow/page.module.css`
- 创建：`src/app/tools/page.js`
- 创建：`src/app/insights/page.js`
- 创建：`src/app/creative/page.js`

- [ ] **步骤 1：创建内容典范 Markdown 文件**

`content/workflow.md`：

```markdown
---
title: "AI 工作流"
icon: "⚡"
---

## 从想法到原型的 4 步法

这里分享我使用 AI 工具构建项目的核心工作流。

### 第一步：用自然语言描述需求

不要一上来就写代码。先用自然语言把需求讲清楚，让 AI 帮你拆解。

> 例子："我想做一个个人主页，展示我的 vibecoding 经验。首页有卡片导航，点击进入详情。"

### 第二步：让 AI 生成项目脚手架

使用 Cursor 或 Claude 生成初始项目结构和核心组件。关键是要给出清晰的上下文和约束。

### 第三步：迭代调试

把错误信息直接复制给 AI，让它帮忙分析和修复。这是 vibecoding 效率最高的环节。

### 第四步：重构与优化

让 AI 帮你 review 代码，提出改进建议。不要接受第一次生成的结果——迭代出更好的方案。
```

`content/tools.md`：

```markdown
---
title: "工具链"
icon: "🔧"
---

## 我的 AI 开发工具箱

### Cursor

日常主力编辑器。内置 AI 的 IDE，可以理解整个项目上下文。适合：
- 项目级重构
- 多文件修改
- 调试复杂问题

### Claude

对话式 AI 助手，擅长：
- 系统设计和架构讨论
- 代码审查和优化建议
- 复杂逻辑推理

### ChatGPT

补充工具，适合：
- 快速原型和探索性编程
- 不熟悉的库/框架入门
- 生成测试数据和 mock
```

`content/insights.md`：

```markdown
---
title: "经验心得"
icon: "📝"
---

## 避坑指南 & 效率技巧

### 什么时候不该用 AI

1. **理解已有代码时** — 先自己读代码理解逻辑，再让 AI 帮忙修改
2. **安全敏感代码** — 永远不要盲目信任 AI 生成的认证、加密逻辑
3. **微小改动** — 改个变量名这种，自己改更快

### 提示词技巧

- **给上下文**：不要说"帮我写个函数"，而是"在 React 项目中，我需要一个处理用户登录的函数..."
- **指定输出格式**：告诉 AI 你要什么格式（代码、列表、表格）
- **分步骤要求**：复杂任务拆成多轮对话，每轮聚焦一个子问题
```

`content/creative.md`：

```markdown
---
title: "创意小实验"
icon: "✨"
---

## 一些好玩的视觉项目

这里放一些用 AI 辅助做的有趣、有视觉冲击力的小实验。

（内容编写中...）
```

- [ ] **步骤 2：创建详情页动态路由组件**

因为 workflow、tools、insights、creative 四个页面的逻辑完全一样，可以用一个通用的详情页组件。但为了更清晰的 App Router 结构，每个页面独立文件更符合设计。

`src/app/workflow/page.js`：

```jsx
import { getPageContent, markdownToHtml } from '@/lib/content'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import styles from './page.module.css'

export default async function WorkflowPage() {
  const data = getPageContent('workflow')
  if (!data) return <div className={styles.empty}>内容编写中...</div>
  const html = await markdownToHtml(data.content)
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{data.meta.icon} {data.meta.title}</h1>
      <MarkdownRenderer html={html} />
    </div>
  )
}
```

`src/app/workflow/page.module.css`：

```css
.page {
  padding: 40px 0 80px;
}

.title {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 28px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 40px;
  color: var(--text-primary);
}

.empty {
  text-align: center;
  padding: 80px 24px;
  color: var(--text-secondary);
  font-size: 16px;
}
```

创建另外三个页面（tools、insights、creative），内容与 workflow/page.js 相同，只需替换 `getPageContent` 的参数。

`src/app/tools/page.js`：

```jsx
import { getPageContent, markdownToHtml } from '@/lib/content'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import styles from './page.module.css'

export default async function ToolsPage() {
  const data = getPageContent('tools')
  if (!data) return <div className={styles.empty}>内容编写中...</div>
  const html = await markdownToHtml(data.content)
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{data.meta.icon} {data.meta.title}</h1>
      <MarkdownRenderer html={html} />
    </div>
  )
}
```

`src/app/insights/page.js`：

```jsx
import { getPageContent, markdownToHtml } from '@/lib/content'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import styles from './page.module.css'

export default async function InsightsPage() {
  const data = getPageContent('insights')
  if (!data) return <div className={styles.empty}>内容编写中...</div>
  const html = await markdownToHtml(data.content)
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{data.meta.icon} {data.meta.title}</h1>
      <MarkdownRenderer html={html} />
    </div>
  )
}
```

`src/app/creative/page.js`：

```jsx
import { getPageContent, markdownToHtml } from '@/lib/content'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import styles from './page.module.css'

export default async function CreativePage() {
  const data = getPageContent('creative')
  if (!data) return <div className={styles.empty}>内容编写中...</div>
  const html = await markdownToHtml(data.content)
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{data.meta.icon} {data.meta.title}</h1>
      <MarkdownRenderer html={html} />
    </div>
  )
}
```

四个页面共享同一个 `page.module.css`（实际路径不同但内容相同）。或者在 `src/app/` 下放一个共享 CSS。

简便做法：为每个详情页创建自己的 `page.module.css`，内容与 `src/app/workflow/page.module.css` 相同。

- [ ] **步骤 3：Commit**

```bash
git add content/ src/app/workflow/ src/app/tools/ src/app/insights/ src/app/creative/
git commit -m "feat: add markdown content files and detail pages for all modules"
```

---

### 任务 11：创建项目案例页面（列表 + 详情）

**文件：**

- 创建：`content/projects/project-1.md`
- 创建：`content/projects/project-2.md`
- 创建：`content/projects/project-3.md`
- 创建：`src/app/projects/page.js`
- 创建：`src/app/projects/page.module.css`
- 创建：`src/app/projects/[slug]/page.js`
- 创建：`src/app/projects/[slug]/page.module.css`

- [ ] **步骤 1：创建示例项目内容**

`content/projects/project-1.md`：

```markdown
---
title: "项目一名称"
date: 2026-01-10
icon: "🚀"
summary: "用 AI 从零构建的一个全栈应用"
---

## 项目背景

描述这个项目的背景和初衷。

## 使用 AI 的过程

- 用 Cursor 生成初始脚手架
- 用 Claude 设计数据库 schema
- 用 ChatGPT 生成测试数据

## 成果

项目链接、截图等。

## 反思

哪些做得好，哪些可以改进。
```

`content/projects/project-2.md`：

```markdown
---
title: "项目二名称"
date: 2026-01-05
icon: "🎨"
summary: "一个有视觉创意的前端项目"
---

## 项目背景

描述...

## 使用 AI 的过程

描述...

## 成果

展示...

## 反思

经验...
```

`content/projects/project-3.md`：

```markdown
---
title: "项目三名称"
date: 2025-12-20
icon: "🛠️"
summary: "一个解决实际问题的工具型项目"
---

## 项目背景

描述...

## 使用 AI 的过程

描述...

## 成果

展示...

## 反思

经验...
```

- [ ] **步骤 2：创建项目列表页**

`src/app/projects/page.module.css`：

```css
.page {
  padding: 40px 0 80px;
}

.title {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 28px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 12px;
}

.subtitle {
  text-align: center;
  color: var(--text-secondary);
  font-size: 15px;
  margin-bottom: 40px;
}

.list {
  max-width: 640px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty {
  text-align: center;
  padding: 60px 24px;
  color: var(--text-secondary);
}
```

`src/app/projects/page.js`：

```jsx
import Link from 'next/link'
import { getProjectList } from '@/lib/content'
import styles from './page.module.css'

export default function ProjectsPage() {
  const projects = getProjectList()

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>📦 项目案例</h1>
      <p className={styles.subtitle}>用 AI 构建过的一些项目</p>
      {projects.length === 0 ? (
        <div className={styles.empty}>还没有项目记录，敬请期待...</div>
      ) : (
        <div className={styles.list}>
          {projects.map((p) => (
            <Link key={p.slug} href={`/projects/${p.slug}`} className={styles.card}>
              <span>{p.meta.icon} <strong>{p.meta.title}</strong></span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>
                {p.meta.summary}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
```

但这里的 card 缺少 CSS。在 `src/app/projects/page.module.css` 补充：

```css
.card {
  display: block;
  padding: 20px;
  background: var(--bg-ivory);
  border: 1px solid var(--border-cream);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-primary);
  transition: box-shadow 0.2s;
}

.card:hover {
  box-shadow: rgba(0, 0, 0, 0.05) 0px 4px 24px;
  text-decoration: none;
}
```

- [ ] **步骤 3：创建项目详情页**

`src/app/projects/[slug]/page.module.css`：

```css
.page {
  padding: 40px 0 80px;
}

.back {
  display: inline-block;
  margin-bottom: 24px;
  font-size: 14px;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 6px 16px;
  border-radius: var(--radius-sm);
  background: var(--bg-ivory);
  border: 1px solid var(--border-cream);
}

.back:hover {
  color: var(--accent-terracotta);
  text-decoration: none;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.headerIcon {
  font-size: 36px;
  display: block;
  margin-bottom: 8px;
}

.headerTitle {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 28px;
  font-weight: 500;
  color: var(--text-primary);
}

.headerDate {
  font-size: 13px;
  color: var(--text-tertiary);
  margin-top: 6px;
}

.empty {
  text-align: center;
  padding: 80px 24px;
  color: var(--text-secondary);
}
```

`src/app/projects/[slug]/page.js`：

```jsx
import Link from 'next/link'
import { getProjectContent, markdownToHtml } from '@/lib/content'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import styles from './page.module.css'

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params
  const data = getProjectContent(slug)
  if (!data) return <div className={styles.empty}>项目不存在</div>
  const html = await markdownToHtml(data.content)

  return (
    <div className={styles.page}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>
        <Link href="/projects" className={styles.back}>← 返回项目列表</Link>
        <div className={styles.header}>
          <span className={styles.headerIcon}>{data.meta.icon}</span>
          <h1 className={styles.headerTitle}>{data.meta.title}</h1>
          <div className={styles.headerDate}>{data.meta.date}</div>
        </div>
        <MarkdownRenderer html={html} />
      </div>
    </div>
  )
}
```

- [ ] **步骤 4：Commit**

```bash
git add content/projects/ src/app/projects/
git commit -m "feat: add projects listing and detail pages with markdown content"
```

---

### 任务 12：创建 next.config.js 并配置静态导出

**文件：**

- 修改：`next.config.js`
- 修改：`package.json`（添加 build 脚本）

- [ ] **步骤 1：配置 next.config.js**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 静态导出，适合 Vercel / Cloudflare Pages
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

- [ ] **步骤 2：测试构建**

```bash
cd E:/hki/Hki-vibecoding
npm run build
```

预期：构建成功，所有页面生成静态 HTML。

- [ ] **步骤 3：Commit**

```bash
git add next.config.js
git commit -m "chore: configure static export for deployment"
```

---

### 任务 13：验证并运行开发服务器

- [ ] **步骤 1：启动开发服务器**

```bash
cd E:/hki/Hki-vibecoding
npm run dev
```

在浏览器中访问 `http://localhost:3000`，确认：

- 首页正常渲染（Hero + 4 张卡片 + 创意区 + Footer）
- 导航链接可点击跳转
- 详情页渲染 Markdown 内容
- 项目列表页和详情页正常
- 移动端响应式布局

- [ ] **步骤 2：最终 Commit**

```bash
git add .
git commit -m "chore: final verification and polish"
```
