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
    <header className="fixed top-0 z-50 w-full border-b border-border bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="font-serif text-lg font-semibold text-ink">
          Muhammad Asim
        </a>
        <ul className="hidden gap-6 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-mono text-xs uppercase tracking-wide text-muted transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-nav-menu"
          onClick={() => setOpen((o) => !o)}
          className="font-mono text-xs uppercase tracking-wide text-ink md:hidden"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>
      {open && (
        <ul
          id="mobile-nav-menu"
          data-testid="mobile-menu"
          className="flex flex-col gap-4 border-t border-border px-6 py-4 md:hidden"
        >
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block font-mono text-xs uppercase tracking-wide text-muted hover:text-accent"
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
