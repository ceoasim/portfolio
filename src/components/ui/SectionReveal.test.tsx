import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SectionReveal from './SectionReveal.jsx'

describe('SectionReveal', () => {
  it('renders children inside the given tag', () => {
    render(
      <SectionReveal as="section" className="test-class">
        <p>Hello</p>
      </SectionReveal>,
    )
    const el = screen.getByText('Hello').closest('section')
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('test-class')
  })
})
