# HKI VibeCoding 个人主页 — 设计规格

> 用于展示个人 vibecoding（AI 辅助开发）经验的主页，以 Claude 官网暖色调为视觉风格，Next.js 为技术栈，Markdown 管理内容。

## 1. 项目概述

**定位**：以个人记录为目的，展示作者如何用 AI 工具高效构建项目的经验和方法论，附带一些有视觉冲击力的创意项目。

**核心信息架构**：

```
首页（总览卡片） → 各模块详情页
├── AI 工作流     → /workflow
├── 工具链        → /tools
├── 经验心得      → /insights
├── 项目案例      → /projects
└── 创意小实验    → /creative
```

## 2. 视觉设计

### 2.1 配色方案

采用 Claude 官网暖色调配色体系。所有灰色均为暖调（黄棕底），无冷色。

| Token | 色值 | 用途 |
| ------- | ------ | ------ |
| Parchment 背景 | `#f5f4ed` | 页面主背景色 |
| Ivory 卡片 | `#faf9f5` | 卡片、组件背景 |
| Terracotta 强调 | `#c96442` | 按钮、链接、品牌点缀 |
| Near Black 主文字 | `#141413` | 标题/正文主要颜色 |
| Olive Gray 次要文字 | `#5e5d59` | 副标题、辅助说明 |
| Stone Gray 三级文字 | `#87867f` | 底部信息、元数据 |
| Border Cream 边框 | `#f0eee6` | 卡片/组件边框 |
| Border Warm 分割线 | `#e8e6dc` | 分组分割线 |

**使用原则**：

- 不许出现纯白（`#ffffff`）作为页面背景
- 不许出现冷蓝灰色
- Terracotta 仅用于 CTA 按钮、链接和品牌点缀，不可滥用
- 圆角统一使用 8px（标准）/ 12px（大）/ 16px（卡片容器）

### 2.2 字体方案

| 层级 | 字体 | 后备 |
| ------ | ------ | ------ |
| 标题/引言 | Georgia | 'Times New Roman', serif |
| 正文/导航/UI | system-ui | -apple-system, sans-serif |
| 代码 | ui-monospace | 'JetBrains Mono', monospace |

- 标题权重 500，行高 1.2
- 正文行高 1.6，营造杂志式阅读节奏
- 导航/UI 文字使用 system-ui

### 2.3 首页布局

从上到下：

```
┌────────────────────────────────────┐
│  Navigation (sticky)                │
│  ⚡ HKI  | 工作流 工具 心得 项目    │
├────────────────────────────────────┤
│  Hero 区                            │
│  我的 VibeCoding 之旅              │
│  用 AI 加速开发，从想法到产品        │
│  [开始阅读 ↓]                      │
├────────────────────────────────────┤
│  2×2 卡片网格                       │
│  ┌──────┐  ┌──────┐               │
│  │⚡工作流│  │🔧工具 │               │
│  └──────┘  └──────┘               │
│  ┌──────┐  ┌──────┐               │
│  │📝心得 │  │📦项目 │               │
│  └──────┘  └──────┘               │
├────────────────────────────────────┤
│  创意小实验区                        │
│  ✨ [视觉实验 1] [视觉实验 2]        │
├────────────────────────────────────┤
│  Footer                             │
│  © 2026 · Built with Hki           │
└────────────────────────────────────┘
```

- 导航栏 sticky 固定
- 卡片点击进入对应详情页（`/workflow`, `/tools` 等）
- 卡片内容：图标 + 标题 + 一句话摘要 + 链接

### 2.4 详情页布局

```
┌────────────────────────────────────┐
│  Navigation ← 返回首页              │
├────────────────────────────────────┤
│  模块标题                          │
│                                    │
│  章节 1：<h2>标题                   │
│  （Markdown 正文内容）              │
│                                    │
│  章节 2：<h2>标题                   │
│  （Markdown 正文内容）              │
│                                    │
│  章节 3：<h2>标题                   │
│  （Markdown 正文内容）              │
├────────────────────────────────────┤
│  底部导航或相关阅读                  │
└────────────────────────────────────┘
```

