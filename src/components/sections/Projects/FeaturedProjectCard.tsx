import AbstractProjectVisual from './AbstractProjectVisual.js'
import TechBadge from '../../ui/TechBadge.js'
import type { Project } from '../../../types/content.js'

interface FeaturedProjectCardProps {
  project: Project
  reverse: boolean
}

function FeaturedProjectCard({ project, reverse }: FeaturedProjectCardProps) {
  return (
    <div className={`grid items-center gap-10 md:grid-cols-2 ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}>
      <div>
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.name} screenshot`}
            loading="lazy"
            decoding="async"
            className="aspect-[16/9] w-full rounded-lg border border-subtle object-cover"
          />
        ) : (
          <AbstractProjectVisual tags={project.tags} />
        )}
      </div>
      <div>
        {project.company && <p className="font-mono text-xs text-muted">{project.company}</p>}
        <h3 className="mt-1 text-2xl font-bold">{project.name}</h3>
        {project.problem && <p className="mt-3 text-sm text-muted">{project.problem}</p>}
        <p className="mt-3 text-primary">{project.description}</p>
        {project.architectureHighlight && (
          <p className="mt-3 text-sm text-muted">{project.architectureHighlight}</p>
        )}
        {project.image && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <TechBadge key={tag} label={tag} />
            ))}
          </div>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block text-sm font-semibold text-accent-cyan hover:underline"
          >
            {project.demoLabel} →
          </a>
        )}
      </div>
    </div>
  )
}

export default FeaturedProjectCard
