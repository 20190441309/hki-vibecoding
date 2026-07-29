'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './MiniShell.module.css'

const SECTIONS = ['guide', 'workflow', 'tools', 'insights', 'projects', 'creative']

const VIBES = [
  '先让 AI 读代码，再让它写代码。',
  '计划写得越细，AI 跑偏得越少。',
  '一个任务一个提交，出错只回滚一步。',
  '不给上下文就要结果，是许愿不是编程。',
  'AI 写完的代码，你不审查就是你的 bug。',
  '会话跑歪了就 /clear，沉没成本不是成本。',
]

// 可交互 mini shell：只在获得焦点时接收键盘，Esc 退出，不监听全局
export default function MiniShell() {
  const router = useRouter()
  const [log, setLog] = useState([
    { type: 'out', text: "welcome to hki's shell — 输入 help 查看命令" },
  ])
  const [input, setInput] = useState('')
  const logRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    logRef.current?.scrollTo(0, logRef.current.scrollHeight)
  }, [log])

  const nav = (href) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) router.push(href)
    else window.dispatchEvent(new CustomEvent('hki:veil', { detail: { href } }))
  }

  const run = (raw) => {
    const cmd = raw.trim()
    const out = (text) => ({ type: 'out', text })
    const lines = [{ type: 'cmd', text: `$ ${cmd}` }]
    const [name, ...args] = cmd.split(/\s+/)

    switch (name) {
      case '':
        break
      case 'help':
        lines.push(out('可用命令：'))
        lines.push(out('  ls              列出栏目'))
        lines.push(out('  cd <栏目>       跳转（如 cd projects，cd ~ 回首页）'))
        lines.push(out('  open <栏目>     同 cd'))
        lines.push(out('  vibe            随机一句 vibe coding 心得'))
        lines.push(out('  clear           清屏'))
        break
      case 'ls':
        lines.push(out(SECTIONS.join('  ')))
        break
      case 'cd':
      case 'open': {
        const target = (args[0] || '~').replace(/^~\/?/, '').replace(/\/$/, '')
        if (target === '') {
          lines.push(out('→ /'))
          setLog((l) => [...l, ...lines])
          setInput('')
          nav('/')
          return
        }
        if (SECTIONS.includes(target)) {
          // 已在 creative 实验页：只提示，不导航
          if (target === 'creative') {
            lines.push(out('你已经在这里了 :)'))
            setLog((l) => [...l, ...lines])
            setInput('')
            return
          }
          lines.push(out(`→ /${target}`))
          setLog((l) => [...l, ...lines])
          setInput('')
          nav(`/${target}`)
          return
        }
        lines.push(out(`no such directory: ${args[0]}（ls 看看有哪些）`))
        break
      }
      case 'vibe':
        lines.push(out(`" ${VIBES[(log.length * 7) % VIBES.length]} "`))
        break
      case 'clear':
        setLog([])
        setInput('')
        return
      case 'sudo':
        lines.push(out('权限被拒绝：这是纯静态站，rm 不动任何东西 :)'))
        break
      case 'exit':
        lines.push(out('这里没有出口，只有 cd ~'))
        break
      default:
        lines.push(out(`command not found: ${name}（试试 help）`))
    }
    setLog((l) => [...l, ...lines])
    setInput('')
  }

  return (
    <div className={styles.shell} onClick={() => inputRef.current?.focus()}>
      <div ref={logRef} className={styles.log} role="log" aria-label="终端输出" aria-live="polite">
        {log.map((l, i) => (
          <div key={i} className={l.type === 'cmd' ? styles.cmd : styles.out}>
            {l.text}
          </div>
        ))}
      </div>
      <div className={styles.inputRow}>
        <span className={styles.prompt}>$</span>
        <input
          ref={inputRef}
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') run(input)
            if (e.key === 'Escape') e.currentTarget.blur()
          }}
          aria-label="终端命令输入（Esc 退出）"
          spellCheck={false}
          autoComplete="off"
          placeholder="输入 help ..."
        />
      </div>
    </div>
  )
}
