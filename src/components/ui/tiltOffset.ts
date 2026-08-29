interface Rect {
  left: number
  top: number
  width: number
  height: number
}

export function computeTilt(rect: Rect, clientX: number, clientY: number, maxDeg = 8) {
  const px = (clientX - rect.left) / rect.width
  const py = (clientY - rect.top) / rect.height
  const rotateY = (px - 0.5) * 2 * maxDeg
  const rotateX = (0.5 - py) * 2 * maxDeg
  return {
    rotateX: Math.max(-maxDeg, Math.min(maxDeg, rotateX)),
    rotateY: Math.max(-maxDeg, Math.min(maxDeg, rotateY)),
  }
}
