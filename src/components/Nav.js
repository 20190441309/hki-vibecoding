'use client'

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

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>⚡ HKI</Link>
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`${styles.link} ${pathname.startsWith(href) ? styles.active : ''}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
