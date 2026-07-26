import { getPageContent, renderArticle } from '@/lib/content'
import ArticleLayout from '@/components/ArticleLayout'
import styles from './page.module.css'

export const metadata = {
  title: "AI 工作流 | HKI's VibeCoding",
  description: 'Anthropic 官方推荐的 4 步工作流实践：探索 → 规划 → 实现 → 提交',
}

export default async function WorkflowPage() {
  const data = getPageContent('workflow')
  if (!data) return <div className={styles.empty}>内容编写中...</div>
  const { html, toc } = await renderArticle(data.content)
  return (
    <ArticleLayout
      kicker="WORKFLOW / 02"
      title={data.meta.title}
      minutes={data.readingMinutes}
      toc={toc}
      html={html}
    />
  )
}
