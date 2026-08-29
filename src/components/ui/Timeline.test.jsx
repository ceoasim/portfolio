import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Timeline from './Timeline.jsx'

const entries = [
  { company: 'A', role: 'Engineer', start: '2024', end: 'Present', current: true, bullets: ['Did X'], tags: ['React'] },
  { company: 'B', role: 'Engineer', start: '2020', end: '2024', current: false, bullets: ['Did Y'], tags: ['Node'] },
]

describe('Timeline', () => {
  it('renders every entry company, role, and bullets', () => {
    render(<Timeline entries={entries} />)
    entries.forEach((e) => {
      // Check for the combination of role and company
      expect(screen.getByText(new RegExp(`${e.role}.*${e.company}`))).toBeInTheDocument()
      e.bullets.forEach((b) => expect(screen.getByText(b)).toBeInTheDocument())
    })
  })
})
