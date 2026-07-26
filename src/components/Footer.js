import Magnetic from './Magnetic'
import styles from './Footer.module.css'

const socials = [
  { label: 'GitHub', href: 'https://github.com/20190441309' },
  { label: '掘金', href: 'https://juejin.cn' },
  { label: '知乎', href: 'https://zhihu.com' },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.socials}>
        {socials.map((s) => (
          <Magnetic key={s.label} strength={0.5}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              {s.label}
            </a>
          </Magnetic>
        ))}
      </div>
      <p className={styles.copy}>© 2026 · Built with Hki</p>
    </footer>
  )
}
