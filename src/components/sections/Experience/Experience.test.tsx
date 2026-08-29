import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Experience from './Experience.js'
import { education } from '../../../data/experience.js'

describe('Experience', () => {
  it('renders the education entry at the end', () => {
    render(<Experience />)
    expect(screen.getByText(education.school)).toBeInTheDocument()
  })

  it('has id="experience"', () => {
    const { container } = render(<Experience />)
    expect(container.querySelector('#experience')).toBeInTheDocument()
  })
})
