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
