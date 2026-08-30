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
