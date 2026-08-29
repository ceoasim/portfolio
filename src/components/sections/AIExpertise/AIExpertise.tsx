import { aiFraming, aiCapabilities } from '../../../data/aiExpertise.js'
import SectionReveal from '../../ui/SectionReveal.js'
import TechBadge from '../../ui/TechBadge.js'

function AIExpertise() {
  return (
    <SectionReveal as="section" className="px-6 py-24">
      <div id="ai" className="mx-auto max-w-5xl scroll-mt-24">
        <h2 className="text-2xl font-bold">
          AI Engineering <span className="text-accent-violet">Expertise</span>
        </h2>
        <p className="mt-3 max-w-2xl text-muted">{aiFraming}</p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {aiCapabilities.map((group) => (
            <div key={group.label}>
              <h3 className="font-mono text-sm uppercase tracking-wide text-muted">{group.label}</h3>
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

export default AIExpertise
