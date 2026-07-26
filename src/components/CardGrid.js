import Card from './Card'
import styles from './CardGrid.module.css'

const modules = [
  { href: '/workflow', icon: '⚡', title: 'AI 工作流', summary: '从 0 到 1 的提示词工程、迭代法与 AI 辅助调试的最佳实践' },
  { href: '/tools', icon: '🔧', title: '工具链', summary: 'Cursor · Claude · ChatGPT · Copilot，不同场景用什么最合适' },
  { href: '/insights', icon: '📝', title: '经验心得', summary: '避坑指南、效率翻倍的技巧、以及什么时候不该用 AI' },
  { href: '/projects', icon: '📦', title: '项目案例', summary: '用 AI 构建过的一些项目，以及每个项目的 takeaways' },
]

export default function CardGrid() {
  return (
    <section className={styles.section} id="modules">
      <div className={styles.grid}>
        {modules.map((m) => (
          <Card key={m.href} {...m} />
        ))}
      </div>
    </section>
  )
}
