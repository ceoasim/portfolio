import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TechMarquee from './TechMarquee.js'
import { techMarqueeItems } from '../../data/techMarquee.js'

// framer-motion's real useReducedMotion() memoizes its window.matchMedia
// read in a module-level singleton the first time it's called in a given
// module registry — reassigning window.matchMedia per test does NOT make it
// re-read the preference on later tests in the same file (verified: it
// reliably keeps returning the first test's value). Mocking the hook
// directly exercises TechMarquee's own branching logic without depending on
// that internal caching behavior.
const useReducedMotionMock = vi.fn()

vi.mock('framer-motion', () => ({
  useReducedMotion: () => useReducedMotionMock(),
}))

describe('TechMarquee', () => {
  it('provides every tech item to screen readers exactly once via the sr-only fallback', () => {
    useReducedMotionMock.mockReturnValue(false)
    const { container } = render(<TechMarquee />)
    const srOnly = container.querySelector('.sr-only')
    expect(srOnly).not.toBeNull()
    techMarqueeItems.forEach((item) => {
      expect(srOnly?.textContent).toContain(item)
    })
  })

  it('marks the decorative scrolling strip as aria-hidden', () => {
    useReducedMotionMock.mockReturnValue(false)
    const { container } = render(<TechMarquee />)
    const hiddenStrip = container.querySelector('[aria-hidden="true"]')
    expect(hiddenStrip).not.toBeNull()
  })

  it('renders a static, non-duplicated list under reduced motion', () => {
    useReducedMotionMock.mockReturnValue(true)
    render(<TechMarquee />)
    techMarqueeItems.forEach((item) => {
      expect(screen.getAllByText(item)).toHaveLength(1)
    })
  })
})
