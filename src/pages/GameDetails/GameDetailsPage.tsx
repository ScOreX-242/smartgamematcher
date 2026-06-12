import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Star, Clock, Monitor, Calendar,
  ThumbsUp, ThumbsDown, Bookmark, Play,
  Dna, CheckCircle,
} from 'lucide-react'
import { useRecommendationStore } from '@/store/recommendationStore'
import { usePreferenceStore } from '@/store/preferenceStore'
import { apiGetGameById } from '@/services/mockApi'
import { MatchBadge } from '@/components/ui/MatchBadge'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import { formatRating, getMatchColor } from '@/utils/format'
import type { Game } from '@/types'

// ─── Compatibility meter ─────────────────────────────────────────────────────

function CompatibilityMeter({ percentage }: { percentage: number }) {
  const color = getMatchColor(percentage)
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#9CA3AF]">Uyğunluq balı</span>
        <span className="text-2xl font-bold" style={{ color }}>
          {percentage}%
        </span>
      </div>
      <div className="h-3 bg-white/8 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-[#9CA3AF]">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  )
}

// ─── Why this matches you ─────────────────────────────────────────────────────

function MatchReasons({ game, genres }: { game: Game; genres: string[] }) {
  const reasons: string[] = []

  if (genres.includes(game.genre)) {
    reasons.push(`${game.genre} janrını bəyənirsən — bu oyun tam sənin zövqünə uyğundur.`)
  }
  if (game.rating >= 9) {
    reasons.push(`Oyun ${formatRating(game.rating)}/10 reytinqə malikdir — kritikin seçimi.`)
  }
  if (game.tags.includes('Open World')) {
    reasons.push('Açıq dünya sevənsən — bu oyun nəhəng bir kəşf sahəsi təqdim edir.')
  }
  if (game.tags.includes('Story-Rich')) {
    reasons.push('Dərin hekayə sevirsən — bu oyun sənə unutulmaz bir macəra yaşadacaq.')
  }
  if (reasons.length === 0) {
    reasons.push(`Bu oyun profilinə ${game.matchPercentage}% uyğun gəlir.`)
  }

  return (
    <div className="flex flex-col gap-3">
      {reasons.map((r, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + i * 0.1 }}
          className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/8"
        >
          <CheckCircle size={16} className="text-[#22C55E] mt-0.5 shrink-0" />
          <p className="text-sm text-[#9CA3AF] leading-relaxed">{r}</p>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function GameDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { genres } = usePreferenceStore()
  const { likeGame, dislikeGame, saveGame, savedGames, addRecentlyViewed } = useRecommendationStore()

  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    apiGetGameById(id).then((g) => {
      if (!g) { setNotFound(true); setLoading(false); return }
      setGame(g)
      addRecentlyViewed(g)
      setLoading(false)
    })
  }, [id])

  const isSaved = savedGames.some((g) => g.id === id)

  function handleLike() {
    if (!game) return
    likeGame(game)
    toast(`"${game.title}" bəyənildi! 👍`, 'success')
  }
  function handleDislike() {
    if (!game) return
    dislikeGame(game)
    toast('Keçildi', 'error')
  }
  function handleSave() {
    if (!game) return
    saveGame(game)
    toast(`"${game.title}" saxlandı! 🔖`, 'success')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#6C63FF] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (notFound || !game) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center gap-4">
        <p className="text-white text-xl font-semibold">Oyun tapılmadı</p>
        <Button onClick={() => navigate(-1)} variant="secondary">Geri qayıt</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0F19]">
      {/* Hero Banner */}
      <div className="relative h-[50vh] min-h-[320px] overflow-hidden">
        {game.image ? (
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full" style={{ background: 'linear-gradient(135deg,#151B2E,#1e2640)' }} />
        )}
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19]/60 via-transparent to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-4 sm:left-6 flex items-center gap-2 px-3 py-2 rounded-xl glass text-[#9CA3AF] hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Geri</span>
        </button>

        {/* Trailer placeholder button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center pointer-events-auto cursor-pointer hover:bg-white/30 transition-all"
            onClick={() => toast('Trailer tezliklə əlavə olunacaq!', 'success')}
          >
            <Play size={24} className="text-white ml-1" fill="white" />
          </motion.div>
        </div>

        {/* Hero info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-end justify-between flex-wrap gap-3">
              <div>
                <MatchBadge percentage={game.matchPercentage} size="md" showLabel className="mb-3" />
                <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight">{game.title}</h1>
                <p className="text-[#9CA3AF] text-sm mt-1">{game.developer}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: main info */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* Meta chips */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass">
                <Star size={15} className="text-yellow-400 fill-yellow-400" />
                <span className="text-white font-semibold">{formatRating(game.rating)}</span>
                <span className="text-[#9CA3AF] text-sm">/ 10</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass">
                <Clock size={15} className="text-[#00D4FF]" />
                <span className="text-white text-sm">{game.playTime}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass">
                <Monitor size={15} className="text-[#6C63FF]" />
                <span className="text-white text-sm">{game.platform.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass">
                <Calendar size={15} className="text-[#FF4D8D]" />
                <span className="text-white text-sm">{game.releaseDate}</span>
              </div>
            </motion.div>

            {/* Tags */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-[#9CA3AF]">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Overview */}
            <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <h2 className="text-lg font-semibold text-white mb-3">Haqqında</h2>
              <p className="text-[#9CA3AF] leading-relaxed">{game.description}</p>
            </motion.section>

            {/* Why this matches you */}
            <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="flex items-center gap-2 mb-4">
                <Dna size={18} className="text-[#6C63FF]" />
                <h2 className="text-lg font-semibold text-white">Niyə sənə uyğundur?</h2>
              </div>
              <MatchReasons game={game} genres={genres} />
            </motion.section>
          </div>

          {/* Right: sidebar */}
          <div className="flex flex-col gap-5">

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-strong rounded-2xl p-5 flex flex-col gap-3"
            >
              <h3 className="text-sm font-semibold text-white mb-1">Əməliyyatlar</h3>
              <Button onClick={handleLike} fullWidth className="gap-2">
                <ThumbsUp size={16} /> Bəyən
              </Button>
              <Button onClick={handleSave} variant="secondary" fullWidth className="gap-2">
                <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
                {isSaved ? 'Saxlanıb' : 'Saxla'}
              </Button>
              <Button onClick={handleDislike} variant="danger" fullWidth className="gap-2">
                <ThumbsDown size={16} /> Keç
              </Button>
            </motion.div>

            {/* Compatibility meter */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-strong rounded-2xl p-5"
            >
              <h3 className="text-sm font-semibold text-white mb-4">Uyğunluq</h3>
              <CompatibilityMeter percentage={game.matchPercentage} />
            </motion.div>

            {/* Genre info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="glass-strong rounded-2xl p-5"
            >
              <h3 className="text-sm font-semibold text-white mb-3">Janr</h3>
              <span className="inline-block text-sm px-3 py-1.5 rounded-full bg-[#6C63FF]/20 text-[#6C63FF] border border-[#6C63FF]/20">
                {game.genre}
              </span>
              {game.subGenres?.map((sg) => (
                <span key={sg} className="inline-block ml-2 text-sm px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-[#9CA3AF]">
                  {sg}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
