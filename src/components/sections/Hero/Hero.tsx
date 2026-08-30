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
            fetchPriority="high"
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
