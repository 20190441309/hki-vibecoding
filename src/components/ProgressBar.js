import styles from './ProgressBar.module.css'

// 阅读进度条：CSS scroll-driven animation，零 JS；不支持的浏览器无进度条（预期降级）
export default function ProgressBar() {
  return <div className={styles.bar} aria-hidden="true" />
}
