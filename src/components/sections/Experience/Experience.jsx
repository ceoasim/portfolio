import { experience, education } from '../../../data/experience.js'
import SectionReveal from '../../ui/SectionReveal.jsx'
import Timeline from '../../ui/Timeline.jsx'

function Experience() {
  return (
    <SectionReveal as="section" className="px-6 py-24">
      <div id="experience" className="mx-auto max-w-3xl scroll-mt-24">
        <h2 className="text-2xl font-bold">
          Professional <span className="text-accent-violet">Experience</span>
        </h2>
        <div className="mt-10">
          <Timeline entries={experience} />
        </div>
        <p className="mt-8 border-l border-subtle pl-8 text-sm text-muted">
          <span>{education.degree}</span> — <span>{education.school}</span> · <span>{education.detail}</span>
        </p>
      </div>
    </SectionReveal>
  )
}

export default Experience
