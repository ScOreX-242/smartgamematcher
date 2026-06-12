import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Mail, Edit2, Save, X,
  ThumbsUp, ThumbsDown, Eye, Bookmark,
  Dna, Trophy, Gamepad2, Zap,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { usePreferenceStore } from '@/store/preferenceStore'
import { useRecommendationStore } from '@/store/recommendationStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { GameCard } from '@/components/ui/GameCard'
import { toast } from '@/components/ui/Toast'

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ username, size = 'lg' }: { username: string; size?: 'sm' | 'lg' }) {
  const initials = username.slice(0, 2).toUpperCase()
  const dim = size === 'lg' ? 'w-24 h-24 text-2xl' : 'w-10 h-10 text-sm'
  return (
    <div
      className={`${dim} rounded-full bg-gradient-to-br from-[#6C63FF] to-[#FF4D8D] flex items-center justify-center font-bold text-white glow-primary shrink-0`}
    >
      {initials}
    </div>
  )
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon, label, value, color, delay,
}: {
  icon: React.ReactNode; label: string; value: number | string; color: string; delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex-1 min-w-[120px] glass rounded-2xl p-4 flex flex-col gap-3"
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '22', color }}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-xs text-[#9CA3AF] mt-0.5">{label}</div>
      </div>
    </motion.div>
  )
}

// ─── Preference chip ──────────────────────────────────────────────────────────

function Chip({ label, color = '#6C63FF' }: { label: string; color?: string }) {
  return (
    <span
      className="text-xs px-3 py-1.5 rounded-full border font-medium"
      style={{ color, borderColor: color + '44', backgroundColor: color + '18' }}
    >
      {label}
    </span>
  )
}

// ─── Edit modal ───────────────────────────────────────────────────────────────

function EditModal({
  username,
  email,
  onSave,
  onClose,
}: {
  username: string
  email: string
  onSave: (u: string, e: string) => void
  onClose: () => void
}) {
  const [newUsername, setNewUsername] = useState(username)
  const [newEmail, setNewEmail] = useState(email)
  const [error, setError] = useState('')

  function handleSave() {
    if (!newUsername.trim() || newUsername.length < 3) {
      setError('İstifadəçi adı ən azı 3 simvol olmalıdır')
      return
    }
    onSave(newUsername.trim(), newEmail.trim())
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 24 }}
        className="glass-strong rounded-2xl p-6 w-full max-w-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Profili redaktə et</h3>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            label="İstifadəçi adı"
            type="text"
            icon={<User size={15} />}
            value={newUsername}
            onChange={(e) => { setNewUsername(e.target.value); setError('') }}
            error={error}
          />
          <Input
            label="Email"
            type="email"
            icon={<Mail size={15} />}
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <div className="flex gap-3 mt-2">
            <Button variant="ghost" fullWidth onClick={onClose}>Ləğv et</Button>
            <Button fullWidth onClick={handleSave} className="gap-2">
              <Save size={15} /> Saxla
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Gaming DNA card ──────────────────────────────────────────────────────────

