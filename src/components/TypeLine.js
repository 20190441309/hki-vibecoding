'use client'

import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '@/lib/motion'
import styles from './TypeLine.module.css'

// Hero 单行命令打字：播一次。首帧输出确定性内容（空串），无水合不匹配。
export default function TypeLine({ text }) {
  const reduced = usePrefersReducedMotion()
  const [n, setN] = useState(0)

  useEffect(() => {
    if (reduced) return
    let i = 0
    const timer = setInterval(() => {
      i += 1
      setN(i)
      if (i >= text.length) clearInterval(timer)
    }, 55)
    return () => clearInterval(timer)
  }, [text, reduced])

  const count = reduced ? text.length : n

  return (
    <span className={styles.type} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      <span className={styles.cursor} aria-hidden="true" />
    </span>
  )
}
