'use client'

import { useEffect, useRef } from 'react'
import styles from './Reveal.module.css'

// 全站唯一文字入场：遮罩内整块升起（Exo Ape 式）。
// immediate 模式：纯 CSS 首帧即播，不等水合（LCP 保护，用于 Hero/H1）；
// 默认模式：进入视口后播放。no-JS 下内容始终可见（html.js 门控在 CSS 里）。
export default function Reveal({ children, delay = 0, immediate = false, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    if (immediate) return
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add(styles.go)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles.go)
          io.disconnect()
        }
      },
      { rootMargin: '-10% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [immediate])

  return (
    <span
      ref={ref}
      className={`${styles.mask} ${immediate ? styles.immediate : ''} ${className}`}
      style={delay ? { '--reveal-delay': `${delay}s` } : undefined}
    >
      <span className={styles.inner}>{children}</span>
    </span>
  )
}
