import { skillGroups } from '../../../data/skills.js'
import SectionReveal from '../../ui/SectionReveal.js'
import TechBadge from '../../ui/TechBadge.js'

function Skills() {
  return (
    <SectionReveal as="section" className="px-6 py-24">
      <div id="skills" className="mx-auto max-w-5xl scroll-mt-24">
        <h2 className="text-2xl font-bold">
          Core <span className="text-accent-violet">Expertise</span>
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {skillGroups.map((group) => (
            <div key={group.group}>
              <h3 className="font-mono text-sm uppercase tracking-wide text-muted">{group.group}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <TechBadge key={item} label={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionReveal>
  )
}

export default Skills
