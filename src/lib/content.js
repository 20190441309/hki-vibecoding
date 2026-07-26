import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import rehypeShiki from '@shikijs/rehype'
import { transformerMetaHighlight } from '@shikijs/transformers'

const contentDir = path.join(process.cwd(), 'content')

export function getPageContent(slug) {
  const fullPath = path.join(contentDir, `${slug}.md`)
  if (!fs.existsSync(fullPath)) return null
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const cjk = (content.match(/[一-鿿]/g) || []).length
  return {
    meta: data,
    content,
    charCount: cjk,
    readingMinutes: Math.max(1, Math.round(cjk / 400)),
  }
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

const textOf = (node) => {
  if (node.type === 'text') return node.value
  return (node.children || []).map(textOf).join('')
}

// 文章加工插件：标题锚点、H2 章节编号、*强调* → 着重号、提取 TOC
function rehypeArticle({ toc }) {
  return (tree) => {
    let chapter = 0
    const walk = (node) => {
      if (node.type === 'element') {
        if (node.tagName === 'h2' || node.tagName === 'h3') {
          const text = textOf(node).trim()
          node.properties = node.properties || {}
          node.properties.id = node.properties.id || slugify(text)
          if (node.tagName === 'h2' && text !== '目录') {
            chapter += 1
            const num = String(chapter).padStart(2, '0')
            node.children.unshift({
              type: 'element',
              tagName: 'span',
              properties: { className: ['chapNum'], 'aria-hidden': 'true' },
              children: [{ type: 'text', value: `${num} / ` }],
            })
            toc?.push({ id: node.properties.id, text, num })
          }
        }
        if (node.tagName === 'em') {
          node.properties = node.properties || {}
          const cls = node.properties.className || []
          node.properties.className = [...cls, 'dot']
        }
      }
      ;(node.children || []).forEach(walk)
    }
    walk(tree)
  }
}

// Shiki 暖色主题：与站点色板同源（深褐底 / 琥珀字符串 / 陶土关键字）
const warmTheme = {
  name: 'hki-warm',
  type: 'dark',
  colors: {
    'editor.background': '#2a211b',
    'editor.foreground': '#ece7df',
  },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#87867f' } },
    { scope: ['string', 'string.quoted'], settings: { foreground: '#d9a05b' } },
    { scope: ['keyword', 'storage.type', 'storage.modifier'], settings: { foreground: '#d97757' } },
    { scope: ['entity.name.function', 'support.function'], settings: { foreground: '#e0b184' } },
    { scope: ['constant.numeric', 'constant.language', 'variable.other.constant'], settings: { foreground: '#d9a05b' } },
    { scope: ['entity.name.tag', 'punctuation.definition.tag'], settings: { foreground: '#d97757' } },
    { scope: ['variable', 'entity.name'], settings: { foreground: '#ece7df' } },
  ],
}

async function runPipeline(markdown, toc) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeArticle, { toc })
    .use(rehypeShiki, {
      theme: warmTheme,
      fallbackLanguage: 'text',
      transformers: [transformerMetaHighlight()],
    })
    .use(rehypeStringify)
    .process(markdown)
  return result.toString()
}

// 文章渲染：返回 html 与 TOC（H2 级，含章节编号）
export async function renderArticle(markdown) {
  const toc = []
  const html = await runPipeline(markdown, toc)
  return { html, toc }
}

export async function markdownToHtml(markdown) {
  const { html } = await renderArticle(markdown)
  return html
}
