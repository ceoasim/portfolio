export function getCountUpValue(elapsedMs, durationMs, target) {
  const progress = Math.min(Math.max(elapsedMs / durationMs, 0), 1)
  return Math.round(progress * target)
}
