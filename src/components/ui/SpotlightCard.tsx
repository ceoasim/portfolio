import type { ReactNode } from 'react'

interface SpotlightCardProps {
  className?: string
  children: ReactNode
}

function SpotlightCard({ className = '', children }: SpotlightCardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface transition-[transform,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-accent motion-reduce:hover:translate-y-0 ${className}`}
    >
      {children}
    </div>
  )
}

export default SpotlightCard
