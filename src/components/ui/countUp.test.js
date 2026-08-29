import { describe, it, expect } from 'vitest'
import { getCountUpValue } from './countUp.js'

describe('getCountUpValue', () => {
  it('returns 0 at elapsed 0', () => {
    expect(getCountUpValue(0, 1000, 6)).toBe(0)
  })

  it('returns the target once elapsed reaches duration', () => {
    expect(getCountUpValue(1000, 1000, 6)).toBe(6)
  })

  it('clamps to the target if elapsed exceeds duration', () => {
    expect(getCountUpValue(5000, 1000, 6)).toBe(6)
  })

  it('interpolates and rounds at the halfway point', () => {
    expect(getCountUpValue(500, 1000, 7)).toBe(4) // 3.5 rounds to 4
  })
})
