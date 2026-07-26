# 第一阶段：全局基础动效实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 为 HKI's VibeCoding 网站添加全局基础动效：平滑滚动、页面过渡、导航毛玻璃、页脚磁力图标。

**架构：** 在 Next.js App Router 中，于 `layout.js` 注入 Lenis 平滑滚动和 framer-motion 的 AnimatePresence 页面过渡。Nav 组件增加滚动感知的毛玻璃效果和链接悬停动画。Footer 增加磁力社交图标。

**技术栈：** Next.js 16 App Router、framer-motion、@studio-freight/lenis、现有 CSS Modules + CSS 变量配色体系

---

## 文件结构

| 文件 | 职责 | 操作 |
| ------ | ------ | ------ |
| `package.json` | 依赖声明 | 修改 |
| `src/app/layout.js` | 根布局，注入全局 Provider | 修改 |
| `src/components/SmoothScroll.js` | Lenis 平滑滚动客户端组件 | 创建 |
| `src/components/PageTransition.js` | AnimatePresence 页面过渡客户端组件 | 创建 |
| `src/components/Nav.js` | 滚动感知 + 链接动画 | 修改 |
| `src/components/Nav.module.css` | 毛玻璃 + 悬停线条样式 | 修改 |
| `src/components/Footer.js` | 磁力社交图标 | 修改 |
| `src/components/Footer.module.css` | 页脚新样式 | 修改 |
| `src/components/Magnetic.js` | 可复用磁力效果包装组件 | 创建 |

---

## 任务 1：安装依赖

**文件：**

- 修改：`package.json`

- [ ] **步骤 1：安装 framer-motion、lenis、gsap**

运行：

```bash
cd E:/hki/Hki-vibecoding && npm install framer-motion @studio-freight/lenis gsap
```

预期：`package.json` 的 `dependencies` 新增三个包，`package-lock.json` 更新。

- [ ] **步骤 2：验证安装成功**

运行：

```bash
cd E:/hki/Hki-vibecoding && node -e "require('framer-motion'); require('@studio-freight/lenis'); require('gsap'); console.log('OK')"
```

预期：输出 `OK`，无报错。

- [ ] **步骤 3：Commit**

```bash
cd E:/hki/Hki-vibecoding && git add package.json package-lock.json && git commit -m "chore: add framer-motion, lenis, gsap dependencies"
```

---

## 任务 2：创建 SmoothScroll 平滑滚动组件

**文件：**

- 创建：`src/components/SmoothScroll.js`

- [ ] **步骤 1：创建 SmoothScroll 客户端组件**

创建文件 `src/components/SmoothScroll.js`，内容：

```jsx
'use client'

import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
```

- [ ] **步骤 2：验证文件创建**

运行：

```bash
cd E:/hki/Hki-vibecoding && node -e "console.log(require('fs').existsSync('src/components/SmoothScroll.js') ? 'created' : 'missing')"
```

预期：输出 `created`。

- [ ] **步骤 3：Commit**

```bash
cd E:/hki/Hki-vibecoding && git add src/components/SmoothScroll.js && git commit -m "feat: add SmoothScroll component with Lenis"
```

---

## 任务 3：创建 PageTransition 页面过渡组件

**文件：**

- 创建：`src/components/PageTransition.js`

- [ ] **步骤 1：创建 PageTransition 客户端组件**

创建文件 `src/components/PageTransition.js`，内容：

```jsx
'use client'

import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

export default function PageTransition({ children }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
        exit={{ opacity: 0, y: -10, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

- [ ] **步骤 2：验证文件创建**

运行：

```bash
cd E:/hki/Hki-vibecoding && node -e "console.log(require('fs').existsSync('src/components/PageTransition.js') ? 'created' : 'missing')"
```

预期：输出 `created`。

- [ ] **步骤 3：Commit**

```bash
cd E:/hki/Hki-vibecoding && git add src/components/PageTransition.js && git commit -m "feat: add PageTransition component with AnimatePresence"
```

---

## 任务 4：在 layout.js 注入全局 Provider

**文件：**

- 修改：`src/app/layout.js`

- [ ] **步骤 1：修改 layout.js，用 SmoothScroll 和 PageTransition 包裹 children**

将 `src/app/layout.js` 的 `<main>{children}</main>` 部分替换为：

```jsx
import '@/app/globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import PageTransition from '@/components/PageTransition'

