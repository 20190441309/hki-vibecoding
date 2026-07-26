import Link from 'next/link'
import { getProjectList, getProjectContent, markdownToHtml } from '@/lib/content'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import styles from './page.module.css'

export function generateStaticParams() {
  return getProjectList().map((p) => ({ slug: p.slug }))
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params
  const data = getProjectContent(slug)
  if (!data) return <div className={styles.empty}>项目不存在</div>
  const html = await markdownToHtml(data.content)

  return (
    <div className={styles.page}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>
        <Link href="/projects" className={styles.back}>← 返回项目列表</Link>
        <div className={styles.header}>
          <span className={styles.headerIcon}>{data.meta.icon}</span>
          <h1 className={styles.headerTitle}>{data.meta.title}</h1>
          <div className={styles.headerDate}>{new Date(data.meta.date).toISOString().split('T')[0]}</div>
        </div>
        <MarkdownRenderer html={html} />
      </div>
    </div>
  )
}
