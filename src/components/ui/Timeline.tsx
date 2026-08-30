import { motion } from 'framer-motion'
import TechBadge from './TechBadge.js'
import type { ExperienceEntry } from '../../types/content.js'

interface TimelineProps {
  entries: ExperienceEntry[]
}

function Timeline({ entries }: TimelineProps) {
  return (
    <ol className="relative border-l border-border pl-8">
      {entries.map((entry) => (
        <li key={`${entry.company}-${entry.start}`} className="mb-12 last:mb-0">
          <motion.span
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full bg-accent"
          />
          <p className="font-mono text-xs text-muted">
            {entry.start} – {entry.end}
          </p>
          <h3 className="mt-1 font-serif text-lg font-normal text-ink">
            <span>{entry.role}</span> · <span>{entry.company}</span>
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {entry.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <TechBadge key={tag} label={tag} />
            ))}
          </div>
        </li>
      ))}
    </ol>
  )
}

export default Timeline
