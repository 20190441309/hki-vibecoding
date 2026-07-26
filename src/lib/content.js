import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
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

// 构建期站点统计（Hero 证据行用，不手写数字）
export function getSiteStats() {
  const articleSlugs = ['guide', 'workflow', 'tools', 'insights']
  const projects = getProjectList()
  let chars = 0
  const countFile = (p) => {
    const { content } = matter(fs.readFileSync(p, 'utf8'))
    chars += (content.match(/[一-鿿]/g) || []).length
  }
  for (const slug of articleSlugs) {
    const p = path.join(contentDir, `${slug}.md`)
    if (fs.existsSync(p)) countFile(p)
  }
  for (const proj of projects) countFile(path.join(contentDir, 'projects', `${proj.slug}.md`))
  return {
    articles: articleSlugs.length,
    projects: projects.length,
    wan: Math.max(1, Math.round(chars / 10000)),
  }
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
  const result = await remark().use(remarkGfm).use(html).process(markdown)
  return result.toString().replace(
    /<(h[23])>([\s\S]*?)<\/\1>/g,
    (match, tag, inner) => {
      const text = inner.replace(/<[^>]+>/g, '')
      return `<${tag} id="${slugify(text)}">${inner}</${tag}>`
    }
  )
}
