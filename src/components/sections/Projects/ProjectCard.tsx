import SpotlightCard from '../../ui/SpotlightCard.js'
import TechBadge from '../../ui/TechBadge.js'
import AbstractProjectVisual from './AbstractProjectVisual.js'
import type { Project } from '../../../types/content.js'

interface ProjectCardProps {
  project: Project
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <SpotlightCard className="flex h-full flex-col p-5">
      {project.image ? (
        <img
          src={project.image}
          alt={`${project.name} screenshot`}
          loading="lazy"
          decoding="async"
          className="aspect-[16/9] w-full rounded-md object-cover"
        />
      ) : (
        <AbstractProjectVisual tags={project.tags} />
      )}
      <h3 className="mt-4 text-lg font-bold">{project.name}</h3>
      <p className="mt-2 flex-1 text-sm text-muted">{project.description}</p>
      {project.image && (
        <div className="mt-3 flex flex-wrap gap-2">
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
          className="mt-3 inline-block text-sm font-semibold text-accent-cyan hover:underline"
        >
          {project.demoLabel} →
        </a>
      )}
    </SpotlightCard>
  )
}

export default ProjectCard
