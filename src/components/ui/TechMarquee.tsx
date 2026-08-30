import { useReducedMotion } from 'framer-motion'
import { techMarqueeItems } from '../../data/techMarquee.js'

function TechMarquee() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="overflow-hidden border-y border-border bg-surface py-6">
      {shouldReduceMotion ? (
        <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-3 px-6">
          {techMarqueeItems.map((item) => (
            <li key={item} className="font-mono text-xs uppercase tracking-wide text-muted">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <>
          <div className="flex w-max animate-marquee gap-10" aria-hidden="true">
            {[...techMarqueeItems, ...techMarqueeItems].map((item, i) => (
              <span key={`${item}-${i}`} className="whitespace-nowrap font-mono text-xs uppercase tracking-wide text-muted">
                {item}
              </span>
            ))}
          </div>
          <span className="sr-only">{techMarqueeItems.join(', ')}</span>
        </>
      )}
    </div>
  )
}

export default TechMarquee
