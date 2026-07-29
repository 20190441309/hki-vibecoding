'use client'

import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/lib/motion'
import styles from './TerminalTyping.module.css'

const script = [
  { text: '$ claude', cls: 'cmd', delay: 400 },
  { text: '> 给页脚的社交按钮加上磁吸效果，要有弹性手感', cls: 'user', delay: 700 },
  { text: '● 正在读取 src/components/Footer.js ...', cls: 'ai', delay: 500 },
  { text: '● 创建 Magnetic.js — gsap.quickTo + elastic.out(1, 0.3)', cls: 'ai', delay: 500 },
  { text: '● 更新 Footer.js — 用 <Magnetic> 包裹社交链接', cls: 'ai', delay: 500 },
  { text: '✓ 完成 · 2 个文件改动 · 试着把鼠标移向页脚', cls: 'ok', delay: 900 },
  { text: '$ git commit -m "feat: magnetic footer buttons"', cls: 'cmd', delay: 600 },
  { text: '[main a1b2c3d] 2 files changed, 58 insertions(+)', cls: 'dim', delay: 2600 },
]

export default function TerminalTyping() {
  const reduced = usePrefersReducedMotion()
  const [lines, setLines] = useState([])
  const [current, setCurrent] = useState('')
  const [currentCls, setCurrentCls] = useState(script[0].cls)
  const state = useRef({ line: 0, char: 0 })

  useEffect(() => {
    if (reduced) return
    let timer
    const tick = () => {
      const { line, char } = state.current
      const entry = script[line]
      if (char < entry.text.length) {
        state.current.char += 1
        setCurrent(entry.text.slice(0, char + 1))
        timer = setTimeout(tick, entry.cls === 'user' ? 45 : 18)
      } else if (line < script.length - 1) {
        const next = line + 1
        state.current = { line: next, char: 0 }
        setLines((prev) => [...prev, entry])
        setCurrent('')
        setCurrentCls(script[next].cls)
        timer = setTimeout(tick, entry.delay)
      } else {
        state.current = { line: 0, char: 0 }
        timer = setTimeout(() => {
          setLines([])
          setCurrent('')
          setCurrentCls(script[0].cls)
          tick()
        }, entry.delay)
      }
    }
    timer = setTimeout(tick, 600)
    return () => clearTimeout(timer)
  }, [reduced])

  return (
    <div className={styles.terminal} aria-label="模拟的 vibe coding 终端会话">
      <div className={styles.titlebar}>
        <span className={`${styles.dot} ${styles.dotRed}`} />
        <span className={`${styles.dot} ${styles.dotYellow}`} />
        <span className={`${styles.dot} ${styles.dotGreen}`} />
        <span className={styles.titleText}>hki@vibecoding — zsh</span>
      </div>
      <div className={styles.body}>
        {(reduced ? script : lines).map((l, i) => (
          <div key={i} className={`${styles.line} ${styles[l.cls]}`}>{l.text}</div>
        ))}
        {!reduced && (
          <div className={`${styles.line} ${styles[currentCls]}`}>
            {current}
            <span className={styles.cursor} />
          </div>
        )}
      </div>
    </div>
  )
}
