import { describe, it, expect } from 'vitest'
import { computeTilt } from './tiltOffset.js'

describe('computeTilt', () => {
  const rect = { left: 0, top: 0, width: 100, height: 100 }

  it('returns zero tilt at the card center', () => {
    expect(computeTilt(rect, 50, 50, 8)).toEqual({ rotateX: 0, rotateY: 0 })
  })

  it('tilts toward the cursor, capped at maxDeg', () => {
    const result = computeTilt(rect, 100, 0, 8)
    expect(result.rotateX).toBe(8)
    expect(result.rotateY).toBe(8)
  })

  it('clamps to maxDeg when the cursor is reported outside the card bounds', () => {
    const result = computeTilt(rect, 150, 140, 8)
    expect(result.rotateX).toBe(-8)
    expect(result.rotateY).toBe(8)

    const result2 = computeTilt(rect, -50, -40, 8)
    expect(result2.rotateX).toBe(8)
    expect(result2.rotateY).toBe(-8)
  })
})
