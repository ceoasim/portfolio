import { MotionConfig } from 'framer-motion'
import Navbar from './components/layout/Navbar.js'
import Footer from './components/layout/Footer.js'
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
