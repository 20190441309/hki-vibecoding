import TransitionLink from '@/components/TransitionLink'
import styles from './not-found.module.css'

export const metadata = {
  title: "404: command not found | HKI's VibeCoding",
}

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <p className={styles.line}>
          <span className={styles.prompt}>$ </span>open {'{当前路径}'}
        </p>
        <p className={`${styles.line} ${styles.error}`}>404: command not found</p>
        <p className={styles.line}>试试这些：</p>
        <ul className={styles.list}>
          <li>
            <span className={styles.prompt}>$ </span>
            <TransitionLink href="/" className={styles.cmd}>cd ~</TransitionLink>
            <span className={styles.comment}>  # 回首页</span>
          </li>
          <li>
            <span className={styles.prompt}>$ </span>
            <TransitionLink href="/guide" className={styles.cmd}>open guide</TransitionLink>
            <span className={styles.comment}>  # 读完全指南</span>
          </li>
          <li>
            <span className={styles.prompt}>$ </span>
            <TransitionLink href="/projects" className={styles.cmd}>ls projects/</TransitionLink>
            <span className={styles.comment}>  # 看项目案例</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
