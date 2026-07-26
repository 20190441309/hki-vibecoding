'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

gsap.registerPlugin(ScrambleTextPlugin)

// hover 时字符乱序落位（触屏无 hover 自动失效）
export default function ScrambleTitle({ text, className }) {
  const ref = useRef(null)

  const scramble = () => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.to(ref.current, {
      duration: 0.6,
      scrambleText: { text, chars: '█▓▒░<>/-_', speed: 0.8 },
    })
  }

  return (
    <span ref={ref} className={className} onMouseEnter={scramble}>
      {text}
    </span>
  )
}
