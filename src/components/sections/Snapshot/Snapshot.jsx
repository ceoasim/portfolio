import { profile } from '../../../data/profile.js'
import SectionReveal from '../../ui/SectionReveal.jsx'
import StatCounter from '../../ui/StatCounter.jsx'

function Snapshot() {
  return (
    <SectionReveal as="section" className="px-6 py-24" delay={0}>
      <div id="snapshot" className="mx-auto max-w-4xl scroll-mt-24 text-center">
        <h2 className="sr-only">About</h2>
        <p className="text-lg text-muted">{profile.snapshotSupportingCopy}</p>
        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {profile.stats.map((stat) => (
            <StatCounter key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
          ))}
        </div>
      </div>
    </SectionReveal>
  )
}

export default Snapshot
