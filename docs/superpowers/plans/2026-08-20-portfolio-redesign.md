# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio as a single-page, Vite + Tailwind + Framer Motion site that positions Muhammad Asim as a Senior Full-Stack / AI Product Engineer, using his resume as the source of truth for all content.

**Architecture:** Replace CRA + Bootstrap + react-router multi-page app with a Vite SPA rendering one scrolling page. Content lives in plain-data files under `src/data/`; presentation is a small set of reusable Framer-Motion-powered UI primitives (`SectionReveal`, `MagneticButton`, `SpotlightCard`, `StatCounter`, `TechBadge`, `AmbientGlow`, `Timeline`) composed into ten section components.

**Tech Stack:** Vite, React 18 (JS, no TypeScript), Tailwind CSS, Framer Motion, Vitest + @testing-library/react, react-icons, react-github-calendar, typewriter-effect.

**Spec:** `docs/superpowers/specs/2026-08-20-portfolio-redesign-design.md`

## Global Constraints

- Plain JavaScript/JSX only — no TypeScript migration.
- No `react-router-dom` / no multi-page routing — one scrolling page, anchor-link navigation only.
- No fabricated companies, projects, metrics, or claims — only resume-verified or already-existing-verified content.
- All animation must respect `prefers-reduced-motion` (continuous/cursor-driven effects degrade to simple opacity fades or are disabled).
- Color tokens: background `#0d0f1a`, surface `#15172a`, border `#262a48`, text `#eceef5`, muted `#9497bd`, accent gradient violet `#8b7bff` → cyan `#25c9d0`.
- Contact info: email `asimm364@gmail.com`, LinkedIn `https://linkedin.com/in/ceoasim`, GitHub `https://github.com/ceoasim` — no Twitter/Instagram.
- Resume presented via download/view buttons only — no embedded PDF viewer.
- All 7 projects from the spec are kept; the self-referential "My Portfolio" card and the unused `leaf.png`/`portfolio.png` assets are removed.

---

## Task 1: Migrate build tooling to Vite, remove legacy stack and old components

**Files:**
- Create: `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html` (root), `src/main.jsx`, `src/App.jsx`, `src/index.css`, `src/test/setup.js`
- Modify: `package.json`
- Delete: `src/index.js`, `src/App.js`, `src/App.css`, `src/App.test.js`, `src/style.css`, `src/setupTests.js`, `src/reportWebVitals.js`, `public/index.html`, `src/components/Home/` (entire folder), `src/components/About/` (entire folder), `src/components/Projects/Projects.js`, `src/components/Projects/ProjectCards.js`, `src/components/Resume/ResumeNew.js`, `src/components/Navbar.js`, `src/components/Footer.js`, `src/components/Particle.js`, `src/components/Pre.js`, `src/components/ScrollToTop.js`, `src/Assets/home-main.svg`, `src/Assets/avatar.svg`, `src/Assets/home-bg.jpg`, `src/Assets/about.png`, `src/Assets/pre.svg`, `src/Assets/Projects/leaf.png`, `src/Assets/Projects/portfolio.png`

**Interfaces:**
- Produces: a booting Vite dev server (`npm run dev`), a passing build (`npm run build`), and a working Vitest runner (`npm run test`) that later tasks build on. `src/App.jsx` exports a default component rendering a single placeholder `<main>` element that later tasks will fill with sections.

- [ ] **Step 1: Update `package.json` dependencies**

Remove: `bootstrap`, `react-bootstrap`, `react-router-dom`, `react-tsparticles`, `react-parallax-tilt`, `react-pdf`, `@react-pdf/renderer`, `axios`, `web-vitals`, `react-scripts`.
Keep: `react`, `react-dom`, `react-icons`, `react-github-calendar`, `typewriter-effect`.
Add dependencies: `framer-motion`.
Add devDependencies: `vite`, `@vitejs/plugin-react`, `tailwindcss`, `postcss`, `autoprefixer`, `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`.

Replace the `scripts` block:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest run"
}
```

Remove the `eslintConfig` block (CRA-specific) and the `browserslist` block (Vite doesn't use it the same way — Tailwind's autoprefixer handles vendor prefixing).

- [ ] **Step 2: Delete the old CRA/router/bootstrap files and components**

```bash
git rm -r src/components/Home src/components/About src/components/Projects/Projects.js \
  src/components/Projects/ProjectCards.js src/components/Resume/ResumeNew.js \
  src/components/Navbar.js src/components/Footer.js src/components/Particle.js \
  src/components/Pre.js src/components/ScrollToTop.js \
  src/Assets/home-main.svg src/Assets/avatar.svg src/Assets/home-bg.jpg \
  src/Assets/about.png src/Assets/pre.svg src/Assets/Projects/leaf.png \
  src/Assets/Projects/portfolio.png \
  src/App.js src/App.css src/App.test.js src/style.css src/setupTests.js \
  src/reportWebVitals.js src/index.js public/index.html
```

- [ ] **Step 3: Create the root `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Muhammad Asim | Portfolio</title>
    <meta name="theme-color" content="#0d0f1a" />
    <link rel="manifest" href="/manifest.json" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

(SEO meta tags are added in full in Task 19 — this task only needs the page to boot.)

- [ ] **Step 4: Create `vite.config.js`**

```js
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

- [ ] **Step 5: Create `src/test/setup.js`**

```js
import '@testing-library/jest-dom'

// jsdom has no IntersectionObserver; Framer Motion's useInView needs a stub.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = IntersectionObserverStub
```

- [ ] **Step 6: Create `tailwind.config.js` and `postcss.config.js`**

```js
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

```js
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

(Color/font theme extension is added in Task 2.)

- [ ] **Step 7: Create `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 8: Create `src/main.jsx`**

```jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 9: Create a minimal placeholder `src/App.jsx`**

```jsx
function App() {
  return (
    <main className="min-h-screen bg-[#0d0f1a] text-[#eceef5]">
      <p className="p-8">Portfolio rebuild in progress.</p>
    </main>
  )
}

export default App
```

- [ ] **Step 10: Install dependencies and verify the app boots**

```bash
npm install
npm run build
```

Expected: `npm run build` completes without errors and produces a `dist/` folder.

- [ ] **Step 11: Write and run a smoke test**

Create `src/App.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App.jsx'

describe('App', () => {
  it('renders the placeholder main content', () => {
    render(<App />)
    expect(screen.getByText(/Portfolio rebuild in progress/i)).toBeInTheDocument()
  })
})
```

Run: `npm run test`
Expected: PASS (1 test)

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "Migrate build tooling to Vite, remove legacy CRA/Bootstrap stack"
```

---

## Task 2: Design tokens — Tailwind theme, fonts, base styles

**Files:**
- Modify: `tailwind.config.js`, `index.html`, `src/index.css`

**Interfaces:**
- Produces: Tailwind color utilities `bg-surface`, `bg-base`, `border-subtle`, `text-primary`, `text-muted`, `text-accent-violet`, `text-accent-cyan`, a `bg-gradient-accent` utility (violet → cyan), font families `font-sans` (Inter) and `font-mono` (JetBrains Mono), and a global `.motion-safe-only` CSS class pattern via the `motion-safe:`/`motion-reduce:` Tailwind variants (built in, no config needed).

- [ ] **Step 1: Extend `tailwind.config.js` theme**

```js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0d0f1a',
        surface: '#15172a',
        subtle: '#262a48',
        primary: '#eceef5',
        muted: '#9497bd',
        accent: {
          violet: '#8b7bff',
          cyan: '#25c9d0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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

- [ ] **Step 2: Load Google Fonts in `index.html`**

Add inside `<head>`, after the manifest link:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap"
  rel="stylesheet"
/>
```

- [ ] **Step 3: Update `src/index.css` with base styles**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

body {
  @apply bg-base text-primary font-sans antialiased;
}
```

- [ ] **Step 4: Update `App.jsx` placeholder to use the new tokens (visual smoke check)**

```jsx
function App() {
  return (
    <main className="min-h-screen bg-base text-primary font-sans">
      <p className="p-8 font-mono text-accent-violet">Portfolio rebuild in progress.</p>
    </main>
  )
}

export default App
```

- [ ] **Step 5: Run the dev server and confirm visually**

Run: `npm run dev`
Expected: page background is `#0d0f1a`, text is `#eceef5`, the placeholder line renders in the monospace font in violet.

- [ ] **Step 6: Run existing test to confirm nothing broke**

Run: `npm run test`
Expected: PASS (1 test, same as Task 1)

- [ ] **Step 7: Commit**

```bash
git add tailwind.config.js index.html src/index.css src/App.jsx
git commit -m "Add design tokens: colors, fonts, base styles"
```

---

## Task 3: Content data layer

**Files:**
- Create: `src/data/profile.js`, `src/data/experience.js`, `src/data/projects.js`, `src/data/skills.js`, `src/data/content.test.js`

**Interfaces:**
- Produces:
  - `profile` object: `{ name, title, location, email, linkedin, github, githubUsername, heroValueProp, snapshotSupportingCopy, typewriterStrings: string[], stats: { value: number, suffix: string, label: string }[] }`
  - `experience` array: `{ company, role, start, end, current: boolean, bullets: string[], tags: string[] }[]`
  - `projects` array: `{ id, name, company, tags: string[], description, problem, architectureHighlight, featured: boolean, image: string|null, demoUrl: string|null, demoLabel: 'Demo'|'Learn more'|null }[]`
  - `skillGroups` array: `{ group: string, items: string[] }[]`
- Consumed by: every section component in Tasks 10-17.

- [ ] **Step 1: Write the failing shape test**

Create `src/data/content.test.js`:

