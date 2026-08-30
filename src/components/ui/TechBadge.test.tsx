import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TechBadge from './TechBadge.js'

describe('TechBadge', () => {
  it('renders the label text', () => {
    render(<TechBadge label="React.js" />)
    expect(screen.getByText('React.js')).toBeInTheDocument()
  })
})
