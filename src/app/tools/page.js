import { getPageContent, markdownToHtml } from '@/lib/content'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import styles from './page.module.css'

export const metadata = {
  title: "工具链 | HKI's VibeCoding",
  description: 'AI 编程工具横评与推荐组合：Claude Code、Cursor 等',
}

export default async function ToolsPage() {
  const data = getPageContent('tools')
  if (!data) return <div className={styles.empty}>内容编写中...</div>
  const html = await markdownToHtml(data.content)
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{data.meta.icon} {data.meta.title}</h1>
      <MarkdownRenderer html={html} />
    </div>
  )
}
