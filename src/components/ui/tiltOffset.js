export function computeTilt(rect, clientX, clientY, maxDeg = 8) {
  const px = (clientX - rect.left) / rect.width // 0..1
  const py = (clientY - rect.top) / rect.height // 0..1
  const rotateY = (px - 0.5) * 2 * maxDeg
  const rotateX = (0.5 - py) * 2 * maxDeg
  return {
    rotateX: Math.max(-maxDeg, Math.min(maxDeg, rotateX)),
    rotateY: Math.max(-maxDeg, Math.min(maxDeg, rotateY)),
  }
}
