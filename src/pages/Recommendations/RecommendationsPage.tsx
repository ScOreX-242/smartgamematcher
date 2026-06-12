import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import {
  ThumbsUp, ThumbsDown, Bookmark, Info,
  Star, Clock, Monitor, Filter, RefreshCw,
  ChevronDown,
} from 'lucide-react'
import { usePreferenceStore } from '@/store/preferenceStore'
import { useRecommendationStore } from '@/store/recommendationStore'
import { apiGetRecommendations } from '@/services/mockApi'
import { MatchBadge } from '@/components/ui/MatchBadge'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import { formatRating } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { Game, Genre, Platform } from '@/types'

// ─── Swipe card ───────────────────────────────────────────────────────────────

const FALLBACK_GRADIENT = 'linear-gradient(135deg, #151B2E 0%, #1e2640 100%)'
const SWIPE_THRESHOLD = 80

function SwipeCard({
  game,
  onLike,
  onDislike,
  isTop,
  stackIndex,
}: {
  game: Game
  onLike: () => void
  onDislike: () => void
  isTop: boolean
  stackIndex: number
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-220, 220], [-18, 18])
  const likeOpacity = useTransform(x, [30, 100], [0, 1])
  const dislikeOpacity = useTransform(x, [-100, -30], [1, 0])

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (info.offset.x > SWIPE_THRESHOLD) onLike()
    else if (info.offset.x < -SWIPE_THRESHOLD) onDislike()
  }

  if (!isTop) {
    return (
      <motion.div
        className="absolute inset-0 rounded-3xl bg-[#151B2E] border border-white/[0.06]"
        style={{
          scale: 1 - stackIndex * 0.04,
          y: stackIndex * 10,
          zIndex: 10 - stackIndex,
        }}
      />
    )
  }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate, zIndex: 20 }}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 cursor-grab active:cursor-grabbing rounded-3xl overflow-hidden border border-white/[0.08] select-none"
      whileDrag={{ scale: 1.02 }}
    >
      {/* Image */}
      <div className="relative h-full">
        {game.image ? (
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover"
            draggable={false}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.parentElement!.style.background = FALLBACK_GRADIENT
            }}
          />
        ) : (
          <div className="w-full h-full" style={{ background: FALLBACK_GRADIENT }} />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/40 to-transparent" />

        {/* Like / Dislike indicators */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-8 left-8 px-4 py-2 rounded-xl border-2 border-[#22C55E] text-[#22C55E] font-bold text-xl rotate-[-15deg]"
        >
          LIKE 👍
        </motion.div>
        <motion.div
          style={{ opacity: dislikeOpacity }}
          className="absolute top-8 right-8 px-4 py-2 rounded-xl border-2 border-[#EF4444] text-[#EF4444] font-bold text-xl rotate-[15deg]"
        >
          PASS 👎
        </motion.div>

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-2xl font-bold text-white leading-tight">{game.title}</h2>
              <p className="text-[#9CA3AF] text-sm mt-0.5">{game.developer}</p>
            </div>
            <MatchBadge percentage={game.matchPercentage} size="lg" showLabel />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#6C63FF]/25 text-[#6C63FF] border border-[#6C63FF]/20">
              {game.genre}
            </span>
            {game.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white/8 text-[#9CA3AF]">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm text-[#9CA3AF]">
            <span className="flex items-center gap-1.5">
              <Star size={13} className="text-yellow-400 fill-yellow-400" />
              {formatRating(game.rating)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {game.playTime}
            </span>
            <span className="flex items-center gap-1.5">
              <Monitor size={13} />
              {game.platform.join(' · ')}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Action button ────────────────────────────────────────────────────────────

function ActionBtn({
  icon,
  onClick,
  color,
  label,
  size = 'md',
}: {
  icon: React.ReactNode
  onClick: () => void
  color: string
  label: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizeClass = size === 'lg' ? 'w-16 h-16 text-xl' : size === 'sm' ? 'w-10 h-10 text-sm' : 'w-13 h-13'
  return (
    <motion.button
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      title={label}
      className={cn(
        'rounded-full flex items-center justify-center border-2 transition-all cursor-pointer',
        sizeClass
      )}
      style={{ borderColor: color, backgroundColor: color + '18', color }}
    >
      {icon}
    </motion.button>
  )
}

// ─── Filter bar ───────────────────────────────────────────────────────────────

const GENRES: Genre[] = ['FPS', 'RPG', 'MOBA', 'Racing', 'Adventure', 'Survival', 'Strategy']
const PLATFORMS: Platform[] = ['PC', 'PlayStation', 'Xbox', 'Mobile']

function FilterBar({
  activeGenre,
  activePlatform,
  onGenre,
  onPlatform,
}: {
  activeGenre: Genre | null
  activePlatform: Platform | null
  onGenre: (g: Genre | null) => void
  onPlatform: (p: Platform | null) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-white transition-colors"
      >
        <Filter size={15} />
        Filterlər
        <ChevronDown size={13} className={cn('transition-transform', open && 'rotate-180')} />
        {(activeGenre || activePlatform) && (
          <span className="ml-1 w-2 h-2 rounded-full bg-[#6C63FF]" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 flex flex-col gap-3">
              <div>
                <p className="text-xs text-[#9CA3AF] mb-2 uppercase tracking-wider">Janr</p>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((g) => (
                    <button
                      key={g}
                      onClick={() => onGenre(activeGenre === g ? null : g)}
                      className={cn(
                        'text-xs px-3 py-1.5 rounded-full border transition-all',
                        activeGenre === g
                          ? 'bg-[#6C63FF]/20 border-[#6C63FF]/50 text-[#6C63FF]'
                          : 'border-white/8 text-[#9CA3AF] hover:border-white/20 hover:text-white'
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-[#9CA3AF] mb-2 uppercase tracking-wider">Platform</p>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      onClick={() => onPlatform(activePlatform === p ? null : p)}
                      className={cn(
                        'text-xs px-3 py-1.5 rounded-full border transition-all',
                        activePlatform === p
                          ? 'bg-[#00D4FF]/15 border-[#00D4FF]/50 text-[#00D4FF]'
                          : 'border-white/8 text-[#9CA3AF] hover:border-white/20 hover:text-white'
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function RecommendationsPage() {
  const { genres, platform: prefPlatform } = usePreferenceStore()
  const {
    recommendations, currentIndex,
    setRecommendations, appendRecommendations,
    nextGame, likeGame, dislikeGame, saveGame,
  } = useRecommendationStore()

  const [loading, setLoading] = useState(false)
  const [activeGenre, setActiveGenre] = useState<Genre | null>(null)
  const [activePlatform, setActivePlatform] = useState<Platform | null>(null)
  const [exiting, setExiting] = useState<'left' | 'right' | null>(null)
  const loadingRef = useRef(false)

  const visibleGames = recommendations.slice(currentIndex, currentIndex + 3)
  const currentGame = visibleGames[0] as Game | undefined

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load() }, [activeGenre, activePlatform])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (recommendations.length - currentIndex <= 3 && !loadingRef.current) loadMore()
  }, [currentIndex, recommendations.length])

  async function load() {
    if (loadingRef.current) return
    loadingRef.current = true
    setLoading(true)
    try {
      const data = await apiGetRecommendations({
        genres: activeGenre ? [activeGenre] : genres,
        platform: activePlatform ?? prefPlatform ?? undefined,
      })
      setRecommendations(data)
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }

  async function loadMore() {
    loadingRef.current = true
    const page = Math.floor(recommendations.length / 10)
    const data = await apiGetRecommendations(
      { genres: activeGenre ? [activeGenre] : genres, platform: activePlatform ?? prefPlatform ?? undefined },
      page
    )
    appendRecommendations(data)
    loadingRef.current = false
  }

  function handleLike() {
    if (!currentGame) return
    setExiting('right')
    setTimeout(() => {
      likeGame(currentGame)
      nextGame()
      setExiting(null)
      toast(`"${currentGame.title}" bəyənildi! 👍`, 'success')
    }, 300)
  }

  function handleDislike() {
    if (!currentGame) return
    setExiting('left')
    setTimeout(() => {
      dislikeGame(currentGame)
      nextGame()
      setExiting(null)
    }, 300)
  }

  function handleSave() {
    if (!currentGame) return
    saveGame(currentGame)
    toast(`"${currentGame.title}" saxlandı! 🔖`, 'success')
  }

  if (loading && recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw size={32} className="text-[#6C63FF] animate-spin" />
          <p className="text-[#9CA3AF]">Oyunlar yüklənir...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0F19]">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Kəşf et</h1>
          <p className="text-sm text-[#9CA3AF]">
            {recommendations.length - currentIndex} oyun sənin üçün hazırlanıb
          </p>
        </motion.div>

        {/* Filters */}
        <FilterBar
          activeGenre={activeGenre}
          activePlatform={activePlatform}
          onGenre={(g) => { setActiveGenre(g); }}
          onPlatform={(p) => { setActivePlatform(p); }}
        />

        {/* Card Stack */}
        {currentGame ? (
          <div className="relative" style={{ height: 480 }}>
            <AnimatePresence>
              {visibleGames.map((game, i) => (
                <motion.div
                  key={game.id}
                  className="absolute inset-0"
                  animate={
                    i === 0 && exiting
                      ? { x: exiting === 'right' ? 300 : -300, opacity: 0, rotate: exiting === 'right' ? 20 : -20 }
                      : {}
                  }
                  transition={{ duration: 0.3 }}
                >
                  <SwipeCard
                    game={game}
                    isTop={i === 0}
                    stackIndex={i}
                    onLike={handleLike}
                    onDislike={handleDislike}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center gap-4 py-24"
          >
            <div className="w-16 h-16 rounded-full bg-[#6C63FF]/20 flex items-center justify-center">
              <RefreshCw size={28} className="text-[#6C63FF]" />
            </div>
            <p className="text-white font-semibold">Hamısına baxdın!</p>
            <p className="text-[#9CA3AF] text-sm text-center">Yeni tövsiyələr üçün filterleri dəyişdir</p>
            <Button onClick={load} variant="secondary">
              Yenilə
            </Button>
          </motion.div>
        )}

        {/* Action buttons */}
        {currentGame && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-5 mt-6"
          >
            <ActionBtn icon={<ThumbsDown size={22} />} onClick={handleDislike} color="#EF4444" label="Keç" size="md" />
            <ActionBtn icon={<ThumbsUp size={26} />}   onClick={handleLike}    color="#22C55E" label="Bəyən" size="lg" />
            <ActionBtn icon={<Bookmark size={18} />}   onClick={handleSave}    color="#00D4FF" label="Saxla" size="sm" />
            <Link to={`/game/${currentGame.id}`}>
              <ActionBtn icon={<Info size={18} />} onClick={() => {}} color="#6C63FF" label="Ətraflı" size="sm" />
            </Link>
          </motion.div>
        )}

        {/* Hint text */}
        {currentGame && (
          <p className="text-center text-xs text-[#9CA3AF]/50 mt-4">
            Sola sürüşdür → keç &nbsp;·&nbsp; Sağa sürüşdür → bəyən
          </p>
        )}
      </div>
    </div>
  )
}
