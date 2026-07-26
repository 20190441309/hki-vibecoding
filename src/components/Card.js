import Link from 'next/link'
import styles from './Card.module.css'

export default function Card({ href, icon, title, summary }) {
  return (
    <Link href={href} className={styles.card}>
      <span className={styles.icon}>{icon}</span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.summary}>{summary}</p>
      <span className={styles.link}>了解更多 -{'>'}</span>
    </Link>
  )
}
