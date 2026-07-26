import { getPageContent, markdownToHtml } from '@/lib/content'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import styles from './page.module.css'

export const metadata = {
  title: "AI 工作流 | HKI's VibeCoding",
  description: 'Anthropic 官方推荐的 4 步工作流实践：探索 → 规划 → 实现 → 提交',
}

export default async function WorkflowPage() {
  const data = getPageContent('workflow')
  if (!data) return <div className={styles.empty}>内容编写中...</div>
  const html = await markdownToHtml(data.content)
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{data.meta.icon} {data.meta.title}</h1>
      <MarkdownRenderer html={html} />
    </div>
  )
}
