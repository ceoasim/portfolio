import { profile } from '../../../data/profile.js'
import SectionReveal from '../../ui/SectionReveal.js'
import MagneticButton from '../../ui/MagneticButton.js'
import resumePdf from '../../../Assets/muhammad_asim_resume.pdf'

function Contact() {
  return (
    <SectionReveal as="section" className="px-6 py-24">
      <div id="contact" className="mx-auto max-w-2xl scroll-mt-24 text-center">
        <h2 className="font-serif text-4xl font-normal text-ink">Let's build something impactful.</h2>
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
