// 构建期生成 RSS：node scripts/gen-rss.mjs → public/rss.xml（build 前置钩子自动执行）
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const SITE = 'https://hki-vibecoding.vercel.app'
const contentDir = path.join(process.cwd(), 'content')

const esc = (s) =>
  String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

const items = []

for (const slug of ['guide', 'workflow', 'tools', 'insights']) {
  const { data } = matter(readFileSync(path.join(contentDir, `${slug}.md`), 'utf8'))
  items.push({ title: data.title, link: `${SITE}/${slug}`, desc: data.summary || data.title })
}

for (const f of readdirSync(path.join(contentDir, 'projects')).filter((f) => f.endsWith('.md'))) {
  const { data } = matter(readFileSync(path.join(contentDir, 'projects', f), 'utf8'))
  items.push({
    title: data.title,
    link: `${SITE}/projects/${f.replace(/\.md$/, '')}`,
    desc: data.summary || data.title,
    date: data.date,
  })
}

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>HKI's VibeCoding</title>
<link>${SITE}</link>
<description>用 AI 加速开发，从想法到产品——vibe coding 经验、指南与案例</description>
<language>zh-cn</language>
${items
  .map(
    (i) => `<item>
<title>${esc(i.title)}</title>
<link>${i.link}</link>
<guid>${i.link}</guid>
<description>${esc(i.desc)}</description>${i.date ? `\n<pubDate>${new Date(i.date).toUTCString()}</pubDate>` : ''}
</item>`
  )
  .join('\n')}
</channel>
</rss>
`

writeFileSync('public/rss.xml', rss)
console.log(`public/rss.xml written (${items.length} items)`)
