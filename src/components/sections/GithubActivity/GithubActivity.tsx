import GitHubCalendar from 'react-github-calendar'
import { profile } from '../../../data/profile.js'
import SectionReveal from '../../ui/SectionReveal.js'

function GithubActivity() {
  return (
    <SectionReveal as="section" className="px-6 py-24">
      <div id="github-activity" className="mx-auto max-w-4xl scroll-mt-24 text-center">
        <h2 className="font-serif text-3xl font-normal text-ink">
          Days I <span className="text-accent">Code</span>
        </h2>
        <div className="mt-8 flex justify-center">
          <GitHubCalendar
            username={profile.githubUsername}
            color="#964a24"
            blockSize={12}
            blockMargin={4}
            fontSize={14}
          />
        </div>
      </div>
    </SectionReveal>
  )
}

export default GithubActivity
