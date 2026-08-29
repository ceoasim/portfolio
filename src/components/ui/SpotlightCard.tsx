import { useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { computeTilt } from './tiltOffset.js'

interface SpotlightCardProps {
  className?: string
  children: ReactNode
}

function SpotlightCard({ className = '', children }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [spot, setSpot] = useState({ x: '50%', y: '50%', opacity: 0 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setTilt(computeTilt(rect, e.clientX, e.clientY))
    setSpot({
      x: `${((e.clientX - rect.left) / rect.width) * 100}%`,
      y: `${((e.clientY - rect.top) / rect.height) * 100}%`,
      opacity: 1,
    })
  }

  function handleMouseLeave() {
    setTilt({ rotateX: 0, rotateY: 0 })
    setSpot((s) => ({ ...s, opacity: 0 }))
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
      transition={{ type: 'spring', stiffness: 150, damping: 20 }}
      style={{ transformPerspective: 600 }}
      className={`relative overflow-hidden rounded-xl border border-subtle bg-surface ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{
          opacity: spot.opacity,
          background: `radial-gradient(220px circle at ${spot.x} ${spot.y}, rgba(139,123,255,0.18), transparent 70%)`,
        }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  )
}

export default SpotlightCard
