import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from './Footer.js'

describe('Footer', () => {
  it('links to GitHub and LinkedIn only', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/ceoasim',
    )
    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute(
      'href',
      'https://linkedin.com/in/ceoasim',
    )
    expect(screen.queryByRole('link', { name: /twitter/i })).not.toBeInTheDocument()
  })
})