export const metadata = {
  title: "HKI's VibeCoding",
  description: '用 AI 加速开发，从想法到产品 - 记录我的 vibecoding 之旅',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <SmoothScroll>
          <Nav />
          <main>
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  )
}
```

- [ ] **步骤 2：运行构建验证**

运行：

```bash
cd E:/hki/Hki-vibecoding && npm run build 2>&1 | tail -20
```

预期：构建成功，输出 `✓ Compiled successfully`，无错误。所有路由正常生成。

- [ ] **步骤 3：Commit**

```bash
cd E:/hki/Hki-vibecoding && git add src/app/layout.js && git commit -m "feat: inject SmoothScroll and PageTransition in root layout"
```

---

## 任务 5：创建可复用 Magnetic 磁力组件

**文件：**

- 创建：`src/components/Magnetic.js`

- [ ] **步骤 1：创建 Magnetic 客户端组件**

创建文件 `src/components/Magnetic.js`，内容：

```jsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Magnetic({ children, strength = 0.35 }) {
  const magnetic = useRef(null)

  useEffect(() => {
    const el = magnetic.current
    if (!el) return

    const xTo = gsap.quickTo(el, 'x', { duration: 1, ease: 'elastic.out(1, 0.3)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 1, ease: 'elastic.out(1, 0.3)' })

    const handleMove = (e) => {
      const { clientX, clientY } = e
      const { height, width, left, top } = el.getBoundingClientRect()
      const x = clientX - (left + width / 2)
      const y = clientY - (top + height / 2)
      xTo(x * strength)
      yTo(y * strength)
    }

    const handleLeave = () => {
      xTo(0)
      yTo(0)
    }

    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)

    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [strength])

  return (
    <div ref={magnetic} style={{ display: 'inline-block' }}>
      {children}
    </div>
  )
}
```

- [ ] **步骤 2：验证文件创建**

运行：

```bash
cd E:/hki/Hki-vibecoding && node -e "console.log(require('fs').existsSync('src/components/Magnetic.js') ? 'created' : 'missing')"
```

预期：输出 `created`。

- [ ] **步骤 3：Commit**

```bash
cd E:/hki/Hki-vibecoding && git add src/components/Magnetic.js && git commit -m "feat: add reusable Magnetic component with GSAP"
```

---

## 任务 6：Nav 滚动感知毛玻璃 + 链接悬停动画

**文件：**

- 修改：`src/components/Nav.js`
- 修改：`src/components/Nav.module.css`

- [ ] **步骤 1：修改 Nav.js 增加滚动监听**

将 `src/components/Nav.js` 全部内容替换为：

```jsx
'use client'

import { useState, useEffect } from 'react'
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
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) setMenuOpen(false)
  }, [pathname])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>⚡ HKI</Link>

      <div className={styles.desktopLinks}>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.link} ${pathname.startsWith(href) ? styles.active : ''}`}
          >
            {label}
          </Link>
        ))}
      </div>

      <button
        className={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="菜单"
        aria-expanded={menuOpen}
      >
        <span className={`${styles.hamburgerLine} ${menuOpen ? styles.hamburgerLineOpen : ''}`}></span>
        <span className={`${styles.hamburgerLine} ${menuOpen ? styles.hamburgerLineOpen : ''}`}></span>
        <span className={`${styles.hamburgerLine} ${menuOpen ? styles.hamburgerLineOpen : ''}`}></span>
      </button>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.mobileLink} ${pathname.startsWith(href) ? styles.mobileLinkActive : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
```

- [ ] **步骤 2：修改 Nav.module.css，增加毛玻璃和链接动画**

将 `src/components/Nav.module.css` 的 `.nav` 规则替换为（增加 transition 和 scrolled 状态）：

```css
.nav {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 14px 32px;
  background: transparent;
  border-bottom: 1px solid transparent;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease;
}

.scrolled {
  background: rgba(250, 249, 245, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-cream);
}
```

将 `.link` 规则替换为（增加底部线条动画）：

