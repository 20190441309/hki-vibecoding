'use client'

import { useSyncExternalStore } from 'react'
import styles from './ThemeToggle.module.css'

function subscribeTheme(onChange) {
  const el = document.documentElement
  const obs = new MutationObserver(onChange)
  obs.observe(el, { attributes: true, attributeFilter: ['data-theme'] })
  return () => obs.disconnect()
}

function getThemeDark() {
  return document.documentElement.dataset.theme === 'dark'
}

// 暖暗色切换：终端 flag 风格按钮（--dark / --light），localStorage 记忆
export default function ThemeToggle() {
  // 订阅 data-theme：SSR 默认 light，挂载后与首帧脚本恢复的主题对齐
  const dark = useSyncExternalStore(subscribeTheme, getThemeDark, () => false)

  const toggle = () => {
    if (dark) delete document.documentElement.dataset.theme
    else document.documentElement.dataset.theme = 'dark'
    try {
      localStorage.theme = dark ? 'light' : 'dark'
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
      {dark ? '--light' : '--dark'}
    </button>
  )
}
