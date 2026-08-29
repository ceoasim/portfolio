import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App.jsx'

describe('App', () => {
  it('renders the placeholder main content', () => {
    render(<App />)
    expect(screen.getByText(/Portfolio rebuild in progress/i)).toBeInTheDocument()
  })
})
