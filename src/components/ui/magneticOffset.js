export function computeMagneticOffset(rect, clientX, clientY, strength = 0.25) {
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  return {
    x: (clientX - centerX) * strength,
    y: (clientY - centerY) * strength,
  }
}
