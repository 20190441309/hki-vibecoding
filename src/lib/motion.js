import { useSyncExternalStore } from 'react'

// 动效常量唯一来源，与 globals.css 的 --dur-* / --ease-* 保持同值
export const DUR = { fast: 0.15, base: 0.3, slow: 0.6, reveal: 0.9 }
export const EASE = { out: [0.22, 1, 0.36, 1], inout: [0.76, 0, 0.24, 1] }
export const STAGGER = 0.08

// prefers-reduced-motion：订阅 media query，SSR 默认 false（首帧确定性，无水合闪动）
// 仅应由 client 组件调用；常量导出仍可被任意模块使用
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  )
}