function GamingDNACard() {
  const { genres, playStyle, dailyPlayTime, mood, platform } = usePreferenceStore()
  const items = [
    { label: 'Janrlar',   value: genres.join(', ') || '—', color: '#6C63FF' },
    { label: 'Oyun Stili', value: playStyle ?? '—',        color: '#00D4FF' },
    { label: 'Gündəlik',  value: dailyPlayTime ?? '—',    color: '#22C55E' },
    { label: 'Əhval',     value: mood ?? '—',             color: '#FF4D8D' },
    { label: 'Platform',  value: platform ?? '—',         color: '#FF9500' },
  ]

  return (
    <div className="glass-strong rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <Dna size={18} className="text-[#6C63FF]" />
        <h2 className="text-base font-semibold text-white">Gaming DNA</h2>
      </div>
      <div className="flex flex-col gap-2">
        {items.map(({ label, value, color }) => (
          <div key={label} className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0">
            <span className="text-xs text-[#9CA3AF] uppercase tracking-wider">{label}</span>
            <span className="text-sm font-semibold" style={{ color }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Achievement badges ───────────────────────────────────────────────────────

function Achievements({ likedCount, viewedCount }: { likedCount: number; viewedCount: number }) {
  const badges = [
    { label: 'İlk Bəyən', icon: <ThumbsUp size={18} />, unlocked: likedCount >= 1, color: '#22C55E' },
    { label: '5 Oyun',     icon: <Trophy size={18} />,  unlocked: likedCount >= 5,  color: '#FF9500' },
    { label: 'Kəşfçi',    icon: <Eye size={18} />,     unlocked: viewedCount >= 5, color: '#00D4FF' },
    { label: 'Hardcore',   icon: <Zap size={18} />,     unlocked: likedCount >= 10, color: '#FF4D8D' },
    { label: 'Pro Gamer',  icon: <Gamepad2 size={18} />, unlocked: likedCount >= 20, color: '#6C63FF' },
  ]

  return (
    <div className="glass-strong rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <Trophy size={18} className="text-[#FF9500]" />
        <h2 className="text-base font-semibold text-white">Nailiyyətlər</h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {badges.map(({ label, icon, unlocked, color }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 p-3 rounded-xl border transition-all w-[80px]"
            style={{
              borderColor: unlocked ? color + '44' : 'rgba(255,255,255,0.06)',
              backgroundColor: unlocked ? color + '15' : 'rgba(255,255,255,0.03)',
              opacity: unlocked ? 1 : 0.4,
            }}
          >
            <div style={{ color: unlocked ? color : '#9CA3AF' }}>{icon}</div>
            <span className="text-[10px] text-center leading-tight" style={{ color: unlocked ? color : '#9CA3AF' }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const updateUser = useAuthStore((s) => s.updateUser)
  const { genres, playStyle, platform } = usePreferenceStore()
  const { likedGames, dislikedGames, savedGames, recentlyViewed } = useRecommendationStore()

  const [editOpen, setEditOpen] = useState(false)
  const [savedTab, setSavedTab] = useState(false)

  const avgMatch =
    likedGames.length > 0
      ? Math.round(likedGames.reduce((s, g) => s + g.matchPercentage, 0) / likedGames.length)
      : 0

  function handleSave(newUsername: string, newEmail: string) {
    updateUser({ username: newUsername, email: newEmail })
    setEditOpen(false)
    toast('Profil yeniləndi! ✅', 'success')
  }

  return (
    <div className="min-h-screen bg-[#0B0F19]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">

        {/* Profile header card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-3xl p-6 sm:p-8 relative overflow-hidden"
        >
          {/* Background orbs */}
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#6C63FF]/15 blur-[60px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-[#FF4D8D]/10 blur-[40px] pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Avatar username={user?.username ?? 'G'} size="lg" />

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{user?.username}</h1>
              <p className="text-sm text-[#9CA3AF] mt-0.5">{user?.email}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                {genres.map((g) => <Chip key={g} label={g} color="#6C63FF" />)}
                {playStyle && <Chip label={playStyle} color="#00D4FF" />}
                {platform && <Chip label={platform} color="#FF4D8D" />}
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="gap-2 shrink-0"
              onClick={() => setEditOpen(true)}
            >
              <Edit2 size={14} />
              Redaktə et
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="flex flex-wrap gap-3">
          <StatCard icon={<ThumbsUp size={18} />}  label="Bəyənildi"     value={likedGames.length}     color="#22C55E" delay={0.05} />
          <StatCard icon={<ThumbsDown size={18} />} label="Keçildi"       value={dislikedGames.length}  color="#EF4444" delay={0.1}  />
          <StatCard icon={<Bookmark size={18} />}   label="Saxlanılan"    value={savedGames.length}     color="#00D4FF" delay={0.15} />
          <StatCard icon={<Zap size={18} />}        label="Ort. uyğunluq" value={avgMatch > 0 ? `${avgMatch}%` : '—'} color="#6C63FF" delay={0.2} />
        </div>

        {/* Middle row: DNA + Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <GamingDNACard />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
            <Achievements likedCount={likedGames.length} viewedCount={recentlyViewed.length} />
          </motion.div>
        </div>

        {/* Liked / Saved games tabs */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center gap-1 mb-5 p-1 bg-white/5 rounded-xl w-fit">
            {[
              { label: `Bəyənilənlər (${likedGames.length})`, active: !savedTab },
              { label: `Saxlanılanlar (${savedGames.length})`, active: savedTab },
            ].map(({ label, active }, i) => (
              <button
                key={label}
                onClick={() => setSavedTab(i === 1)}
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${
                  active ? 'bg-[#6C63FF] text-white' : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={savedTab ? 'saved' : 'liked'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {(savedTab ? savedGames : likedGames).length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-[#9CA3AF]">
                  <Gamepad2 size={36} className="opacity-30" />
                  <p className="text-sm">
                    {savedTab ? 'Hələ heç nə saxlamamısan' : 'Hələ heç bir oyun bəyənməmişsən'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {(savedTab ? savedGames : likedGames).map((game, i) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <GameCard game={game} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.section>
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editOpen && (
          <EditModal
            username={user?.username ?? ''}
            email={user?.email ?? ''}
            onSave={handleSave}
            onClose={() => setEditOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