```css
.link {
  font-size: 14px;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 4px 0;
  position: relative;
}

.link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  right: 50%;
  height: 2px;
  background: var(--accent-terracotta);
  border-radius: 1px;
  transition: left 0.3s ease, right 0.3s ease;
}

.link:hover {
  color: var(--accent-terracotta);
  text-decoration: none;
}

.link:hover::after {
  left: 0;
  right: 0;
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

- [ ] **步骤 3：运行构建验证**

运行：

```bash
cd E:/hki/Hki-vibecoding && npm run build 2>&1 | tail -20
```

预期：构建成功，无错误。

- [ ] **步骤 4：Commit**

```bash
cd E:/hki/Hki-vibecoding && git add src/components/Nav.js src/components/Nav.module.css && git commit -m "feat: add scroll-aware glass nav with link hover animations"
```

---

## 任务 7：Footer 磁力社交图标

**文件：**

- 修改：`src/components/Footer.js`
- 修改：`src/components/Footer.module.css`

- [ ] **步骤 1：修改 Footer.js，增加社交图标和入场动画**

将 `src/components/Footer.js` 全部内容替换为：

```jsx
'use client'

import { motion } from 'framer-motion'
import Magnetic from './Magnetic'
import styles from './Footer.module.css'

const socials = [
  { label: 'GitHub', href: 'https://github.com' },
  { label: '掘金', href: 'https://juejin.cn' },
  { label: '知乎', href: 'https://zhihu.com' },
]

export default function Footer() {
  return (
    <motion.footer
      className={styles.footer}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.socials}>
        {socials.map((s) => (
          <Magnetic key={s.label} strength={0.5}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              {s.label}
            </a>
          </Magnetic>
        ))}
      </div>
      <p className={styles.copy}>© 2026 · Built with Hki</p>
    </motion.footer>
  )
}
```

- [ ] **步骤 2：修改 Footer.module.css，增加社交图标样式**

将 `src/components/Footer.module.css` 全部内容替换为：

```css
.footer {
  text-align: center;
  padding: 32px 24px;
  border-top: 1px solid var(--border-warm);
  color: var(--text-tertiary);
  font-size: 13px;
  margin-top: 80px;
}

.socials {
  display: flex;
  gap: 24px;
  justify-content: center;
  margin-bottom: 16px;
}

.socialLink {
  font-size: 14px;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid var(--border-warm);
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}

.socialLink:hover {
  color: var(--accent-terracotta);
  border-color: var(--accent-terracotta);
  background: rgba(201, 100, 66, 0.05);
  text-decoration: none;
}

.copy {
  margin: 0;
}
```

- [ ] **步骤 3：运行构建验证**

运行：

```bash
cd E:/hki/Hki-vibecoding && npm run build 2>&1 | tail -20
```

预期：构建成功，所有路由正常生成。

- [ ] **步骤 4：启动开发服务器做视觉验证**

运行：

```bash
cd E:/hki/Hki-vibecoding && timeout 15 npm run dev 2>&1 | head -15
```

预期：输出 `Ready in xxx ms` 和 `Local: http://localhost:3000`，无编译错误。

- [ ] **步骤 5：Commit**

```bash
cd E:/hki/Hki-vibecoding && git add src/components/Footer.js src/components/Footer.module.css && git commit -m "feat: add footer with magnetic social links and entrance animation"
```

---

## 自检

**1. 规格覆盖度：** 对照设计文档第一阶段：

- ✅ 安装依赖 -> 任务 1
- ✅ AnimatePresence 页面过渡 -> 任务 3 + 4
- ✅ Lenis 平滑滚动 -> 任务 2 + 4
- ✅ Nav 毛玻璃 + 滚动感知 + 链接悬停动画 -> 任务 6
- ✅ Footer 磁力图标 -> 任务 5 + 7

**2. 占位符扫描：** 无 TODO、无"待定"、所有步骤含完整代码块。✅

**3. 类型一致性：**

- `SmoothScroll` 接收 `{ children }` -> `layout.js` 中 `<SmoothScroll>` 包裹子节点 ✅
- `PageTransition` 接收 `{ children }` -> `layout.js` 中 `<PageTransition>{children}</PageTransition>` ✅
- `Magnetic` 接收 `{ children, strength }` -> `Footer.js` 中 `<Magnetic strength={0.5}>` ✅
- Nav 的 `scrolled` 状态类名 `styles.scrolled` -> CSS 中定义 `.scrolled` ✅
- Footer 的 `socials` 数组结构 `{ label, href }` -> JSX 中使用 `s.label` / `s.href` ✅

---

## 执行交接

计划已完成并保存到 `docs/superpowers/plans/2026-07-phase1-global-basics.md`。
