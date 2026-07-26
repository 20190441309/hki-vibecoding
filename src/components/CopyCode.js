'use client'

import { useEffect } from 'react'

// 给正文里的每个代码块补一键复制按钮（构建期 HTML 不含交互，挂载后装饰）
export default function CopyCode() {
  useEffect(() => {
    const pres = document.querySelectorAll('main pre')
    const buttons = []
    pres.forEach((pre) => {
      if (pre.querySelector('[data-copy]')) return
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.dataset.copy = ''
      btn.className = 'copyBtn'
      btn.textContent = 'copy'
      btn.setAttribute('aria-label', '复制代码')
      btn.addEventListener('click', async () => {
        const code = pre.querySelector('code')
        if (!code) return
        try {
          await navigator.clipboard.writeText(code.innerText)
          btn.textContent = 'copied ✓'
        } catch {
          btn.textContent = 'failed'
        }
        setTimeout(() => {
          btn.textContent = 'copy'
        }, 1500)
      })
      pre.appendChild(btn)
      buttons.push(btn)
    })
    return () => buttons.forEach((b) => b.remove())
  }, [])

  return null
}
