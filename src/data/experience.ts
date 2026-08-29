import type { ExperienceEntry, Education } from '../types/content.js'

export const experience: ExperienceEntry[] = [
  {
    company: 'SMS Holdings',
    role: 'Senior Software Engineer',
    start: 'Feb 2025',
    end: 'Present',
    current: true,
    bullets: [
      'Led AI feature integration across core products — LLM-backed assistants, automated content generation, intelligent search — via API-based model integrations with fallback, retry, and cost-control layers.',
      'Designed prompt/context strategies with structured outputs and schema validation, eliminating downstream parsing failures in production.',
      'Adopted agentic coding tools (Claude Code, Cursor) into team workflow for scaffolding, legacy migration, and test-coverage expansion, with human review gates on every AI-generated change.',
      'Hardened security posture (auth rebuild, RBAC) and strengthened CI/CD and observability, improving uptime and mean-time-to-detect.',
    ],
    tags: ['LLM Integration', 'Prompt Engineering', 'CI/CD', 'Security', 'Mentorship'],
  },
  {
    company: 'CodingCops',
    role: 'Senior Software Engineer',
    start: 'Feb 2022',
    end: 'Jan 2025',
    current: false,
    bullets: [
      'Owned architecture, development, and deployment of multi-tenant B2B hospitality platforms.',
      'Migrated a monolith to microservices, delivering a 35% performance improvement and independent service scalability.',
      'Built AI-assisted features on GPT and Gemini APIs (conversational interfaces, automated content, intelligent search) through clean service boundaries.',
      'Automated CI/CD with JUnit coverage, cutting release time to near-zero manual effort; authored TDD guidelines adopted org-wide.',
    ],
    tags: ['Microservices', 'GPT/Gemini', 'CI/CD', 'Ruby on Rails', 'React'],
  },
  {
    company: 'TectSoft',
    role: 'Software Engineer',
    start: 'Oct 2020',
    end: 'Jan 2022',
    current: false,
    bullets: [
      'Redesigned portal matching workflows, driving a 20% sales increase for a retail client.',
      'Delivered mobile applications for Namibian government clients — full ownership of design, architecture, and store publication.',
      'Led OCR R&D with React Native + Tesseract, improving identity-document extraction accuracy.',
      'Built a citizen police-verification platform from scratch (document verification, attestation, gesture-based security).',
    ],
    tags: ['React Native', 'OCR', 'Mobile', 'GitLab CI'],
  },
]

export const education: Education = {
  degree: 'BS Software Engineering',
  school: 'Lahore Garrison University',
  detail: 'CGPA 3.4 / 4.0',
}
