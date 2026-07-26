'use client'

import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

export default function PageTransition({ children }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
        exit={{ opacity: 0, y: -10, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
