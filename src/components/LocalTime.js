'use client'

import { useEffect, useState } from 'react'

// 作者本地时间（GMT+8）。SSR 首帧渲染占位，mounted 后再出真实值——无水合不匹配。
export default function LocalTime() {
  const [time, setTime] = useState('--:--')

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Shanghai',
    })
    const update = () => setTime(fmt.format(new Date()))
    update()
    const timer = setInterval(update, 30_000)
    return () => clearInterval(timer)
  }, [])

  return <span suppressHydrationWarning>LOCAL {time} GMT+8</span>
}
