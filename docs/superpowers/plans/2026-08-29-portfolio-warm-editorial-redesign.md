# Portfolio Warm-Editorial Redesign + TypeScript Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the portfolio codebase to TypeScript, then replace its "Deep Space Mesh" dark visual system with the approved "Warm Technical Mono" editorial system, promote StackLead to flagship project, and integrate the user's profile photo.

**Architecture:** Two sequential phases. Phase A converts every source file to `.ts`/`.tsx` with no behavior change (mechanical, low judgment risk, verified green after each task). Phase B layers the new design tokens, retires dark-theme-only interactions (AmbientGlow, card tilt), reskins every section, adds the new Tech Marquee section, and updates project/profile data — each task independently buildable and testable.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS, Framer Motion, Vitest + @testing-library/react. No new frameworks; TypeScript and one new component (`TechMarquee`) are the only additions.

**Spec:** `docs/superpowers/specs/2026-08-29-portfolio-warm-editorial-redesign-design.md`

## Global Constraints

- No dark mode / theme toggle — one light theme throughout.
- No invented content. StackLead's four story beats are paraphrased from the resume's "AnyWork Agent" bullets plus the product screenshots described in the spec §2 — no numbers beyond what's stated there.
- Color tokens (exact hex, from spec §3): `paper #f2ece0`, `surface #ece4d2`, `border #d9cdb6`, `ink #262019`, `muted #5c5344`, `accent #a8552b`.
- Fonts: Fraunces (serif, display/headlines only), JetBrains Mono (labels/tags/eyebrows), Inter (all body copy) — all via Google Fonts `<link>`, no new npm font packages.
- All motion respects `prefers-reduced-motion`: reuse the existing `MotionConfig reducedMotion="user"` pattern plus explicit `useReducedMotion()` checks for anything outside Framer Motion's `positionalKeys` (SVG attributes, raw `requestAnimationFrame` loops, CSS animations like the tech marquee scroll).
- Every task must leave `npm run build` and `npm run test` green before its commit.
- Single-page anchor-scroll architecture stays; no `react-router-dom`.
- Exact contact links stay unchanged: email `asimm364@gmail.com`, LinkedIn `https://linkedin.com/in/ceoasim`, GitHub `https://github.com/ceoasim`.
- Resume stays download/view-only via the existing PDF import pattern (`import resumePdf from '../../../Assets/muhammad_asim_resume.pdf'`).
- StackLead's image field stays `null` (rendering its placeholder block) until a real screenshot file is supplied — do not fabricate or synthesize an image.

## File Structure

**New files:**
- `tsconfig.json`, `tsconfig.node.json` — TypeScript project config
- `src/types/content.ts` — shared interfaces: `Profile`, `Project`, `ExperienceEntry`, `Education`, `SkillGroup`, `AICapability`
- `src/data/techMarquee.ts` — the 14-item tech list for the new marquee section
- `src/components/ui/TechMarquee.tsx` (+ `.test.tsx`) — new auto-scrolling tech strip
- `src/components/sections/Projects/ProjectStory.tsx` — new full-bleed numbered case-study layout (replaces `FeaturedProjectCard` for `storyLayout: true` projects)
- `src/Assets/profile.jpg` — the user's headshot (copied from repo-root `pic.jpg`)

**Renamed (`.jsx`→`.tsx`, `.js`→`.ts`) — same directory, same responsibility, typed:**
All files under `src/components/`, `src/data/`, plus `src/App.jsx`, `src/App.test.jsx`, `src/main.jsx`, `src/test/setup.js`, `vite.config.js`.

**Deleted:**
- `src/components/ui/AmbientGlow.jsx` + `.test.jsx` — dark-glow mouse effect, no place in the paper-editorial theme
- `src/components/ui/tiltOffset.js` + `.test.js` — card-tilt math, no longer used once `SpotlightCard`'s tilt interaction is removed
- `src/components/sections/Hero/HeroVisual.jsx` — the node-graph SVG is superseded by the profile photo in the new hero layout
- `src/components/sections/Projects/FeaturedProjectCard.jsx` — superseded by `ProjectStory.tsx`

**Modified (content/logic, not just renamed):** `tailwind.config.js`, `index.css`, `index.html`, `public/manifest.json`, `src/data/profile.ts`, `src/data/projects.ts`, every section/UI component's className tokens, `README.md`.

## Task Sequencing Rationale

Phase A (Tasks 1–8) is pure mechanical conversion — every file keeps its current behavior and classNames, just typed and renamed. This is deliberately isolated from Phase B (Tasks 9–23) so a TypeScript mistake and a visual-design mistake are never entangled in the same diff. Phase B tasks 9–10 are additive/isolated (new tokens added alongside old ones so nothing breaks mid-migration; dark-only interactions retired in one contained task), then Tasks 11–21 reskin/rebuild one component group at a time, Task 22 removes the now-dead old tokens as cleanup once nothing references them, and Task 23 updates documentation.

---

## Phase A — TypeScript Migration

### Task 1: TypeScript tooling setup

**Files:**
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Modify: `package.json` (add devDependencies)
- Modify: `vite.config.js` → rename to `vite.config.ts`
- Modify: `tailwind.config.js` (content globs only)

**Interfaces:**
- Produces: a working `tsc --noEmit` command and a `vite.config.ts` that Vite picks up automatically (no other task depends on new exports here, only on the tooling existing).

- [ ] **Step 1: Install TypeScript and React types**

Run: `npm install --save-dev typescript @types/react @types/react-dom`

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "allowJs": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

`allowJs: true` is deliberate — during Phase A, `.tsx` files still import not-yet-converted `.jsx` files, and this must not error.

