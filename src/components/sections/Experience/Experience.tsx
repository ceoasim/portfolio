import { experience, education } from '../../../data/experience.js'
import SectionReveal from '../../ui/SectionReveal.js'
import Timeline from '../../ui/Timeline.js'

function Experience() {
  return (
    <SectionReveal as="section" className="px-6 py-24">
      <div id="experience" className="mx-auto max-w-3xl scroll-mt-24">
        <h2 className="font-serif text-3xl font-normal text-ink">
          Professional <span className="text-accent">Experience</span>
        </h2>
        <div className="mt-10 border-l border-border">
          <Timeline entries={experience} />
          <p className="mt-8 pl-8 text-sm text-muted">
            <span>{education.degree}</span> — <span>{education.school}</span> · <span>{education.detail}</span>
          </p>
        </div>
      </div>
    </SectionReveal>
  )
}

export default Experience
