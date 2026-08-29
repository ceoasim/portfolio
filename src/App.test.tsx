import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App.jsx'

describe('App', () => {
  it('renders every top-level section in order', () => {
    render(<App />)
    const ids = ['hero', 'snapshot', 'skills', 'projects', 'experience', 'ai', 'github-activity', 'resume', 'contact']
    const rendered = ids.map((id) => document.getElementById(id))
    rendered.forEach((el) => expect(el).toBeInTheDocument())

    for (let i = 0; i < rendered.length - 1; i += 1) {
      const current = rendered[i] as Element
      const next = rendered[i + 1] as Element
      const position = current.compareDocumentPosition(next)
      expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    }
  })
})
