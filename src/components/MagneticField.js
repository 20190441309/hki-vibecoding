'use client'

import { useEffect, useRef } from 'react'
import styles from './MagneticField.module.css'

const GAP = 26
const RADIUS = 130
const PULL = 0.45

export default function MagneticField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let dots = []
    let raf
    const pointer = { x: -9999, y: -9999 }

    const build = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dots = []
      for (let y = GAP; y < rect.height; y += GAP) {
        for (let x = GAP; x < rect.width; x += GAP) {
          dots.push({ ox: x, oy: y, x, y })
        }
      }
    }

    const render = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)
      for (const d of dots) {
        const dx = pointer.x - d.ox
        const dy = pointer.y - d.oy
        const dist = Math.hypot(dx, dy)
        let tx = d.ox
        let ty = d.oy
        if (dist < RADIUS && dist > 0.01) {
          const force = (1 - dist / RADIUS) * PULL
          tx = d.ox + dx * force
          ty = d.oy + dy * force
        }
        d.x += (tx - d.x) * 0.12
        d.y += (ty - d.y) * 0.12
        const offset = Math.hypot(d.x - d.ox, d.y - d.oy)
        const heat = Math.min(offset / 18, 1)
        ctx.fillStyle = heat > 0.05 ? `rgba(201, 100, 66, ${0.35 + heat * 0.65})` : 'rgba(135, 134, 127, 0.4)'
        ctx.beginPath()
        ctx.arc(d.x, d.y, 2 + heat * 1.6, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(render)
    }

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
    }
    const onLeave = () => {
      pointer.x = -9999
      pointer.y = -9999
    }

    build()
    render()
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', build)
    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', build)
    }
  }, [])

  return (
    <div className={styles.wrap}>
      <canvas ref={canvasRef} className={styles.canvas} aria-label="跟随鼠标产生磁力形变的点阵" />
      <span className={styles.hint}>移动鼠标 / 手指划过</span>
    </div>
  )
}
