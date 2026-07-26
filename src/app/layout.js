import '@/app/globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import PageTransition from '@/components/PageTransition'

export const metadata = {
  title: "HKI's VibeCoding",
  description: '用 AI 加速开发，从想法到产品 - 记录我的 vibecoding 之旅',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <SmoothScroll>
          <Nav />
          <main>
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  )
}
