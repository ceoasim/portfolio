import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StatCounter from './StatCounter.js'

describe('StatCounter', () => {
  it('renders the label and starts at 0 before animating', () => {
    render(<StatCounter value={6} suffix="+" label="Years Experience" />)
    expect(screen.getByText('Years Experience')).toBeInTheDocument()
    expect(screen.getByText('0+')).toBeInTheDocument()
  })
})
