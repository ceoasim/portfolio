import { motion, useReducedMotion } from 'framer-motion'

const NODES = [
  { x: 60, y: 40 }, { x: 180, y: 20 }, { x: 220, y: 120 },
  { x: 100, y: 160 }, { x: 20, y: 110 }, { x: 150, y: 90 },
]
const EDGES: [number, number][] = [[0, 1], [1, 2], [2, 5], [5, 0], [0, 4], [4, 3], [3, 5]]

function HeroVisual() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <svg viewBox="0 0 240 200" className="h-64 w-64 motion-reduce:opacity-80" aria-hidden="true">
      {EDGES.map(([a, b], i) => (
        <line
          key={i}
          x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
          stroke="#8b7bff" strokeOpacity={0.35} strokeWidth={1}
        />
      ))}
      {NODES.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x} cy={n.y} r={5}
          fill={i % 2 === 0 ? '#8b7bff' : '#25c9d0'}
          initial={{ cy: n.y }}
          animate={shouldReduceMotion ? { cy: n.y } : { cy: [n.y, n.y - 8, n.y] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  )
}

export default HeroVisual
