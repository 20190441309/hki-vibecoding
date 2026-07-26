import '@/app/globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import PageTransition from '@/components/PageTransition'
import NoiseOverlay from '@/components/NoiseOverlay'
import MotionProvider from '@/components/MotionProvider'

export const metadata = {
  title: "HKI's VibeCoding",
  description: '用 AI 加速开发，从想法到产品 - 记录我的 vibecoding 之旅',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preload" href="/fonts/jbm-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <NoiseOverlay />
        <MotionProvider>
          <SmoothScroll>
            <Nav />
            <main>
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </SmoothScroll>
        </MotionProvider>
      </body>
    </html>
  )
}
