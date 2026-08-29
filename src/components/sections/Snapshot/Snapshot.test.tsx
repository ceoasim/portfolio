import { render } from '@testing-library/react'
import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Snapshot from './Snapshot.js'
import { profile } from '../../../data/profile.js'

describe('Snapshot', () => {
  it('renders a stat label for every profile stat', () => {
    render(<Snapshot />)
    profile.stats.forEach((stat) => {
      expect(screen.getByText(stat.label)).toBeInTheDocument()
    })
  })

  it('has id="snapshot"', () => {
    const { container } = render(<Snapshot />)
    expect(container.querySelector('#snapshot')).toBeInTheDocument()
  })
})
