import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Skills from './Skills.js'
import { skillGroups } from '../../../data/skills.js'

describe('Skills', () => {
  it('renders every group heading and at least its first item', () => {
    render(<Skills />)
    skillGroups.forEach((group) => {
      expect(screen.getByText(group.group)).toBeInTheDocument()
      expect(screen.getByText(group.items[0])).toBeInTheDocument()
    })
  })

  it('has id="skills"', () => {
    const { container } = render(<Skills />)
    expect(container.querySelector('#skills')).toBeInTheDocument()
  })
})
