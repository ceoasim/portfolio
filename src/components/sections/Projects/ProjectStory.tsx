import type { Project } from '../../../types/content.js'
import TechBadge from '../../ui/TechBadge.js'

interface ProjectStoryProps {
  project: Project
}

const BEATS: { key: 'problem' | 'description' | 'architectureHighlight' | 'impact'; label: string }[] = [
  { key: 'problem', label: 'Problem' },
  { key: 'description', label: 'Approach & Features' },
  { key: 'architectureHighlight', label: 'Architecture' },
  { key: 'impact', label: 'Impact' },
]

function ProjectStory({ project }: ProjectStoryProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-8 py-10 sm:px-11">
        <p className="font-mono text-xs uppercase tracking-wide text-accent">
          Featured Project{project.company ? ` · ${project.company}` : ''}
        </p>
        <h3 className="mt-3 font-serif text-3xl font-normal text-ink sm:text-4xl">{project.name}</h3>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <TechBadge key={tag} label={tag} />
          ))}
        </div>
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-block text-sm font-semibold text-accent-green hover:underline"
          >
            {project.demoLabel} →
          </a>
        )}
      </div>
      {project.image ? (
        <img
          src={project.image}
          alt={`${project.name} screenshot`}
          loading="lazy"
          decoding="async"
          className="aspect-[16/9] w-full object-cover"
        />
      ) : (
        <div className="mx-8 my-8 flex aspect-[16/9] items-center justify-center rounded-lg border border-dashed border-border font-mono text-xs uppercase tracking-wide text-muted sm:mx-11">
          Screenshot coming soon
        </div>
      )}
      {BEATS.map(({ key, label }, i) => {
        const text = project[key]
        if (!text) return null
        return (
          <div
            key={key}
            className={`grid gap-4 px-8 py-8 sm:grid-cols-[80px_1fr] sm:px-11 ${
              i < BEATS.length - 1 ? 'border-b border-border' : ''
            }`}
          >
            <p className="font-mono text-sm text-accent">{String(i + 1).padStart(2, '0')}</p>
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-muted">{label}</p>
              <p className="mt-2 text-ink">{text}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ProjectStory
