import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ProjectStory from './ProjectStory.js'
import type { Project } from '../../../types/content.js'

const baseProject: Project = {
  id: 'test-project',
  name: 'Test Project',
  company: 'Test Co',
  tags: ['React.js', 'Node.js'],
  problem: 'A real problem statement.',
  description: 'A real approach and features statement.',
  architectureHighlight: 'A real architecture statement.',
  impact: 'A real impact statement.',
  storyLayout: true,
  image: null,
  demoUrl: 'https://example.com',
  demoLabel: 'Live Product',
}

describe('ProjectStory', () => {
  it('renders all four beats with numbered labels and their content', () => {
    render(<ProjectStory project={baseProject} />)
    expect(screen.getByText('Problem')).toBeInTheDocument()
    expect(screen.getByText('Approach & Features')).toBeInTheDocument()
    expect(screen.getByText('Architecture')).toBeInTheDocument()
    expect(screen.getByText('Impact')).toBeInTheDocument()
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('02')).toBeInTheDocument()
    expect(screen.getByText('03')).toBeInTheDocument()
    expect(screen.getByText('04')).toBeInTheDocument()
    expect(screen.getByText(baseProject.problem as string)).toBeInTheDocument()
    expect(screen.getByText(baseProject.description)).toBeInTheDocument()
    expect(screen.getByText(baseProject.architectureHighlight as string)).toBeInTheDocument()
    expect(screen.getByText(baseProject.impact as string)).toBeInTheDocument()
  })

  it('renders a placeholder block instead of a broken image when image is null', () => {
    render(<ProjectStory project={baseProject} />)
    expect(screen.getByText(/screenshot coming soon/i)).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders the real screenshot when image is provided', () => {
    render(<ProjectStory project={{ ...baseProject, image: '/fake-image.png' }} />)
    expect(screen.getByRole('img', { name: `${baseProject.name} screenshot` })).toBeInTheDocument()
    expect(screen.queryByText(/screenshot coming soon/i)).not.toBeInTheDocument()
  })

  it('shows the demo link when demoUrl is present', () => {
    render(<ProjectStory project={baseProject} />)
    expect(screen.getByRole('link', { name: /live product/i })).toHaveAttribute('href', 'https://example.com')
  })
})
