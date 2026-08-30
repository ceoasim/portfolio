import { projects } from '../../../data/projects.js'
import SectionReveal from '../../ui/SectionReveal.js'
import ProjectStory from './ProjectStory.js'
import ProjectCard from './ProjectCard.js'

function Projects() {
  const stories = projects.filter((p) => p.storyLayout)
  const standard = projects.filter((p) => !p.storyLayout)

  return (
    <SectionReveal as="section" className="px-6 py-24">
      <div id="projects" className="mx-auto max-w-5xl scroll-mt-24">
        <h2 className="font-serif text-3xl font-normal text-ink">
          Featured <span className="text-accent">Projects</span>
        </h2>
        <div className="mt-12 flex flex-col gap-16">
          {stories.map((project) => (
            <ProjectStory key={project.id} project={project} />
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
