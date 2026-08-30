import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Hero from './Hero.js'

describe('Hero', () => {
  it('renders the name and both CTAs with correct targets', () => {
    render(<Hero />)
    expect(screen.getByText('Muhammad Asim')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view projects/i })).toHaveAttribute('href', '#projects')
    expect(screen.getByRole('link', { name: /view resume/i })).toHaveAttribute(
      'href',
      expect.stringContaining('resume'),
    )
  })

  it('has id="hero" for anchor navigation', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('#hero')).toBeInTheDocument()
  })

  it('renders the profile photo with an accessible name', () => {
    render(<Hero />)
    expect(screen.getByRole('img', { name: 'Muhammad Asim' })).toBeInTheDocument()
  })
})
