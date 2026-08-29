// src/components/ui/TechBadge.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TechBadge from './TechBadge.jsx'

describe('TechBadge', () => {
  it('renders the label text', () => {
    render(<TechBadge label="React.js" />)
    expect(screen.getByText('React.js')).toBeInTheDocument()
  })
})
