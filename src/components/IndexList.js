'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import TransitionLink from './TransitionLink'
import Reveal from './Reveal'
import styles from './IndexList.module.css'

// 首页索引列表：文字行 + 悬停跟随光标的预览浮图（仅 pointer:fine 启用）
export default function IndexList({ rows }) {
  const preview = useRef(null)
  const img = useRef(null)
  const enabled = useRef(false)
  const setPos = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    enabled.current = true
    const el = preview.current
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })
    const move = (e) => {
      xTo(e.clientX + 24)
      yTo(e.clientY - 90)
    }
    // mouseenter 立即落位（滚动把行送到静止光标下时，pointermove 不会触发）
    setPos.current = (x, y) => {
      gsap.set(el, { x: x + 24, y: y - 90 })
    }
    window.addEventListener('pointermove', move, { passive: true })
    // 首次 hover 前预加载 + decode，避免浮图闪白
    rows.forEach((r) => {
      const i = new Image()
      i.src = r.img
      i.decode?.().catch(() => {})
    })
    return () => window.removeEventListener('pointermove', move)
  }, [rows])

  const show = (e, src) => {
    if (!enabled.current) return
    setPos.current?.(e.clientX, e.clientY)
    img.current.src = src
    preview.current.classList.add(styles.on)
  }
  const hide = () => preview.current?.classList.remove(styles.on)

  return (
    <>
      <ul className={styles.list} onMouseLeave={hide}>
        {rows.map((row, i) => (
          <li key={row.href} className={styles.row} onMouseEnter={(e) => show(e, row.img)}>
            <Reveal delay={i * 0.08}>
              <TransitionLink href={row.href} className={styles.rowLink}>
                <span className={styles.num}>{row.num}</span>
                <span className={styles.title}>{row.title}</span>
                <span className={`meta ${styles.rowMeta}`}>
                  {row.meta}
                  <span className={styles.arrow}>↗</span>
                </span>
              </TransitionLink>
            </Reveal>
          </li>
        ))}
      </ul>
      <div ref={preview} className={styles.preview} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={img} alt="" className={styles.previewImg} />
      </div>
    </>
  )
}