```js
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

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL — data files don't exist yet.

- [ ] **Step 3: Create `src/data/profile.js`**

```js
export const profile = {
  name: 'Muhammad Asim',
  title: 'Senior Software Engineer — AI-Native Full-Stack Development',
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

- [ ] **Step 4: Create `src/data/experience.js`**

```js
export const experience = [
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

export const education = {
  degree: 'BS Software Engineering',
  school: 'Lahore Garrison University',
  detail: 'CGPA 3.4 / 4.0',
}
```

- [ ] **Step 5: Create `src/data/projects.js`**

```js
import miner from '../Assets/Projects/miner.png'
import ivy from '../Assets/Projects/ivy.png'
import nft from '../Assets/Projects/nft.png'
import door from '../Assets/Projects/door.png'
import shift from '../Assets/Projects/shift.png'

export const projects = [
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

- [ ] **Step 6: Create `src/data/skills.js`**

```js
export const skillGroups = [
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

- [ ] **Step 7: Run test to verify it passes**

Run: `npm run test`
Expected: PASS (5 tests: 1 from App.test.jsx + 4 in content.test.js)

- [ ] **Step 8: Commit**

```bash
git add src/data
git commit -m "Add resume-sourced content data layer"
```

---

## Task 4: UI primitive — SectionReveal

**Files:**
- Create: `src/components/ui/SectionReveal.jsx`, `src/components/ui/SectionReveal.test.jsx`

**Interfaces:**
- Produces: `<SectionReveal as="section" className="..." delay={0}>{children}</SectionReveal>` — a wrapper that fades/slides its children up into view once, using Framer Motion's `whileInView`. Consumed by every section component (Tasks 10-17).

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/ui/SectionReveal.test.jsx
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

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL — `./SectionReveal.jsx` doesn't exist.

- [ ] **Step 3: Implement `SectionReveal.jsx`**

```jsx
import { motion } from 'framer-motion'

const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

function SectionReveal({ as = 'div', className = '', delay = 0, children }) {
  const MotionTag = motion[as] ?? motion.div
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

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/SectionReveal.jsx src/components/ui/SectionReveal.test.jsx
git commit -m "Add SectionReveal scroll-reveal primitive"
```

---

## Task 5: UI primitive — MagneticButton

**Files:**
- Create: `src/components/ui/magneticOffset.js`, `src/components/ui/magneticOffset.test.js`, `src/components/ui/MagneticButton.jsx`, `src/components/ui/MagneticButton.test.jsx`

**Interfaces:**
- Produces: pure function `computeMagneticOffset(rect, clientX, clientY, strength = 0.25)` → `{ x: number, y: number }`; component `<MagneticButton href="#" variant="primary|secondary">Label</MagneticButton>`. Consumed by Hero (Task 10) and ResumeCTA/Contact (Task 17).

- [ ] **Step 1: Write the failing test for the pure function**

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL — `./magneticOffset.js` doesn't exist.

- [ ] **Step 3: Implement the pure function**

```js
// src/components/ui/magneticOffset.js
export function computeMagneticOffset(rect, clientX, clientY, strength = 0.25) {
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  return {
    x: (clientX - centerX) * strength,
    y: (clientY - centerY) * strength,
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 5: Write the failing component test**

```jsx
// src/components/ui/MagneticButton.test.jsx
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

- [ ] **Step 6: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL — `./MagneticButton.jsx` doesn't exist.

- [ ] **Step 7: Implement `MagneticButton.jsx`**

```jsx
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { computeMagneticOffset } from './magneticOffset.js'

const base =
  'inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-shadow'
const variants = {
  primary: 'bg-gradient-accent text-base',
  secondary: 'border border-subtle text-primary',
}

function MagneticButton({ href, variant = 'primary', onClick, children }) {
  const ref = useRef(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  function handleMouseMove(e) {
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
    >
      {children}
    </motion.a>
  )
}

export default MagneticButton
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add src/components/ui/magneticOffset.js src/components/ui/magneticOffset.test.js \
  src/components/ui/MagneticButton.jsx src/components/ui/MagneticButton.test.jsx
git commit -m "Add MagneticButton primitive with tested offset math"
```

---

## Task 6: UI primitive — SpotlightCard

**Files:**
- Create: `src/components/ui/tiltOffset.js`, `src/components/ui/tiltOffset.test.js`, `src/components/ui/SpotlightCard.jsx`, `src/components/ui/SpotlightCard.test.jsx`

**Interfaces:**
- Produces: pure function `computeTilt(rect, clientX, clientY, maxDeg = 8)` → `{ rotateX: number, rotateY: number }`; component `<SpotlightCard className="...">{children}</SpotlightCard>`. Consumed by Projects section (Task 13).

- [ ] **Step 1: Write the failing test for the pure function**

```js
// src/components/ui/tiltOffset.test.js
import { describe, it, expect } from 'vitest'
import { computeTilt } from './tiltOffset.js'

describe('computeTilt', () => {
  const rect = { left: 0, top: 0, width: 100, height: 100 }

  it('returns zero tilt at the card center', () => {
    expect(computeTilt(rect, 50, 50, 8)).toEqual({ rotateX: 0, rotateY: 0 })
  })

  it('tilts toward the cursor, capped at maxDeg', () => {
    // cursor at top-right corner
    const result = computeTilt(rect, 100, 0, 8)
    expect(result.rotateX).toBe(8)
    expect(result.rotateY).toBe(8)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL — `./tiltOffset.js` doesn't exist.

- [ ] **Step 3: Implement the pure function**

```js
// src/components/ui/tiltOffset.js
export function computeTilt(rect, clientX, clientY, maxDeg = 8) {
  const px = (clientX - rect.left) / rect.width // 0..1
  const py = (clientY - rect.top) / rect.height // 0..1
  const rotateY = (px - 0.5) * 2 * maxDeg
  const rotateX = (0.5 - py) * 2 * maxDeg
  return { rotateX, rotateY }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 5: Write the failing component test**

```jsx
// src/components/ui/SpotlightCard.test.jsx
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

- [ ] **Step 6: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL — `./SpotlightCard.jsx` doesn't exist.

- [ ] **Step 7: Implement `SpotlightCard.jsx`**

```jsx
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { computeTilt } from './tiltOffset.js'

function SpotlightCard({ className = '', children }) {
  const ref = useRef(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [spot, setSpot] = useState({ x: '50%', y: '50%', opacity: 0 })

  function handleMouseMove(e) {
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

- [ ] **Step 8: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add src/components/ui/tiltOffset.js src/components/ui/tiltOffset.test.js \
  src/components/ui/SpotlightCard.jsx src/components/ui/SpotlightCard.test.jsx
git commit -m "Add SpotlightCard primitive with tested tilt math"
```

---

## Task 7: UI primitive — StatCounter

**Files:**
- Create: `src/components/ui/countUp.js`, `src/components/ui/countUp.test.js`, `src/components/ui/StatCounter.jsx`, `src/components/ui/StatCounter.test.jsx`

**Interfaces:**
- Produces: pure function `getCountUpValue(elapsedMs, durationMs, target)` → number; component `<StatCounter value={6} suffix="+" label="Years Experience" />`. Consumed by Snapshot section (Task 11).

- [ ] **Step 1: Write the failing test for the pure function**

```js
// src/components/ui/countUp.test.js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL — `./countUp.js` doesn't exist.

- [ ] **Step 3: Implement the pure function**

```js
// src/components/ui/countUp.js
export function getCountUpValue(elapsedMs, durationMs, target) {
  const progress = Math.min(Math.max(elapsedMs / durationMs, 0), 1)
  return Math.round(progress * target)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 5: Write the failing component test**

```jsx
// src/components/ui/StatCounter.test.jsx
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

- [ ] **Step 6: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL — `./StatCounter.jsx` doesn't exist.

- [ ] **Step 7: Implement `StatCounter.jsx`**

```jsx
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { getCountUpValue } from './countUp.js'

const DURATION_MS = 1200

function StatCounter({ value, suffix = '', label }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start
    let frame
    function tick(timestamp) {
      if (start === undefined) start = timestamp
      const elapsed = timestamp - start
      setDisplay(getCountUpValue(elapsed, DURATION_MS, value))
      if (elapsed < DURATION_MS) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value])

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

- [ ] **Step 8: Run test to verify it passes**

Run: `npm run test`
Expected: PASS (the `IntersectionObserverStub` from Task 1 means `inView` never flips true in jsdom, so the component stays at its initial render of `0+`, matching the test)

- [ ] **Step 9: Commit**

```bash
git add src/components/ui/countUp.js src/components/ui/countUp.test.js \
  src/components/ui/StatCounter.jsx src/components/ui/StatCounter.test.jsx
git commit -m "Add StatCounter primitive with tested count-up math"
```

---

## Task 8: UI primitives — TechBadge and AmbientGlow

**Files:**
- Create: `src/components/ui/TechBadge.jsx`, `src/components/ui/TechBadge.test.jsx`, `src/components/ui/AmbientGlow.jsx`, `src/components/ui/AmbientGlow.test.jsx`

**Interfaces:**
- Produces: `<TechBadge label="React.js" />` (hover-interactive pill); `<AmbientGlow />` (absolutely-positioned cursor-following background glow, meant to be placed inside a `relative` container). Consumed by Skills (Task 12), Projects (Task 13), and Hero (Task 10).

- [ ] **Step 1: Write the failing TechBadge test**

```jsx
// src/components/ui/TechBadge.test.jsx
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

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL — `./TechBadge.jsx` doesn't exist.

- [ ] **Step 3: Implement `TechBadge.jsx`**

```jsx
function TechBadge({ label }) {
  return (
    <span className="inline-block rounded-full border border-subtle bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent-violet hover:text-primary">
      {label}
    </span>
  )
}

export default TechBadge
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 5: Write the failing AmbientGlow test**

```jsx
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
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL — `./AmbientGlow.jsx` doesn't exist.

- [ ] **Step 7: Implement `AmbientGlow.jsx`**

The wrapper must keep `pointer-events-none` — it's positioned `absolute inset-0` as a sibling before the hero's actual content, and by default CSS stacking rules an absolutely-positioned element renders above static siblings regardless of DOM order. Without `pointer-events-none` it would silently block clicks on the hero's CTA buttons. Since an element with `pointer-events-none` never receives its own mouse events, the listener is attached to `window` instead (reading the container's position via its ref, which works regardless of pointer-events):

```jsx
import { useEffect, useRef, useState } from 'react'

function AmbientGlow() {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: '50%', y: '40%' })

  useEffect(() => {
    function handleMouseMove(e) {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      setPos({
        x: `${e.clientX - rect.left}px`,
        y: `${e.clientY - rect.top}px`,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={ref}
      data-testid="ambient-glow"
      className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden"
    >
      <div
        className="absolute h-[420px] w-[420px] rounded-full blur-3xl transition-[left,top] duration-300 ease-out"
        style={{
          left: pos.x,
          top: pos.y,
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(circle, rgba(139,123,255,0.20), rgba(37,201,208,0.10) 60%, transparent 80%)',
        }}
      />
    </div>
  )
}

export default AmbientGlow
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add src/components/ui/TechBadge.jsx src/components/ui/TechBadge.test.jsx \
  src/components/ui/AmbientGlow.jsx src/components/ui/AmbientGlow.test.jsx
git commit -m "Add TechBadge and AmbientGlow primitives"
```

---

## Task 9: Layout — Navbar and Footer

**Files:**
- Create: `src/components/layout/Navbar.jsx`, `src/components/layout/Navbar.test.jsx`, `src/components/layout/Footer.jsx`, `src/components/layout/Footer.test.jsx`

**Interfaces:**
- Produces: `<Navbar />` (fixed top nav with anchor links to `#snapshot #skills #projects #experience #ai #contact`, mobile hamburger menu, scroll-based background change); `<Footer />` (copyright + GitHub/LinkedIn icons, no Twitter/Instagram). Both consume `profile` from `src/data/profile.js`.
- Consumed by: `App.jsx` (Task 18).

- [ ] **Step 1: Write the failing Navbar test**

```jsx
// src/components/layout/Navbar.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Navbar from './Navbar.jsx'

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

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL — `./Navbar.jsx` doesn't exist.

- [ ] **Step 3: Implement `Navbar.jsx`**

```jsx
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
          onClick={() => setOpen((o) => !o)}
          className="text-primary md:hidden"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>
      {open && (
        <ul data-testid="mobile-menu" className="flex flex-col gap-4 border-t border-subtle px-6 py-4 md:hidden">
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

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 5: Write the failing Footer test**

```jsx
// src/components/layout/Footer.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from './Footer.jsx'

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

- [ ] **Step 6: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL — `./Footer.jsx` doesn't exist.

- [ ] **Step 7: Implement `Footer.jsx`**

```jsx
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

- [ ] **Step 8: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add src/components/layout
git commit -m "Add Navbar and Footer layout components"
```

---

## Task 10: Hero section

**Files:**
- Create: `src/components/sections/Hero/Hero.jsx`, `src/components/sections/Hero/HeroVisual.jsx`, `src/components/sections/Hero/Hero.test.jsx`, `src/components/sections/Hero/index.js`

**Interfaces:**
- Produces: `<Hero />` — full-viewport section with id `hero`, eyebrow/name/headline/typewriter/value-prop/CTAs/social row/abstract visual. Consumes `profile` from `src/data/profile.js`, `MagneticButton`, `AmbientGlow`.
- Consumed by: `App.jsx` (Task 18).

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/sections/Hero/Hero.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Hero from './Hero.jsx'

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

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL — `./Hero.jsx` doesn't exist.

- [ ] **Step 3: Implement `HeroVisual.jsx`** (abstract node-graph, no stock illustration)

```jsx
import { motion } from 'framer-motion'

const NODES = [
  { x: 60, y: 40 }, { x: 180, y: 20 }, { x: 220, y: 120 },
  { x: 100, y: 160 }, { x: 20, y: 110 }, { x: 150, y: 90 },
]
const EDGES = [[0, 1], [1, 2], [2, 5], [5, 0], [0, 4], [4, 3], [3, 5]]

function HeroVisual() {
  return (
    <svg viewBox="0 0 240 200" className="h-64 w-64 motion-reduce:opacity-80" aria-hidden="true">
      {EDGES.map(([a, b], i) => (
        <line
          key={i}
          x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
          stroke="#8b7bff" strokeOpacity="0.35" strokeWidth="1"
        />
      ))}
      {NODES.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x} cy={n.y} r={5}
          fill={i % 2 === 0 ? '#8b7bff' : '#25c9d0'}
          animate={{ cy: [n.y, n.y - 8, n.y] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  )
}

export default HeroVisual
```

- [ ] **Step 4: Implement `Hero.jsx`**

```jsx
import Typewriter from 'typewriter-effect'
import { AiFillGithub } from 'react-icons/ai'
import { FaLinkedinIn } from 'react-icons/fa'
import { MdOutlineEmail } from 'react-icons/md'
import { profile } from '../../../data/profile.js'
import MagneticButton from '../../ui/MagneticButton.jsx'
import AmbientGlow from '../../ui/AmbientGlow.jsx'
import HeroVisual from './HeroVisual.jsx'
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
            <MagneticButton href={resumePdf} variant="secondary">
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

- [ ] **Step 5: Create `index.js` barrel**

```js
export { default } from './Hero.jsx'
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/Hero
git commit -m "Add Hero section"
```

---

## Task 11: Snapshot section

**Files:**
- Create: `src/components/sections/Snapshot/Snapshot.jsx`, `src/components/sections/Snapshot/Snapshot.test.jsx`, `src/components/sections/Snapshot/index.js`

**Interfaces:**
- Produces: `<Snapshot />` — id `snapshot`, renders `profile.snapshotSupportingCopy` and one `StatCounter` per entry in `profile.stats`, wrapped in `SectionReveal`.
- Consumed by: `App.jsx` (Task 18).

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/sections/Snapshot/Snapshot.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Snapshot from './Snapshot.jsx'
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

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL — `./Snapshot.jsx` doesn't exist.

- [ ] **Step 3: Implement `Snapshot.jsx`**

```jsx
import { profile } from '../../../data/profile.js'
import SectionReveal from '../../ui/SectionReveal.jsx'
import StatCounter from '../../ui/StatCounter.jsx'

function Snapshot() {
  return (
    <SectionReveal as="section" className="px-6 py-24" delay={0}>
      <div id="snapshot" className="mx-auto max-w-4xl scroll-mt-24 text-center">
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

- [ ] **Step 4: Create `index.js` barrel**

```js
export { default } from './Snapshot.jsx'
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Snapshot
git commit -m "Add Professional Snapshot section"
```

---

## Task 12: Skills section

**Files:**
- Create: `src/components/sections/Skills/Skills.jsx`, `src/components/sections/Skills/Skills.test.jsx`, `src/components/sections/Skills/index.js`

**Interfaces:**
- Produces: `<Skills />` — id `skills`, renders each `skillGroups` entry as a labeled group of `TechBadge`s.
- Consumed by: `App.jsx` (Task 18).

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/sections/Skills/Skills.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Skills from './Skills.jsx'
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

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL — `./Skills.jsx` doesn't exist.

- [ ] **Step 3: Implement `Skills.jsx`**

```jsx
import { skillGroups } from '../../../data/skills.js'
import SectionReveal from '../../ui/SectionReveal.jsx'
import TechBadge from '../../ui/TechBadge.jsx'

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

- [ ] **Step 4: Create `index.js` barrel**

```js
export { default } from './Skills.jsx'
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Skills
git commit -m "Add Core Expertise / Skills section"
```

---

## Task 13: Projects section

**Files:**
- Create: `src/components/sections/Projects/Projects.jsx`, `src/components/sections/Projects/FeaturedProjectCard.jsx`, `src/components/sections/Projects/ProjectCard.jsx`, `src/components/sections/Projects/AbstractProjectVisual.jsx`, `src/components/sections/Projects/Projects.test.jsx`, `src/components/sections/Projects/index.js`

**Interfaces:**
- Produces: `<Projects />` — id `projects`, renders the 2 featured projects (`featured: true`) via `FeaturedProjectCard` in an alternating layout, then the remaining 5 via `ProjectCard` in a responsive grid. Consumes `projects` from `src/data/projects.js`, `SpotlightCard`, `TechBadge`.
- Consumed by: `App.jsx` (Task 18).

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/sections/Projects/Projects.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Projects from './Projects.jsx'
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

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL — `./Projects.jsx` doesn't exist.

- [ ] **Step 3: Implement `AbstractProjectVisual.jsx`**

```jsx
import TechBadge from '../../ui/TechBadge.jsx'

function AbstractProjectVisual({ tags }) {
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

- [ ] **Step 4: Implement `FeaturedProjectCard.jsx`**

```jsx
import AbstractProjectVisual from './AbstractProjectVisual.jsx'
import TechBadge from '../../ui/TechBadge.jsx'

function FeaturedProjectCard({ project, reverse }) {
  return (
    <div className={`grid items-center gap-10 md:grid-cols-2 ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}>
      <div>
        {project.image ? (
          <img src={project.image} alt={`${project.name} screenshot`} className="rounded-lg border border-subtle" />
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
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <TechBadge key={tag} label={tag} />
          ))}
        </div>
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

- [ ] **Step 5: Implement `ProjectCard.jsx`**

```jsx
import SpotlightCard from '../../ui/SpotlightCard.jsx'
import TechBadge from '../../ui/TechBadge.jsx'
import AbstractProjectVisual from './AbstractProjectVisual.jsx'

function ProjectCard({ project }) {
  return (
    <SpotlightCard className="flex h-full flex-col p-5">
      {project.image ? (
        <img src={project.image} alt={`${project.name} screenshot`} className="rounded-md" />
      ) : (
        <AbstractProjectVisual tags={project.tags} />
      )}
      <h3 className="mt-4 text-lg font-bold">{project.name}</h3>
      <p className="mt-2 flex-1 text-sm text-muted">{project.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <TechBadge key={tag} label={tag} />
        ))}
      </div>
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

- [ ] **Step 6: Implement `Projects.jsx`**

```jsx
import { projects } from '../../../data/projects.js'
import SectionReveal from '../../ui/SectionReveal.jsx'
import FeaturedProjectCard from './FeaturedProjectCard.jsx'
import ProjectCard from './ProjectCard.jsx'

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

- [ ] **Step 7: Create `index.js` barrel**

```js
export { default } from './Projects.jsx'
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add src/components/sections/Projects
git commit -m "Add Featured Projects section"
```

---

## Task 14: Experience timeline section

**Files:**
- Create: `src/components/ui/Timeline.jsx`, `src/components/ui/Timeline.test.jsx`, `src/components/sections/Experience/Experience.jsx`, `src/components/sections/Experience/Experience.test.jsx`, `src/components/sections/Experience/index.js`

**Interfaces:**
- Produces: `<Timeline entries={experience} />` (reusable animated vertical line + node-per-entry primitive); `<Experience />` — id `experience`, renders the timeline plus the `education` entry at the end. Consumes `experience` and `education` from `src/data/experience.js`.
- Consumed by: `App.jsx` (Task 18).

- [ ] **Step 1: Write the failing Timeline test**

```jsx
// src/components/ui/Timeline.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Timeline from './Timeline.jsx'

const entries = [
  { company: 'A', role: 'Engineer', start: '2024', end: 'Present', current: true, bullets: ['Did X'], tags: ['React'] },
  { company: 'B', role: 'Engineer', start: '2020', end: '2024', current: false, bullets: ['Did Y'], tags: ['Node'] },
]

describe('Timeline', () => {
  it('renders every entry company, role, and bullets', () => {
    render(<Timeline entries={entries} />)
    entries.forEach((e) => {
      expect(screen.getByText(e.company)).toBeInTheDocument()
      expect(screen.getByText(e.role)).toBeInTheDocument()
      e.bullets.forEach((b) => expect(screen.getByText(b)).toBeInTheDocument())
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL — `./Timeline.jsx` doesn't exist.

- [ ] **Step 3: Implement `Timeline.jsx`**

```jsx
import { motion } from 'framer-motion'
import TechBadge from './TechBadge.jsx'

function Timeline({ entries }) {
  return (
    <ol className="relative border-l border-subtle pl-8">
      {entries.map((entry) => (
        <li key={entry.company} className="mb-12 last:mb-0">
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
            {entry.role} · {entry.company}
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

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 5: Write the failing Experience section test**

```jsx
// src/components/sections/Experience/Experience.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Experience from './Experience.jsx'
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

- [ ] **Step 6: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL — `./Experience.jsx` doesn't exist.

- [ ] **Step 7: Implement `Experience.jsx`**

```jsx
import { experience, education } from '../../../data/experience.js'
import SectionReveal from '../../ui/SectionReveal.jsx'
import Timeline from '../../ui/Timeline.jsx'

function Experience() {
  return (
    <SectionReveal as="section" className="px-6 py-24">
      <div id="experience" className="mx-auto max-w-3xl scroll-mt-24">
        <h2 className="text-2xl font-bold">
          Professional <span className="text-accent-violet">Experience</span>
        </h2>
        <div className="mt-10">
          <Timeline entries={experience} />
        </div>
        <p className="mt-8 border-l border-subtle pl-8 text-sm text-muted">
          {education.degree} — {education.school} · {education.detail}
        </p>
      </div>
    </SectionReveal>
  )
}

export default Experience
```

- [ ] **Step 8: Create `index.js` barrel**

```js
export { default } from './Experience.jsx'
```

- [ ] **Step 9: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 10: Commit**

```bash
git add src/components/ui/Timeline.jsx src/components/ui/Timeline.test.jsx src/components/sections/Experience
git commit -m "Add animated Timeline primitive and Experience section"
```

---

## Task 15: AI Engineering Expertise section

**Files:**
- Create: `src/data/aiExpertise.js`, `src/components/sections/AIExpertise/AIExpertise.jsx`, `src/components/sections/AIExpertise/AIExpertise.test.jsx`, `src/components/sections/AIExpertise/index.js`

**Interfaces:**
- Produces: `<AIExpertise />` — id `ai`. Consumes a new `aiCapabilities` array (grouped: label + items) from `src/data/aiExpertise.js`.
- Consumed by: `App.jsx` (Task 18).

- [ ] **Step 1: Create `src/data/aiExpertise.js`**

```js
export const aiFraming =
  'I build products on top of frontier models, not just around an API call.'

export const aiCapabilities = [
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

- [ ] **Step 2: Write the failing test**

```jsx
// src/components/sections/AIExpertise/AIExpertise.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AIExpertise from './AIExpertise.jsx'
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

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL — `./AIExpertise.jsx` doesn't exist.

- [ ] **Step 4: Implement `AIExpertise.jsx`**

```jsx
import { aiFraming, aiCapabilities } from '../../../data/aiExpertise.js'
import SectionReveal from '../../ui/SectionReveal.jsx'
import TechBadge from '../../ui/TechBadge.jsx'

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

- [ ] **Step 5: Create `index.js` barrel**

```js
export { default } from './AIExpertise.jsx'
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/data/aiExpertise.js src/components/sections/AIExpertise
git commit -m "Add AI Engineering Expertise section"
```

---

## Task 16: GitHub Activity section

**Files:**
- Create: `src/components/sections/GithubActivity/GithubActivity.jsx`, `src/components/sections/GithubActivity/GithubActivity.test.jsx`, `src/components/sections/GithubActivity/index.js`

**Interfaces:**
- Produces: `<GithubActivity />` — id `github-activity`, renders `react-github-calendar` for `profile.githubUsername` (`ceoasim`, fixing the previous stale `ansnisar`).
- Consumed by: `App.jsx` (Task 18).

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/sections/GithubActivity/GithubActivity.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('react-github-calendar', () => ({
  default: (props) => <div data-testid="calendar" data-username={props.username} />,
}))

import GithubActivity from './GithubActivity.jsx'

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

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL — `./GithubActivity.jsx` doesn't exist.

- [ ] **Step 3: Implement `GithubActivity.jsx`**

```jsx
import GitHubCalendar from 'react-github-calendar'
import { profile } from '../../../data/profile.js'
import SectionReveal from '../../ui/SectionReveal.jsx'

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

- [ ] **Step 4: Create `index.js` barrel**

```js
export { default } from './GithubActivity.jsx'
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/GithubActivity
git commit -m "Add GitHub Activity section, fix stale username"
```

---

## Task 17: ResumeCTA and Contact sections

**Files:**
- Create: `src/components/sections/ResumeCTA/ResumeCTA.jsx`, `src/components/sections/ResumeCTA/ResumeCTA.test.jsx`, `src/components/sections/ResumeCTA/index.js`, `src/components/sections/Contact/Contact.jsx`, `src/components/sections/Contact/Contact.test.jsx`, `src/components/sections/Contact/index.js`

**Interfaces:**
- Produces: `<ResumeCTA />` (id `resume`, second download/view CTA band); `<Contact />` (id `contact`, "Let's build something impactful" headline + email/LinkedIn/GitHub/resume links).
- Consumed by: `App.jsx` (Task 18).

- [ ] **Step 1: Write the failing ResumeCTA test**

```jsx
// src/components/sections/ResumeCTA/ResumeCTA.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ResumeCTA from './ResumeCTA.jsx'

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

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL — `./ResumeCTA.jsx` doesn't exist.

- [ ] **Step 3: Implement `ResumeCTA.jsx`**

```jsx
import SectionReveal from '../../ui/SectionReveal.jsx'
import MagneticButton from '../../ui/MagneticButton.jsx'
import resumePdf from '../../../Assets/muhammad_asim_resume.pdf'

function ResumeCTA() {
  return (
    <SectionReveal as="section" className="px-6 py-24">
      <div id="resume" className="mx-auto max-w-2xl scroll-mt-24 text-center">
        <h2 className="text-2xl font-bold">Want the full picture?</h2>
        <p className="mt-3 text-muted">Download the resume for the complete role-by-role breakdown.</p>
        <div className="mt-8 flex justify-center gap-4">
          <MagneticButton href={resumePdf} variant="primary">
            Download Resume
          </MagneticButton>
          <MagneticButton href={resumePdf} variant="secondary">
            View Resume
          </MagneticButton>
        </div>
      </div>
    </SectionReveal>
  )
}

export default ResumeCTA
```

- [ ] **Step 4: Create `index.js` barrel**

```js
export { default } from './ResumeCTA.jsx'
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 6: Write the failing Contact test**

```jsx
// src/components/sections/Contact/Contact.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Contact from './Contact.jsx'

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

- [ ] **Step 7: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL — `./Contact.jsx` doesn't exist.

- [ ] **Step 8: Implement `Contact.jsx`**

```jsx
import { profile } from '../../../data/profile.js'
import SectionReveal from '../../ui/SectionReveal.jsx'
import MagneticButton from '../../ui/MagneticButton.jsx'
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
          <MagneticButton href={profile.linkedin} variant="secondary">
            LinkedIn
          </MagneticButton>
          <MagneticButton href={profile.github} variant="secondary">
            GitHub
          </MagneticButton>
          <MagneticButton href={resumePdf} variant="secondary">
            Resume
          </MagneticButton>
        </div>
      </div>
    </SectionReveal>
  )
}

export default Contact
```

- [ ] **Step 9: Create `index.js` barrel**

```js
export { default } from './Contact.jsx'
```

- [ ] **Step 10: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 11: Commit**

```bash
git add src/components/sections/ResumeCTA src/components/sections/Contact
git commit -m "Add ResumeCTA and Contact sections"
```

---

## Task 18: Wire App.jsx

**Files:**
- Modify: `src/App.jsx`, `src/App.test.jsx`

**Interfaces:**
- Consumes: `Navbar`, `Footer` (Task 9), `Hero` (Task 10), `Snapshot` (Task 11), `Skills` (Task 12), `Projects` (Task 13), `Experience` (Task 14), `AIExpertise` (Task 15), `GithubActivity` (Task 16), `ResumeCTA`, `Contact` (Task 17).
- Produces: the fully assembled single-page site.

- [ ] **Step 1: Update the failing/outdated smoke test**

```jsx
// src/App.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App.jsx'

describe('App', () => {
  it('renders every top-level section in order', () => {
    render(<App />)
    const ids = ['hero', 'snapshot', 'skills', 'projects', 'experience', 'ai', 'github-activity', 'resume', 'contact']
    const rendered = ids.map((id) => document.getElementById(id))
    rendered.forEach((el) => expect(el).toBeInTheDocument())
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL — `App.jsx` still renders only the placeholder.

- [ ] **Step 3: Rewrite `App.jsx`**

```jsx
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
    <>
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
    </>
  )
}

export default App
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test`
Expected: PASS (all suites — should be the full test count from Tasks 1-17)

- [ ] **Step 5: Manually verify in the browser**

Run: `npm run dev`
Open the printed local URL and confirm: the page scrolls through all 9 sections in order, nav links jump to the right anchors, hero CTAs work, project cards render images/abstract visuals correctly, and no console errors appear.

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx src/App.test.jsx
git commit -m "Wire all sections into App"
```

---

## Task 19: SEO metadata and manifest

**Files:**
- Modify: `index.html`, `public/manifest.json`, `public/robots.txt`

**Interfaces:**
- Produces: complete `<head>` metadata (title, description, Open Graph, Twitter card, theme-color), a manifest matching the new dark palette.

- [ ] **Step 1: Update `index.html` `<head>`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Muhammad Asim — Senior Software Engineer, AI-Native Full-Stack Development</title>
    <meta
      name="description"
      content="Senior software engineer with 6+ years shipping full-stack web, mobile, and cloud products, now focused on AI-native application development: LLM integrations, RAG, and agentic workflows."
    />
    <meta name="theme-color" content="#0d0f1a" />
    <link rel="manifest" href="/manifest.json" />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://devasim.vercel.app" />
    <meta property="og:title" content="Muhammad Asim — Senior Software Engineer, AI-Native Full-Stack Development" />
    <meta
      property="og:description"
      content="Senior software engineer with 6+ years shipping full-stack web, mobile, and cloud products, now focused on AI-native application development."
    />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="Muhammad Asim — Senior Software Engineer, AI-Native Full-Stack Development" />
    <meta
      name="twitter:description"
      content="Senior software engineer with 6+ years shipping full-stack web, mobile, and cloud products, now focused on AI-native application development."
    />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Update `public/manifest.json`**

Read the current file first, then set `background_color` and `theme_color` to `#0d0f1a`, and `short_name`/`name` to "Muhammad Asim | Portfolio" (keep existing icon entries as-is).

- [ ] **Step 3: Verify `public/robots.txt` allows crawling**

Confirm it contains `User-agent: *` / `Allow: /` (leave as-is if already permissive; this is a public portfolio, not a private app).

- [ ] **Step 4: Run the full test suite and build**

Run: `npm run test && npm run build`
Expected: all tests PASS, build succeeds.

- [ ] **Step 5: Commit**

```bash
git add index.html public/manifest.json public/robots.txt
git commit -m "Add SEO metadata and update manifest for new theme"
```

---

## Task 20: Responsive/accessibility audit and final cleanup

**Files:**
- Modify: any section/component files where issues are found (expected: minor className tweaks only, no new components)

**Interfaces:**
- No new interfaces — this task verifies the contract every prior task already established.

- [ ] **Step 1: Run the dev server and check breakpoints**

Run: `npm run dev`
Using the browser's responsive mode, check at 375px (mobile), 768px (tablet), and 1440px (desktop) widths:
- Navbar collapses to the hamburger menu below `md` and the mobile menu opens/closes correctly
- Hero stacks the text column above the visual on narrow widths (grid falls back to 1 column below `md`)
- Featured project alternating layout collapses to a single stacked column below `md`
- Timeline remains readable in a single left-aligned column at all widths
- Stat row wraps to 2x2 below `sm`

Fix any overflow or overlap issues found by adjusting Tailwind classes in the relevant section file (e.g., adding `flex-col md:flex-row`, adjusting gap/padding at breakpoints).

- [ ] **Step 2: Check keyboard navigation and focus states**

Tab through the whole page. Confirm every link/button has a visible focus outline (Tailwind's default `focus-visible` ring is sufficient — if any custom component suppressed it, add `focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-violet` to that element).

- [ ] **Step 3: Check color contrast**

Confirm `text-muted` (`#9497bd`) on `bg-base` (`#0d0f1a`) and `bg-surface` (`#15172a`) meets at least WCAG AA for body text (contrast ratio ≥ 4.5:1). If a spot check shows insufficient contrast on a specific surface, lighten that specific instance (do not change the shared token unless the check fails everywhere).

- [ ] **Step 4: Confirm `prefers-reduced-motion` behavior**

In browser dev tools, emulate `prefers-reduced-motion: reduce` and reload. Confirm: `AmbientGlow` is hidden (`motion-reduce:hidden` from Task 8), `HeroVisual`'s floating nodes are visibly calmer (`motion-reduce:opacity-80` from Task 10 — if node motion still feels excessive under reduced motion, wrap the `animate` prop in a check against `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and skip the animation entirely), and scroll behavior is instant, not smooth (already handled by the CSS media query in Task 2).

- [ ] **Step 5: Verify all images have alt text**

Grep for `<img` across `src/` and confirm every instance has a descriptive `alt` attribute (already done in Tasks 13 — `alt={\`${project.name} screenshot\`}`). Fix any that don't.

- [ ] **Step 6: Confirm the resume PDF is tracked and committed**

Run: `git status src/Assets/muhammad_asim_resume.pdf`
If it shows as modified/untracked, stage and commit it:

```bash
git add src/Assets/muhammad_asim_resume.pdf
git commit -m "Update resume PDF"
```

- [ ] **Step 7: Final full verification**

```bash
npm run test
npm run build
npm run preview
```

Expected: all tests pass, build succeeds, and `npm run preview` serves the production build correctly — spot-check the same breakpoints as Step 1 against the production build.

- [ ] **Step 8: Commit any fixes from this task**

```bash
git add -A
git commit -m "Responsive, accessibility, and final verification pass"
```
