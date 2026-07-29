'use client'

import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/lib/motion'
import styles from './BootSequence.module.css'

const LINES = ['HKI VIBECODING OS v1.0', 'loading experiments... ok', 'ready.']

// 进入实验区的 boot 序列：逐行打印一次；reduced-motion 直出全文
export default function BootSequence() {
  const reduced = usePrefersReducedMotion()
  const [lines, setLines] = useState([])
  const [current, setCurrent] = useState('')
  const [done, setDone] = useState(false)
  const state = useRef({ line: 0, char: 0 })

  useEffect(() => {
    if (reduced) return
    let timer
    const tick = () => {
      const { line, char } = state.current
      const text = LINES[line]
      if (char < text.length) {
        state.current.char += 1
        setCurrent(text.slice(0, char + 1))
        timer = setTimeout(tick, 24)
      } else if (line < LINES.length - 1) {
        state.current = { line: line + 1, char: 0 }
        setLines((prev) => [...prev, text])
        setCurrent('')
        timer = setTimeout(tick, 260)
      } else {
        setLines(LINES)
        setCurrent('')
        setDone(true)
      }
    }
    timer = setTimeout(tick, 300)
    return () => clearTimeout(timer)
  }, [reduced])

  const shown = reduced ? LINES : lines
  const showCursor = !reduced && !done

  return (
    <div className={styles.boot} aria-label={LINES.join(' ')}>
      {shown.map((l, i) => (
        <div key={i} className={styles.line}>{l}</div>
      ))}
      {showCursor && (
        <div className={styles.line}>
          {current}
          <span className={styles.cursor} />
        </div>
      )}
    </div>
  )
}
