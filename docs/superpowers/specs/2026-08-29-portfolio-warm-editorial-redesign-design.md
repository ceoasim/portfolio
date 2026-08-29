# Portfolio Redesign: Warm Technical Mono — Design Spec

Status: Approved by user 2026-08-29. Supersedes the visual system of the
2026-08-20 "Deep Space Mesh" redesign (`2026-08-20-portfolio-redesign-design.md`).
IA, components, and content sourcing from that spec are largely reused;
only the visual system, a few sections, and the tech stack (TypeScript) change.

## 1. Why this redesign

The Deep Space Mesh redesign (dark/glow, implemented and merged 2026-08-20)
is being replaced with a lighter, editorial, "confident agency" aesthetic,
inspired in spirit (not literally copied) by moritzdunkel.de, plus:

- A real profile photo, integrated tastefully (not a generic circular avatar).
- **StackLead** (`https://stacklead.net/`) promoted to flagship project —
  confirmed by the user to be the public/commercial name for the resume's
  "AnyWork Agent" project at SMS Holdings. Same project, public name.
- Full TypeScript migration.
- A dedicated "Trusted / Technology" marquee section (new IA element).

## 2. Source of truth

Resume file: `src/Assets/muhammad_asim_resume.pdf` (staged, current as of
2026-08-29). All facts below are pulled from it; nothing is invented.

- **Name**: Muhammad Asim
- **Title**: Senior Software Engineer · AI-Native Full-Stack Development
- **Location**: Lahore, Pakistan
- **Email**: asimm364@gmail.com
- **LinkedIn**: https://linkedin.com/in/ceoasim
- **GitHub**: https://github.com/ceoasim
- **Experience**: 6+ years — SMS Holdings (Feb 2025–Present), CodingCops
  (Feb 2022–Jan 2025), TectSoft (Oct 2020–Jan 2022)
- **Education**: BS Software Engineering, Lahore Garrison University, CGPA 3.4/4.0
- **Profile photo**: `pic.jpg` (provided by user this session, 1000×1000
  headshot) → moves to `src/Assets/profile.jpg`
- All experience bullets, skill groups, and AI capability content from the
  2026-08-20 spec remain accurate against this resume and are reused verbatim
  (see `src/data/experience.js`, `src/data/skills.js`, `src/data/aiExpertise.js`
  — no content changes there, only visual reskin).

**StackLead / AnyWork Agent merge** — resume's "SELECTED PROJECTS" entry:

> AnyWork Agent — React.js, Node.js, LLM APIs, Voice AI, Email Automation · SMS Holdings
> - Conversational AI agent that turns a natural-language prompt into a qualified lead list, then autonomously builds and launches an outreach campaign around it.
> - Built agentic tool-calling workflows spanning lead discovery, campaign generation, AI voice calling, and automated email sequencing — with human approval gates before any outbound action.

This becomes the **StackLead** project entry (see §6). `stacklead.net`'s own
page title ("AnyWork Agent - AI Chatbot for Personalized Conversations")
corroborates the identity match. No metrics beyond what the resume states
are invented.

**Additional source of truth — product screenshots**: the user shared four
screenshots of the live product (branded "Campaign AI" internally) showing:
an AI Chatbot module answering natural-language lead queries and kicking off
a trackable background job; a Campaign detail view with response stats
(Interested / Not Interested / No Response / Not Contacted / Meetings
Booked) and a recipients list with call/email history, CSV/PDF export; a
Jobs dashboard giving real-time visibility into the search → validation →
deduplication → campaign-creation pipeline; and an Analytics dashboard
tracking call connection rate, email success rate, meetings booked (via
Calendly), and response breakdown over time. This confirms and extends the
resume's bullets with concrete architecture detail (§6 uses this). The
specific numbers visible in the screenshots (e.g. "62% response rate") are
sample/demo data, not a verified business result, and are **not** used as
claimed metrics — only the underlying capabilities they demonstrate are
described.

The screenshot images themselves arrived as inline chat attachments, not
files — there is no file on disk yet. The implementation plan will need a
real image file (e.g. `src/Assets/Projects/stacklead.png`) supplied before
the visual can render; until then the story renders its placeholder block
(§6).

## 3. Visual system

**Palette** (light theme only — no dark mode toggle):

