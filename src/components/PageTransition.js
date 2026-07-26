'use client'

import { usePathname } from 'next/navigation'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { DUR, EASE } from '@/lib/motion'

export default function PageTransition({ children }) {
  const pathname = usePathname()
  const reduced = useReducedMotion()

  const variants = reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: DUR.fast } },
        exit: { opacity: 0, transition: { duration: DUR.fast } },
      }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE.out } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: EASE.out } },
      }

  return (
    <AnimatePresence mode="wait">
      <m.div key={pathname} {...variants}>
        {children}
      </m.div>
    </AnimatePresence>
  )
}
