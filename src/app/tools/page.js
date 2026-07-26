import { getPageContent, renderArticle } from '@/lib/content'
import ArticleLayout from '@/components/ArticleLayout'
import styles from './page.module.css'

export const metadata = {
  title: "工具链 | HKI's VibeCoding",
  description: 'AI 编程工具横评与推荐组合：Claude Code、Cursor 等',
}

export default async function ToolsPage() {
  const data = getPageContent('tools')
  if (!data) return <div className={styles.empty}>内容编写中...</div>
  const { html, toc } = await renderArticle(data.content)
  return (
    <ArticleLayout
      kicker="TOOLS / 03"
      title={data.meta.title}
      minutes={data.readingMinutes}
      toc={toc}
      html={html}
    />
  )
}
