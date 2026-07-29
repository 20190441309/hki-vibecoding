'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import TransitionLink from './TransitionLink'
import ThemeToggle from './ThemeToggle'
import styles from './Nav.module.css'

const links = [
  { href: '/guide', label: '指南', num: '01' },
  { href: '/workflow', label: '工作流', num: '02' },
  { href: '/tools', label: '工具', num: '03' },
  { href: '/insights', label: '心得', num: '04' },
  { href: '/projects', label: '项目', num: '05' },
]

export default function Nav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  // 路由变化时在 render 阶段关闭菜单（避免 effect 里同步 setState）
  const [menuPath, setMenuPath] = useState(pathname)
  if (pathname !== menuPath) {
    setMenuPath(pathname)
    if (menuOpen) setMenuOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <TransitionLink href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>⚡ HKI</TransitionLink>

      {/* Desktop horizontal links */}
      <div className={styles.desktopLinks}>
        {links.map(({ href, label, num }) => (
          <TransitionLink
            key={href}
            href={href}
            className={`${styles.link} ${pathname.startsWith(href) ? styles.active : ''}`}
          >
            <span className={styles.num}>{num}</span>
            {/* Obys 式字体瞬切：默认字面与 mono 字面叠放，hover 切 opacity */}
            <span className={styles.swap}>
              <span className={styles.word}>{label}</span>
              <span className={styles.wordMono} aria-hidden="true">./{label}</span>
            </span>
          </TransitionLink>
        ))}
        <ThemeToggle />
      </div>

      {/* Mobile hamburger button */}
      <button
        className={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="菜单"
        aria-expanded={menuOpen}
      >
        <span className={`${styles.hamburgerLine} ${menuOpen ? styles.hamburgerLineOpen : ''}`}></span>
        <span className={`${styles.hamburgerLine} ${menuOpen ? styles.hamburgerLineOpen : ''}`}></span>
        <span className={`${styles.hamburgerLine} ${menuOpen ? styles.hamburgerLineOpen : ''}`}></span>
      </button>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {links.map(({ href, label, num }, i) => (
            <TransitionLink
              key={href}
              href={href}
              className={`${styles.mobileLink} ${pathname.startsWith(href) ? styles.mobileLinkActive : ''}`}
              style={{ '--i': i }}
              onClick={() => setMenuOpen(false)}
            >
              <span className={styles.num}>{num}</span>
              {label}
            </TransitionLink>
          ))}
          <div className={styles.mobileToggleRow}>
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  )
}
