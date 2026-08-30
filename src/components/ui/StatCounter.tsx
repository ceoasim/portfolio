import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { getCountUpValue } from './countUp.js'

const DURATION_MS = 1200

interface StatCounterProps {
  value: number
  suffix?: string
  label: string
}

function StatCounter({ value, suffix = '', label }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [display, setDisplay] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!inView) return
    if (shouldReduceMotion) {
      setDisplay(value)
      return
    }
    let start: number | undefined
    let frame: number
    function tick(timestamp: number) {
      if (start === undefined) start = timestamp
      const elapsed = timestamp - start
      setDisplay(getCountUpValue(elapsed, DURATION_MS, value))
      if (elapsed < DURATION_MS) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value, shouldReduceMotion])

  return (
    <div ref={ref} className="text-center">
      <div className="font-sans text-4xl font-bold text-accent">
        {display}
        {suffix}
      </div>
      <div className="mt-1 text-sm text-muted">{label}</div>
    </div>
  )
}

export default StatCounter
