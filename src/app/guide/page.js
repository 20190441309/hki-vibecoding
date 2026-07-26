import { getPageContent, renderArticle } from '@/lib/content'
import ArticleLayout from '@/components/ArticleLayout'
import styles from './page.module.css'

export const metadata = {
  title: "Vibe Coding 完全指南 | HKI's VibeCoding",
  description: '从入门到精通的 AI 辅助编程手册：概念、工具链、核心工作流、实战避坑与进阶',
}

export default async function GuidePage() {
  const data = getPageContent('guide')
  if (!data) return <div className={styles.empty}>内容编写中...</div>
  const { html, toc } = await renderArticle(data.content)
  return (
    <ArticleLayout
      kicker="GUIDE / 01"
      title={data.meta.title}
      minutes={data.readingMinutes}
      date="2026-07"
      toc={toc}
      html={html}
    />
  )
}
