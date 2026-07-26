'use client'

import { LazyMotion, domAnimation } from 'framer-motion'

// strict：组件里误用 motion.* 会直接 throw，强制全站走 m.* 以保持按需加载
export default function MotionProvider({ children }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  )
}
