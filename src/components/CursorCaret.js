'use client'

import { useEffect, useRef } from 'react'
import styles from './CursorCaret.module.css'

// 实验区专属插入符光标：仅 pointer:fine 且非 reduced-motion 时替换系统光标
export default function CursorCaret({ scopeId }) {
  const caret = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const scope = document.getElementById(scopeId)
    const el = caret.current
    if (!scope || !el) return

    scope.classList.add(styles.noCursor)
    let raf = 0
    const move = (e) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${e.clientX + 2}px, ${e.clientY - 8}px)`
      })
    }
    const show = () => (el.style.opacity = '1')
    const hide = () => (el.style.opacity = '0')
    scope.addEventListener('pointermove', move, { passive: true })
    scope.addEventListener('pointerenter', show)
    scope.addEventListener('pointerleave', hide)
    return () => {
      cancelAnimationFrame(raf)
      scope.classList.remove(styles.noCursor)
      scope.removeEventListener('pointermove', move)
      scope.removeEventListener('pointerenter', show)
      scope.removeEventListener('pointerleave', hide)
    }
  }, [scopeId])

  return <div ref={caret} className={styles.caret} aria-hidden="true" />
}
