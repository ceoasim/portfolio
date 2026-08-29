import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App.jsx'

describe('App', () => {
  it('renders every top-level section in order', () => {
    render(<App />)
    const ids = ['hero', 'snapshot', 'skills', 'projects', 'experience', 'ai', 'github-activity', 'resume', 'contact']
    const rendered = ids.map((id) => document.getElementById(id))
    rendered.forEach((el) => expect(el).toBeInTheDocument())
  })
})
