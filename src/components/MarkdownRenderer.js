import styles from './MarkdownRenderer.module.css'

export default function MarkdownRenderer({ html }) {
  return (
    <div
      className={styles.content}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