- [ ] **Step 3: Create `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Rename `vite.config.js` to `vite.config.ts`**

Delete `vite.config.js`, create `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
```

(The `setupFiles` path stays `.js` for now — Task 3 renames it and updates this reference.)

- [ ] **Step 5: Update Tailwind content globs to include TS/TSX**

In `tailwind.config.js`, change:

```js
content: ['./index.html', './src/**/*.{js,jsx}'],
```

to:

```js
content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
```

- [ ] **Step 6: Verify tooling works without breaking the existing build**

Run: `npx tsc --noEmit` — Expected: no errors (nothing to type-check yet beyond config).
Run: `npm run build` — Expected: succeeds exactly as before (no `.tsx` files exist yet).
Run: `npm run test` — Expected: all existing tests still pass.

- [ ] **Step 7: Commit**

```bash
git add tsconfig.json tsconfig.node.json vite.config.ts package.json package-lock.json tailwind.config.js
git rm vite.config.js
git commit -m "Add TypeScript tooling (tsconfig, vite.config.ts, type deps)"
```

---

### Task 2: Convert data layer to TypeScript

**Files:**
- Create: `src/types/content.ts`
- Modify (rename `.js`→`.ts`): `src/data/profile.ts`, `src/data/experience.ts`, `src/data/projects.ts`, `src/data/skills.ts`, `src/data/aiExpertise.ts`
- Modify (rename `.js`→`.ts`): `src/data/content.test.ts`

**Interfaces:**
- Produces: `Profile`, `Project`, `ExperienceEntry`, `Education`, `SkillGroup`, `AICapability` types from `src/types/content.ts`, and typed `profile`, `experience`, `education`, `projects`, `skillGroups`, `aiFraming`, `aiCapabilities` exports — every later task that imports from `src/data/*` relies on these exact names and shapes.
- Note: `Project.featured` still exists here (unchanged) — it is replaced by `storyLayout` in Task 17, which is a Phase B content task, not this mechanical conversion.

- [ ] **Step 1: Create `src/types/content.ts`**

```ts
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
  typewriterStrings: string[]
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
  featured: boolean
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
```

- [ ] **Step 2: Convert `src/data/profile.js` to `src/data/profile.ts`**

Delete `src/data/profile.js`, create `src/data/profile.ts` with the same content plus a type annotation:

```ts
import type { Profile } from '../types/content.js'

export const profile: Profile = {
  name: 'Muhammad Asim',
  location: 'Lahore, Pakistan',
  email: 'asimm364@gmail.com',
  linkedin: 'https://linkedin.com/in/ceoasim',
  github: 'https://github.com/ceoasim',
  githubUsername: 'ceoasim',
  heroValueProp:
    'I build production systems on top of frontier models — LLM integrations, RAG pipelines, and agentic tool-calling workflows — backed by 6+ years shipping full-stack web, mobile, and cloud products. I use agentic coding tools daily while keeping architectural judgment and review discipline human-owned.',
  snapshotSupportingCopy:
    'Comfortable owning the full path from microservice architecture to CI/CD, observability, and latency/cost tuning of model-backed services — across web, mobile, and cloud.',
  typewriterStrings: [
    'AI-Native Product Engineer',
    'Full-Stack Systems Builder',
    'Cloud-Native Architect',
    'Agentic Workflow Designer',
  ],
  stats: [
    { value: 6, suffix: '+', label: 'Years Experience' },
    { value: 3, suffix: '', label: 'Companies' },
    { value: 7, suffix: '', label: 'Projects Shipped' },
    { value: 5, suffix: '+', label: 'AI Model Providers' },
  ],
}
```

(Import paths use the `.js` extension per this project's existing convention with `moduleResolution: "bundler"` and `allowImportingTsExtensions` — TypeScript resolves `.ts` files imported with a `.js` specifier under NodeNext-style resolution; this matches how Vite already resolves extensionless/`.js`-suffixed relative imports.)

- [ ] **Step 3: Convert `src/data/experience.js` to `src/data/experience.ts`**

Delete `src/data/experience.js`, create `src/data/experience.ts`:

```ts
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
```

- [ ] **Step 4: Convert `src/data/projects.js` to `src/data/projects.ts`**

Delete `src/data/projects.js`, create `src/data/projects.ts` (same content as current, just typed — the StackLead rename happens in Task 17):

```ts
import type { Project } from '../types/content.js'
import miner from '../Assets/Projects/miner.png'
import ivy from '../Assets/Projects/ivy.png'
import nft from '../Assets/Projects/nft.png'
import door from '../Assets/Projects/door.png'
import shift from '../Assets/Projects/shift.png'

export const projects: Project[] = [
  {
    id: 'anywork-agent',
    name: 'AnyWork Agent',
    company: 'SMS Holdings',
    tags: ['React.js', 'Node.js', 'LLM APIs', 'Voice AI', 'Email Automation'],
    problem:
      'Turning a natural-language prompt into a qualified lead list and outreach campaign without manual prospecting.',
    description:
      'Conversational AI agent that discovers leads, generates a campaign, places AI voice calls, and sequences automated emails.',
    architectureHighlight:
      'Agentic tool-calling workflow spanning lead discovery, campaign generation, AI voice calling, and automated email sequencing — with human approval gates before any outbound action.',
    featured: true,
    image: null,
    demoUrl: null,
    demoLabel: null,
  },
  {
    id: 'mindminer',
    name: 'MindMiner',
    company: 'CodingCops',
    tags: ['React.js', 'Node.js', 'AWS ECS/ECR/Fargate', 'Ethereum', 'LLM & Video Gen APIs'],
    problem:
      'Turning a described problem into candidate invention solutions and structured patent documentation.',
    description:
      'AI-assisted invention platform generating candidate solutions and drafting structured patent documentation via LLM pipelines, with automated multimedia explainer videos per invention.',
    architectureHighlight:
      'Web3 layer with wallet balances, on-chain burns, ERC-20/NFT transfers, crowdfunding contracts, and token minting — secure multi-step authenticated transactions with blockchain event verification.',
    featured: true,
    image: miner,
    demoUrl: 'https://dev.mindminer.ai/',
    demoLabel: 'Demo',
  },
  {
    id: 'smart-system',
    name: 'Smart System',
    company: 'SMS Holdings',
    tags: ['React Native', 'React.js', 'Node.js', 'AWS'],
    problem: null,
    description:
      'Mobile and web platform for on-demand household services, with an integrated admin panel for customer/partner monitoring and in-app commissioning support.',
    architectureHighlight: null,
    featured: false,
    image: null,
    demoUrl: null,
    demoLabel: null,
  },
  {
    id: 'ivy',
    name: 'IVY',
    company: 'CodingCops',
    tags: ['Ruby on Rails', 'React.js', 'Hanami', 'Heroku', 'Datadog', 'Redis'],
    problem: null,
    description:
      'Hospitality platform covering guest booking, task orchestration, SMS notifications, and an activity management system that improved staff task completion.',
    architectureHighlight: null,
    featured: false,
    image: ivy,
    demoUrl: 'https://www.revinate.com/solutions/revinate-ivy/',
    demoLabel: 'Learn more',
  },
  {
    id: 'smeisty',
    name: 'Smeisty',
    company: 'TectSoft',
    tags: ['React.js', 'Node.js', 'Ethereum', 'MetaMask', 'OpenSea'],
    problem: null,
    description:
      'NFT management platform handling contract addresses and wallet transactions, optimized for speed and cross-device responsiveness.',
    architectureHighlight: null,
    featured: false,
    image: nft,
    demoUrl: 'https://smeisty.app/',
    demoLabel: 'Demo',
  },
  {
    id: 'door-visualizer',
    name: 'Door Visualizer',
    company: null,
    tags: ['Augmented Reality', 'Mobile'],
    problem: null,
    description:
      'Augmented reality app for smartphones — people can see through their camera how new doors would look directly in their interior.',
    architectureHighlight: null,
    featured: false,
    image: door,
    demoUrl: 'https://www.door-visualizer.com/',
    demoLabel: 'Demo',
  },
  {
    id: 'shifterp',
    name: 'ShiftERP',
    company: null,
    tags: ['ERP', 'Supply Chain'],
    problem: null,
    description:
      'First fully integrated end-to-end ERP solution for co-packers and supply chain teams.',
    architectureHighlight: null,
    featured: false,
    image: shift,
    demoUrl: 'https://www.shifterp.com/',
    demoLabel: 'Demo',
  },
]
```

- [ ] **Step 5: Convert `src/data/skills.js` to `src/data/skills.ts`**

Delete `src/data/skills.js`, create `src/data/skills.ts`:

```ts
import type { SkillGroup } from '../types/content.js'

export const skillGroups: SkillGroup[] = [
  {
    group: 'Frontend',
    items: ['React.js', 'Next.js', 'TypeScript', 'JavaScript', 'Redux', 'GraphQL', 'Angular', 'Vue'],
  },
  {
    group: 'Backend & Mobile',
    items: [
      'Node.js', 'Express', 'NestJS', 'React Native', 'Java', 'Spring Boot', 'Ruby on Rails', 'Python', 'C++', 'SQL',
    ],
  },
  {
    group: 'AI & LLM',
    items: [
      'Anthropic Claude', 'OpenAI GPT-4/4o', 'Google Gemini', 'DeepSeek', 'Llama',
      'RAG', 'Vector Search & Embeddings', 'Agentic Workflows', 'MCP', 'LangChain', 'LangGraph', 'Vercel AI SDK',
    ],
  },
  {
    group: 'Cloud & DevOps',
    items: ['AWS (ECS, ECR, Fargate, EC2, CloudWatch)', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'GitLab CI'],
  },
  {
    group: 'Databases',
    items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Neo4j', 'Firebase', 'Pinecone / pgvector'],
  },
  {
    group: 'Distributed Systems',
    items: ['Microservices', 'Apache Kafka', 'RabbitMQ', 'Pub/Sub', 'Event-Driven Architecture'],
  },
]
```

- [ ] **Step 6: Convert `src/data/aiExpertise.js` to `src/data/aiExpertise.ts`**

Delete `src/data/aiExpertise.js`, create `src/data/aiExpertise.ts`:

```ts
import type { AICapability } from '../types/content.js'

export const aiFraming =
  'I build products on top of frontier models, not just around an API call.'

export const aiCapabilities: AICapability[] = [
  {
    label: 'LLM Integration',
    items: ['Anthropic Claude', 'OpenAI GPT-4/4o', 'Google Gemini', 'DeepSeek', 'Llama'],
  },
  {
    label: 'RAG & Retrieval',
    items: ['Retrieval-Augmented Generation', 'Vector Search & Embeddings', 'Pinecone', 'pgvector'],
  },
  {
    label: 'Agentic Systems',
    items: ['Agentic Workflows', 'Function/Tool Calling', 'MCP (Model Context Protocol)'],
  },
  {
    label: 'Reliability & Cost',
    items: ['Prompt & Context Engineering', 'Structured Outputs', 'Streaming', 'Guardrails & Fallbacks', 'Token/Cost Optimization'],
  },
  {
    label: 'Applied AI Products',
    items: ['Voice AI & Conversational Agents', 'AI Video Generation'],
  },
  {
    label: 'AI Coding Tools (daily use)',
    items: ['Claude Code', 'Cursor', 'GitHub Copilot', 'Windsurf', 'Codex', 'v0'],
  },
]
```

- [ ] **Step 7: Convert `src/data/content.test.js` to `src/data/content.test.ts`**

Delete `src/data/content.test.js`, create `src/data/content.test.ts` with identical assertions (imports now resolve `.ts` files):

```ts
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
    expect(profile.typewriterStrings.length).toBeGreaterThan(0)
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

  it('projects has exactly 7 entries with 2 featured', () => {
    expect(projects).toHaveLength(7)
    const featured = projects.filter((p) => p.featured)
    expect(featured).toHaveLength(2)
    expect(featured.map((p) => p.id).sort()).toEqual(['anywork-agent', 'mindminer'])
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
```

(This task keeps the `featured`/`anywork-agent` assertions exactly as they are today — Task 17 in Phase B updates this test file again alongside the StackLead content change. Changing schema and changing file extension in the same task would conflate two unrelated risks.)

- [ ] **Step 8: Run the full suite and build**

Run: `npm run test` — Expected: all tests pass (data layer is now TS, nothing consuming it has changed).
Run: `npm run build` — Expected: succeeds.

- [ ] **Step 9: Commit**

```bash
git add src/types/content.ts src/data/profile.ts src/data/experience.ts src/data/projects.ts src/data/skills.ts src/data/aiExpertise.ts src/data/content.test.ts
git rm src/data/profile.js src/data/experience.js src/data/projects.js src/data/skills.js src/data/aiExpertise.js src/data/content.test.js
git commit -m "Convert data layer to TypeScript"
```

---

### Task 3: Convert app entry point to TypeScript

**Files:**
- Modify (rename): `src/main.jsx` → `src/main.tsx`
- Modify (rename): `src/App.jsx` → `src/App.tsx`
- Modify (rename): `src/App.test.jsx` → `src/App.test.tsx`
- Modify (rename): `src/test/setup.js` → `src/test/setup.ts`
- Modify: `index.html` (script tag), `vite.config.ts` (setupFiles path)

**Interfaces:**
- Consumes: nothing new from Task 2 yet (still imports section `index.js` barrels, which stay `.jsx`-backed until Phase A finishes).
- Produces: `App` component (default export) — unchanged shape, consumed by `main.tsx` and `App.test.tsx`.

- [ ] **Step 1: Convert `src/test/setup.js` to `src/test/setup.ts`**

Delete `src/test/setup.js`, create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom'

class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// jsdom has no IntersectionObserver; Framer Motion's useInView needs a stub.
;(window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = IntersectionObserverStub
```

- [ ] **Step 2: Update `vite.config.ts` to point at the renamed setup file**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
```

- [ ] **Step 3: Convert `src/App.jsx` to `src/App.tsx`**

Delete `src/App.jsx`, create `src/App.tsx` (identical content, `.tsx` extension):

```tsx
import { MotionConfig } from 'framer-motion'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import Hero from './components/sections/Hero/index.js'
import Snapshot from './components/sections/Snapshot/index.js'
import Skills from './components/sections/Skills/index.js'
import Projects from './components/sections/Projects/index.js'
import Experience from './components/sections/Experience/index.js'
import AIExpertise from './components/sections/AIExpertise/index.js'
import GithubActivity from './components/sections/GithubActivity/index.js'
import ResumeCTA from './components/sections/ResumeCTA/index.js'
import Contact from './components/sections/Contact/index.js'

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-surface focus:text-primary focus:p-4"
      >
        Skip to content
      </a>
      <Navbar />
      <main>
        <Hero />
        <Snapshot />
        <Skills />
        <Projects />
        <Experience />
        <AIExpertise />
        <GithubActivity />
        <ResumeCTA />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  )
}

export default App
```

- [ ] **Step 4: Convert `src/App.test.jsx` to `src/App.test.tsx`**

Delete `src/App.test.jsx`, create `src/App.test.tsx` (identical content):

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App.jsx'

describe('App', () => {
  it('renders every top-level section in order', () => {
    render(<App />)
    const ids = ['hero', 'snapshot', 'skills', 'projects', 'experience', 'ai', 'github-activity', 'resume', 'contact']
    const rendered = ids.map((id) => document.getElementById(id))
    rendered.forEach((el) => expect(el).toBeInTheDocument())

    for (let i = 0; i < rendered.length - 1; i += 1) {
      const current = rendered[i] as Element
      const next = rendered[i + 1] as Element
      const position = current.compareDocumentPosition(next)
      expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    }
  })
})
```

- [ ] **Step 5: Convert `src/main.jsx` to `src/main.tsx`**

Delete `src/main.jsx`, create `src/main.tsx`:

```tsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.js'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('#root element not found')

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

(`createRoot` now requires a null-check under `strict: true` — `document.getElementById` returns `HTMLElement | null`.)

- [ ] **Step 6: Update `index.html` script tag**

Change:

```html
<script type="module" src="/src/main.jsx"></script>
```

to:

```html
<script type="module" src="/src/main.tsx"></script>
```

- [ ] **Step 7: Run the full suite and build**

Run: `npm run test` — Expected: all tests pass.
Run: `npm run build` — Expected: succeeds; `npm run dev` also starts cleanly (spot-check, not required to keep running).

- [ ] **Step 8: Commit**

```bash
git add src/main.tsx src/App.tsx src/App.test.tsx src/test/setup.ts index.html vite.config.ts
git rm src/main.jsx src/App.jsx src/App.test.jsx src/test/setup.js
git commit -m "Convert app entry point to TypeScript"
```

---

### Task 4: Convert UI primitives to TypeScript

**Files:**
- Modify (rename): `src/components/ui/MagneticButton.jsx` → `.tsx`, `magneticOffset.js` → `.ts`, `magneticOffset.test.js` → `.test.ts`, `MagneticButton.test.jsx` → `.test.tsx`
- Modify (rename): `src/components/ui/SectionReveal.jsx` → `.tsx`, `SectionReveal.test.jsx` → `.test.tsx`
- Modify (rename): `src/components/ui/SpotlightCard.jsx` → `.tsx`, `SpotlightCard.test.jsx` → `.test.tsx`, `tiltOffset.js` → `.ts`, `tiltOffset.test.js` → `.test.ts`
- Modify (rename): `src/components/ui/StatCounter.jsx` → `.tsx`, `StatCounter.test.jsx` → `.test.tsx`, `countUp.js` → `.ts`, `countUp.test.js` → `.test.ts`
- Modify (rename): `src/components/ui/TechBadge.jsx` → `.tsx`, `TechBadge.test.jsx` → `.test.tsx`
- Modify (rename): `src/components/ui/Timeline.jsx` → `.tsx`, `Timeline.test.jsx` → `.test.tsx`

**Interfaces:**
- Produces: `computeMagneticOffset(rect: DOMRect | { left: number; top: number; width: number; height: number }, clientX: number, clientY: number, strength?: number): { x: number; y: number }`, `computeTilt(rect: ..., clientX: number, clientY: number, maxDeg?: number): { rotateX: number; rotateY: number }`, `getCountUpValue(elapsedMs: number, durationMs: number, target: number): number` — same signatures as today, now typed. `MagneticButton`, `SectionReveal`, `SpotlightCard`, `StatCounter`, `TechBadge`, `Timeline` component prop types (below) are what Phase B tasks will import.
- Note: `AmbientGlow.jsx`/`.test.jsx` are intentionally **not** converted here — the component is deleted whole in Task 10. Converting it now would be wasted work.

- [ ] **Step 1: Convert `magneticOffset.js`/`.test.js`**

Delete `src/components/ui/magneticOffset.js`, create `src/components/ui/magneticOffset.ts`:

```ts
interface Rect {
  left: number
  top: number
  width: number
  height: number
}

export function computeMagneticOffset(rect: Rect, clientX: number, clientY: number, strength = 0.25) {
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  return {
    x: (clientX - centerX) * strength,
    y: (clientY - centerY) * strength,
  }
}
```

Delete `src/components/ui/magneticOffset.test.js`, create `src/components/ui/magneticOffset.test.ts` (identical assertions):

```ts
import { describe, it, expect } from 'vitest'
import { computeMagneticOffset } from './magneticOffset.js'

describe('computeMagneticOffset', () => {
  const rect = { left: 100, top: 100, width: 40, height: 20 }

  it('returns zero offset when cursor is at the button center', () => {
    expect(computeMagneticOffset(rect, 120, 110)).toEqual({ x: 0, y: 0 })
  })

  it('scales offset by the strength factor', () => {
    expect(computeMagneticOffset(rect, 140, 120, 0.25)).toEqual({ x: 5, y: 2.5 })
  })
})
```

- [ ] **Step 2: Convert `MagneticButton.jsx`/`.test.jsx`**

Delete `src/components/ui/MagneticButton.jsx`, create `src/components/ui/MagneticButton.tsx`:

```tsx
import { useRef, useState, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { computeMagneticOffset } from './magneticOffset.js'

const base =
  'inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-shadow'
const variants = {
  primary: 'bg-gradient-accent text-base',
  secondary: 'border border-subtle text-primary',
}

interface MagneticButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  variant?: keyof typeof variants
  children: ReactNode
}

function MagneticButton({ href, variant = 'primary', onClick, children, ...rest }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setOffset(computeMagneticOffset(rect, e.clientX, e.clientY))
  }

  function handleMouseLeave() {
    setOffset({ x: 0, y: 0 })
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className={`${base} ${variants[variant]}`}
      {...rest}
    >
      {children}
    </motion.a>
  )
}

export default MagneticButton
```

Delete `src/components/ui/MagneticButton.test.jsx`, create `src/components/ui/MagneticButton.test.tsx` (identical assertions):

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import MagneticButton from './MagneticButton.jsx'

describe('MagneticButton', () => {
  it('renders an anchor with the given label and href', () => {
    render(
      <MagneticButton href="#projects" variant="primary">
        View My Work
      </MagneticButton>,
    )
    const link = screen.getByRole('link', { name: 'View My Work' })
    expect(link).toHaveAttribute('href', '#projects')
  })
})
```

- [ ] **Step 3: Convert `SectionReveal.jsx`/`.test.jsx`**

Delete `src/components/ui/SectionReveal.jsx`, create `src/components/ui/SectionReveal.tsx`:

```tsx
import type { ElementType, ReactNode } from 'react'
import { motion } from 'framer-motion'

const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

interface SectionRevealProps {
  as?: ElementType
  className?: string
  delay?: number
  children: ReactNode
}

function SectionReveal({ as = 'div', className = '', delay = 0, children }: SectionRevealProps) {
  const MotionTag = (motion as Record<string, ElementType>)[as as string] ?? motion.div
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </MotionTag>
  )
}

export default SectionReveal
```

Delete `src/components/ui/SectionReveal.test.jsx`, create `src/components/ui/SectionReveal.test.tsx` (identical assertions):

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SectionReveal from './SectionReveal.jsx'

describe('SectionReveal', () => {
  it('renders children inside the given tag', () => {
    render(
      <SectionReveal as="section" className="test-class">
        <p>Hello</p>
      </SectionReveal>,
    )
    const el = screen.getByText('Hello').closest('section')
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('test-class')
  })
})
```

- [ ] **Step 4: Convert `tiltOffset.js`/`.test.js`**

Delete `src/components/ui/tiltOffset.js`, create `src/components/ui/tiltOffset.ts`:

```ts
interface Rect {
  left: number
  top: number
  width: number
  height: number
}

export function computeTilt(rect: Rect, clientX: number, clientY: number, maxDeg = 8) {
  const px = (clientX - rect.left) / rect.width
  const py = (clientY - rect.top) / rect.height
  const rotateY = (px - 0.5) * 2 * maxDeg
  const rotateX = (0.5 - py) * 2 * maxDeg
  return {
    rotateX: Math.max(-maxDeg, Math.min(maxDeg, rotateX)),
    rotateY: Math.max(-maxDeg, Math.min(maxDeg, rotateY)),
  }
}
```

Delete `src/components/ui/tiltOffset.test.js`, create `src/components/ui/tiltOffset.test.ts` (identical assertions):

```ts
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
```

(`tiltOffset.ts`/`computeTilt` is deleted whole in Task 10 once `SpotlightCard`'s tilt interaction is removed — converted here for consistency since, unlike `AmbientGlow`, `SpotlightCard` itself survives and is only simplified, not deleted, so its test suite must stay green through this task.)

- [ ] **Step 5: Convert `SpotlightCard.jsx`/`.test.jsx`**

Delete `src/components/ui/SpotlightCard.jsx`, create `src/components/ui/SpotlightCard.tsx`:

```tsx
import { useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { computeTilt } from './tiltOffset.js'

interface SpotlightCardProps {
  className?: string
  children: ReactNode
}

function SpotlightCard({ className = '', children }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [spot, setSpot] = useState({ x: '50%', y: '50%', opacity: 0 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setTilt(computeTilt(rect, e.clientX, e.clientY))
    setSpot({
      x: `${((e.clientX - rect.left) / rect.width) * 100}%`,
      y: `${((e.clientY - rect.top) / rect.height) * 100}%`,
      opacity: 1,
    })
  }

  function handleMouseLeave() {
    setTilt({ rotateX: 0, rotateY: 0 })
    setSpot((s) => ({ ...s, opacity: 0 }))
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
      transition={{ type: 'spring', stiffness: 150, damping: 20 }}
      style={{ transformPerspective: 600 }}
      className={`relative overflow-hidden rounded-xl border border-subtle bg-surface ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{
          opacity: spot.opacity,
          background: `radial-gradient(220px circle at ${spot.x} ${spot.y}, rgba(139,123,255,0.18), transparent 70%)`,
        }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  )
}

export default SpotlightCard
```

Delete `src/components/ui/SpotlightCard.test.jsx`, create `src/components/ui/SpotlightCard.test.tsx` (identical assertions):

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SpotlightCard from './SpotlightCard.jsx'

describe('SpotlightCard', () => {
  it('renders children', () => {
    render(
      <SpotlightCard className="test-class">
        <p>Project name</p>
      </SpotlightCard>,
    )
    expect(screen.getByText('Project name')).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Convert `countUp.js`/`.test.js`**

Delete `src/components/ui/countUp.js`, create `src/components/ui/countUp.ts`:

```ts
export function getCountUpValue(elapsedMs: number, durationMs: number, target: number) {
  const progress = Math.min(Math.max(elapsedMs / durationMs, 0), 1)
  return Math.round(progress * target)
}
```

Delete `src/components/ui/countUp.test.js`, create `src/components/ui/countUp.test.ts` (identical assertions):

```ts
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
    expect(getCountUpValue(500, 1000, 7)).toBe(4)
  })
})
```

- [ ] **Step 7: Convert `StatCounter.jsx`/`.test.jsx`**

Delete `src/components/ui/StatCounter.jsx`, create `src/components/ui/StatCounter.tsx`:

```tsx
import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { getCountUpValue } from './countUp.js'

const DURATION_MS = 1200

interface StatCounterProps {
  value: number
  suffix?: string
  label: string
}

function StatCounter({ value, suffix = '', label }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [display, setDisplay] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!inView) return
    if (shouldReduceMotion) {
      setDisplay(value)
      return
    }
    let start: number | undefined
    let frame: number
    function tick(timestamp: number) {
      if (start === undefined) start = timestamp
      const elapsed = timestamp - start
      setDisplay(getCountUpValue(elapsed, DURATION_MS, value))
      if (elapsed < DURATION_MS) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value, shouldReduceMotion])

  return (
    <div ref={ref} className="text-center">
      <div className="font-sans text-4xl font-bold text-accent-violet">
        {display}
        {suffix}
      </div>
      <div className="mt-1 text-sm text-muted">{label}</div>
    </div>
  )
}

export default StatCounter
```

Delete `src/components/ui/StatCounter.test.jsx`, create `src/components/ui/StatCounter.test.tsx` (identical assertions):

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StatCounter from './StatCounter.jsx'

describe('StatCounter', () => {
  it('renders the label and starts at 0 before animating', () => {
    render(<StatCounter value={6} suffix="+" label="Years Experience" />)
    expect(screen.getByText('Years Experience')).toBeInTheDocument()
    expect(screen.getByText('0+')).toBeInTheDocument()
  })
})
```

- [ ] **Step 8: Convert `TechBadge.jsx`/`.test.jsx`**

Delete `src/components/ui/TechBadge.jsx`, create `src/components/ui/TechBadge.tsx`:

```tsx
interface TechBadgeProps {
  label: string
}

function TechBadge({ label }: TechBadgeProps) {
  return (
    <span className="inline-block rounded-full border border-subtle bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent-violet hover:text-primary">
      {label}
    </span>
  )
}

export default TechBadge
```

Delete `src/components/ui/TechBadge.test.jsx`, create `src/components/ui/TechBadge.test.tsx` (identical assertions):

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TechBadge from './TechBadge.jsx'

describe('TechBadge', () => {
  it('renders the label text', () => {
    render(<TechBadge label="React.js" />)
    expect(screen.getByText('React.js')).toBeInTheDocument()
  })
})
```

- [ ] **Step 9: Convert `Timeline.jsx`/`.test.jsx`**

Delete `src/components/ui/Timeline.jsx`, create `src/components/ui/Timeline.tsx`:

```tsx
import { motion } from 'framer-motion'
import TechBadge from './TechBadge.js'
import type { ExperienceEntry } from '../../types/content.js'

interface TimelineProps {
  entries: ExperienceEntry[]
}

function Timeline({ entries }: TimelineProps) {
  return (
    <ol className="relative border-l border-subtle pl-8">
      {entries.map((entry) => (
        <li key={`${entry.company}-${entry.start}`} className="mb-12 last:mb-0">
          <motion.span
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full bg-accent-violet"
          />
          <p className="font-mono text-xs text-muted">
            {entry.start} – {entry.end}
          </p>
          <h3 className="mt-1 text-lg font-bold">
            <span>{entry.role}</span> · <span>{entry.company}</span>
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {entry.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <TechBadge key={tag} label={tag} />
            ))}
          </div>
        </li>
      ))}
    </ol>
  )
}

export default Timeline
```

Delete `src/components/ui/Timeline.test.jsx`, create `src/components/ui/Timeline.test.tsx` (identical assertions):

```tsx
import { render, within } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Timeline from './Timeline.js'

const entries = [
  { company: 'A', role: 'Engineer', start: '2024', end: 'Present', current: true, bullets: ['Did X'], tags: ['React'] },
  { company: 'B', role: 'Engineer', start: '2020', end: '2024', current: false, bullets: ['Did Y'], tags: ['Node'] },
]

describe('Timeline', () => {
  it('renders every entry company, role, and bullets', () => {
    const { container } = render(<Timeline entries={entries} />)
    const listItems = container.querySelectorAll('ol > li')
    entries.forEach((e, index) => {
      const item = listItems[index]
      expect(within(item as HTMLElement).getByText(e.company)).toBeInTheDocument()
      expect(within(item as HTMLElement).getByText(e.role)).toBeInTheDocument()
      e.bullets.forEach((b) => expect(within(item as HTMLElement).getByText(b)).toBeInTheDocument())
    })
  })
})
```

- [ ] **Step 10: Run the full suite and build**

Run: `npm run test` — Expected: all tests pass.
Run: `npm run build` — Expected: succeeds.

- [ ] **Step 11: Commit**

```bash
git add src/components/ui/MagneticButton.tsx src/components/ui/MagneticButton.test.tsx src/components/ui/magneticOffset.ts src/components/ui/magneticOffset.test.ts src/components/ui/SectionReveal.tsx src/components/ui/SectionReveal.test.tsx src/components/ui/SpotlightCard.tsx src/components/ui/SpotlightCard.test.tsx src/components/ui/tiltOffset.ts src/components/ui/tiltOffset.test.ts src/components/ui/StatCounter.tsx src/components/ui/StatCounter.test.tsx src/components/ui/countUp.ts src/components/ui/countUp.test.ts src/components/ui/TechBadge.tsx src/components/ui/TechBadge.test.tsx src/components/ui/Timeline.tsx src/components/ui/Timeline.test.tsx
git rm src/components/ui/MagneticButton.jsx src/components/ui/MagneticButton.test.jsx src/components/ui/magneticOffset.js src/components/ui/magneticOffset.test.js src/components/ui/SectionReveal.jsx src/components/ui/SectionReveal.test.jsx src/components/ui/SpotlightCard.jsx src/components/ui/SpotlightCard.test.jsx src/components/ui/tiltOffset.js src/components/ui/tiltOffset.test.js src/components/ui/StatCounter.jsx src/components/ui/StatCounter.test.jsx src/components/ui/countUp.js src/components/ui/countUp.test.js src/components/ui/TechBadge.jsx src/components/ui/TechBadge.test.jsx src/components/ui/Timeline.jsx src/components/ui/Timeline.test.jsx
git commit -m "Convert UI primitives to TypeScript"
```

---

### Task 5: Convert layout components to TypeScript

**Files:**
- Modify (rename): `src/components/layout/Navbar.jsx` → `.tsx`, `Navbar.test.jsx` → `.test.tsx`
- Modify (rename): `src/components/layout/Footer.jsx` → `.tsx`, `Footer.test.jsx` → `.test.tsx`

**Interfaces:**
- Consumes: `profile` from `src/data/profile.js` (Task 2).
- Produces: `Navbar`, `Footer` default exports, no props — consumed by `App.tsx` (already importing via `.jsx` specifier, which still resolves).

- [ ] **Step 1: Convert `Navbar.jsx`/`.test.jsx`**

Delete `src/components/layout/Navbar.jsx`, create `src/components/layout/Navbar.tsx`:

```tsx
import { useState } from 'react'

const LINKS = [
  { href: '#snapshot', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#ai', label: 'AI Expertise' },
  { href: '#contact', label: 'Contact' },
]

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 z-50 w-full border-b border-subtle bg-base/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="font-mono text-sm font-semibold text-primary">
          MA
        </a>
        <ul className="hidden gap-6 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-sm text-muted transition-colors hover:text-primary">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-nav-menu"
          onClick={() => setOpen((o) => !o)}
          className="text-primary md:hidden"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>
      {open && (
        <ul
          id="mobile-nav-menu"
          data-testid="mobile-menu"
          className="flex flex-col gap-4 border-t border-subtle px-6 py-4 md:hidden"
        >
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block text-sm text-muted hover:text-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}

export default Navbar
```

Delete `src/components/layout/Navbar.test.jsx`, create `src/components/layout/Navbar.test.tsx` (identical assertions):

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Navbar from './Navbar.js'

describe('Navbar', () => {
  it('renders anchor links for every section', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /projects/i })).toHaveAttribute('href', '#projects')
    expect(screen.getByRole('link', { name: /experience/i })).toHaveAttribute('href', '#experience')
    expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '#contact')
  })

  it('toggles the mobile menu open and closed', () => {
    render(<Navbar />)
    const toggle = screen.getByRole('button', { name: /toggle menu/i })
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument()
    fireEvent.click(toggle)
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument()
    fireEvent.click(toggle)
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Convert `Footer.jsx`/`.test.jsx`**

Delete `src/components/layout/Footer.jsx`, create `src/components/layout/Footer.tsx`:

```tsx
import { AiFillGithub } from 'react-icons/ai'
import { FaLinkedinIn } from 'react-icons/fa'
import { profile } from '../../data/profile.js'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-subtle px-6 py-8 text-sm text-muted">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <p>Designed &amp; developed by {profile.name}</p>
        <p>© {year} {profile.name}</p>
        <div className="flex gap-4 text-lg">
          <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-primary">
            <AiFillGithub />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-primary">
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
```

Delete `src/components/layout/Footer.test.jsx`, create `src/components/layout/Footer.test.tsx` (identical assertions):

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from './Footer.js'

describe('Footer', () => {
  it('links to GitHub and LinkedIn only', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/ceoasim',
    )
    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute(
      'href',
      'https://linkedin.com/in/ceoasim',
    )
    expect(screen.queryByRole('link', { name: /twitter/i })).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run the full suite and build**

Run: `npm run test` — Expected: all tests pass.
Run: `npm run build` — Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Navbar.tsx src/components/layout/Navbar.test.tsx src/components/layout/Footer.tsx src/components/layout/Footer.test.tsx
git rm src/components/layout/Navbar.jsx src/components/layout/Navbar.test.jsx src/components/layout/Footer.jsx src/components/layout/Footer.test.jsx
git commit -m "Convert layout components to TypeScript"
```

---

### Task 6: Convert Hero, Snapshot, Skills sections to TypeScript

**Files:**
- Modify (rename): `src/components/sections/Hero/Hero.jsx` → `.tsx`, `Hero.test.jsx` → `.test.tsx`, `HeroVisual.jsx` → `.tsx`, `index.js` → `index.ts`
- Modify (rename): `src/components/sections/Snapshot/Snapshot.jsx` → `.tsx`, `Snapshot.test.jsx` → `.test.tsx`, `index.js` → `index.ts`
- Modify (rename): `src/components/sections/Skills/Skills.jsx` → `.tsx`, `Skills.test.jsx` → `.test.tsx`, `index.js` → `index.ts`

**Interfaces:**
- Consumes: `profile` (Task 2), `skillGroups` (Task 2), `MagneticButton`/`SectionReveal`/`StatCounter`/`TechBadge` (Task 4), `AmbientGlow.jsx` (still untouched JS — fine, `allowJs` covers this until Task 10 deletes it).
- Produces: `Hero`, `Snapshot`, `Skills` default exports via their `index.ts` barrels — same as today, consumed by `App.tsx`.
- Note: `HeroVisual` is converted here (behavior-preserving) even though Task 12 in Phase B deletes it — same rationale as `SpotlightCard`/`tiltOffset` in Task 4: it's still imported by `Hero.tsx` and must type-check and pass its own test suite through this task.

- [ ] **Step 1: Convert Hero section files**

Delete `src/components/sections/Hero/HeroVisual.jsx`, create `src/components/sections/Hero/HeroVisual.tsx`:

```tsx
import { motion, useReducedMotion } from 'framer-motion'

const NODES = [
  { x: 60, y: 40 }, { x: 180, y: 20 }, { x: 220, y: 120 },
  { x: 100, y: 160 }, { x: 20, y: 110 }, { x: 150, y: 90 },
]
const EDGES: [number, number][] = [[0, 1], [1, 2], [2, 5], [5, 0], [0, 4], [4, 3], [3, 5]]

function HeroVisual() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <svg viewBox="0 0 240 200" className="h-64 w-64 motion-reduce:opacity-80" aria-hidden="true">
      {EDGES.map(([a, b], i) => (
        <line
          key={i}
          x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
          stroke="#8b7bff" strokeOpacity={0.35} strokeWidth={1}
        />
      ))}
      {NODES.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x} cy={n.y} r={5}
          fill={i % 2 === 0 ? '#8b7bff' : '#25c9d0'}
          initial={{ cy: n.y }}
          animate={shouldReduceMotion ? { cy: n.y } : { cy: [n.y, n.y - 8, n.y] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  )
}

export default HeroVisual
```

Delete `src/components/sections/Hero/Hero.jsx`, create `src/components/sections/Hero/Hero.tsx`:

```tsx
import Typewriter from 'typewriter-effect'
import { AiFillGithub } from 'react-icons/ai'
import { FaLinkedinIn } from 'react-icons/fa'
import { MdOutlineEmail } from 'react-icons/md'
import { profile } from '../../../data/profile.js'
import MagneticButton from '../../ui/MagneticButton.js'
import AmbientGlow from '../../ui/AmbientGlow.jsx'
import HeroVisual from './HeroVisual.js'
import resumePdf from '../../../Assets/muhammad_asim_resume.pdf'

function Hero() {
  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden px-6 pt-24">
      <AmbientGlow />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div>
          <p className="font-mono text-sm text-muted">{profile.location}</p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">{profile.name}</h1>
          <h2 className="mt-2 text-xl text-muted sm:text-2xl">
            Senior Software Engineer —{' '}
            <span className="bg-gradient-accent bg-clip-text text-transparent">AI-Native</span> Full-Stack
            Development
          </h2>
          <div className="mt-4 h-8 font-mono text-lg text-accent-cyan">
            <Typewriter
              options={{ strings: profile.typewriterStrings, autoStart: true, loop: true, deleteSpeed: 30 }}
            />
          </div>
          <p className="mt-6 max-w-xl text-muted">{profile.heroValueProp}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <MagneticButton href="#projects" variant="primary">
              View My Work
            </MagneticButton>
            <MagneticButton href={resumePdf} variant="secondary" download="Muhammad_Asim_Resume.pdf">
              Download Resume
            </MagneticButton>
          </div>
          <div className="mt-8 flex gap-4 text-xl text-muted">
            <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-primary">
              <AiFillGithub />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-primary">
              <FaLinkedinIn />
            </a>
            <a href={`mailto:${profile.email}`} aria-label="Email" className="hover:text-primary">
              <MdOutlineEmail />
            </a>
          </div>
        </div>
        <div className="flex justify-center">
          <HeroVisual />
        </div>
      </div>
    </section>
  )
}

export default Hero
```

Delete `src/components/sections/Hero/Hero.test.jsx`, create `src/components/sections/Hero/Hero.test.tsx` (identical assertions):

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Hero from './Hero.js'

describe('Hero', () => {
  it('renders the name, title, and both CTAs with correct targets', () => {
    render(<Hero />)
    expect(screen.getByText('Muhammad Asim')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view my work/i })).toHaveAttribute('href', '#projects')
    expect(screen.getByRole('link', { name: /download resume/i })).toHaveAttribute(
      'href',
      expect.stringContaining('resume'),
    )
  })

  it('has id="hero" for anchor navigation', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('#hero')).toBeInTheDocument()
  })
})
```

Delete `src/components/sections/Hero/index.js`, create `src/components/sections/Hero/index.ts`:

```ts
export { default } from './Hero.js'
```

- [ ] **Step 2: Convert Snapshot section files**

Delete `src/components/sections/Snapshot/Snapshot.jsx`, create `src/components/sections/Snapshot/Snapshot.tsx`:

```tsx
import { profile } from '../../../data/profile.js'
import SectionReveal from '../../ui/SectionReveal.js'
import StatCounter from '../../ui/StatCounter.js'

function Snapshot() {
  return (
    <SectionReveal as="section" className="px-6 py-24" delay={0}>
      <div id="snapshot" className="mx-auto max-w-4xl scroll-mt-24 text-center">
        <h2 className="sr-only">About</h2>
        <p className="text-lg text-muted">{profile.snapshotSupportingCopy}</p>
        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {profile.stats.map((stat) => (
            <StatCounter key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
          ))}
        </div>
      </div>
    </SectionReveal>
  )
}

export default Snapshot
```

Delete `src/components/sections/Snapshot/Snapshot.test.jsx`, create `src/components/sections/Snapshot/Snapshot.test.tsx` (identical assertions):

```tsx
import { render } from '@testing-library/react'
import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Snapshot from './Snapshot.js'
import { profile } from '../../../data/profile.js'

describe('Snapshot', () => {
  it('renders a stat label for every profile stat', () => {
    render(<Snapshot />)
    profile.stats.forEach((stat) => {
      expect(screen.getByText(stat.label)).toBeInTheDocument()
    })
  })

  it('has id="snapshot"', () => {
    const { container } = render(<Snapshot />)
    expect(container.querySelector('#snapshot')).toBeInTheDocument()
  })
})
```

Delete `src/components/sections/Snapshot/index.js`, create `src/components/sections/Snapshot/index.ts`:

```ts
export { default } from './Snapshot.js'
```

- [ ] **Step 3: Convert Skills section files**

Delete `src/components/sections/Skills/Skills.jsx`, create `src/components/sections/Skills/Skills.tsx`:

```tsx
import { skillGroups } from '../../../data/skills.js'
import SectionReveal from '../../ui/SectionReveal.js'
import TechBadge from '../../ui/TechBadge.js'

function Skills() {
  return (
    <SectionReveal as="section" className="px-6 py-24">
      <div id="skills" className="mx-auto max-w-5xl scroll-mt-24">
        <h2 className="text-2xl font-bold">
          Core <span className="text-accent-violet">Expertise</span>
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {skillGroups.map((group) => (
            <div key={group.group}>
              <h3 className="font-mono text-sm uppercase tracking-wide text-muted">{group.group}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <TechBadge key={item} label={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionReveal>
  )
}

export default Skills
```

Delete `src/components/sections/Skills/Skills.test.jsx`, create `src/components/sections/Skills/Skills.test.tsx` (identical assertions):

```tsx
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
```

Delete `src/components/sections/Skills/index.js`, create `src/components/sections/Skills/index.ts`:

```ts
export { default } from './Skills.js'
```

- [ ] **Step 4: Run the full suite and build**

Run: `npm run test` — Expected: all tests pass.
Run: `npm run build` — Expected: succeeds.

- [ ] **Step 5: Commit**

```bash
git add -A src/components/sections/Hero src/components/sections/Snapshot src/components/sections/Skills
git commit -m "Convert Hero, Snapshot, and Skills sections to TypeScript"
```

---

### Task 7: Convert Projects section to TypeScript

**Files:**
- Modify (rename): `src/components/sections/Projects/Projects.jsx` → `.tsx`, `Projects.test.jsx` → `.test.tsx`, `FeaturedProjectCard.jsx` → `.tsx`, `ProjectCard.jsx` → `.tsx`, `AbstractProjectVisual.jsx` → `.tsx`, `index.js` → `index.ts`

**Interfaces:**
- Consumes: `Project` type and `projects` data (Task 2), `SectionReveal`, `SpotlightCard`, `TechBadge` (Task 4).
- Produces: `Projects` default export (via `index.ts`) — same as today.
- Note: `FeaturedProjectCard` is converted here behavior-preserving even though Task 17 (Phase B) replaces its usage with the new `ProjectStory` component and eventually deletes this file — same incremental-conversion rationale as `HeroVisual` in Task 6.

- [ ] **Step 1: Convert `AbstractProjectVisual.jsx`**

Delete `src/components/sections/Projects/AbstractProjectVisual.jsx`, create `src/components/sections/Projects/AbstractProjectVisual.tsx`:

```tsx
import TechBadge from '../../ui/TechBadge.js'

interface AbstractProjectVisualProps {
  tags: string[]
}

function AbstractProjectVisual({ tags }: AbstractProjectVisualProps) {
  return (
    <div
      className="flex h-full min-h-[220px] flex-wrap content-center items-center justify-center gap-2 rounded-lg p-8"
      style={{ background: 'radial-gradient(circle at 30% 30%, rgba(139,123,255,0.18), transparent 60%), radial-gradient(circle at 70% 70%, rgba(37,201,208,0.15), transparent 60%)' }}
    >
      {tags.map((tag) => (
        <TechBadge key={tag} label={tag} />
      ))}
    </div>
  )
}

export default AbstractProjectVisual
```

- [ ] **Step 2: Convert `FeaturedProjectCard.jsx`**

Delete `src/components/sections/Projects/FeaturedProjectCard.jsx`, create `src/components/sections/Projects/FeaturedProjectCard.tsx`:

```tsx
import AbstractProjectVisual from './AbstractProjectVisual.js'
import TechBadge from '../../ui/TechBadge.js'
import type { Project } from '../../../types/content.js'

interface FeaturedProjectCardProps {
  project: Project
  reverse: boolean
}

function FeaturedProjectCard({ project, reverse }: FeaturedProjectCardProps) {
  return (
    <div className={`grid items-center gap-10 md:grid-cols-2 ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}>
      <div>
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.name} screenshot`}
            loading="lazy"
            decoding="async"
            className="aspect-[16/9] w-full rounded-lg border border-subtle object-cover"
          />
        ) : (
          <AbstractProjectVisual tags={project.tags} />
        )}
      </div>
      <div>
        {project.company && <p className="font-mono text-xs text-muted">{project.company}</p>}
        <h3 className="mt-1 text-2xl font-bold">{project.name}</h3>
        {project.problem && <p className="mt-3 text-sm text-muted">{project.problem}</p>}
        <p className="mt-3 text-primary">{project.description}</p>
        {project.architectureHighlight && (
          <p className="mt-3 text-sm text-muted">{project.architectureHighlight}</p>
        )}
        {project.image && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <TechBadge key={tag} label={tag} />
            ))}
          </div>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block text-sm font-semibold text-accent-cyan hover:underline"
          >
            {project.demoLabel} →
          </a>
        )}
      </div>
    </div>
  )
}

export default FeaturedProjectCard
```

- [ ] **Step 3: Convert `ProjectCard.jsx`**

Delete `src/components/sections/Projects/ProjectCard.jsx`, create `src/components/sections/Projects/ProjectCard.tsx`:

```tsx
import SpotlightCard from '../../ui/SpotlightCard.js'
import TechBadge from '../../ui/TechBadge.js'
import AbstractProjectVisual from './AbstractProjectVisual.js'
import type { Project } from '../../../types/content.js'

interface ProjectCardProps {
  project: Project
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <SpotlightCard className="flex h-full flex-col p-5">
      {project.image ? (
        <img
          src={project.image}
          alt={`${project.name} screenshot`}
          loading="lazy"
          decoding="async"
          className="aspect-[16/9] w-full rounded-md object-cover"
        />
      ) : (
        <AbstractProjectVisual tags={project.tags} />
      )}
      <h3 className="mt-4 text-lg font-bold">{project.name}</h3>
      <p className="mt-2 flex-1 text-sm text-muted">{project.description}</p>
      {project.image && (
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <TechBadge key={tag} label={tag} />
          ))}
        </div>
      )}
      {project.demoUrl && (
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-sm font-semibold text-accent-cyan hover:underline"
        >
          {project.demoLabel} →
        </a>
      )}
    </SpotlightCard>
  )
}

export default ProjectCard
```

- [ ] **Step 4: Convert `Projects.jsx`/`.test.jsx`**

Delete `src/components/sections/Projects/Projects.jsx`, create `src/components/sections/Projects/Projects.tsx`:

```tsx
import { projects } from '../../../data/projects.js'
import SectionReveal from '../../ui/SectionReveal.js'
import FeaturedProjectCard from './FeaturedProjectCard.js'
import ProjectCard from './ProjectCard.js'

function Projects() {
  const featured = projects.filter((p) => p.featured)
  const standard = projects.filter((p) => !p.featured)

  return (
    <SectionReveal as="section" className="px-6 py-24">
      <div id="projects" className="mx-auto max-w-6xl scroll-mt-24">
        <h2 className="text-2xl font-bold">
          Featured <span className="text-accent-violet">Projects</span>
        </h2>
        <div className="mt-12 flex flex-col gap-20">
          {featured.map((project, i) => (
            <FeaturedProjectCard key={project.id} project={project} reverse={i % 2 === 1} />
          ))}
        </div>
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {standard.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </SectionReveal>
  )
}

export default Projects
```

Delete `src/components/sections/Projects/Projects.test.jsx`, create `src/components/sections/Projects/Projects.test.tsx` (identical assertions):

```tsx
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
```

Delete `src/components/sections/Projects/index.js`, create `src/components/sections/Projects/index.ts`:

```ts
export { default } from './Projects.js'
```

- [ ] **Step 5: Run the full suite and build**

Run: `npm run test` — Expected: all tests pass.
Run: `npm run build` — Expected: succeeds.

- [ ] **Step 6: Commit**

```bash
git add -A src/components/sections/Projects
git commit -m "Convert Projects section to TypeScript"
```

---

### Task 8: Convert remaining sections to TypeScript

**Files:**
- Modify (rename): `Experience.jsx`→`.tsx`, `Experience.test.jsx`→`.test.tsx`, `Experience/index.js`→`.ts`
- Modify (rename): `AIExpertise.jsx`→`.tsx`, `AIExpertise.test.jsx`→`.test.tsx`, `AIExpertise/index.js`→`.ts`
- Modify (rename): `GithubActivity.jsx`→`.tsx`, `GithubActivity.test.jsx`→`.test.tsx`, `GithubActivity/index.js`→`.ts`
- Modify (rename): `ResumeCTA.jsx`→`.tsx`, `ResumeCTA.test.jsx`→`.test.tsx`, `ResumeCTA/index.js`→`.ts`
- Modify (rename): `Contact.jsx`→`.tsx`, `Contact.test.jsx`→`.test.tsx`, `Contact/index.js`→`.ts`

**Interfaces:**
- Consumes: `experience`/`education` and `aiFraming`/`aiCapabilities` (Task 2), `profile` (Task 2), `SectionReveal`/`Timeline`/`TechBadge`/`MagneticButton` (Task 4).
- Produces: `Experience`, `AIExpertise`, `GithubActivity`, `ResumeCTA`, `Contact` default exports — same as today. This completes Phase A: after this task, zero `.jsx`/`.js` source files remain except the intentionally-deferred `AmbientGlow.jsx`/`.test.jsx` (deleted in Task 10).

- [ ] **Step 1: Convert Experience section files**

Delete `src/components/sections/Experience/Experience.jsx`, create `src/components/sections/Experience/Experience.tsx`:

```tsx
import { experience, education } from '../../../data/experience.js'
import SectionReveal from '../../ui/SectionReveal.js'
import Timeline from '../../ui/Timeline.js'

function Experience() {
  return (
    <SectionReveal as="section" className="px-6 py-24">
      <div id="experience" className="mx-auto max-w-3xl scroll-mt-24">
        <h2 className="text-2xl font-bold">
          Professional <span className="text-accent-violet">Experience</span>
        </h2>
        <div className="mt-10 border-l border-subtle">
          <Timeline entries={experience} />
          <p className="mt-8 pl-8 text-sm text-muted">
            <span>{education.degree}</span> — <span>{education.school}</span> · <span>{education.detail}</span>
          </p>
        </div>
      </div>
    </SectionReveal>
  )
}

export default Experience
```

Delete `src/components/sections/Experience/Experience.test.jsx`, create `src/components/sections/Experience/Experience.test.tsx` (identical assertions):

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Experience from './Experience.js'
import { education } from '../../../data/experience.js'

describe('Experience', () => {
  it('renders the education entry at the end', () => {
    render(<Experience />)
    expect(screen.getByText(education.school)).toBeInTheDocument()
  })

  it('has id="experience"', () => {
    const { container } = render(<Experience />)
    expect(container.querySelector('#experience')).toBeInTheDocument()
  })
})
```

Delete `src/components/sections/Experience/index.js`, create `src/components/sections/Experience/index.ts`:

```ts
export { default } from './Experience.js'
```

- [ ] **Step 2: Convert AIExpertise section files**

Delete `src/components/sections/AIExpertise/AIExpertise.jsx`, create `src/components/sections/AIExpertise/AIExpertise.tsx`:

```tsx
import { aiFraming, aiCapabilities } from '../../../data/aiExpertise.js'
import SectionReveal from '../../ui/SectionReveal.js'
import TechBadge from '../../ui/TechBadge.js'

function AIExpertise() {
  return (
    <SectionReveal as="section" className="px-6 py-24">
      <div id="ai" className="mx-auto max-w-5xl scroll-mt-24">
        <h2 className="text-2xl font-bold">
          AI Engineering <span className="text-accent-violet">Expertise</span>
        </h2>
        <p className="mt-3 max-w-2xl text-muted">{aiFraming}</p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {aiCapabilities.map((group) => (
            <div key={group.label}>
              <h3 className="font-mono text-sm uppercase tracking-wide text-muted">{group.label}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <TechBadge key={item} label={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionReveal>
  )
}

export default AIExpertise
```

Delete `src/components/sections/AIExpertise/AIExpertise.test.jsx`, create `src/components/sections/AIExpertise/AIExpertise.test.tsx` (identical assertions):

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AIExpertise from './AIExpertise.js'
import { aiCapabilities } from '../../../data/aiExpertise.js'

describe('AIExpertise', () => {
  it('renders every capability group label', () => {
    render(<AIExpertise />)
    aiCapabilities.forEach((group) => {
      expect(screen.getByText(group.label)).toBeInTheDocument()
    })
  })

  it('has id="ai"', () => {
    const { container } = render(<AIExpertise />)
    expect(container.querySelector('#ai')).toBeInTheDocument()
  })
})
```

Delete `src/components/sections/AIExpertise/index.js`, create `src/components/sections/AIExpertise/index.ts`:

```ts
export { default } from './AIExpertise.js'
```

- [ ] **Step 3: Convert GithubActivity section files**

Delete `src/components/sections/GithubActivity/GithubActivity.jsx`, create `src/components/sections/GithubActivity/GithubActivity.tsx`:

```tsx
import GitHubCalendar from 'react-github-calendar'
import { profile } from '../../../data/profile.js'
import SectionReveal from '../../ui/SectionReveal.js'

function GithubActivity() {
  return (
    <SectionReveal as="section" className="px-6 py-24">
      <div id="github-activity" className="mx-auto max-w-4xl scroll-mt-24 text-center">
        <h2 className="text-2xl font-bold">
          Days I <span className="text-accent-violet">Code</span>
        </h2>
        <div className="mt-8 flex justify-center">
          <GitHubCalendar username={profile.githubUsername} colorScheme="dark" blockSize={12} blockMargin={4} fontSize={14} />
        </div>
      </div>
    </SectionReveal>
  )
}

export default GithubActivity
```

Delete `src/components/sections/GithubActivity/GithubActivity.test.jsx`, create `src/components/sections/GithubActivity/GithubActivity.test.tsx` (identical assertions):

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

vi.mock('react-github-calendar', () => ({
  default: (props: { username: string }) => <div data-testid="calendar" data-username={props.username} />,
}))

import { vi } from 'vitest'
import GithubActivity from './GithubActivity.js'

describe('GithubActivity', () => {
  it('renders the calendar with the correct username', () => {
    render(<GithubActivity />)
    expect(screen.getByTestId('calendar')).toHaveAttribute('data-username', 'ceoasim')
  })

  it('has id="github-activity"', () => {
    const { container } = render(<GithubActivity />)
    expect(container.querySelector('#github-activity')).toBeInTheDocument()
  })
})
```

(Note the reordered imports: `vi.mock` calls are hoisted by Vitest to the top of the file regardless of where `vi` itself is imported, but placing the `vi` import above its usage keeps this readable and avoids any lint complaint about using `vi` before it's imported.)

Delete `src/components/sections/GithubActivity/index.js`, create `src/components/sections/GithubActivity/index.ts`:

```ts
export { default } from './GithubActivity.js'
```

- [ ] **Step 4: Convert ResumeCTA section files**

Delete `src/components/sections/ResumeCTA/ResumeCTA.jsx`, create `src/components/sections/ResumeCTA/ResumeCTA.tsx`:

```tsx
import SectionReveal from '../../ui/SectionReveal.js'
import MagneticButton from '../../ui/MagneticButton.js'
import resumePdf from '../../../Assets/muhammad_asim_resume.pdf'

function ResumeCTA() {
  return (
    <SectionReveal as="section" className="px-6 py-24">
      <div id="resume" className="mx-auto max-w-2xl scroll-mt-24 text-center">
        <h2 className="text-2xl font-bold">Want the full picture?</h2>
        <p className="mt-3 text-muted">Download the resume for the complete role-by-role breakdown.</p>
        <div className="mt-8 flex justify-center gap-4">
          <MagneticButton href={resumePdf} variant="primary" download="Muhammad_Asim_Resume.pdf">
            Download Resume
          </MagneticButton>
          <MagneticButton href={resumePdf} variant="secondary" target="_blank" rel="noreferrer">
            View Resume
          </MagneticButton>
        </div>
      </div>
    </SectionReveal>
  )
}

export default ResumeCTA
```

Delete `src/components/sections/ResumeCTA/ResumeCTA.test.jsx`, create `src/components/sections/ResumeCTA/ResumeCTA.test.tsx` (identical assertions):

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ResumeCTA from './ResumeCTA.js'

describe('ResumeCTA', () => {
  it('renders a download resume link', () => {
    render(<ResumeCTA />)
    expect(screen.getByRole('link', { name: /download resume/i })).toHaveAttribute(
      'href',
      expect.stringContaining('resume'),
    )
  })
})
```

Delete `src/components/sections/ResumeCTA/index.js`, create `src/components/sections/ResumeCTA/index.ts`:

```ts
export { default } from './ResumeCTA.js'
```

- [ ] **Step 5: Convert Contact section files**

Delete `src/components/sections/Contact/Contact.jsx`, create `src/components/sections/Contact/Contact.tsx`:

```tsx
import { profile } from '../../../data/profile.js'
import SectionReveal from '../../ui/SectionReveal.js'
import MagneticButton from '../../ui/MagneticButton.js'
import resumePdf from '../../../Assets/muhammad_asim_resume.pdf'

function Contact() {
  return (
    <SectionReveal as="section" className="px-6 py-24">
      <div id="contact" className="mx-auto max-w-2xl scroll-mt-24 text-center">
        <h2 className="text-3xl font-bold">Let's build something impactful.</h2>
        <p className="mt-3 text-muted">{profile.location} — reach out any time.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <MagneticButton href={`mailto:${profile.email}`} variant="primary">
            Email
          </MagneticButton>
          <MagneticButton href={profile.linkedin} variant="secondary" target="_blank" rel="noreferrer">
            LinkedIn
          </MagneticButton>
          <MagneticButton href={profile.github} variant="secondary" target="_blank" rel="noreferrer">
            GitHub
          </MagneticButton>
          <MagneticButton href={resumePdf} variant="secondary" download="Muhammad_Asim_Resume.pdf">
            Resume
          </MagneticButton>
        </div>
      </div>
    </SectionReveal>
  )
}

export default Contact
```

Delete `src/components/sections/Contact/Contact.test.jsx`, create `src/components/sections/Contact/Contact.test.tsx` (identical assertions):

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Contact from './Contact.js'

describe('Contact', () => {
  it('renders the email, LinkedIn, GitHub, and resume links', () => {
    render(<Contact />)
    expect(screen.getByRole('link', { name: /email/i })).toHaveAttribute(
      'href',
      'mailto:asimm364@gmail.com',
    )
    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute(
      'href',
      'https://linkedin.com/in/ceoasim',
    )
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/ceoasim',
    )
    expect(screen.getByRole('link', { name: /resume/i })).toHaveAttribute(
      'href',
      expect.stringContaining('resume'),
    )
  })

  it('has id="contact"', () => {
    const { container } = render(<Contact />)
    expect(container.querySelector('#contact')).toBeInTheDocument()
  })
})
```

Delete `src/components/sections/Contact/index.js`, create `src/components/sections/Contact/index.ts`:

```ts
export { default } from './Contact.js'
```

- [ ] **Step 6: Run the full suite and build — end of Phase A**

Run: `npm run test` — Expected: all tests pass.
Run: `npx tsc --noEmit` — Expected: no type errors anywhere in `src/` except (still) `AmbientGlow.jsx`, which `allowJs` accepts untyped.
Run: `npm run build` — Expected: succeeds.

- [ ] **Step 7: Commit**

```bash
git add -A src/components/sections/Experience src/components/sections/AIExpertise src/components/sections/GithubActivity src/components/sections/ResumeCTA src/components/sections/Contact
git commit -m "Convert remaining sections to TypeScript (end of Phase A)"
```

---

## Phase B — Warm Technical Mono Redesign

### Task 9: Add new design tokens and fonts

**Files:**
- Modify: `tailwind.config.js`, `src/index.css`, `index.html`, `public/manifest.json`

**Interfaces:**
- Produces: Tailwind color tokens `paper`, `surface`, `border`, `ink`, `muted`, `accent` and font families `font-serif` (Fraunces), `font-mono` (JetBrains Mono), `font-sans` (Inter) — every subsequent Phase B task uses these exact names. The old tokens `base`, `subtle`, `primary`, `accent-violet`, `accent-cyan` stay defined (old hex values) for components not yet reskinned; they're deleted in Task 22 once nothing references them. `surface` and `muted` are reused names from the old palette — their hex values change to the new ones immediately in this task, since both roles (card background, secondary text) are conceptually identical in both designs.

- [ ] **Step 1: Update `tailwind.config.js` with the new palette and fonts**

```js
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f2ece0',
        surface: '#ece4d2',
        border: '#d9cdb6',
        ink: '#262019',
        muted: '#5c5344',
        accent: '#a8552b',
        // Legacy "Deep Space Mesh" tokens — still referenced by components
        // not yet reskinned. Removed in the final cleanup task of this plan.
        base: '#0d0f1a',
        subtle: '#262a48',
        primary: '#eceef5',
        'accent-violet': '#8b7bff',
        'accent-cyan': '#25c9d0',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(90deg, #8b7bff, #25c9d0)',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: Update `src/index.css` body tokens**

Change:

```css
body {
  @apply bg-base text-primary font-sans antialiased;
}
```

to:

```css
body {
  @apply bg-paper text-ink font-sans antialiased;
}
```

- [ ] **Step 3: Add Fraunces to the Google Fonts link in `index.html`**

Change:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap"
  rel="stylesheet"
/>
```

to:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap"
  rel="stylesheet"
/>
```

Also update the `theme-color` meta tag in the same file:

```html
<meta name="theme-color" content="#0d0f1a" />
```

to:

```html
<meta name="theme-color" content="#f2ece0" />
```

- [ ] **Step 4: Update `public/manifest.json` theme colors**

Change `theme_color` and `background_color` from `#0d0f1a` to `#f2ece0`:

```json
{
  "short_name": "M. Asim",
  "name": "Muhammad Asim | Portfolio",
  "icons": [
    {
      "src": "favicon.png",
      "sizes": "24x24",
      "type": "image/png"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#f2ece0",
  "background_color": "#f2ece0"
}
```

- [ ] **Step 5: Run the full suite and build**

Run: `npm run test` — Expected: all tests pass (no component behavior changed).
Run: `npm run build` — Expected: succeeds.
Run: `npm run dev`, open the site, confirm the page background is now cream and body text is dark graphite even though most components still render in their old dark-theme colors (expected — this is corrected component-by-component through the rest of Phase B). Stop the dev server once confirmed.

- [ ] **Step 6: Commit**

```bash
git add tailwind.config.js src/index.css index.html public/manifest.json
git commit -m "Add Warm Technical Mono design tokens and Fraunces font"
```

---

### Task 10: Retire AmbientGlow and simplify SpotlightCard's hover interaction

**Files:**
- Delete: `src/components/ui/AmbientGlow.jsx`, `src/components/ui/AmbientGlow.test.jsx`
- Delete: `src/components/ui/tiltOffset.ts`, `src/components/ui/tiltOffset.test.ts`
- Modify: `src/components/ui/SpotlightCard.tsx`, `src/components/ui/SpotlightCard.test.tsx`
- Modify: `src/components/sections/Hero/Hero.tsx` (remove `AmbientGlow` usage)

**Interfaces:**
- Produces: `SpotlightCard` keeps the exact same public shape (`{ className?: string; children: ReactNode }`) — no consumer (`ProjectCard.tsx`, and later `ProjectStory.tsx`) needs to change.
- Removes: `AmbientGlow` (no consumer left after this task — its only usage was `Hero.tsx`), `computeTilt`/`tiltOffset.ts` (no consumer left after `SpotlightCard` drops the tilt interaction).

- [ ] **Step 1: Remove `AmbientGlow` from `Hero.tsx`**

In `src/components/sections/Hero/Hero.tsx`, remove the import and the `<AmbientGlow />` element:

```tsx
import Typewriter from 'typewriter-effect'
import { AiFillGithub } from 'react-icons/ai'
import { FaLinkedinIn } from 'react-icons/fa'
import { MdOutlineEmail } from 'react-icons/md'
import { profile } from '../../../data/profile.js'
import MagneticButton from '../../ui/MagneticButton.js'
import HeroVisual from './HeroVisual.js'
import resumePdf from '../../../Assets/muhammad_asim_resume.pdf'

function Hero() {
  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden px-6 pt-24">
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div>
          <p className="font-mono text-sm text-muted">{profile.location}</p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">{profile.name}</h1>
          <h2 className="mt-2 text-xl text-muted sm:text-2xl">
            Senior Software Engineer —{' '}
            <span className="bg-gradient-accent bg-clip-text text-transparent">AI-Native</span> Full-Stack
            Development
          </h2>
          <div className="mt-4 h-8 font-mono text-lg text-accent-cyan">
            <Typewriter
              options={{ strings: profile.typewriterStrings, autoStart: true, loop: true, deleteSpeed: 30 }}
            />
          </div>
          <p className="mt-6 max-w-xl text-muted">{profile.heroValueProp}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <MagneticButton href="#projects" variant="primary">
              View My Work
            </MagneticButton>
            <MagneticButton href={resumePdf} variant="secondary" download="Muhammad_Asim_Resume.pdf">
              Download Resume
            </MagneticButton>
          </div>
          <div className="mt-8 flex gap-4 text-xl text-muted">
            <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-primary">
              <AiFillGithub />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-primary">
              <FaLinkedinIn />
            </a>
            <a href={`mailto:${profile.email}`} aria-label="Email" className="hover:text-primary">
              <MdOutlineEmail />
            </a>
          </div>
        </div>
        <div className="flex justify-center">
          <HeroVisual />
        </div>
      </div>
    </section>
  )
}

export default Hero
```

(This is an intermediate state — Task 12 replaces this entire component with the new hero layout, including the profile photo and dropping `HeroVisual`/`Typewriter`. This step only removes the now-orphaned `AmbientGlow` so it can be deleted without breaking the build.)

- [ ] **Step 2: Delete `AmbientGlow` files**

```bash
git rm src/components/ui/AmbientGlow.jsx src/components/ui/AmbientGlow.test.jsx
```

- [ ] **Step 3: Simplify `SpotlightCard.tsx` — remove tilt/glow, add restrained hover**

Replace `src/components/ui/SpotlightCard.tsx` entirely:

```tsx
import type { ReactNode } from 'react'

interface SpotlightCardProps {
  className?: string
  children: ReactNode
}

function SpotlightCard({ className = '', children }: SpotlightCardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface transition-[transform,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-accent motion-reduce:hover:translate-y-0 ${className}`}
    >
      {children}
    </div>
  )
}

export default SpotlightCard
```

- [ ] **Step 4: Update `SpotlightCard.test.tsx` — same assertions still apply**

The existing test only checks that children render, which remains true; no change needed to `src/components/ui/SpotlightCard.test.tsx`.

- [ ] **Step 5: Delete `tiltOffset.ts` and its test**

```bash
git rm src/components/ui/tiltOffset.ts src/components/ui/tiltOffset.test.ts
```

- [ ] **Step 6: Run the full suite and build**

Run: `npm run test` — Expected: all tests pass (the `SpotlightCard` test still passes; no test referenced `computeTilt` or `AmbientGlow` outside their own now-deleted test files).
Run: `npx tsc --noEmit` — Expected: no errors (confirms nothing else imports the deleted files).
Run: `npm run build` — Expected: succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/Hero/Hero.tsx src/components/ui/SpotlightCard.tsx
git commit -m "Retire AmbientGlow and card tilt interaction for the editorial theme"
```

---

### Task 11: Reskin Navbar and Footer

**Files:**
- Modify: `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`

**Interfaces:**
- No prop/export shape changes — tokens and copy only. `Navbar.test.tsx`/`Footer.test.tsx` assertions are unaffected (they check link roles/hrefs and toggle behavior, not colors or the wordmark), so neither test file changes.

- [ ] **Step 1: Reskin `Navbar.tsx`**

Replace `src/components/layout/Navbar.tsx` entirely:

```tsx
import { useState } from 'react'

const LINKS = [
  { href: '#snapshot', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#ai', label: 'AI Expertise' },
  { href: '#contact', label: 'Contact' },
]

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="font-serif text-lg font-semibold text-ink">
          Muhammad Asim
        </a>
        <ul className="hidden gap-6 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-mono text-xs uppercase tracking-wide text-muted transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-nav-menu"
          onClick={() => setOpen((o) => !o)}
          className="font-mono text-xs uppercase tracking-wide text-ink md:hidden"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>
      {open && (
        <ul
          id="mobile-nav-menu"
          data-testid="mobile-menu"
          className="flex flex-col gap-4 border-t border-border px-6 py-4 md:hidden"
        >
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block font-mono text-xs uppercase tracking-wide text-muted hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}

export default Navbar
```

- [ ] **Step 2: Reskin `Footer.tsx`**

Replace `src/components/layout/Footer.tsx` entirely:

```tsx
import { AiFillGithub } from 'react-icons/ai'
import { FaLinkedinIn } from 'react-icons/fa'
import { profile } from '../../data/profile.js'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border px-6 py-8 text-sm text-muted">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <p>Designed &amp; developed by {profile.name}</p>
        <p>© {year} {profile.name}</p>
        <div className="flex gap-4 text-lg">
          <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-accent">
            <AiFillGithub />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-accent">
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
```

- [ ] **Step 3: Run the full suite and build**

Run: `npm run test` — Expected: all tests pass.
Run: `npm run build` — Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Navbar.tsx src/components/layout/Footer.tsx
git commit -m "Reskin Navbar and Footer to Warm Technical Mono tokens"
```

---

### Task 12: Rebuild Hero with profile photo, drop Typewriter and HeroVisual

**Files:**
- Create: `src/Assets/profile.jpg` (copied from repo-root `pic.jpg`)
- Modify: `src/components/sections/Hero/Hero.tsx`, `src/components/sections/Hero/Hero.test.tsx`
- Modify: `src/data/profile.ts`, `src/types/content.ts`, `src/data/content.test.ts` (drop the now-unused `typewriterStrings` field)
- Delete: `src/components/sections/Hero/HeroVisual.tsx`
- Modify: `package.json` (remove `typewriter-effect` dependency)

**Interfaces:**
- Produces: `Hero` renders the profile photo with `alt={profile.name}`; primary CTA is now labeled "View Projects" (was "View My Work"), secondary CTA is "View Resume" opening the PDF in a new tab (was "Download Resume" with a `download` attribute) — this matches the spec's brief-derived CTA labels. `Profile` no longer has a `typewriterStrings` field.
- Removes: `HeroVisual` (no other consumer).

- [ ] **Step 1: Copy the profile photo into the repo**

```bash
cp pic.jpg src/Assets/profile.jpg
```

- [ ] **Step 2: Update the failing test first — `Hero.test.tsx`**

Replace `src/components/sections/Hero/Hero.test.tsx` entirely:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Hero from './Hero.js'

describe('Hero', () => {
  it('renders the name and both CTAs with correct targets', () => {
    render(<Hero />)
    expect(screen.getByText('Muhammad Asim')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view projects/i })).toHaveAttribute('href', '#projects')
    expect(screen.getByRole('link', { name: /view resume/i })).toHaveAttribute(
      'href',
      expect.stringContaining('resume'),
    )
  })

  it('has id="hero" for anchor navigation', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('#hero')).toBeInTheDocument()
  })

  it('renders the profile photo with an accessible name', () => {
    render(<Hero />)
    expect(screen.getByRole('img', { name: 'Muhammad Asim' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx vitest run src/components/sections/Hero/Hero.test.tsx`
Expected: FAIL — no link named "view projects" or "view resume" yet, no image role present.

- [ ] **Step 4: Remove `typewriterStrings` from the data layer**

In `src/types/content.ts`, remove the `typewriterStrings: string[]` line from the `Profile` interface.

In `src/data/profile.ts`, remove the `typewriterStrings: [...]` block from the `profile` object.

In `src/data/content.test.ts`, remove this line from the `'profile has all required fields'` test:

```ts
    expect(profile.typewriterStrings.length).toBeGreaterThan(0)
```

- [ ] **Step 5: Delete `HeroVisual.tsx`**

```bash
git rm src/components/sections/Hero/HeroVisual.tsx
```

- [ ] **Step 6: Rebuild `Hero.tsx`**

Replace `src/components/sections/Hero/Hero.tsx` entirely:

```tsx
import { AiFillGithub } from 'react-icons/ai'
import { FaLinkedinIn } from 'react-icons/fa'
import { MdOutlineEmail } from 'react-icons/md'
import { profile } from '../../../data/profile.js'
import MagneticButton from '../../ui/MagneticButton.js'
import resumePdf from '../../../Assets/muhammad_asim_resume.pdf'
import profilePhoto from '../../../Assets/profile.jpg'

function Hero() {
  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden px-6 pt-24">
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.3fr_0.9fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-accent">Senior Software Engineer</p>
          <h1 className="mt-4 font-serif text-5xl font-normal leading-[0.98] text-ink sm:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-3 text-lg text-muted">AI-Native Full-Stack Development</p>
          <p className="mt-6 max-w-xl text-ink">{profile.heroValueProp}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <MagneticButton href="#projects" variant="primary">
              View Projects
            </MagneticButton>
            <MagneticButton href={resumePdf} variant="secondary" target="_blank" rel="noreferrer">
              View Resume
            </MagneticButton>
          </div>
          <div className="mt-8 flex gap-4 text-xl text-muted">
            <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-accent">
              <AiFillGithub />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-accent">
              <FaLinkedinIn />
            </a>
            <a href={`mailto:${profile.email}`} aria-label="Email" className="hover:text-accent">
              <MdOutlineEmail />
            </a>
          </div>
        </div>
        <div>
          <img
            src={profilePhoto}
            alt={profile.name}
            className="aspect-[4/5] w-full rounded-lg border border-border object-cover"
            style={{ filter: 'sepia(0.15) contrast(1.02)' }}
          />
          <p className="mt-3 font-mono text-xs text-muted">{profile.location}</p>
        </div>
      </div>
    </section>
  )
}

export default Hero
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `npx vitest run src/components/sections/Hero/Hero.test.tsx`
Expected: PASS.

- [ ] **Step 8: Remove the now-unused `typewriter-effect` dependency**

Run: `npm uninstall typewriter-effect`

- [ ] **Step 9: Run the full suite and build**

Run: `npm run test` — Expected: all tests pass.
Run: `npx tsc --noEmit` — Expected: no errors.
Run: `npm run build` — Expected: succeeds.

- [ ] **Step 10: Commit**

```bash
git add src/Assets/profile.jpg src/components/sections/Hero/Hero.tsx src/components/sections/Hero/Hero.test.tsx src/data/profile.ts src/types/content.ts src/data/content.test.ts package.json package-lock.json
git rm src/components/sections/Hero/HeroVisual.tsx
git commit -m "Rebuild Hero with profile photo, drop Typewriter and node-graph visual"
```

---

### Task 13: Add the Tech Marquee section

**Files:**
- Create: `src/data/techMarquee.ts`
- Create: `src/components/ui/TechMarquee.tsx`, `src/components/ui/TechMarquee.test.tsx`
- Modify: `tailwind.config.js` (add marquee keyframes/animation)
- Modify: `src/App.tsx` (insert `TechMarquee` between `Hero` and `Snapshot`; fix stale token classNames on the skip-link)

**Interfaces:**
- Produces: `TechMarquee` default export, no props — a new sibling section inserted in `App.tsx`, not part of the anchor-nav id list (spec doesn't ask for a nav link to it).
- Consumes: nothing from other Phase B tasks; purely additive.

- [ ] **Step 1: Create `src/data/techMarquee.ts`**

```ts
export const techMarqueeItems: string[] = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'MongoDB',
  'AWS', 'Docker', 'Kubernetes', 'OpenAI / LLM APIs', 'RAG', 'Vector Search', 'AI Agents',
]
```

- [ ] **Step 2: Write the failing test — `TechMarquee.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TechMarquee from './TechMarquee.js'
import { techMarqueeItems } from '../../data/techMarquee.js'

describe('TechMarquee', () => {
  it('renders every tech item accessibly at least once', () => {
    render(<TechMarquee />)
    techMarqueeItems.forEach((item) => {
      expect(screen.getAllByText(item).length).toBeGreaterThan(0)
    })
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx vitest run src/components/ui/TechMarquee.test.tsx`
Expected: FAIL with "Cannot find module './TechMarquee.js'".

- [ ] **Step 4: Add marquee keyframes to `tailwind.config.js`**

Add `keyframes` and `animation` under `theme.extend` (alongside the existing `colors`, `fontFamily`, `backgroundImage` keys):

```js
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
```

- [ ] **Step 5: Implement `TechMarquee.tsx`**

```tsx
import { useReducedMotion } from 'framer-motion'
import { techMarqueeItems } from '../../data/techMarquee.js'

function TechMarquee() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="overflow-hidden border-y border-border bg-surface py-6">
      {shouldReduceMotion ? (
        <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-3 px-6">
          {techMarqueeItems.map((item) => (
            <li key={item} className="font-mono text-xs uppercase tracking-wide text-muted">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <>
          <div className="flex w-max animate-marquee gap-10" aria-hidden="true">
            {[...techMarqueeItems, ...techMarqueeItems].map((item, i) => (
              <span key={`${item}-${i}`} className="whitespace-nowrap font-mono text-xs uppercase tracking-wide text-muted">
                {item}
              </span>
            ))}
          </div>
          <span className="sr-only">{techMarqueeItems.join(', ')}</span>
        </>
      )}
    </div>
  )
}

export default TechMarquee
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run src/components/ui/TechMarquee.test.tsx`
Expected: PASS.

- [ ] **Step 7: Wire `TechMarquee` into `App.tsx`, fix stale token classNames**

Replace `src/App.tsx` entirely:

```tsx
import { MotionConfig } from 'framer-motion'
import Navbar from './components/layout/Navbar.js'
import Footer from './components/layout/Footer.js'
import Hero from './components/sections/Hero/index.js'
import TechMarquee from './components/ui/TechMarquee.js'
import Snapshot from './components/sections/Snapshot/index.js'
import Skills from './components/sections/Skills/index.js'
import Projects from './components/sections/Projects/index.js'
import Experience from './components/sections/Experience/index.js'
import AIExpertise from './components/sections/AIExpertise/index.js'
import GithubActivity from './components/sections/GithubActivity/index.js'
import ResumeCTA from './components/sections/ResumeCTA/index.js'
import Contact from './components/sections/Contact/index.js'

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-surface focus:text-ink focus:p-4"
      >
        Skip to content
      </a>
      <Navbar />
      <main>
        <Hero />
        <TechMarquee />
        <Snapshot />
        <Skills />
        <Projects />
        <Experience />
        <AIExpertise />
        <GithubActivity />
        <ResumeCTA />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  )
}

export default App
```

- [ ] **Step 8: Run the full suite and build**

Run: `npm run test` — Expected: all tests pass, including `App.test.tsx`'s section-order check (unaffected — `TechMarquee` has no `id` in that list).
Run: `npm run build` — Expected: succeeds.

- [ ] **Step 9: Commit**

```bash
git add src/data/techMarquee.ts src/components/ui/TechMarquee.tsx src/components/ui/TechMarquee.test.tsx tailwind.config.js src/App.tsx
git commit -m "Add Tech Marquee section"
```

---

### Task 14: Reskin MagneticButton

**Files:**
- Modify: `src/components/ui/MagneticButton.tsx`

**Interfaces:**
- No prop/export shape change — this fixes the actual bug the spec's self-review flagged in the prior redesign: the old `secondary` variant used Tailwind's built-in `text-base` (a font-size utility, 1rem) where a `text-{color}` was clearly intended, because the old palette named a background color `base` — colliding with Tailwind's own `text-base` size utility. The new palette has no color named `base`, so this task both reskins the buttons and permanently removes that collision.

- [ ] **Step 1: Update variant classNames in `MagneticButton.tsx`**

In `src/components/ui/MagneticButton.tsx`, change:

```tsx
const base =
  'inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-shadow'
const variants = {
  primary: 'bg-gradient-accent text-base',
  secondary: 'border border-subtle text-primary',
}
```

to:

```tsx
const base =
  'inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-colors'
const variants = {
  primary: 'bg-accent text-paper hover:bg-ink',
  secondary: 'border border-border text-ink hover:border-accent',
}
```

- [ ] **Step 2: Run the full suite and build**

Run: `npm run test` — Expected: all tests pass (existing `MagneticButton.test.tsx` only checks role/href, not classNames).
Run: `npm run build` — Expected: succeeds.
Run: `npm run dev`, confirm Hero's two CTA buttons now render with solid rust/cream and cream/graphite-border styling instead of the old dark-gradient/unstyled-text combination. Stop the dev server once confirmed.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/MagneticButton.tsx
git commit -m "Reskin MagneticButton and fix base/text-base token collision"
```

---

### Task 15: Reskin Snapshot section (StatCounter accent color)

**Files:**
- Modify: `src/components/ui/StatCounter.tsx`

**Interfaces:**
- No prop/export shape change. `Snapshot.tsx` itself needs no edits — its only color className (`text-muted`) already picked up the new hex in Task 9.

- [ ] **Step 1: Update the accent color in `StatCounter.tsx`**

Change:

```tsx
      <div className="font-sans text-4xl font-bold text-accent-violet">
```

to:

```tsx
      <div className="font-sans text-4xl font-bold text-accent">
```

- [ ] **Step 2: Run the full suite and build**

Run: `npm run test` — Expected: all tests pass.
Run: `npm run build` — Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/StatCounter.tsx
git commit -m "Reskin Snapshot stat counters to the accent token"
```

---

### Task 16: Reskin Skills section and shared TechBadge

**Files:**
- Modify: `src/components/ui/TechBadge.tsx`, `src/components/sections/Skills/Skills.tsx`

**Interfaces:**
- No prop/export shape change. `TechBadge` is shared by `Skills`, `AIExpertise`, `Timeline` (Experience), and the Projects visuals — fixing its tokens here means Tasks 19–20 (Experience, AIExpertise) need no `TechBadge`-related changes of their own.

- [ ] **Step 1: Update `TechBadge.tsx` tokens**

Change:

```tsx
    <span className="inline-block rounded-full border border-subtle bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent-violet hover:text-primary">
```

to:

```tsx
    <span className="inline-block rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-ink">
```

- [ ] **Step 2: Update `Skills.tsx` heading accent**

Change:

```tsx
        <h2 className="text-2xl font-bold">
          Core <span className="text-accent-violet">Expertise</span>
        </h2>
```

to:

```tsx
        <h2 className="font-serif text-3xl font-normal text-ink">
          Core <span className="text-accent">Expertise</span>
        </h2>
```

(Section headings switch to the serif display font per the spec's typography rules — this same heading pattern repeats in Tasks 18–20 for Projects, Experience, and AIExpertise.)

- [ ] **Step 3: Run the full suite and build**

Run: `npm run test` — Expected: all tests pass.
Run: `npm run build` — Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/TechBadge.tsx src/components/sections/Skills/Skills.tsx
git commit -m "Reskin Skills section and shared TechBadge"
```

---

### Task 17: StackLead flagship project — data schema, ProjectStory layout, Projects section rebuild

**Files:**
- Modify: `src/types/content.ts` (replace `Project.featured` with `Project.storyLayout` and add `Project.impact`)
- Modify: `src/data/projects.ts`, `src/data/content.test.ts`
- Create: `src/components/sections/Projects/ProjectStory.tsx` (full-bleed numbered case-study layout)
- Modify: `src/components/sections/Projects/Projects.tsx`, `ProjectCard.tsx`, `AbstractProjectVisual.tsx`
- Delete: `src/components/sections/Projects/FeaturedProjectCard.tsx`

**Interfaces:**
- Produces: `Project` now has `storyLayout: boolean` (replaces `featured`) and `impact: string | null`. `ProjectStory` takes `{ project: Project }` and renders the four beats (`problem`, `description`, `architectureHighlight`, `impact`) as numbered blocks, skipping any that are `null`.
- Content source: spec §6 (StackLead) and §5 (MindMiner's added `impact` line) — copy is reproduced verbatim from the spec, not re-derived here.
- This is one task, not two, because the schema change and its only consumers are not independently buildable — splitting them would mean committing a broken build, which violates this plan's global constraint that every commit stays green.

- [ ] **Step 1: Write the failing test first — update `content.test.ts`**

In `src/data/content.test.ts`, replace the `'projects has exactly 7 entries with 2 featured'` test:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/data/content.test.ts`
Expected: FAIL — `projects` still uses `featured`/`anywork-agent`, `storyLayout`/`impact` are `undefined`.

- [ ] **Step 3: Update the `Project` interface in `src/types/content.ts`**

Change:

```ts
export interface Project {
  id: string
  name: string
  company: string | null
  tags: string[]
  problem: string | null
  description: string
  architectureHighlight: string | null
  featured: boolean
  image: string | null
  demoUrl: string | null
  demoLabel: string | null
}
```

to:

```ts
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
```

- [ ] **Step 4: Update `src/data/projects.ts`**

Replace the file entirely:

```ts
import type { Project } from '../types/content.js'
import miner from '../Assets/Projects/miner.png'
import ivy from '../Assets/Projects/ivy.png'
import nft from '../Assets/Projects/nft.png'
import door from '../Assets/Projects/door.png'
import shift from '../Assets/Projects/shift.png'

export const projects: Project[] = [
  {
    id: 'stacklead',
    name: 'StackLead',
    company: 'SMS Holdings',
    tags: ['React.js', 'Node.js', 'LLM APIs', 'Voice AI', 'Email Automation', 'Agentic Workflows'],
    problem:
      'Sales teams drown in unqualified leads and manual, multi-tool prospecting — there was no single system to find, validate, contact, and track leads through to a booked meeting.',
    description:
      "A conversational AI chatbot lets reps query and analyze lead data in plain language, kicking off a trackable background job that searches and enriches results in real time. Underneath, an agentic pipeline handles lead discovery, deduplication, and campaign creation, then places AI voice calls to understand a lead's interests and sequences automated email outreach — with Calendly-based meeting booking and CSV/PDF export throughout.",
    architectureHighlight:
      'A modular full-stack platform (AI Chatbot, Campaigns, Contacts, Jobs, Analytics) built around an asynchronous job pipeline — search, validation, deduplication, and campaign-creation stages tracked in real time on a live Jobs dashboard — with LLM-backed natural-language querying, AI voice calling, and automated email sequencing orchestrated through tool-calling workflows.',
    impact:
      'Gives sales teams a single system to go from a plain-language ask to a qualified, contacted, and tracked lead — with call-connection rate, email success rate, and meetings booked all measured automatically on a built-in analytics dashboard instead of assembled by hand across disconnected tools.',
    storyLayout: true,
    image: null,
    demoUrl: 'https://stacklead.net/',
    demoLabel: 'Live Product',
  },
  {
    id: 'mindminer',
    name: 'MindMiner',
    company: 'CodingCops',
    tags: ['React.js', 'Node.js', 'AWS ECS/ECR/Fargate', 'Ethereum', 'LLM & Video Gen APIs'],
    problem:
      'Turning a described problem into candidate invention solutions and structured patent documentation.',
    description:
      'AI-assisted invention platform generating candidate solutions and drafting structured patent documentation via LLM pipelines, with automated multimedia explainer videos per invention.',
    architectureHighlight:
      'Web3 layer with wallet balances, on-chain burns, ERC-20/NFT transfers, crowdfunding contracts, and token minting — secure multi-step authenticated transactions with blockchain event verification.',
    impact:
      'Collapses invention documentation from concept to structured, patent-ready drafts — with an automated video explainer generated for every submission.',
    storyLayout: true,
    image: miner,
    demoUrl: 'https://dev.mindminer.ai/',
    demoLabel: 'Demo',
  },
  {
    id: 'smart-system',
    name: 'Smart System',
    company: 'SMS Holdings',
    tags: ['React Native', 'React.js', 'Node.js', 'AWS'],
    problem: null,
    description:
      'Mobile and web platform for on-demand household services, with an integrated admin panel for customer/partner monitoring and in-app commissioning support.',
    architectureHighlight: null,
    impact: null,
    storyLayout: false,
    image: null,
    demoUrl: null,
    demoLabel: null,
  },
  {
    id: 'ivy',
    name: 'IVY',
    company: 'CodingCops',
    tags: ['Ruby on Rails', 'React.js', 'Hanami', 'Heroku', 'Datadog', 'Redis'],
    problem: null,
    description:
      'Hospitality platform covering guest booking, task orchestration, SMS notifications, and an activity management system that improved staff task completion.',
    architectureHighlight: null,
    impact: null,
    storyLayout: false,
    image: ivy,
    demoUrl: 'https://www.revinate.com/solutions/revinate-ivy/',
    demoLabel: 'Learn more',
  },
  {
    id: 'smeisty',
    name: 'Smeisty',
    company: 'TectSoft',
    tags: ['React.js', 'Node.js', 'Ethereum', 'MetaMask', 'OpenSea'],
    problem: null,
    description:
      'NFT management platform handling contract addresses and wallet transactions, optimized for speed and cross-device responsiveness.',
    architectureHighlight: null,
    impact: null,
    storyLayout: false,
    image: nft,
    demoUrl: 'https://smeisty.app/',
    demoLabel: 'Demo',
  },
  {
    id: 'door-visualizer',
    name: 'Door Visualizer',
    company: null,
    tags: ['Augmented Reality', 'Mobile'],
    problem: null,
    description:
      'Augmented reality app for smartphones — people can see through their camera how new doors would look directly in their interior.',
    architectureHighlight: null,
    impact: null,
    storyLayout: false,
    image: door,
    demoUrl: 'https://www.door-visualizer.com/',
    demoLabel: 'Demo',
  },
  {
    id: 'shifterp',
    name: 'ShiftERP',
    company: null,
    tags: ['ERP', 'Supply Chain'],
    problem: null,
    description:
      'First fully integrated end-to-end ERP solution for co-packers and supply chain teams.',
    architectureHighlight: null,
    impact: null,
    storyLayout: false,
    image: shift,
    demoUrl: 'https://www.shifterp.com/',
    demoLabel: 'Demo',
  },
]
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/data/content.test.ts`
Expected: PASS.

- [ ] **Step 6: Confirm the schema change breaks the build (expected, temporary)**

Run: `npx tsc --noEmit` — Expected: type errors in `Projects.tsx` and `FeaturedProjectCard.tsx` (`.featured` no longer exists on `Project`). This confirms the schema change is real; the remaining steps in this task fix it.

- [ ] **Step 7: Create `ProjectStory.tsx` — the full-bleed numbered case-study layout**

```tsx
import type { Project } from '../../../types/content.js'
import TechBadge from '../../ui/TechBadge.js'

interface ProjectStoryProps {
  project: Project
}

const BEATS: { key: 'problem' | 'description' | 'architectureHighlight' | 'impact'; label: string }[] = [
  { key: 'problem', label: 'Problem' },
  { key: 'description', label: 'Approach & Features' },
  { key: 'architectureHighlight', label: 'Architecture' },
  { key: 'impact', label: 'Impact' },
]

function ProjectStory({ project }: ProjectStoryProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-8 py-10 sm:px-11">
        <p className="font-mono text-xs uppercase tracking-wide text-accent">
          Featured Project{project.company ? ` · ${project.company}` : ''}
        </p>
        <h3 className="mt-3 font-serif text-3xl font-normal text-ink sm:text-4xl">{project.name}</h3>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <TechBadge key={tag} label={tag} />
          ))}
        </div>
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-block text-sm font-semibold text-accent hover:underline"
          >
            {project.demoLabel} →
          </a>
        )}
      </div>
      {project.image ? (
        <img
          src={project.image}
          alt={`${project.name} screenshot`}
          loading="lazy"
          decoding="async"
          className="aspect-[16/9] w-full object-cover"
        />
      ) : (
        <div className="mx-8 my-8 flex aspect-[16/9] items-center justify-center rounded-lg border border-dashed border-border font-mono text-xs uppercase tracking-wide text-muted sm:mx-11">
          Screenshot coming soon
        </div>
      )}
      {BEATS.map(({ key, label }, i) => {
        const text = project[key]
        if (!text) return null
        return (
          <div
            key={key}
            className={`grid gap-4 px-8 py-8 sm:grid-cols-[80px_1fr] sm:px-11 ${
              i < BEATS.length - 1 ? 'border-b border-border' : ''
            }`}
          >
            <p className="font-mono text-sm text-accent">{String(i + 1).padStart(2, '0')}</p>
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-muted">{label}</p>
              <p className="mt-2 text-ink">{text}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ProjectStory
```

- [ ] **Step 8: Reskin `AbstractProjectVisual.tsx`**

Replace entirely:

```tsx
import TechBadge from '../../ui/TechBadge.js'

interface AbstractProjectVisualProps {
  tags: string[]
}

function AbstractProjectVisual({ tags }: AbstractProjectVisualProps) {
  return (
    <div
      className="flex h-full min-h-[220px] flex-wrap content-center items-center justify-center gap-2 rounded-lg border border-border p-8"
      style={{
        background:
          'radial-gradient(circle at 30% 30%, rgba(168,85,43,0.12), transparent 60%), radial-gradient(circle at 70% 70%, rgba(168,85,43,0.06), transparent 60%)',
      }}
    >
      {tags.map((tag) => (
        <TechBadge key={tag} label={tag} />
      ))}
    </div>
  )
}

export default AbstractProjectVisual
```

- [ ] **Step 9: Reskin `ProjectCard.tsx`**

Replace entirely:

```tsx
import SpotlightCard from '../../ui/SpotlightCard.js'
import TechBadge from '../../ui/TechBadge.js'
import AbstractProjectVisual from './AbstractProjectVisual.js'
import type { Project } from '../../../types/content.js'

interface ProjectCardProps {
  project: Project
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <SpotlightCard className="flex h-full flex-col p-5">
      {project.image ? (
        <img
          src={project.image}
          alt={`${project.name} screenshot`}
          loading="lazy"
          decoding="async"
          className="aspect-[16/9] w-full rounded-md object-cover"
        />
      ) : (
        <AbstractProjectVisual tags={project.tags} />
      )}
      <h3 className="mt-4 font-serif text-lg font-normal text-ink">{project.name}</h3>
      <p className="mt-2 flex-1 text-sm text-muted">{project.description}</p>
      {project.image && (
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <TechBadge key={tag} label={tag} />
          ))}
        </div>
      )}
      {project.demoUrl && (
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-sm font-semibold text-accent hover:underline"
        >
          {project.demoLabel} →
        </a>
      )}
    </SpotlightCard>
  )
}

export default ProjectCard
```

- [ ] **Step 10: Rebuild `Projects.tsx` to use `storyLayout`**

Replace entirely:

```tsx
import { projects } from '../../../data/projects.js'
import SectionReveal from '../../ui/SectionReveal.js'
import ProjectStory from './ProjectStory.js'
import ProjectCard from './ProjectCard.js'

function Projects() {
  const stories = projects.filter((p) => p.storyLayout)
  const standard = projects.filter((p) => !p.storyLayout)

  return (
    <SectionReveal as="section" className="px-6 py-24">
      <div id="projects" className="mx-auto max-w-5xl scroll-mt-24">
        <h2 className="font-serif text-3xl font-normal text-ink">
          Featured <span className="text-accent">Projects</span>
        </h2>
        <div className="mt-12 flex flex-col gap-16">
          {stories.map((project) => (
            <ProjectStory key={project.id} project={project} />
          ))}
        </div>
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {standard.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </SectionReveal>
  )
}

export default Projects
```

(`Projects.test.tsx` needs no changes — it only asserts that every project's name renders somewhere and that `#projects` exists, both still true with `ProjectStory` replacing `FeaturedProjectCard`.)

- [ ] **Step 11: Delete the now-unused `FeaturedProjectCard.tsx`**

```bash
git rm src/components/sections/Projects/FeaturedProjectCard.tsx
```

- [ ] **Step 12: Run the full suite, typecheck, and build**

Run: `npm run test` — Expected: all tests pass, including `Projects.test.tsx` and `content.test.ts`.
Run: `npx tsc --noEmit` — Expected: no errors.
Run: `npm run build` — Expected: succeeds.

- [ ] **Step 13: Commit**

```bash
git add src/types/content.ts src/data/projects.ts src/data/content.test.ts src/components/sections/Projects
git commit -m "Promote StackLead to flagship project with full-bleed case-study layout"
```

---

### Task 18: Reskin Experience section and Timeline

**Files:**
- Modify: `src/components/sections/Experience/Experience.tsx`, `src/components/ui/Timeline.tsx`

**Interfaces:**
- No prop/export shape change. `Experience.test.tsx`/`Timeline.test.tsx` assertions (school text, company/role/bullets text) are unaffected by className/font changes.

- [ ] **Step 1: Reskin `Timeline.tsx`**

Change:

```tsx
    <ol className="relative border-l border-subtle pl-8">
```

to:

```tsx
    <ol className="relative border-l border-border pl-8">
```

Change:

```tsx
            className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full bg-accent-violet"
```

to:

```tsx
            className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full bg-accent"
```

Change:

```tsx
          <h3 className="mt-1 text-lg font-bold">
```

to:

```tsx
          <h3 className="mt-1 font-serif text-lg font-normal text-ink">
```

- [ ] **Step 2: Reskin `Experience.tsx`**

Change:

```tsx
        <h2 className="text-2xl font-bold">
          Professional <span className="text-accent-violet">Experience</span>
        </h2>
        <div className="mt-10 border-l border-subtle">
```

to:

```tsx
        <h2 className="font-serif text-3xl font-normal text-ink">
          Professional <span className="text-accent">Experience</span>
        </h2>
        <div className="mt-10 border-l border-border">
```

- [ ] **Step 3: Run the full suite and build**

Run: `npm run test` — Expected: all tests pass.
Run: `npm run build` — Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Experience/Experience.tsx src/components/ui/Timeline.tsx
git commit -m "Reskin Experience section and Timeline"
```

---

### Task 19: Reskin AIExpertise section

**Files:**
- Modify: `src/components/sections/AIExpertise/AIExpertise.tsx`

**Interfaces:**
- No prop/export shape change. `AIExpertise.test.tsx` assertions (capability group labels, `#ai` id) are unaffected.

- [ ] **Step 1: Reskin the heading**

Change:

```tsx
        <h2 className="text-2xl font-bold">
          AI Engineering <span className="text-accent-violet">Expertise</span>
        </h2>
```

to:

```tsx
        <h2 className="font-serif text-3xl font-normal text-ink">
          AI Engineering <span className="text-accent">Expertise</span>
        </h2>
```

- [ ] **Step 2: Run the full suite and build**

Run: `npm run test` — Expected: all tests pass.
Run: `npm run build` — Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/AIExpertise/AIExpertise.tsx
git commit -m "Reskin AIExpertise section"
```

---

### Task 20: Reskin GithubActivity section

**Files:**
- Modify: `src/components/sections/GithubActivity/GithubActivity.tsx`

**Interfaces:**
- No prop/export shape change. `GithubActivity.test.tsx` mocks `react-github-calendar` entirely and only checks the `data-username` prop and the `#github-activity` id — the `colorScheme` prop change is invisible to that mock and needs no test update.

- [ ] **Step 1: Reskin the heading and switch the calendar to light mode**

Change:

```tsx
        <h2 className="text-2xl font-bold">
          Days I <span className="text-accent-violet">Code</span>
        </h2>
        <div className="mt-8 flex justify-center">
          <GitHubCalendar username={profile.githubUsername} colorScheme="dark" blockSize={12} blockMargin={4} fontSize={14} />
        </div>
```

to:

```tsx
        <h2 className="font-serif text-3xl font-normal text-ink">
          Days I <span className="text-accent">Code</span>
        </h2>
        <div className="mt-8 flex justify-center">
          <GitHubCalendar username={profile.githubUsername} colorScheme="light" blockSize={12} blockMargin={4} fontSize={14} />
        </div>
```

- [ ] **Step 2: Run the full suite and build**

Run: `npm run test` — Expected: all tests pass.
Run: `npm run build` — Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/GithubActivity/GithubActivity.tsx
git commit -m "Reskin GithubActivity section, switch calendar to light mode"
```

---

### Task 21: Reskin ResumeCTA and Contact headings

**Files:**
- Modify: `src/components/sections/ResumeCTA/ResumeCTA.tsx`, `src/components/sections/Contact/Contact.tsx`

**Interfaces:**
- No prop/export shape change. Neither test file checks heading text/classNames.
- Note: neither component has any other color classNames of its own — both already inherit `text-muted` (Task 9) and correctly-styled `MagneticButton`s (Task 14). This task only brings their headings in line with the serif-display pattern used by every other section (Task 16, 17, 18, 19, 20).

- [ ] **Step 1: Reskin `ResumeCTA.tsx` heading**

Change:

```tsx
        <h2 className="text-2xl font-bold">Want the full picture?</h2>
```

to:

```tsx
        <h2 className="font-serif text-3xl font-normal text-ink">Want the full picture?</h2>
```

- [ ] **Step 2: Reskin `Contact.tsx` heading**

Change:

```tsx
        <h2 className="text-3xl font-bold">Let's build something impactful.</h2>
```

to:

```tsx
        <h2 className="font-serif text-4xl font-normal text-ink">Let's build something impactful.</h2>
```

- [ ] **Step 3: Run the full suite and build**

Run: `npm run test` — Expected: all tests pass.
Run: `npm run build` — Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/ResumeCTA/ResumeCTA.tsx src/components/sections/Contact/Contact.tsx
git commit -m "Reskin ResumeCTA and Contact headings"
```

---

### Task 22: Remove legacy design tokens

**Files:**
- Modify: `tailwind.config.js`

**Interfaces:**
- Produces: the final, clean token set — `paper`, `surface`, `border`, `ink`, `muted`, `accent` are the only colors; `base`, `subtle`, `primary`, `accent-violet`, `accent-cyan`, and the unused `gradient-accent` background image are gone. Every prior Phase B task has already migrated its own file off these names, so this task is pure subtraction.

- [ ] **Step 1: Verify nothing still references the legacy tokens**

Run: `grep -rn "text-primary\|bg-base\|border-subtle\|accent-violet\|accent-cyan\|bg-gradient-accent\|bg-clip-text" src/`
Expected: no output. If anything matches, fix that file before continuing — it means an earlier task's reskin was incomplete.

- [ ] **Step 2: Remove legacy tokens from `tailwind.config.js`**

Replace the file entirely:

```js
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f2ece0',
        surface: '#ece4d2',
        border: '#d9cdb6',
        ink: '#262019',
        muted: '#5c5344',
        accent: '#a8552b',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: Run the full suite, typecheck, and build**

Run: `npm run test` — Expected: all tests pass.
Run: `npx tsc --noEmit` — Expected: no errors.
Run: `npm run build` — Expected: succeeds.
Run: `npm run dev`, click through every section, confirm nothing renders unstyled (which would indicate a missed legacy-token reference that Step 1's grep didn't catch, e.g. inside a template string built at runtime). Stop the dev server once confirmed.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.js
git commit -m "Remove legacy Deep Space Mesh design tokens"
```

---

### Task 23: Update README and verify final dependency list

**Files:**
- Modify: `README.md`, `package.json` (verify only — no further dependency changes expected)

**Interfaces:**
- No code interfaces — documentation only.

- [ ] **Step 1: Update `README.md`**

Replace the `## Built With` section:

```md
This project was built using these technologies.

- Vite
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Vercel
```

Replace the `## Features` section:

```md
**📖 Single-Page Scroll Layout**

**🎨 Styled with Tailwind CSS, animated with Framer Motion**

**📱 Fully Responsive**

**🔷 Written in TypeScript**
```

- [ ] **Step 2: Verify the final dependency list is intentional**

Run: `cat package.json`
Expected: `dependencies` no longer lists `typewriter-effect` (removed in Task 12); `devDependencies` includes `typescript`, `@types/react`, `@types/react-dom` (added in Task 1). No other dependency changes are expected from this plan — if any are present, that's a signal a prior task's cleanup step was skipped.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "Update README for TypeScript and the Warm Technical Mono redesign"
```
