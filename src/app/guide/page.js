import { getPageContent, markdownToHtml } from '@/lib/content'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import styles from './page.module.css'

export const metadata = {
  title: "Vibe Coding 完全指南 | HKI's VibeCoding",
  description: '从入门到精通的 AI 辅助编程手册：概念、工具链、核心工作流、实战避坑与进阶',
}

export default async function GuidePage() {
  const data = getPageContent('guide')
  if (!data) return <div className={styles.empty}>内容编写中...</div>
  const html = await markdownToHtml(data.content)
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{data.meta.icon} {data.meta.title}</h1>
      <MarkdownRenderer html={html} />
    </div>
  )
}
