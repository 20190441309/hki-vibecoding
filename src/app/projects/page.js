import { getProjectList } from '@/lib/content'
import ProjectIndex from '@/components/ProjectIndex'
import styles from './page.module.css'

export const metadata = {
  title: "项目案例 | HKI's VibeCoding",
  description: '用 AI 构建的项目案例：背景、过程、成果与反思',
}

export default function ProjectsPage() {
  const projects = getProjectList()

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={`meta ${styles.kicker}`}>PROJECTS / 05 · {projects.length} 个案例</p>
        <h1 className={styles.title}>项目案例</h1>
      </header>
      {projects.length === 0 ? (
        <div className={styles.empty}>还没有项目记录，敬请期待...</div>
      ) : (
        <ProjectIndex projects={projects} />
      )}
    </div>
  )
}
