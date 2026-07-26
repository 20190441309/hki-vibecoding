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
          <Link href="/creative" className={styles.chip}>视觉实验 1</Link>
          <Link href="/creative" className={styles.chip}>视觉实验 2</Link>
        </div>
      </section>
    </div>
  )
}
