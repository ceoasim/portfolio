# Portfolio Redesign & Modernization — Design Spec

Date: 2026-08-20
Status: Approved for planning

## 1. Goal

Replace the current template-derived portfolio (Bootstrap + react-tsparticles, multi-page router, generic AI-buzzword copy) with a single-page, recruiter-focused portfolio that positions Muhammad Asim as a **Senior Full-Stack / AI Product Engineer**, using his resume as the source of truth for all facts, roles, dates, and links.

## 2. Source-of-Truth Facts (from resume PDF)

- Name: Muhammad Asim
- Title: Senior Software Engineer · AI-Native Full-Stack Development
- Location: Lahore, Pakistan
- Email: `asimm364@gmail.com`
- LinkedIn: `https://linkedin.com/in/ceoasim`
- GitHub: `https://github.com/ceoasim`
- Experience: 6+ years
- Current role: Senior Software Engineer, SMS Holdings (Feb 2025–Present)
- Prior roles: CodingCops (Feb 2022–Jan 2025), TectSoft (Oct 2020–Jan 2022)
- Education: BS Software Engineering, Lahore Garrison University (CGPA 3.4/4.0)

These override anything currently in the codebase that conflicts (e.g., bio text claiming current employment at CodingCops; LinkedIn/GitHub links that don't match the resume's embedded links; the GitHub calendar's stale `ansnisar` username).

Twitter/Instagram links currently in the footer/about section are **dropped** — not present anywhere in the resume, and not needed for a recruiter-focused site.

## 3. Tech Stack

| Area | Decision |
|---|---|
| Build tool | Vite (replaces CRA/`react-scripts`) |
| Framework | React 18, plain JS (no TypeScript migration — out of scope for this redesign) |
| Styling | Tailwind CSS (replaces Bootstrap + react-bootstrap) |
| Animation | Framer Motion (replaces react-tsparticles + react-parallax-tilt) |
| Routing | None — single-page scroll site. `react-router-dom` and `ScrollToTop.js` are removed. |
| Resume | Download/View buttons only. `react-pdf`, `pdfjs`, and the CDN worker script are removed. |
| Kept as-is | `react-icons`, `react-github-calendar`, `typewriter-effect` (restyled, content updated) |
| Removed (dead/unused) | `axios`, `@react-pdf/renderer`, `bootstrap`, `react-bootstrap`, `react-tsparticles`, `react-parallax-tilt`, `react-pdf` |
| Entry point | `src/index.js` → `src/main.jsx`, migrated from `ReactDOM.render` to `createRoot` |

Rationale: this is a static, single-owner portfolio, not a content site needing SSR/CMS — Next.js would be a disproportionate rewrite (routing model, server/client boundaries) for what static `<head>` tags and a single Vite SPA already satisfy. Vite is a like-for-like swap for CRA (same SPA mental model) that unlocks Tailwind + Framer Motion, which CRA + Bootstrap actively fight against.

## 4. Visual Direction — "Deep Space Mesh" (user-approved)

- Background base: `#0d0f1a`; elevated/card surfaces `#15172a`; borders `#262a48`
- Text: primary `#eceef5`, muted `#9497bd`
- Accent: violet `#8b7bff` → cyan `#25c9d0` gradient, used sparingly (icons, key CTAs, 1-2 hero words, active states)
- Subtle animated gradient-mesh glow + faint grid pattern in the hero background — no glassmorphism, no stock imagery
- Typography: sans-serif (Inter/Geist Sans stack) for all body/headings; a monospace face (ui-monospace/JetBrains Mono fallback) reserved for small technical accents only (eyebrow labels, tags, dates) — never for body copy
- Type scale: hero display `clamp(2.5rem, 5vw, 4rem)`, section headings `~2rem`, body `1rem`, labels `0.75-0.85rem`
- Max content width ~1200px; generous vertical section padding (96-140px desktop, 56-72px mobile)

## 5. Motion (Framer Motion) — user-approved patterns

- Scroll-triggered fade/slide-up reveals, staggered per section and per card
- Magnetic CTA buttons (transform toward cursor + soft glow on hover)
- Spotlight + subtle tilt on featured project cards (cursor-follow radial highlight)
- Animated stat counters (count up once when scrolled into view)
- Ambient cursor-follow glow in the hero background (subtle, blurred, low-opacity)
- Gradient-sweep animation limited to 1-2 words in the hero headline ("AI-Native") — not a running pattern elsewhere
- Animated experience timeline (line + node draw-in on scroll)
- Explicitly skipped: infinite marquee tech-strip (reads templated)
- All motion respects `prefers-reduced-motion` — continuous/cursor-driven effects degrade to simple opacity fades or are disabled

## 6. Information Architecture (single page, anchor nav)

1. Hero
2. Professional Snapshot
3. Core Expertise / Tech Stack
4. Featured Projects
5. Professional Experience (timeline)
6. AI Engineering Expertise
7. GitHub Activity
8. Resume CTA
9. Contact
10. Footer

The original brief's "Architecture / Technical Capabilities" section is folded into AI Engineering Expertise + Core Expertise rather than kept separate — the microservices/CI-CD/observability content already lives in Experience bullets and the Cloud & DevOps skill group; a dedicated section would just repeat it.

## 7. Section Content

### 7.1 Hero

- Eyebrow: "Lahore, Pakistan"
- Name: "Muhammad Asim"
- Headline: "Senior Software Engineer — **AI-Native** Full-Stack Development" (gradient-sweep on "AI-Native" only)
- Typewriter rotating line (replaces "Freelancer / MERN Stack Developer / Open Source Contributor"): "AI-Native Product Engineer", "Full-Stack Systems Builder", "Cloud-Native Architect", "Agentic Workflow Designer" — each phrase is a direct paraphrase of a resume competency group, not an invented title
- Value prop (tightened from resume summary): "I build production systems on top of frontier models — LLM integrations, RAG pipelines, and agentic tool-calling workflows — backed by 6+ years shipping full-stack web, mobile, and cloud products. I use agentic coding tools daily while keeping architectural judgment and review discipline human-owned."
- CTAs: primary "View My Work" (scrolls to Projects), secondary "Download Resume" (opens PDF)
- Social row: GitHub, LinkedIn, Email icons
- Visual element: the existing flat-illustration assets (`home-main.svg`, `avatar.svg`) are replaced with an abstract CSS/SVG-generated visual (node-graph or geometric composition) consistent with the Deep Space Mesh direction — reads as "engineered," not stock clipart. No new image asset required.

### 7.2 Professional Snapshot

Animated stat counters, all verifiable from the resume:
- 6+ Years Experience
- 3 Companies
- 7 Projects Shipped
- 5+ AI Model Providers Integrated (Claude, GPT-4/4o, Gemini, DeepSeek, Llama)

Short supporting paragraph (distinct from the hero value prop — a different cut of the same resume summary, emphasizing breadth of ownership rather than the AI angle already covered in the hero): "Comfortable owning the full path from microservice architecture to CI/CD, observability, and latency/cost tuning of model-backed services — across web, mobile, and cloud."

### 7.3 Core Expertise / Tech Stack (grouped, hover-interactive badges — not a logo wall)

- **Frontend:** React.js, Next.js, TypeScript, JavaScript, Redux, GraphQL, Angular, Vue
- **Backend & Mobile:** Node.js, Express, NestJS, React Native, Java, Spring Boot, Ruby on Rails, Python, C++, SQL
- **AI & LLM:** Anthropic Claude, OpenAI (GPT-4/4o), Google Gemini, DeepSeek, Llama, RAG, vector search & embeddings, agentic workflows, MCP, LangChain, LangGraph, Vercel AI SDK
- **Cloud & DevOps:** AWS (ECS, ECR, Fargate, EC2, CloudWatch), Docker, Kubernetes, Terraform, GitHub Actions, GitLab CI
- **Databases:** PostgreSQL, MySQL, MongoDB, Redis, Neo4j, Firebase, Pinecone/pgvector
- **Distributed Systems:** Microservices, Apache Kafka, RabbitMQ, Pub/Sub, event-driven architecture

Web3/Ethereum skills are surfaced as project-level tags (MindMiner, Smeisty) rather than a 7th top-level group.

### 7.4 Featured Projects (7 total)

**Featured / large alternating layout:**

1. **AnyWork Agent** — SMS Holdings · React.js, Node.js, LLM APIs, Voice AI, Email Automation
   - Problem: Turning a natural-language prompt into a qualified lead list and outreach campaign without manual prospecting.
   - What it does: Conversational AI agent that discovers leads, generates a campaign, places AI voice calls, and sequences automated emails.
   - Architecture highlight: Agentic tool-calling workflow spanning lead discovery → campaign generation → voice calling → email sequencing, with human approval gates before any outbound action.
   - Visual: no screenshot exists (internal/client product) — use an abstract tech visual instead: a Deep-Space-Mesh-styled card showing the project's tech badges (React.js, Node.js, LLM APIs, Voice AI) arranged over a subtle gradient-mesh background, matching the hero's abstract visual language rather than a fabricated UI mockup

2. **MindMiner** — CodingCops · React.js, Node.js, AWS ECR/ECS/Fargate, Ethereum, LLM & Video Gen APIs
   - Problem: Turning a described problem into candidate invention solutions and structured patent documentation.
   - What it does: AI-assisted invention platform generating candidate solutions and drafting structured patent documentation via LLM pipelines; automated multimedia explainer videos per invention via AI video generation.
   - Architecture highlight: Web3 layer — wallet balances, on-chain burns, ERC-20/NFT transfers, crowdfunding contracts, token minting, with multi-step authenticated transactions and blockchain event verification.
   - Visual: existing `miner.png`. Demo: `https://dev.mindminer.ai/`

**Standard cards:**

3. **Smart System** — SMS Holdings · React Native, React.js, Node.js, GitLab, AWS
   - Mobile and web platform for on-demand household services, with an integrated admin panel for customer/partner monitoring and in-app commissioning support.
   - Visual: no screenshot exists — same abstract tech-visual treatment as AnyWork Agent, with this project's tags (React Native, React.js, Node.js, AWS)

4. **IVY** — CodingCops · Ruby on Rails, React.js, Hanami, Heroku, Datadog, Redis
   - Hospitality platform covering guest booking, task orchestration, SMS notifications, and an activity management system that improved staff task completion.
   - Visual: existing `ivy.png`. Reference link: `revinate.com/solutions/revinate-ivy`

5. **Smeisty** — TectSoft · React.js, Node.js, Ethereum, MetaMask, OpenSea
   - NFT management platform handling contract addresses and wallet transactions, optimized for speed and cross-device responsiveness.
   - Visual: existing `nft.png`. Demo: `smeisty.app`

6. **Door Visualizer** (no company/resume attribution — kept from existing site as-is)
   - Augmented reality app for smartphones; lets people see new doors placed directly in their interior through the camera.
   - Visual: existing `door.png`. Demo: `door-visualizer.com`

7. **ShiftERP** (no company/resume attribution — kept from existing site as-is)
   - Fully integrated end-to-end ERP solution for co-packers and supply chain teams.
   - Visual: existing `shift.png`. Demo: `shifterp.com`

**Dropped:** the self-referential "My Portfolio" project card (the site listing itself as a project) — redundant with the persistent GitHub/nav links in the new design, and wasn't part of either the resume's 5 projects or the confirmed "keep" list of 7. Its image (`portfolio.png`) and the unused `leaf.png` (an orphaned, unattributed plant-disease/CV screenshot with no matching project anywhere) are deleted during cleanup.

### 7.5 Professional Experience (animated timeline)

**Senior Software Engineer — SMS Holdings** · Feb 2025–Present
- Led AI feature integration across core products — LLM-backed assistants, automated content generation, intelligent search — via API-based model integrations with fallback, retry, and cost-control layers.
- Designed prompt/context strategies with structured outputs and schema validation, eliminating downstream parsing failures in production.
- Adopted agentic coding tools (Claude Code, Cursor) into team workflow for scaffolding, legacy migration, and test-coverage expansion, with human review gates on every AI-generated change.
- Hardened security posture (auth rebuild, RBAC) and strengthened CI/CD and observability, improving uptime and mean-time-to-detect.
Tags: LLM Integration, Prompt Engineering, CI/CD, Security, Mentorship

**Senior Software Engineer — CodingCops** · Feb 2022–Jan 2025
- Owned architecture, development, and deployment of multi-tenant B2B hospitality platforms.
- Migrated a monolith to microservices, delivering a 35% performance improvement and independent service scalability.
- Built AI-assisted features on GPT and Gemini APIs (conversational interfaces, automated content, intelligent search) through clean service boundaries.
- Automated CI/CD with JUnit coverage, cutting release time to near-zero manual effort; authored TDD guidelines adopted org-wide.
Tags: Microservices, GPT/Gemini, CI/CD, Ruby on Rails, React

**Software Engineer — TectSoft** · Oct 2020–Jan 2022
- Redesigned portal matching workflows, driving a 20% sales increase for a retail client.
- Delivered mobile applications for Namibian government clients — full ownership of design, architecture, and store publication.
- Led OCR R&D with React Native + Tesseract, improving identity-document extraction accuracy.
- Built a citizen police-verification platform from scratch (document verification, attestation, gesture-based security).
Tags: React Native, OCR, Mobile, GitLab CI

**Education** (end of timeline): BS Software Engineering — Lahore Garrison University (CGPA 3.4/4.0)

### 7.6 AI Engineering Expertise

Dedicated section, framed as "I build products on top of frontier models, not just around an API call":
- LLM API integration: Claude, GPT-4/4o, Gemini, DeepSeek, Llama
- RAG & vector search: Pinecone, pgvector
- Agentic & tool-calling workflows, MCP (Model Context Protocol)
- Prompt & context engineering, structured outputs, streaming
- Voice AI & conversational agents, AI video generation
- Guardrails & fallbacks, token/cost optimization
- Daily AI coding tools: Claude Code, Cursor, GitHub Copilot, Windsurf, Codex, v0 — agentic pair-programming, spec-driven development, AI-assisted refactoring and code review

Positioned as "strong full-stack engineer + AI-enabled product engineering," not an AI-only portfolio — this section sits after Projects/Experience, not before.

### 7.7 GitHub Activity

Contribution calendar restyled to the dark theme, username corrected to `ceoasim` (currently `ansnisar`).

### 7.8 Resume CTA

Second prominent "Download Resume" / "View Resume" CTA band (first one is in the hero), no embedded PDF viewer.

### 7.9 Contact

Headline: "Let's build something impactful."
Email (`asimm364@gmail.com`), LinkedIn, GitHub, resume download — location noted (Lahore, Pakistan). No invented claims about remote availability/relocation since the resume doesn't state a preference.

### 7.10 Footer

"Designed & developed by Muhammad Asim", copyright year, GitHub/LinkedIn icons only (Twitter/Instagram dropped).

## 8. Component/File Structure

```
src/
  components/
    layout/          Navbar, Footer
    sections/        Hero, Snapshot, Skills, Projects, Experience, AIExpertise, GithubActivity, ResumeCTA, Contact
    ui/               MagneticButton, SpotlightCard, StatCounter, TechBadge, SectionReveal, AmbientGlow, Timeline
  data/               content.js, experience.js, projects.js, skills.js — single source of truth for on-page copy
  App.jsx
  main.jsx            (replaces index.js; createRoot instead of ReactDOM.render)
```

Centralizing resume-sourced copy into `src/data/*` keeps content easy to update later without touching component logic.

## 9. Responsive Behavior

Tailwind default breakpoints (mobile <640px, tablet 640-1024px, desktop >1024px):
- Nav collapses to a mobile menu (hamburger → slide-in panel)
- Hero stacks vertically, visual element scales down or moves below text
- Featured project alternating layout collapses to a single stacked column
- Timeline collapses to a single-column, left-aligned line
- Tech badge groups reflow to fewer columns; stat row wraps to 2x2 on small screens

## 10. Performance & SEO

- Canvas particle background removed entirely (perf win); replaced with a lightweight CSS/SVG mesh + gradient glow
- Below-the-fold project imagery lazy-loaded
- `public/index.html` updated: title "Muhammad Asim — Senior Software Engineer, AI-Native Full-Stack Development", meta description, Open Graph tags (title/description/url; image if a suitable one exists), Twitter card, `theme-color` matched to the new dark palette
- Semantic HTML (`nav`/`main`/`section`, correct heading hierarchy), alt text on all images, visible focus states, contrast-checked against the dark palette
- `manifest.json` updated to match new branding colors

## 11. Explicit Non-Goals

- No TypeScript migration
- No CMS/blog/dynamic backend
- No fabricated metrics, companies, certifications, or claims beyond what the resume or existing verified project descriptions already state
- No SSR/Next.js migration
