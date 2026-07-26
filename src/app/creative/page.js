import { getPageContent, markdownToHtml } from '@/lib/content'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import TerminalTyping from '@/components/TerminalTyping'
import MagneticField from '@/components/MagneticField'
import styles from './page.module.css'

export const metadata = {
  title: "创意小实验 | HKI's VibeCoding",
  description: '用 AI 辅助实现的交互视觉实验：终端影院、磁力点阵',
}

export default async function CreativePage() {
  const data = getPageContent('creative')
  if (!data) return <div className={styles.empty}>内容编写中...</div>
  const html = await markdownToHtml(data.content)
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{data.meta.icon} {data.meta.title}</h1>
      <MarkdownRenderer html={html} />
      <section id="terminal" className={styles.experiment}>
        <h2 className={styles.experimentTitle}>01 · 终端影院</h2>
        <p className={styles.experimentDesc}>
          一段循环播放的 vibe coding 会话：描述需求 → AI 读代码、写组件 → 提交。
          本站的磁吸页脚就是这么来的。
        </p>
        <TerminalTyping />
      </section>
      <section id="magnetic-field" className={styles.experiment}>
        <h2 className={styles.experimentTitle}>02 · 磁力点阵</h2>
        <p className={styles.experimentDesc}>
          Canvas 上的点阵会被指针"磁化"——靠近的点被吸引、变热，离开后弹性归位。
          与页脚磁吸按钮同一套物理直觉，换了一种介质。
        </p>
        <MagneticField />
      </section>
    </div>
  )
}
