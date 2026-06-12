import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Clock, Monitor } from 'lucide-react'
import { MatchBadge } from './MatchBadge'
import { cn } from '@/utils/cn'
import { formatRating } from '@/utils/format'
import type { Game, Genre } from '@/types'

interface GameCardProps {
  game: Game
  className?: string
  compact?: boolean
}

const GENRE_GRADIENTS: Record<Genre, string> = {
  FPS:       'linear-gradient(135deg, #3a0a0a 0%, #1a0505 100%)',
  RPG:       'linear-gradient(135deg, #1a1040 0%, #0d0820 100%)',
  MOBA:      'linear-gradient(135deg, #2a1800 0%, #150c00 100%)',
  Racing:    'linear-gradient(135deg, #001a2a 0%, #000d15 100%)',
  Adventure: 'linear-gradient(135deg, #001a0d 0%, #000d06 100%)',
  Survival:  'linear-gradient(135deg, #2a001a 0%, #15000d 100%)',
  Strategy:  'linear-gradient(135deg, #1a0035 0%, #0d001a 100%)',
}

export function GameCard({ game, className, compact = false }: GameCardProps) {
  const fallback = GENRE_GRADIENTS[game.genre] ?? 'linear-gradient(135deg, #151B2E 0%, #1e2640 100%)'

  return (
    <Link to={`/game/${game.id}`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'group relative rounded-2xl bg-[#151B2E] border border-white/[0.06] overflow-hidden cursor-pointer',
          'hover:border-[#6C63FF]/30 hover:shadow-lg hover:shadow-[#6C63FF]/10 transition-all',
          className
        )}
      >
        {/* Cover image */}
        <div className={cn('relative overflow-hidden', compact ? 'h-36' : 'h-48')}>
          {game.image ? (
            <img
              src={game.image}
              alt={game.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.parentElement!.style.background = fallback
              }}
            />
          ) : (
            <div className="w-full h-full" style={{ background: fallback }} />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#151B2E] via-transparent to-transparent" />

          <div className="absolute top-3 right-3">
            <MatchBadge percentage={game.matchPercentage} size="sm" />
          </div>

          <div className="absolute bottom-3 left-3">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#6C63FF]/30 text-[#6C63FF] border border-[#6C63FF]/20">
              {game.genre}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-2">
          <h3 className="font-semibold text-white text-sm leading-tight line-clamp-1 group-hover:text-[#6C63FF] transition-colors">
            {game.title}
          </h3>
          <div className="flex items-center gap-3 text-[#9CA3AF] text-xs">
            <span className="flex items-center gap-1">
              <Star size={11} className="text-yellow-400 fill-yellow-400" />
              {formatRating(game.rating)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {game.playTime}
            </span>
            <span className="flex items-center gap-1">
              <Monitor size={11} />
              {game.platform[0]}{game.platform.length > 1 && ` +${game.platform.length - 1}`}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
