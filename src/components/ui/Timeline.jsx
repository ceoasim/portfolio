import { motion } from 'framer-motion'
import TechBadge from './TechBadge.jsx'

function Timeline({ entries }) {
  return (
    <ol className="relative border-l border-subtle pl-8">
      {entries.map((entry) => (
        <li key={entry.company} className="mb-12 last:mb-0">
          <motion.span
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full bg-accent-violet"
          />
          <p className="font-mono text-xs text-muted">
            {entry.start} – {entry.end}
          </p>
          <h3 className="mt-1 text-lg font-bold">
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
