import { getPageContent, markdownToHtml } from '@/lib/content'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import styles from './page.module.css'

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
