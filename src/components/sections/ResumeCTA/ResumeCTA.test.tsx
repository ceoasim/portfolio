import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ResumeCTA from './ResumeCTA.js'

describe('ResumeCTA', () => {
  it('renders a download resume link', () => {
    render(<ResumeCTA />)
    expect(screen.getByRole('link', { name: /download resume/i })).toHaveAttribute(
      'href',
      expect.stringContaining('resume'),
    )
  })
})
