import { describe, it, expect } from 'vitest'
import { profile } from './profile.js'
import { experience } from './experience.js'
import { projects } from './projects.js'
import { skillGroups } from './skills.js'

describe('content data', () => {
  it('profile has all required fields', () => {
    expect(profile.name).toBe('Muhammad Asim')
    expect(profile.email).toBe('asimm364@gmail.com')
    expect(profile.linkedin).toBe('https://linkedin.com/in/ceoasim')
    expect(profile.github).toBe('https://github.com/ceoasim')
    expect(profile.githubUsername).toBe('ceoasim')
    expect(profile.stats).toHaveLength(4)
  })

  it('experience has 3 roles in reverse-chronological order', () => {
    expect(experience).toHaveLength(3)
    expect(experience[0].company).toBe('SMS Holdings')
    expect(experience[0].current).toBe(true)
    expect(experience[1].company).toBe('CodingCops')
    expect(experience[2].company).toBe('TectSoft')
    experience.forEach((role) => {
      expect(role.bullets.length).toBeGreaterThan(0)
      expect(role.tags.length).toBeGreaterThan(0)
    })
  })

  it('projects has exactly 7 entries with 2 story-layout case studies', () => {
    expect(projects).toHaveLength(7)
    const stories = projects.filter((p) => p.storyLayout)
    expect(stories).toHaveLength(2)
    expect(stories.map((p) => p.id).sort()).toEqual(['mindminer', 'stacklead'])
    stories.forEach((p) => expect(p.impact).toBeTruthy())
    projects.forEach((p) => {
      expect(p.tags.length).toBeGreaterThan(0)
      expect(p.description).toBeTruthy()
    })
  })

  it('skillGroups covers the 6 resume competency groups', () => {
    const groupNames = skillGroups.map((g) => g.group)
    expect(groupNames).toEqual([
      'Frontend',
      'Backend & Mobile',
      'AI & LLM',
      'Cloud & DevOps',
      'Databases',
      'Distributed Systems',
    ])
    skillGroups.forEach((g) => expect(g.items.length).toBeGreaterThan(0))
  })
})
