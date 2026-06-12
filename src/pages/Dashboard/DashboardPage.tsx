import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ThumbsUp, ThumbsDown, Eye, Zap,
  TrendingUp, ChevronRight, Sparkles,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { usePreferenceStore } from '@/store/preferenceStore'
import { useRecommendationStore } from '@/store/recommendationStore'
import { apiGetTrending, apiGetRecommendations } from '@/services/mockApi'
import { GameCard } from '@/components/ui/GameCard'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { Button } from '@/components/ui/Button'
import type { Game } from '@/types'

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  color,
  delay,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  color: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex-1 min-w-[130px] glass rounded-2xl p-4 flex flex-col gap-3"
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: color + '22', color }}
      >
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-xs text-[#9CA3AF] mt-0.5">{label}</div>
      </div>
    </motion.div>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
  linkTo,
  linkLabel,
}: {
  icon: React.ReactNode
  title: string
  linkTo?: string
  linkLabel?: string
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="text-[#6C63FF]">{icon}</div>
        <h2 className="text-base font-semibold text-white">{title}</h2>
      </div>
      {linkTo && (
        <Link to={linkTo}>
          <span className="flex items-center gap-1 text-xs text-[#6C63FF] hover:text-[#00D4FF] transition-colors">
            {linkLabel}
            <ChevronRight size={13} />
          </span>
        </Link>
      )}
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const { genres, playStyle, platform } = usePreferenceStore()
  const { likedGames, dislikedGames, recentlyViewed } = useRecommendationStore()

  const [trending, setTrending] = useState<Game[]>([])
  const [quickRecs, setQuickRecs] = useState<Game[]>([])
  const [loadingTrending, setLoadingTrending] = useState(true)
  const [loadingRecs, setLoadingRecs] = useState(true)

  useEffect(() => {
    apiGetTrending().then((data) => {
      setTrending(data)
      setLoadingTrending(false)
    })
    apiGetRecommendations({ genres, platform: platform ?? undefined }).then((data) => {
      setQuickRecs(data.slice(0, 4))
      setLoadingRecs(false)
    })
  }, [genres, platform])

  const avgMatch =
    likedGames.length > 0
      ? Math.round(likedGames.reduce((s, g) => s + g.matchPercentage, 0) / likedGames.length)
      : 0

  return (
    <div className="min-h-screen bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden mb-8 p-8 sm:p-10"
          style={{
            background: 'linear-gradient(135deg, #151B2E 0%, #1a1040 50%, #0d1a2e 100%)',
            border: '1px solid rgba(108,99,255,0.2)',
          }}
        >
          {/* Orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#6C63FF]/20 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#00D4FF]/10 blur-[60px] pointer-events-none" />

          <div className="relative">
            <p className="text-[#9CA3AF] text-sm mb-1">Xoş gəldiniz 👋</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {user?.username ?? 'Gamer'}
            </h1>

            <div className="flex flex-wrap gap-2 mb-6">
              {genres.map((g) => (
                <span
                  key={g}
                  className="text-xs px-3 py-1 rounded-full bg-[#6C63FF]/20 text-[#6C63FF] border border-[#6C63FF]/20"
                >
                  {g}
                </span>
              ))}
              {playStyle && (
                <span className="text-xs px-3 py-1 rounded-full bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/20">
                  {playStyle}
                </span>
              )}
              {platform && (
                <span className="text-xs px-3 py-1 rounded-full bg-[#FF4D8D]/15 text-[#FF4D8D] border border-[#FF4D8D]/20">
                  {platform}
                </span>
              )}
            </div>

            <Link to="/recommendations">
              <Button size="lg" className="gap-2">
                <Sparkles size={17} />
                Oyun kəşf et
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="flex flex-wrap gap-3 mb-10">
          <StatCard icon={<ThumbsUp size={18} />}  label="Bəyənildi"          value={likedGames.length}    color="#22C55E" delay={0.1} />
          <StatCard icon={<ThumbsDown size={18} />} label="Keçildi"            value={dislikedGames.length} color="#EF4444" delay={0.15} />
          <StatCard icon={<Eye size={18} />}         label="Baxılan oyunlar"   value={recentlyViewed.length} color="#00D4FF" delay={0.2} />
          <StatCard icon={<Zap size={18} />}         label="Ort. uyğunluq"     value={avgMatch > 0 ? `${avgMatch}%` : '—'} color="#6C63FF" delay={0.25} />
        </div>

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <section className="mb-10">
            <SectionHeader icon={<Eye size={16} />} title="Son baxılanlar" linkTo="/recommendations" linkLabel="Hamısı" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {recentlyViewed.slice(0, 5).map((game, i) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <GameCard game={game} compact />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Recommendations */}
        <section className="mb-10">
          <SectionHeader
            icon={<Sparkles size={16} />}
            title="Sənin üçün"
            linkTo="/recommendations"
            linkLabel="Hamısını gör"
          />
          {loadingRecs ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {quickRecs.map((game, i) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <GameCard game={game} />
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Trending */}
        <section>
          <SectionHeader
            icon={<TrendingUp size={16} />}
            title="Trend oyunlar"
            linkTo="/recommendations"
            linkLabel="Hamısını gör"
          />
          {loadingTrending ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {trending.map((game, i) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <GameCard game={game} compact />
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
