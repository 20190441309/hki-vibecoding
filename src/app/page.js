import Hero from '@/components/Hero'
import CardGrid from '@/components/CardGrid'
import Link from 'next/link'
import styles from './page.module.css'

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Hero />
      <CardGrid />
      <section className={styles.creative}>
        <h2 className={styles.creativeTitle}>✨ 创意小实验</h2>
        <div className={styles.chips}>
          <Link href="/creative#terminal" className={styles.chip}>🖥️ 终端影院</Link>
          <Link href="/creative#magnetic-field" className={styles.chip}>🧲 磁力点阵</Link>
        </div>
      </section>
    </div>
  )
}
