import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>我的 VibeCoding 之旅</h1>
      <p className={styles.subtitle}>用 AI 加速开发，从想法到产品</p>
      <a href="#modules" className={styles.cta}>开始阅读 ↓</a>
    </section>
  )
}
