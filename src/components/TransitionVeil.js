'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import gsap from 'gsap'
import styles from './TransitionVeil.module.css'

const ROUTES = [
  ['/guide', 'guide'],
  ['/workflow', 'workflow'],
  ['/tools', 'tools'],
  ['/insights', 'insights'],
  ['/projects', 'projects'],
  ['/creative', 'creative'],
]

const labelFor = (href) => {
  if (href === '/') return '~'
  for (const [prefix, name] of ROUTES) if (href.startsWith(prefix)) return `~/${name}`
  return `~${href}`
}

// 陶土红帘：自下而上盖住 → mono 打出目标路径 → push → 新页挂载后向上掀开。
export default function TransitionVeil() {
  const veil = useRef(null)
  const router = useRouter()
  const pathname = usePathname()
  const covering = useRef(false)
  const [text, setText] = useState('')

  useEffect(() => {
    const onVeil = (e) => {
      const { href } = e.detail
      if (covering.current) return
      covering.current = true
      const label = `$ cd ${labelFor(href)}`
      setText('')
      const proxy = { n: 0 }
      gsap.timeline()
        .fromTo(
          veil.current,
          { clipPath: 'inset(100% 0 0 0)' },
          { clipPath: 'inset(0% 0 0 0)', duration: 0.3, ease: 'power3.inOut' }
        )
        .to(proxy, {
          n: label.length,
          duration: 0.25,
          ease: 'none',
          snap: { n: 1 },
          onUpdate: () => setText(label.slice(0, proxy.n)),
          onComplete: () => router.push(href),
        }, '-=0.1')
    }
    window.addEventListener('hki:veil', onVeil)
    return () => window.removeEventListener('hki:veil', onVeil)
  }, [router])

  useEffect(() => {
    if (!covering.current) return
    covering.current = false
    gsap.to(veil.current, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.3,
      ease: 'power3.inOut',
      delay: 0.05,
      onComplete: () => {
        gsap.set(veil.current, { clipPath: 'inset(100% 0 0 0)' })
        setText('')
      },
    })
  }, [pathname])

  return (
    <div ref={veil} className={styles.veil} aria-hidden="true">
      <span className={styles.path}>
        {text}
        <span className={styles.cursor} />
      </span>
    </div>
  )
}
