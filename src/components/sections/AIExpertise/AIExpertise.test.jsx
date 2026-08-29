import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AIExpertise from './AIExpertise.jsx'
import { aiCapabilities } from '../../../data/aiExpertise.js'

describe('AIExpertise', () => {
  it('renders every capability group label', () => {
    render(<AIExpertise />)
    aiCapabilities.forEach((group) => {
      expect(screen.getByText(group.label)).toBeInTheDocument()
    })
  })

  it('has id="ai"', () => {
    const { container } = render(<AIExpertise />)
    expect(container.querySelector('#ai')).toBeInTheDocument()
  })
})
