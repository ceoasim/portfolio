import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Projects from './Projects.js'
import { projects } from '../../../data/projects.js'

describe('Projects', () => {
  it('renders a heading for every project', () => {
    render(<Projects />)
    projects.forEach((p) => {
      expect(screen.getByText(p.name)).toBeInTheDocument()
    })
  })

  it('has id="projects"', () => {
    const { container } = render(<Projects />)
    expect(container.querySelector('#projects')).toBeInTheDocument()
  })
})
