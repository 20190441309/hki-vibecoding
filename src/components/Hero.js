import Reveal from './Reveal'
import TypeLine from './TypeLine'
import LocalTime from './LocalTime'
import Magnetic from './Magnetic'
import TransitionLink from './TransitionLink'
import styles from './Hero.module.css'

export default function Hero({ stats }) {
  return (
    <section className={styles.hero}>
      <p className={`meta ${styles.kicker}`}>HKI · VIBE CODING · EST. 2026</p>

      <h1 className={styles.title}>
        <Reveal immediate>把想法说给 AI 听，</Reveal>
        <Reveal immediate delay={0.12}>
          然后<em className={styles.em}>一起</em>把它写成。
        </Reveal>
      </h1>

      <div className={styles.typeRow}>
        <TypeLine text="$ vibe --with claude  # 边聊边写" />
      </div>

      <p className={styles.evidence}>
        <span className={styles.evidenceItem}>
          <strong className={styles.evidenceNum}>{stats.articles}</strong> 篇长文
        </span>
        <span className={styles.evidenceDot}>·</span>
        <span className={styles.evidenceItem}>
          <strong className={styles.evidenceNum}>{stats.projects}</strong> 个案例
        </span>
        <span className={styles.evidenceDot}>·</span>
        <span className={styles.evidenceItem}>
          <strong className={styles.evidenceNum}>{stats.wan}</strong> 万字
        </span>
      </p>

      <div className={styles.ctaRow}>
        <Magnetic strength={0.35}>
          <TransitionLink href="/guide" className={styles.cta}>
            从指南读起
          </TransitionLink>
        </Magnetic>
      </div>

      <p className={`meta ${styles.corner} ${styles.cornerLeft}`}>SCROLL ↓</p>
      <p className={`meta ${styles.corner} ${styles.cornerRight}`}>
        <LocalTime />
      </p>
    </section>
  )
}