| Token | Hex | Use |
|---|---|---|
| `base` | `#f2ece0` | page background |
| `surface` | `#ece4d2` | card/section background (slightly deeper cream) |
| `border` | `#d9cdb6` | hairline rules, card borders |
| `ink` | `#262019` | primary text |
| `muted` | `#5c5344` | secondary/body-supporting text |
| `accent` | `#a8552b` | links, CTAs, numbered labels, tag hover — used sparingly |

**Typography**:

- **Display serif** — Fraunces (Google Fonts). Used only for: person's name
  in the hero, section headlines (`h2`), and project/case-study titles.
- **Monospace** — JetBrains Mono. Used for: eyebrows/labels, nav wordmark,
  tags, tech-marquee tokens, numbered case-study labels (`01`, `02`...), CTA
  button labels in the case-study context.
- **Sans body** — Inter. Used for: all paragraph copy, list items, nav
  links, card descriptions. (The hero mockup used serif for body copy;
  overruled here in favor of recruiter-scannability at case-study length —
  serif stays display-only.)

**Motion** (all gated by `prefers-reduced-motion` via the existing
`MotionConfig reducedMotion="user"` pattern, plus explicit `useReducedMotion()`
checks for anything Framer Motion's `positionalKeys` doesn't cover — same
discipline as the prior redesign):

- Reused as-is (restyled to new tokens): `SectionReveal`, `MagneticButton`,
  `StatCounter`, `Timeline`, `TechBadge`.
- **Retired**: `AmbientGlow` (mouse-reactive radial glow) and the
  tilt/glow interaction in `SpotlightCard` — both were built for the dark
  glow aesthetic and clash with a paper-clean editorial look. Hover states
  on cards/projects become restrained: a subtle translateY lift + border
  color shift to `accent`, no tilt/glow.
- **New**: `TechMarquee` — a slow, continuous horizontal auto-scroll of
  monospace tech tokens (duplicated list for seamless loop). Pauses
  entirely under `prefers-reduced-motion: reduce` (render as a static
  wrapped row instead).

**Navigation**: keep the existing `Navbar` component structure (sticky,
tested, works) — reskin only: cream/graphite/rust tokens, small serif
wordmark ("MA" or "Muhammad Asim" in Fraunces) instead of the prior mark.

## 4. Information architecture

1. Navbar (persistent)
2. **Hero** — eyebrow (title) → large serif name → sans value-prop paragraph
   → primary CTA "View Projects" + secondary CTA "View Resume" → photo,
   duotone/sepia-treated, rectangular (not circular) crop, integrated into
   the layout per the approved mockup (photo occupies a dedicated column,
   not a floating avatar).
3. **Tech Marquee** (new) — auto-scrolling strip: React, Next.js,
   TypeScript, Node.js, Python, PostgreSQL, MongoDB, AWS, Docker,
   Kubernetes, OpenAI / LLM APIs, RAG, Vector Search, AI Agents. All
   resume-verified.
4. **Snapshot/About** — existing component, reskinned only. Short narrative
   + stat counters, unchanged copy.
5. **Featured Projects**:
   - **StackLead** (flagship, full-bleed numbered case study — Option 2
     layout) — Problem → Approach & Features → Architecture → Impact.
   - **MindMiner** (second full case study, same layout).
   - Remaining projects (Smart System, IVY, Smeisty, Door Visualizer,
     ShiftERP) as lighter reskinned cards below, existing `ProjectCard`
     component restyled, no structural change.
6. **AI Engineering** — existing `AIExpertise` component, reskinned only.
7. **Technical Skills** — existing `Skills` component, reskinned only.
8. **Experience Timeline** — existing `Experience`/`Timeline` components,
   reskinned only.
9. **GitHub Activity** — existing component, kept, low visual emphasis,
   reskinned.
10. **Resume CTA** — existing component, reskinned.
11. **Contact** — existing component, reskinned, final strong CTA.
12. Footer — reskinned.

## 5. Project data model change

`Project` type gains one field (`impact`) and replaces the old `featured`
boolean with `storyLayout`, since both existed only to pick between the two
render treatments — one flag is enough:

