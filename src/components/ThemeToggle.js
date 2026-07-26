'use client'

import { useEffect, useState } from 'react'
import styles from './ThemeToggle.module.css'

// 暖暗色切换：终端 flag 风格按钮（--dark / --light），localStorage 记忆
export default function ThemeToggle() {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === 'dark')
    setMounted(true)
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    if (next) document.documentElement.dataset.theme = 'dark'
    else delete document.documentElement.dataset.theme
    try {
      localStorage.theme = next ? 'dark' : 'light'
    } catch {}
  }

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={dark ? '切换到浅色模式' : '切换到深色模式'}
      suppressHydrationWarning
    >
      {mounted ? (dark ? '--light' : '--dark') : '--dark'}
    </button>
  )
}