内容由 Markdown 渲染，支持代码高亮、图片、内嵌链接。

## 3. 技术方案

### 3.1 技术栈

| 层 | 技术 |
| ---- | ------ |
| 框架 | Next.js 14+ (App Router) |
| 样式 | CSS Modules |
| 内容 | Markdown (gray-matter + remark) |
| 部署 | Vercel 或 Cloudflare Pages |
| 版本控制 | Git |

### 3.2 内容管理

所有内容以 Markdown 文件存储在 `content/` 目录：

```
content/
├── workflow/
│   └── index.md
├── tools/
│   └── index.md
├── insights/
│   └── index.md
├── projects/
│   ├── project-1.md
│   ├── project-2.md
│   └── project-3.md
└── creative/
    └── index.md
```

每个 Markdown 文件头部包含 frontmatter：

```yaml
---
title: "标题"
date: 2026-01-01
icon: "⚡"
summary: "一句话摘要"
---
```

### 3.3 组件树

```
Layout (根布局)
├── Nav (全局导航)
├── Page
│   ├── HomePage
│   │   ├── Hero
│   │   ├── CardGrid
│   │   │   └── Card (×4)
│   │   ├── CreativeSection
│   │   └── Footer
│   └── DetailPage
│       ├── ContentRenderer (MD → HTML)
│       └── BackToHome
└── GlobalStyles
```

### 3.4 路由设计

| 路径 | 页面 | 说明 |
| ------ | ------ | ------ |
| `/` | 首页 | 卡片总览 |
| `/workflow` | AI 工作流详情 | 经验和方法论 |
| `/tools` | 工具链详情 | 工具评测和搭配 |
| `/insights` | 经验心得详情 | 避坑指南和技巧 |
| `/projects` | 项目案例列表 | 项目摘要 |
| `/projects/[slug]` | 单个项目详情 | 项目详细介绍 |
| `/creative` | 创意小实验 | 视觉项目展示 |

### 3.5 响应式

- 移动端：卡片网格从 2 列变为 1 列
- 导航：桌面端水平展示，移动端可折叠（hamburger 菜单）
- 间距和字号按比例缩小

## 4. 边界情况与错误处理

- **内容缺失**：详情页显示友好的"内容编写中"提示，而非 404
- **Markdown 解析失败**：显示原始内容，记录错误日志
- **导航状态**：当前页面在导航栏高亮
- **空状态**：项目列表为空时显示引导提示
- **加载状态**：页面切换显示简单加载指示

## 5. 项目文件结构

```
Hki-vibecoding/
├── content/           # Markdown 内容文件
│   ├── workflow/
│   ├── tools/
│   ├── insights/
│   ├── projects/
│   └── creative/
├── public/            # 静态资源（图片等）
├── src/
│   ├── app/           # Next.js App Router 页面
│   │   ├── page.js
│   │   ├── layout.js
│   │   ├── workflow/page.js
│   │   ├── tools/page.js
│   │   ├── insights/page.js
│   │   ├── projects/
│   │   └── creative/page.js
│   ├── components/    # 可复用组件
│   │   ├── Nav.js
│   │   ├── Hero.js
│   │   ├── CardGrid.js
│   │   ├── Card.js
│   │   ├── Footer.js
│   │   └── MarkdownRenderer.js
│   └── styles/        # 样式文件
│       └── globals.css
├── next.config.js
├── package.json
└── README.md
```

## 6. 非功能性需求

- **性能**：Lighthouse 评分 ≥ 90，使用 Next.js 静态生成（SSG）
- **可维护性**：内容与展示分离，修改内容只需编辑 Markdown
- **可扩展性**：新增模块只需新建文件夹 + 添加路由
- **SEO**：页面支持基础 meta tags
