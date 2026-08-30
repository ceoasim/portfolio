import SectionReveal from '../../ui/SectionReveal.js'
import MagneticButton from '../../ui/MagneticButton.js'
import resumePdf from '../../../Assets/muhammad_asim_resume.pdf'

function ResumeCTA() {
  return (
    <SectionReveal as="section" className="px-6 py-24">
      <div id="resume" className="mx-auto max-w-2xl scroll-mt-24 text-center">
        <h2 className="font-serif text-3xl font-normal text-ink">Want the full picture?</h2>
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
