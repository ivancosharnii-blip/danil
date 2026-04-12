'use client'
import { useEffect, useRef, useState } from 'react'

interface Props {
  onMidpoint: () => void
  onComplete: () => void
  active: boolean
  color: string
}

export default function InkTransition({ onMidpoint, onComplete, active, color }: Props) {
  const [phase, setPhase] = useState<'opening' | 'closing' | 'idle'>('idle')
  const midpointRef = useRef(false)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active) return
    midpointRef.current = false
    setPhase('opening')
  }, [active])

  useEffect(() => {
    if (phase === 'idle') return
    const bg = bgRef.current
    if (!bg) return

    function setDimensions() {
      const frameProportion = 1.78
      const frames = 25
      const W = window.innerWidth
      const H = window.innerHeight
      let layerWidth, layerHeight
      if (W / H > frameProportion) {
        layerWidth = W
        layerHeight = layerWidth / frameProportion
      } else {
        layerHeight = H * 1.2
        layerWidth = layerHeight * frameProportion
      }
      if (bg) {
        bg.style.width = layerWidth * frames + 'px'
        bg.style.height = layerHeight + 'px'
      }
    }
    setDimensions()

    if (phase === 'opening') {
      const midTimer = setTimeout(() => {
        if (!midpointRef.current) {
          midpointRef.current = true
          onMidpoint()
        }
      }, 200)
      const endTimer = setTimeout(() => {
        setPhase('closing')
      }, 420)
      return () => { clearTimeout(midTimer); clearTimeout(endTimer) }
    }

    if (phase === 'closing') {
      const endTimer = setTimeout(() => {
        setPhase('idle')
        onComplete()
      }, 420)
      return () => clearTimeout(endTimer)
    }
  }, [phase, onMidpoint, onComplete])

  if (phase === 'idle') return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, zIndex: 9999,
      height: '100%', width: '100%', overflow: 'hidden',
      pointerEvents: 'none',
    }}>
      <div
        ref={bgRef}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          backgroundImage: 'url(/ink.png)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '0 0',
          backgroundSize: '100% 100%',
          filter: color === '#0a0a0a' ? 'brightness(0)' : 'brightness(0) invert(1)',
          animation: phase === 'opening'
            ? 'inkOpen 0.4s steps(24) forwards'
            : 'inkClose 0.4s steps(24) forwards',
        }}
      />
      <style>{`
        @keyframes inkOpen {
          0%   { transform: translateY(-50%) translateX(-2%); }
          100% { transform: translateY(-50%) translateX(-98%); }
        }
        @keyframes inkClose {
          0%   { transform: translateY(-50%) translateX(-98%); }
          100% { transform: translateY(-50%) translateX(-2%); }
        }
      `}</style>
    </div>
  )
}