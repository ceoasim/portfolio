export interface Stat {
  value: number
  suffix: string
  label: string
}

export interface Profile {
  name: string
  location: string
  email: string
  linkedin: string
  github: string
  githubUsername: string
  heroValueProp: string
  snapshotSupportingCopy: string
  stats: Stat[]
}

export interface ExperienceEntry {
  company: string
  role: string
  start: string
  end: string
  current: boolean
  bullets: string[]
  tags: string[]
}

export interface Education {
  degree: string
  school: string
  detail: string
}

export interface Project {
  id: string
  name: string
  company: string | null
  tags: string[]
  problem: string | null
  description: string
  architectureHighlight: string | null
  impact: string | null
  storyLayout: boolean
  image: string | null
  demoUrl: string | null
  demoLabel: string | null
}

export interface SkillGroup {
  group: string
  items: string[]
}

export interface AICapability {
  label: string
  items: string[]
}
