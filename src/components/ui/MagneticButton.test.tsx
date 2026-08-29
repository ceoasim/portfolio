import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import MagneticButton from './MagneticButton.jsx'

describe('MagneticButton', () => {
  it('renders an anchor with the given label and href', () => {
    render(
      <MagneticButton href="#projects" variant="primary">
        View My Work
      </MagneticButton>,
    )
    const link = screen.getByRole('link', { name: 'View My Work' })
    expect(link).toHaveAttribute('href', '#projects')
  })
})
