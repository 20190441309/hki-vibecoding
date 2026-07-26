---
title: "AI 工作流"
icon: "⚡"
---

## 4 步标准工作流（Anthropic 官方推荐）

这是 Claude Code 官方最佳实践推荐的流程，也是当前验证最有效的 Vibe Coding 流程。

```
探索 (Explore) → 规划 (Plan) → 实现 (Implement) → 提交 (Commit)
```

---

### 第 1 步：探索（Explore）

进入 Plan Mode，让 AI **先阅读代码理解项目结构，不修改任何文件**。这就像让一个程序员先看项目文档再动手。

```
（进入 Plan Mode）
读取 /src/auth 目录，理解我们如何处理用户登录和会话。
同时查看环境变量的配置方式。
```

> ⚠️ **跳过这一步是初学者最常犯的错误。** 不给上下文就让 AI 写代码，效果大打折扣。

### 第 2 步：规划（Plan）

让 AI 生成详细的实施计划，明确要改哪些文件、改什么、有什么假设。

```
（仍在 Plan Mode）
我想添加 Google OAuth 登录。需要改哪些文件？
会话流程是什么？请生成一个实施计划，列出所有假设。
```

**高级技巧**——让 AI 主动采访你：

```
我想构建[简要描述]。用问题采访我。
问技术实现、UI/UX、边界情况和权衡。
不要问显而易见的问题，深挖我没想到的难点。
把最终结论写成 SPEC.md。
```

### 第 3 步：实现（Implement）

退出 Plan Mode，让 AI 按计划编码，**同时给出验证标准**。

```
按照你的计划实现 OAuth 流程。
为 callback handler 写测试，运行测试套件并修复失败项。
```

**提供验证标准是最有效的质量保障手段：**

| 验证方式 | 示例 |
| --------- | ------ |
| 测试用例 | "写 validateEmail 函数：<valid@example.com> → true，invalid → false" |
| 截图对比 | "截图当前效果，与目标设计图对比，列出差异并修复" |
| 命令输出 | "修复后运行 npm run build，确认无报错" |

### 第 4 步：提交（Commit）

```
写一条描述性 commit message 并提交，创建 PR。
```

---

## 构建迭代循环

**不要一次让 AI 做所有事。** 按层构建，每层验证后再继续：

### 先定义数据模型

```
Prompt: 创建 PostgreSQL schema: users(id, email, hashed_password),
tasks(id, user_id, title, status, created_at)。含外键和索引。
```

### 再构建 API

```
Prompt: 基于以上 schema，创建 GET /api/tasks 端点，
返回当前用户的所有任务。用参数化查询，无 session 返回 401。
```

### 最后做 UI

```
Prompt: 创建 React 组件，从 GET /api/tasks 获取数据并渲染列表。
显示 loading 骨架屏和空状态。
```

---

## Prompt 技巧

### 5 个提升质量的写法

**1. 具体化：指定文件、场景、偏好**

```
❌ "给 foo.py 加测试"
✅ "给 foo.py 写一个测试，覆盖用户未登录时的边界情况，不用 mock"
```

**2. 给参照代码**

```
❌ "加一个日历组件"
✅ "看 HotDogWidget.php 理解组件模式，按同样的结构实现日历组件"
```

**3. 描述症状，而非命令修复**

```
❌ "修复登录 bug"
✅ "用户反映 session 超时后登录失败，检查 src/auth/ 的 token 刷新逻辑"
```

**4. 用 @ 引用文件**

```
❌ "看看认证模块的文件"
✅ "@src/auth/session.ts 这里的 token 刷新逻辑是否有竞态条件？"
```

**5. 让 AI 自己获取上下文**

```
用 'gh issue view 1234' 了解这个 issue 的细节，然后修复它，写测试，创建 PR。
```

### Prompt 万能公式

```
[做什么功能] + [具体文件] + [技术要求] + [样式要求] + [验证标准]
```

---

## Daily Loop：每日编码节奏

1. **Plan before prompting** — 花 5 分钟写清楚要做什么
2. **One feature per session** — 每次只做一个可测试的功能
3. **Test immediately** — 生成代码后立刻运行验证
4. **Review before commit** — 过一遍审查清单再提交
5. **Reset context** — 功能完成后 `/clear`，新功能开新会话

---

## CLAUDE.md 配置指南

CLAUDE.md 是每次会话自动加载的"项目说明书"。其他工具也有对应文件：

| 工具 | 配置文件 |
| ------ | --------- |
| Cursor | `.cursor/rules/*.mdc` |
| Windsurf | `.windsurfrules` |
| Claude Code | `CLAUDE.md` |
| Codex | `AGENTS.md` |

### 推荐配置模版

```markdown
# 代码风格
- 使用 ES modules，不用 CommonJS
- 尽量解构导入：import { foo } from 'bar'

# 工作流
- 修改文件后必须运行 typecheck
- 优先跑单个测试，不跑整个套件

# 项目约定
- API 路由统一前缀 /api/v1/
- 数据库操作统一走 /src/db 层

# 禁区（off-limits）
- 不要修改 /src/config 下的环境变量文件
- 不要改动数据库迁移脚本
```

### 该写 vs 不该写

| 写进去 | 不要写 |
| -------- | -------- |
| AI 猜不到的 Bash 命令 | AI 能从代码读出来的内容 |
| 与默认值不同的代码风格 | 标准语言规范 |
| 测试工具和运行方式 | 详细的 API 文档（给链接） |
| **Off-limits 声明** | 临时笔记和 deadline |

> **关键原则：越短越好。** 规则太多 AI 会忽略一半。

---

## 代码审查 5 点清单

每次 AI 生成代码后，快速过一遍：

1. **Security inputs** — 用户输入有验证和清理吗？SQL 是参数化查询吗？
2. **Error handling** — 代码处理了失败情况吗？还是假设一切成功？
3. **Hardcoded values** — API 密钥、密码、URL 写在源码里了吗？
4. **Dead code** — AI 经常生成未使用的函数和 import
5. **Logic coherence** — 函数实际做的和注释写的一致吗？
