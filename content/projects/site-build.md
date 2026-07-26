---
title: "一天建成这个网站"
date: "2026-07-26"
icon: "🏗️"
summary: "计划驱动 + 原子提交：用 Claude Code 从空目录到可部署的个人主页，22 个提交，一天完成"
model: "Claude · Claude Code"
stack: "Next.js 16 · CSS Modules · gray-matter · remark"
duration: "1 天 · 22 个提交"
takeaway: "计划先行，原子提交，AI 不会跑偏"
repo: "https://github.com/20190441309/hki-vibecoding"
---

## 项目背景

我想要一个能展示自己 vibe coding 经验的个人主页。与其空谈方法论，不如让这个网站本身就成为方法论的证明——**你现在看到的这个站，从空目录到可部署，是在一天内用 vibe coding 完成的。**

## 使用 AI 的过程

严格执行了 Anthropic 官方推荐的 4 步工作流：

### 1. 探索 + 规划先行

动手写代码之前，先让 AI 生成了一份完整的实现计划（就存在仓库的 `docs/superpowers/plans/` 里）：目标、架构、技术栈、完整的文件结构、逐任务的复选框清单。计划确定了 Markdown 驱动的内容架构——页面内容全部放在 `content/` 目录，用 gray-matter + remark 渲染，改内容不用碰代码。

### 2. 逐任务实现，原子提交

按计划逐项执行，每完成一个独立单元就提交一次。看看 git 历史就知道节奏：

```
feat: add global styles with Claude color palette and root layout
feat: add sticky nav component with active state
feat: add footer component
feat: add hero component with CTA
feat: add card and card grid components
feat: add markdown content loader utility
...
```

22 个提交，每个都是一个可独立回滚的完整单元。AI 跑偏时，最多损失一个任务的进度。

### 3. 遇到问题，修复也是原子的

静态导出（`output: 'export'`）时日期格式化在构建期报错，两个 `fix:` 提交精准解决；移动端没有汉堡菜单，一个 `fix:` 补上。问题暴露 → 定位 → 修复 → 提交，每一步都留下记录。

## 成果

- 6 个页面 + 动态路由的项目详情页
- Markdown 驱动，加一篇 md 文件就多一个项目页
- 纯静态导出，可部署到任何静态托管
- Claude 暖色调（陶土红 + 暖白）的完整设计体系

## 反思

**做得好的**：计划先行是最关键的一步。那份实现计划让 AI 全程没有偏离架构，也让我随时知道进度。原子提交让整个过程可审计、可回滚。

**可以改进的**：初版内容全是占位符（"项目一名称"），说明当时只顾了架构没顾内容——架构和内容应该同步规划。
