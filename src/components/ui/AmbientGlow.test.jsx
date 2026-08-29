// src/components/ui/AmbientGlow.test.jsx
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AmbientGlow from './AmbientGlow.jsx'

describe('AmbientGlow', () => {
  it('renders a glow element with the given test id', () => {
    const { getByTestId } = render(<AmbientGlow />)
    expect(getByTestId('ambient-glow')).toBeInTheDocument()
  })
})
