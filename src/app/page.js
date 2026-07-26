import Hero from '@/components/Hero'
import IndexList from '@/components/IndexList'
import { getSiteStats } from '@/lib/content'
import styles from './page.module.css'

export default function HomePage() {
  const stats = getSiteStats()
  const rows = [
    { num: '01', title: '完全指南', href: '/guide', meta: '五章 + 附录', img: '/images/previews/guide.jpg' },
    { num: '02', title: 'AI 工作流', href: '/workflow', meta: '探索 → 规划 → 实现 → 提交', img: '/images/previews/workflow.jpg' },
    { num: '03', title: '工具链', href: '/tools', meta: '主流工具横评', img: '/images/previews/tools.jpg' },
    { num: '04', title: '经验心得', href: '/insights', meta: '避坑与效率技巧', img: '/images/previews/insights.jpg' },
    { num: '05', title: '项目案例', href: '/projects', meta: `${stats.projects} 个真实案例`, img: '/images/previews/projects.jpg' },
    { num: '06', title: '创意实验', href: '/creative', meta: 'EXP-001 · EXP-002', img: '/images/previews/creative.jpg' },
  ]

  return (
    <div className={styles.page}>
      <Hero stats={stats} />
      <section className={styles.index}>
        <p className={`meta ${styles.indexKicker}`}>
          INDEX / <em>目录</em>
        </p>
        <IndexList rows={rows} />
      </section>
    </div>
  )
}
