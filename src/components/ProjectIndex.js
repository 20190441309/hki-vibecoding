'use client'

import { useRef } from 'react'
import TransitionLink from './TransitionLink'
import Reveal from './Reveal'
import styles from './ProjectIndex.module.css'

// 项目索引：roving tabindex 键盘导航（↑↓ 移动焦点，Enter 原生打开）
export default function ProjectIndex({ projects }) {
  const listRef = useRef(null)

  const onKeyDown = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    const links = [...listRef.current.querySelectorAll('a')]
    const i = links.indexOf(document.activeElement)
    if (i === -1) return
    e.preventDefault()
    const next = e.key === 'ArrowDown' ? Math.min(i + 1, links.length - 1) : Math.max(i - 1, 0)
    links[next].focus()
  }

  return (
    <>
      <ul ref={listRef} className={styles.list} onKeyDown={onKeyDown}>
        {projects.map((p, i) => (
          <li key={p.slug} className={styles.row}>
            <Reveal delay={i * 0.08}>
              <TransitionLink href={`/projects/${p.slug}`} className={styles.rowLink}>
                <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.body}>
                  <span className={styles.title}>{p.meta.title}</span>
                  <span className={styles.summary}>{p.meta.summary}</span>
                </span>
                <span className={`meta ${styles.rowMeta}`}>
                  {new Date(p.meta.date).toISOString().split('T')[0]}
                  <span className={styles.arrow}>↗</span>
                </span>
              </TransitionLink>
            </Reveal>
          </li>
        ))}
      </ul>
      <p className={`meta ${styles.hint}`}>[↑↓] 选择 · [↵] 打开</p>
    </>
  )
}
