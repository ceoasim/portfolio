import '@testing-library/jest-dom'

// jsdom has no IntersectionObserver; Framer Motion's useInView needs a stub.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = IntersectionObserverStub
