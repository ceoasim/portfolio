import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SpotlightCard from './SpotlightCard.jsx'

describe('SpotlightCard', () => {
  it('renders children', () => {
    render(
      <SpotlightCard className="test-class">
        <p>Project name</p>
      </SpotlightCard>,
    )
    expect(screen.getByText('Project name')).toBeInTheDocument()
  })
})