```ts
export interface Project {
  id: string
  name: string
  company: string | null
  tags: string[]
  problem: string | null
  description: string          // short card copy OR "Approach & Features" body for story view
  architectureHighlight: string | null
  impact: string | null        // NEW — required for story-treated projects, null otherwise
  storyLayout: boolean          // replaces `featured` — true for StackLead & MindMiner (full-bleed numbered), false for card view
  image: string | null
  demoUrl: string | null
  demoLabel: string | null
}
```

## 6. StackLead project content (new entry, replaces `anywork-agent`)

```ts
{
  id: 'stacklead',
  name: 'StackLead',
  company: 'SMS Holdings',
  tags: ['React.js', 'Node.js', 'LLM APIs', 'Voice AI', 'Email Automation', 'Agentic Workflows'],
  problem: 'Sales teams drown in unqualified leads and manual, multi-tool prospecting — there was no single system to find, validate, contact, and track leads through to a booked meeting.',
  description: 'A conversational AI chatbot lets reps query and analyze lead data in plain language, kicking off a trackable background job that searches and enriches results in real time. Underneath, an agentic pipeline handles lead discovery, deduplication, and campaign creation, then places AI voice calls to understand a lead\'s interests and sequences automated email outreach — with Calendly-based meeting booking and CSV/PDF export throughout.',
  architectureHighlight: 'A modular full-stack platform (AI Chatbot, Campaigns, Contacts, Jobs, Analytics) built around an asynchronous job pipeline — search, validation, deduplication, and campaign-creation stages tracked in real time on a live Jobs dashboard — with LLM-backed natural-language querying, AI voice calling, and automated email sequencing orchestrated through tool-calling workflows.',
  impact: 'Gives sales teams a single system to go from a plain-language ask to a qualified, contacted, and tracked lead — with call-connection rate, email success rate, and meetings booked all measured automatically on a built-in analytics dashboard instead of assembled by hand across disconnected tools.',
  featured: true,
  storyLayout: true,
  image: null,   // placeholder until user supplies an actual screenshot file (see note above — arrived as chat attachments only)
  demoUrl: 'https://stacklead.net/',
  demoLabel: 'Live Product',
}
```

`MindMiner` gains `storyLayout: true` and an `impact` line (descriptive,
no invented metrics): *"Collapses invention documentation from concept to
structured, patent-ready drafts — with an automated video explainer
generated for every submission."* Its existing `problem`/`description`/
`architectureHighlight` are reused as the first three story beats.

All other projects: `storyLayout: false`, `impact: null` (unused by the
card view).

**Open item**: StackLead has no screenshot/logo yet. The story layout
renders a designed placeholder visual block (bordered, dashed, "screenshot
coming soon" treatment consistent with the site's aesthetic — not a broken
image) until the user supplies the asset; swapping it in later is a
one-line change to `image`.

## 7. TypeScript migration

- Convert every `.jsx`→`.tsx`, `.js`→`.ts` (components, data files, tests,
  `main.jsx`→`main.tsx`, `vite.config.js`→`.ts`, `src/test/setup.js`→`.ts`).
- Add `tsconfig.json` + `tsconfig.node.json`; install `typescript`,
  `@types/react`, `@types/react-dom`.
- Define typed interfaces for `Profile`, `Project` (§5), `ExperienceEntry`,
  `SkillGroup`, `AICapability`.
- This runs as its own early implementation phase, verified green (build +
  full test suite) before the visual/content redesign work layers on top —
  mechanical, high file-count, low judgment risk if done first and in
  isolation.
- No behavior change from the migration itself; it's a type-safety and
  resume-accuracy pass (TypeScript is listed as one of the person's core
  skills — the codebase should reflect it).

## 8. Non-goals

- No dark mode / theme toggle.
- No content invented beyond what's in the resume (StackLead's four beats
  are paraphrased directly from the resume's AnyWork Agent bullets).
- No new external asset dependencies (fonts via Google Fonts `<link>` only,
  consistent with current approach).
- No routing changes — stays single-page anchor-scroll.
- No changes to `GithubActivity`, `AIExpertise`, `Skills`, `Experience`
  *content* — visual reskin only.

## 9. Carried over from the prior spec (unchanged)

Performance/SEO/accessibility/responsive requirements, resume
download/view-only CTA behavior, exact contact links, and the general
"clean modular component" file structure from
`2026-08-20-portfolio-redesign-design.md` all still apply and are not
re-litigated here.
