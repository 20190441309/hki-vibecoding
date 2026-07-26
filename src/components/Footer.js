import Magnetic from './Magnetic'
import Reveal from './Reveal'
import styles from './Footer.module.css'

const socials = [
  { label: 'GitHub', href: 'https://github.com/20190441309' },
  { label: '掘金', href: 'https://juejin.cn' },
  { label: '知乎', href: 'https://zhihu.com' },
]

const phrases =
  '$ git push --force-with-lease · /compact · 先跑起来再说 · explore → plan → implement → commit · $ claude --resume · '

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* 命令口头禅跑马灯（纯装饰，读屏忽略） */}
      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.track}>
          <span className={styles.seg}>{phrases}</span>
          <span className={styles.seg}>{phrases}</span>
        </div>
      </div>

      <div className={styles.inner}>
        <p className={`meta ${styles.kicker}`}>NEXT / 下一步</p>
        <div className={styles.bigRow}>
          <h2 className={styles.big}>
            <Reveal>一起来 Vibe Coding</Reveal>
          </h2>
          <Magnetic strength={0.5}>
            <a
              href="https://github.com/20190441309/hki-vibecoding"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.circleCta}
            >
              看源码 ↗
            </a>
          </Magnetic>
        </div>
        <p className={`meta ${styles.status}`}>
          正在写：终端杂志改版 · 可约聊：<em>是</em>
        </p>

        <div className={styles.bottomRow}>
          <div className={styles.socials}>
            {socials.map((s) => (
              <Magnetic key={s.label} strength={0.5}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  {s.label}
                </a>
              </Magnetic>
            ))}
          </div>
          <p className={`meta ${styles.colophon}`}>
            Georgia 排版 · Lenis 滚动 · Next.js 静态导出 · 与 Claude 结对写成
          </p>
        </div>
      </div>
    </footer>
  )
}
