import type { ElementType, ReactNode } from 'react'
import { motion } from 'framer-motion'

const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

interface SectionRevealProps {
  as?: ElementType
  className?: string
  delay?: number
  children: ReactNode
}

function SectionReveal({ as = 'div', className = '', delay = 0, children }: SectionRevealProps) {
  const MotionTag = (motion as unknown as Record<string, ElementType>)[as as string] ?? motion.div
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </MotionTag>
  )
}

export default SectionReveal
