import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

vi.mock('react-github-calendar', () => ({
  default: (props: { username: string }) => <div data-testid="calendar" data-username={props.username} />,
}))

import { vi } from 'vitest'
import GithubActivity from './GithubActivity.js'

describe('GithubActivity', () => {
  it('renders the calendar with the correct username', () => {
    render(<GithubActivity />)
    expect(screen.getByTestId('calendar')).toHaveAttribute('data-username', 'ceoasim')
  })

  it('has id="github-activity"', () => {
    const { container } = render(<GithubActivity />)
    expect(container.querySelector('#github-activity')).toBeInTheDocument()
  })
})
