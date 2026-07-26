import { getPageContent, renderArticle } from '@/lib/content'
import ArticleLayout from '@/components/ArticleLayout'
import styles from './page.module.css'

export const metadata = {
  title: "经验心得 | HKI's VibeCoding",
  description: 'Vibe coding 实践中的经验、观察与踩坑记录',
}

export default async function InsightsPage() {
  const data = getPageContent('insights')
  if (!data) return <div className={styles.empty}>内容编写中...</div>
  const { html, toc } = await renderArticle(data.content)
  return (
    <ArticleLayout
      kicker="INSIGHTS / 04"
      title={data.meta.title}
      minutes={data.readingMinutes}
      toc={toc}
      html={html}
    />
  )
}
