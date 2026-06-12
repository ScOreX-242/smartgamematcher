import { cn } from '@/utils/cn'
import { getMatchColor, getMatchLabel } from '@/utils/format'

interface MatchBadgeProps {
  percentage: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const sizes = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1.5 font-semibold',
}

export function MatchBadge({ percentage, size = 'md', showLabel = false, className }: MatchBadgeProps) {
  const color = getMatchColor(percentage)
  const label = getMatchLabel(percentage)

  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-full font-medium border', sizes[size], className)}
      style={{ color, borderColor: color + '44', backgroundColor: color + '18' }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
      {percentage}% {showLabel && label}
    </span>
  )
}
