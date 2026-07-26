'use client'

import { useEffect, useState } from 'react'
import styles from './TocNav.module.css'

const NAV_OFFSET = -90

// 左栏 sticky 目录：IntersectionObserver 高亮当前章节；锚点走 lenis.scrollTo（补偿 nav 高度）
export default function TocNav({ toc }) {
  const [active, setActive] = useState(toc[0]?.id)

  useEffect(() => {
    const heads = toc.map((t) => document.getElementById(t.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) setActive(visible[0].target.id)
      },
      { rootMargin: '-90px 0px -65% 0px' }
    )
    heads.forEach((h) => io.observe(h))
    return () => io.disconnect()
  }, [toc])

  // 带 #hash 直达页面时的落位（Lenis 初始化之后）
  useEffect(() => {
    if (!location.hash) return
    const el = document.getElementById(decodeURIComponent(location.hash.slice(1)))
    if (!el) return
    requestAnimationFrame(() => {
      if (window.__lenis) window.__lenis.scrollTo(el, { offset: NAV_OFFSET, immediate: true })
      else el.scrollIntoView()
    })
  }, [])

  const go = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: NAV_OFFSET })
    else el.scrollIntoView({ behavior: 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <nav className={styles.toc} aria-label="章节目录">
      <p className={`meta ${styles.title}`}>TOC / 目录</p>
      <ul className={styles.list}>
        {toc.map((t) => (
          <li key={t.id}>
            <a
              href={`#${t.id}`}
              onClick={(e) => go(e, t.id)}
              className={`${styles.item} ${active === t.id ? styles.active : ''}`}
            >
              <span className={styles.rule} aria-hidden="true" />
              <span className={styles.num}>{t.num}</span>
              <span className={styles.text}>{t.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
