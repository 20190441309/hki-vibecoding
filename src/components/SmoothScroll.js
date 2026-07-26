'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }) {
  useEffect(() => {
    // reduced-motion：回原生滚动，ScrollTrigger 仍随原生滚动工作
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    // Lenis 与 GSAP 共用单时钟（后续一切滚动动效的前提）
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    // 供 TOC 等页内锚点组件调用（带 nav 偏移的平滑定位）
    window.__lenis = lenis

    return () => {
      gsap.ticker.remove(tick)
      delete window.__lenis
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
