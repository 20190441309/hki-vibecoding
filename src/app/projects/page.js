import Link from 'next/link'
import { getProjectList } from '@/lib/content'
import styles from './page.module.css'

export const metadata = {
  title: "项目案例 | HKI's VibeCoding",
  description: '用 AI 构建的项目案例：背景、过程、成果与反思',
}

export default function ProjectsPage() {
  const projects = getProjectList()

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>📦 项目案例</h1>
      <p className={styles.subtitle}>用 AI 构建过的一些项目</p>
      {projects.length === 0 ? (
        <div className={styles.empty}>还没有项目记录，敬请期待...</div>
      ) : (
        <div className={styles.list}>
          {projects.map((p) => (
            <Link key={p.slug} href={`/projects/${p.slug}`} className={styles.card}>
              <span>{p.meta.icon} <strong>{p.meta.title}</strong></span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>
                {p.meta.summary}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
