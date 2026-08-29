import '@testing-library/jest-dom'

class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// jsdom has no IntersectionObserver; Framer Motion's useInView needs a stub.
;(window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = IntersectionObserverStub
