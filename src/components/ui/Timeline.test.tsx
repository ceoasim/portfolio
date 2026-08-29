import { render, within } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Timeline from './Timeline.js'

const entries = [
  { company: 'A', role: 'Engineer', start: '2024', end: 'Present', current: true, bullets: ['Did X'], tags: ['React'] },
  { company: 'B', role: 'Engineer', start: '2020', end: '2024', current: false, bullets: ['Did Y'], tags: ['Node'] },
]

describe('Timeline', () => {
  it('renders every entry company, role, and bullets', () => {
    const { container } = render(<Timeline entries={entries} />)
    const listItems = container.querySelectorAll('ol > li')
    entries.forEach((e, index) => {
      const item = listItems[index]
      expect(within(item as HTMLElement).getByText(e.company)).toBeInTheDocument()
      expect(within(item as HTMLElement).getByText(e.role)).toBeInTheDocument()
      e.bullets.forEach((b) => expect(within(item as HTMLElement).getByText(b)).toBeInTheDocument())
    })
  })
})
