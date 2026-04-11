'use client'

import { useEffect, useRef } from 'react'

interface InkTransitionProps {
  active: boolean
  direction: 'to-dark' | 'to-light'
  onMidpoint: () => void
  onComplete: () => void
}

const STRIPS = 40
const FILL_DURATION = 600
const HOLD_PAUSE = 100
const RETREAT_DURATION = 600
const TOTAL = FILL_DURATION + HOLD_PAUSE + RETREAT_DURATION

export default function InkTransition({
  active,
  direction,
  onMidpoint,
  onComplete,
}: InkTransitionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const midFired = useRef(false)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    ctx.scale(dpr, dpr)

    const fromRight = direction === 'to-dark'
    const color = direction === 'to-dark' ? '#0A0A0A' : '#FAFAF8'

    const stripH = h / STRIPS

    const baseSpeeds: number[] = []
    const leaders = new Set<number>()
    for (let i = 0; i < STRIPS; i++) {
      baseSpeeds[i] = 8 + Math.random() * 17
      if (Math.random() < 0.2) leaders.add(i)
    }

    const tentacles = new Float64Array(STRIPS)
    const retreatOffsets = new Float64Array(STRIPS)
    let retreatSpeeds: number[] | null = null

    midFired.current = false
    const startTime = performance.now()

    function draw(now: number) {
      const elapsed = now - startTime

      if (elapsed >= FILL_DURATION + HOLD_PAUSE && !midFired.current) {
        midFired.current = true
        onMidpoint()
      }

      if (elapsed >= TOTAL) {
        ctx!.clearRect(0, 0, w, h)
        onComplete()
        return
      }

      ctx!.clearRect(0, 0, w, h)
      ctx!.fillStyle = color

      if (elapsed <= FILL_DURATION) {
        const progress = elapsed / FILL_DURATION
        const ease = 1 - Math.pow(1 - progress, 2.5)

        for (let i = 0; i < STRIPS; i++) {
          const speed = baseSpeeds[i] * (leaders.has(i) ? 2 : 1)
          const noise = (Math.random() - 0.5) * 5
          const target = ease * w
          tentacles[i] += (speed + noise) * (target - tentacles[i]) / (w * 0.4 + 1)
          tentacles[i] = Math.min(tentacles[i], w)
          if (tentacles[i] < 0) tentacles[i] = 0

          const len = tentacles[i]
          const y = i * stripH
          if (fromRight) {
            ctx!.fillRect(w - len, y, len, stripH + 0.5)
          } else {
            ctx!.fillRect(0, y, len, stripH + 0.5)
          }
        }

        if (progress > 0.85) {
          for (let i = 0; i < STRIPS; i++) {
            tentacles[i] = w
          }
          ctx!.fillRect(0, 0, w, h)
        }
      } else if (elapsed <= FILL_DURATION + HOLD_PAUSE) {
        ctx!.fillRect(0, 0, w, h)
      } else {
        if (!retreatSpeeds) {
          retreatSpeeds = []
          for (let i = 0; i < STRIPS; i++) {
            retreatSpeeds[i] = 8 + Math.random() * 17
            if (Math.random() < 0.2) retreatSpeeds[i] *= 2
            retreatOffsets[i] = 0
          }
        }

        const retreatElapsed = elapsed - FILL_DURATION - HOLD_PAUSE
        const retreatProgress = retreatElapsed / RETREAT_DURATION
        const ease = 1 - Math.pow(1 - retreatProgress, 2.5)

        for (let i = 0; i < STRIPS; i++) {
          const speed = retreatSpeeds[i]
          const noise = (Math.random() - 0.5) * 5
          const target = ease * w
          retreatOffsets[i] += (speed + noise) * (target - retreatOffsets[i]) / (w * 0.4 + 1)
          retreatOffsets[i] = Math.min(retreatOffsets[i], w)
          if (retreatOffsets[i] < 0) retreatOffsets[i] = 0

          const remaining = w - retreatOffsets[i]
          const y = i * stripH
          if (fromRight) {
            ctx!.fillRect(0, y, remaining, stripH + 0.5)
          } else {
            ctx!.fillRect(w - remaining, y, remaining, stripH + 0.5)
          }
        }

        if (retreatProgress > 0.85) {
          ctx!.clearRect(0, 0, w, h)
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
    />
  )
}
