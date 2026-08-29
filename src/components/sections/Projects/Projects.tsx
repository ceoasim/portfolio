import { projects } from '../../../data/projects.js'
import SectionReveal from '../../ui/SectionReveal.js'
import FeaturedProjectCard from './FeaturedProjectCard.js'
import ProjectCard from './ProjectCard.js'

function Projects() {
  const featured = projects.filter((p) => p.featured)
  const standard = projects.filter((p) => !p.featured)

  return (
    <SectionReveal as="section" className="px-6 py-24">
      <div id="projects" className="mx-auto max-w-6xl scroll-mt-24">
        <h2 className="text-2xl font-bold">
          Featured <span className="text-accent-violet">Projects</span>
        </h2>
        <div className="mt-12 flex flex-col gap-20">
          {featured.map((project, i) => (
            <FeaturedProjectCard key={project.id} project={project} reverse={i % 2 === 1} />
          ))}
        </div>
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {standard.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </SectionReveal>
  )
}

export default Projects
