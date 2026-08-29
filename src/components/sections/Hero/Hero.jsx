import Typewriter from 'typewriter-effect'
import { AiFillGithub } from 'react-icons/ai'
import { FaLinkedinIn } from 'react-icons/fa'
import { MdOutlineEmail } from 'react-icons/md'
import { profile } from '../../../data/profile.js'
import MagneticButton from '../../ui/MagneticButton.js'
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
