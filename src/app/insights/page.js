import { getPageContent, markdownToHtml } from '@/lib/content'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import styles from './page.module.css'

export const metadata = {
  title: "经验心得 | HKI's VibeCoding",
  description: 'Vibe coding 实践中的经验、观察与踩坑记录',
}

export default async function InsightsPage() {
  const data = getPageContent('insights')
  if (!data) return <div className={styles.empty}>内容编写中...</div>
  const html = await markdownToHtml(data.content)
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{data.meta.icon} {data.meta.title}</h1>
      <MarkdownRenderer html={html} />
    </div>
  )
}
