'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

// 站内导航统一入口：拦截点击 → 通知帘层盖帘 → 帘盖满后由 TransitionVeil 执行 router.push。
// 修饰键/新标签/同页/reduced-motion 直接走默认导航。浏览器前进后退（popstate）不经过这里，不播帘。
export default function TransitionLink({ href, children, onClick, ...props }) {
  const router = useRouter()
  const pathname = usePathname()

  const handleClick = (e) => {
    onClick?.(e)
    if (e.defaultPrevented) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || props.target === '_blank') return
    e.preventDefault()
    if (href === pathname) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      router.push(href)
      return
    }
    window.dispatchEvent(new CustomEvent('hki:veil', { detail: { href } }))
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}
