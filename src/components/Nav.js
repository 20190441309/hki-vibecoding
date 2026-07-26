'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Nav.module.css'

const links = [
  { href: '/workflow', label: '工作流' },
  { href: '/tools', label: '工具' },
  { href: '/insights', label: '心得' },
  { href: '/projects', label: '项目' },
]

export default function Nav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>⚡ HKI</Link>

      {/* Desktop horizontal links */}
      <div className={styles.desktopLinks}>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.link} ${pathname.startsWith(href) ? styles.active : ''}`}
          >
            {label}
          </Link>
        ))}
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
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.mobileLink} ${pathname.startsWith(href) ? styles.mobileLinkActive : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
