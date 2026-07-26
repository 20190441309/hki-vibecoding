import BootSequence from '@/components/BootSequence'
import MiniShell from '@/components/MiniShell'
import CursorCaret from '@/components/CursorCaret'
import ScrambleTitle from '@/components/ScrambleTitle'
import MagneticField from '@/components/MagneticField'
import TerminalTyping from '@/components/TerminalTyping'
import styles from './page.module.css'

export const metadata = {
  title: "创意实验 | HKI's VibeCoding",
  description: '工程附录：磁力点阵、终端影院、可交互 mini shell——每个实验都是一次对话的产物',
}

const EXPS = [
  {
    id: 'EXP-001',
    name: '磁力点阵',
    anchor: 'magnetic-field',
    params: '输入: POINTER · 引擎: CANVAS 2D · 归位: 0.12 LERP',
    desc: '点阵会被指针"磁化"——靠近的点被吸引、变热，离开后弹性归位。与页脚磁吸按钮同一套物理直觉。',
    body: <MagneticField />,
  },
  {
    id: 'EXP-002',
    name: '终端影院',
    anchor: 'terminal',
    params: '来源: 真实会话改编 · 播放: 循环 · REDUCED-MOTION: 直出',
    desc: '一段循环播放的 vibe coding 会话：描述需求 → AI 读代码、写组件 → 提交。本站的磁吸页脚就是这么来的。',
    body: <TerminalTyping />,
  },
  {
    id: 'EXP-003',
    name: 'MINI SHELL',
    anchor: 'shell',
    params: '命令: 6 · 运行时依赖: 0 · 彩蛋: ≥1',
    desc: '真的可以敲。help 开始，cd projects 会真的带你跳转（试试 sudo rm -rf /）。',
    body: <MiniShell />,
  },
]

export default function CreativePage() {
  return (
    <div id="crt" className={styles.page}>
      <div className={styles.scanlines} aria-hidden="true" />
      <CursorCaret scopeId="crt" />
      <div className={styles.inner}>
        <BootSequence />
        <header className={styles.header}>
          <p className={styles.kicker}>APPENDIX / 工程附录</p>
          <h1 className={styles.title}>创意实验</h1>
          <p className={styles.intro}>
            每个实验都是一次对话的产物：描述想要的手感，让 AI 实现，再一起调参到满意为止。
          </p>
        </header>
        {EXPS.map((exp) => (
          <section key={exp.id} id={exp.anchor} className={styles.exp}>
            <div className={styles.expHead}>
              <span className={styles.expId}>{exp.id}</span>
              <h2 className={styles.expName}>
                <ScrambleTitle text={exp.name} />
              </h2>
              <span className={styles.expParams}>{exp.params}</span>
            </div>
            <p className={styles.expDesc}>{exp.desc}</p>
            <div className={styles.expBody}>{exp.body}</div>
          </section>
        ))}
      </div>
    </div>
  )
}
