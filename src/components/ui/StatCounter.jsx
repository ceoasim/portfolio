import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { getCountUpValue } from './countUp.js'

const DURATION_MS = 1200

function StatCounter({ value, suffix = '', label }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [display, setDisplay] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!inView) return
    if (shouldReduceMotion) {
      setDisplay(value)
      return
    }
    let start
    let frame
    function tick(timestamp) {
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
      <div className="font-sans text-4xl font-bold text-accent-violet">
        {display}
        {suffix}
      </div>
      <div className="mt-1 text-sm text-muted">{label}</div>
    </div>
  )
}

export default StatCounter
