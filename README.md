# HKI's VibeCoding

> 用 AI 加速开发，从想法到产品——记录我的 vibe coding 之旅。

一个展示个人 vibe coding 经验的静态网站。这个站本身就是方法论的证明：从空目录到可部署，全程用 vibe coding（Claude Code + 计划驱动开发）在一天内完成，全部过程可在 git 历史中回溯。

## 站点结构

| 路由 | 内容 |
| --- | --- |
| `/` | 首页：Hero + 模块卡片 + 创意实验入口 |
| `/guide` | 《Vibe Coding 完全指南》全文（五章 + 附录） |
| `/workflow` | Anthropic 官方推荐的 4 步工作流实践 |
| `/tools` | 工具链横评与推荐组合 |
| `/insights` | 经验心得 |
| `/projects` | 项目案例（含动态路由详情页） |
| `/creative` | 交互视觉实验：终端影院、磁力点阵 |

## 技术栈

- **Next.js 16**（App Router，`output: 'export'` 纯静态导出）+ React 19
- **内容架构**：Markdown 驱动——页面内容放在 `content/`，用 gray-matter 解析 frontmatter、remark 渲染正文，加一篇 md 就多一个页面
- **动效**：Lenis（平滑滚动）、framer-motion（页面过渡）、GSAP（磁吸交互）
- **样式**：CSS Modules，Claude 暖色调设计体系（陶土红 + 暖白）

## 本地开发

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # 静态导出到 out/
```

## 内容维护

- 新增项目案例：在 `content/projects/` 加一篇带 frontmatter（`title` / `date` / `icon` / `summary`）的 md 文件即可
- 修改页面文案：直接编辑 `content/` 下对应的 md 文件，不需要碰代码

## 开发过程档案

- `docs/superpowers/plans/` — 建站实现计划（计划驱动开发的起点）
- `docs/superpowers/specs/` — 视觉动效设计规划稿
- git 历史 — 原子提交记录了每一步
