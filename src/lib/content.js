import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const contentDir = path.join(process.cwd(), 'content')

export function getPageContent(slug) {
  const fullPath = path.join(contentDir, `${slug}.md`)
  if (!fs.existsSync(fullPath)) return null
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  return { meta: data, content }
}

export function getProjectList() {
  const projectsDir = path.join(contentDir, 'projects')
  if (!fs.existsSync(projectsDir)) return []
  const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.md'))
  return files.map((filename) => {
    const slug = filename.replace(/\.md$/, '')
    const fileContents = fs.readFileSync(path.join(projectsDir, filename), 'utf8')
    const { data } = matter(fileContents)
    return { slug, meta: data }
  }).sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date))
}

export function getProjectContent(slug) {
  const fullPath = path.join(contentDir, 'projects', `${slug}.md`)
  if (!fs.existsSync(fullPath)) return null
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  return { meta: data, content }
}

// GitHub-style slug，兼容中文标题，供页内目录锚点跳转使用
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
}

export async function markdownToHtml(markdown) {
  const result = await remark().use(html).process(markdown)
  return result.toString().replace(
    /<(h[23])>([\s\S]*?)<\/\1>/g,
    (match, tag, inner) => {
      const text = inner.replace(/<[^>]+>/g, '')
      return `<${tag} id="${slugify(text)}">${inner}</${tag}>`
    }
  )
}
