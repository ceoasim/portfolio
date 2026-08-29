import type React from 'react'
import GitHubCalendar from 'react-github-calendar'
import { profile } from '../../../data/profile.js'
import SectionReveal from '../../ui/SectionReveal.js'

function GithubActivity() {
  const calendarProps = {
    username: profile.githubUsername,
    colorScheme: 'dark',
    blockSize: 12,
    blockMargin: 4,
    fontSize: 14,
  } as unknown as React.ComponentProps<typeof GitHubCalendar>

  return (
    <SectionReveal as="section" className="px-6 py-24">
      <div id="github-activity" className="mx-auto max-w-4xl scroll-mt-24 text-center">
        <h2 className="text-2xl font-bold">
          Days I <span className="text-accent-violet">Code</span>
        </h2>
        <div className="mt-8 flex justify-center">
          <GitHubCalendar {...calendarProps} />
        </div>
      </div>
    </SectionReveal>
  )
}

export default GithubActivity
