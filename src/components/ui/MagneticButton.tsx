import { useRef, useState, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { computeMagneticOffset } from './magneticOffset.js'

const base =
  'inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-colors'
const variants = {
  primary: 'bg-accent text-paper hover:bg-ink',
  secondary: 'border border-border text-ink hover:border-accent',
}

interface MagneticButtonProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'> {
  href: string
  variant?: keyof typeof variants
  children: ReactNode
}

function MagneticButton({ href, variant = 'primary', onClick, children, ...rest }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setOffset(computeMagneticOffset(rect, e.clientX, e.clientY))
  }

  function handleMouseLeave() {
    setOffset({ x: 0, y: 0 })
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className={`${base} ${variants[variant]}`}
      {...rest}
    >
      {children}
    </motion.a>
  )
}

export default MagneticButton
