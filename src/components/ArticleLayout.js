import MarkdownRenderer from './MarkdownRenderer'
import TocNav from './TocNav'
import ProgressBar from './ProgressBar'
import CopyCode from './CopyCode'
import Reveal from './Reveal'
import styles from './ArticleLayout.module.css'

// 长文阅读页共用模板：kicker 页头 + 三栏（sticky TOC | 正文 | 留白）+ 进度条
export default function ArticleLayout({ kicker, title, minutes, date, toc = [], html }) {
  return (
    <div className={styles.page}>
      <ProgressBar />
      <header className={styles.header}>
        <p className={`meta ${styles.kicker}`}>
          {kicker} · 约 {minutes} 分钟{date ? ` · ${date}` : ''}
        </p>
        <h1 className={styles.title}>
          <Reveal immediate>{title}</Reveal>
        </h1>
      </header>
      <div className={styles.grid}>
        <aside className={styles.aside}>{toc.length > 1 && <TocNav toc={toc} />}</aside>
        <article className={styles.article}>
          <MarkdownRenderer html={html} />
          <CopyCode />
        </article>
        <div className={styles.gutter} aria-hidden="true" />
      </div>
    </div>
  )
}
