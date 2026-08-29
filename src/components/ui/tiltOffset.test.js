// src/components/ui/tiltOffset.test.js
import { describe, it, expect } from 'vitest'
import { computeTilt } from './tiltOffset.js'

describe('computeTilt', () => {
  const rect = { left: 0, top: 0, width: 100, height: 100 }

  it('returns zero tilt at the card center', () => {
    expect(computeTilt(rect, 50, 50, 8)).toEqual({ rotateX: 0, rotateY: 0 })
  })

  it('tilts toward the cursor, capped at maxDeg', () => {
    // cursor at top-right corner
    const result = computeTilt(rect, 100, 0, 8)
    expect(result.rotateX).toBe(8)
    expect(result.rotateY).toBe(8)
  })
})
