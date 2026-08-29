import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('react-github-calendar', () => ({
  default: (props) => <div data-testid="calendar" data-username={props.username} />,
}))

import GithubActivity from './GithubActivity.jsx'

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
