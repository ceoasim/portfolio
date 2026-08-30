import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TechMarquee from './TechMarquee.js'
import { techMarqueeItems } from '../../data/techMarquee.js'

describe('TechMarquee', () => {
  it('renders every tech item accessibly at least once', () => {
    render(<TechMarquee />)
    techMarqueeItems.forEach((item) => {
      expect(screen.getAllByText(item).length).toBeGreaterThan(0)
    })
  })
})
