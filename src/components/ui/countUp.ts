export function getCountUpValue(elapsedMs: number, durationMs: number, target: number) {
  const progress = Math.min(Math.max(elapsedMs / durationMs, 0), 1)
  return Math.round(progress * target)
}
