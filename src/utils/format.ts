export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function getMatchColor(pct: number): string {
  if (pct >= 90) return '#22C55E'
  if (pct >= 75) return '#00D4FF'
  if (pct >= 60) return '#6C63FF'
  return '#9CA3AF'
}

export function getMatchLabel(pct: number): string {
  if (pct >= 90) return 'Perfect Match'
  if (pct >= 75) return 'Great Match'
  if (pct >= 60) return 'Good Match'
  return 'Partial Match'
}
