import '@/app/globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import NoiseOverlay from '@/components/NoiseOverlay'
import TransitionVeil from '@/components/TransitionVeil'

export const metadata = {
  title: "HKI's VibeCoding",
  description: '用 AI 加速开发，从想法到产品 - 记录我的 vibecoding 之旅',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 首帧打 .js 标：Reveal 的隐藏初始态只在有 JS 时生效（no-JS/爬虫直接可见） */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="preload" href="/fonts/jbm-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="alternate" type="application/rss+xml" title="HKI's VibeCoding" href="/rss.xml" />
      </head>
      <body>
        <a href="#main" className="skipLink">跳到正文</a>
        <NoiseOverlay />
        <TransitionVeil />
        <SmoothScroll>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  )
}
