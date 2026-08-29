// src/components/ui/magneticOffset.test.js
import { describe, it, expect } from 'vitest'
import { computeMagneticOffset } from './magneticOffset.js'

describe('computeMagneticOffset', () => {
  const rect = { left: 100, top: 100, width: 40, height: 20 }

  it('returns zero offset when cursor is at the button center', () => {
    expect(computeMagneticOffset(rect, 120, 110)).toEqual({ x: 0, y: 0 })
  })

  it('scales offset by the strength factor', () => {
    // center is (120, 110); cursor is 20px right, 10px down of center
    expect(computeMagneticOffset(rect, 140, 120, 0.25)).toEqual({ x: 5, y: 2.5 })
  })
})
