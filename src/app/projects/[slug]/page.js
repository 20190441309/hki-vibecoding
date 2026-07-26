import TransitionLink from '@/components/TransitionLink'
import { getProjectList, getProjectContent, markdownToHtml } from '@/lib/content'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import CopyCode from '@/components/CopyCode'
import styles from './page.module.css'

export function generateStaticParams() {
  return getProjectList().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const data = getProjectContent(slug)
  if (!data) return { title: "项目不存在 | HKI's VibeCoding" }
  return {
    title: `${data.meta.title} | HKI's VibeCoding`,
    description: data.meta.summary,
  }
}

const SHEET_ROWS = [
  ['model', '模型'],
  ['stack', '工具链'],
  ['duration', '耗时'],
  ['takeaway', '一句话结论'],
]

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params
  const data = getProjectContent(slug)
  if (!data) return <div className={styles.empty}>项目不存在</div>
  const html = await markdownToHtml(data.content)
  const date = new Date(data.meta.date).toISOString().split('T')[0]

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <TransitionLink href="/projects" className={styles.back}>← 返回项目列表</TransitionLink>

        <header className={styles.header}>
          <p className={`meta ${styles.kicker}`}>PROJECT · {date}</p>
          <h1 className={styles.headerTitle}>{data.meta.title}</h1>
        </header>

        {/* datasheet 参数表（frontmatter 驱动） */}
        <dl className={styles.sheet}>
          {SHEET_ROWS.filter(([key]) => data.meta[key]).map(([key, label]) => (
            <div key={key} className={styles.sheetRow}>
              <dt className={styles.sheetKey}>{label}</dt>
              <dd className={styles.sheetVal}>{data.meta[key]}</dd>
            </div>
          ))}
          {data.meta.repo && (
            <div className={styles.sheetRow}>
              <dt className={styles.sheetKey}>REPO</dt>
              <dd className={styles.sheetVal}>
                <a href={data.meta.repo} target="_blank" rel="noopener noreferrer">
                  {data.meta.repo.replace('https://github.com/', 'github.com/')} ↗
                </a>
              </dd>
            </div>
          )}
        </dl>

        <MarkdownRenderer html={html} />
        <CopyCode />
      </div>
    </div>
  )
}
