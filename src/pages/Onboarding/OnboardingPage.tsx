import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Crosshair, Sword, Trophy, Car, Map, Flame, Brain,
  Users, User, UserCheck,
  Clock, Timer, Infinity,
  Coffee, Target, MessageCircle, Compass,
  Monitor, Gamepad, Gamepad2, Smartphone,
  Dna, ChevronRight, ChevronLeft, Check,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import { usePreferenceStore } from '@/store/preferenceStore'
import { useAuthStore } from '@/store/authStore'
import { apiUpdatePreferences } from '@/services/mockApi'
import type { Genre, PlayStyle, DailyPlayTime, Mood, Platform } from '@/types'
import { cn } from '@/utils/cn'

// ─── Step data ──────────────────────────────────────────────────────────────

const GENRES: { value: Genre; icon: React.ReactNode; color: string }[] = [
  { value: 'FPS',      icon: <Crosshair size={22} />, color: '#EF4444' },
  { value: 'RPG',      icon: <Sword size={22} />,     color: '#6C63FF' },
  { value: 'MOBA',     icon: <Trophy size={22} />,    color: '#FF9500' },
  { value: 'Racing',   icon: <Car size={22} />,       color: '#00D4FF' },
  { value: 'Adventure',icon: <Map size={22} />,       color: '#22C55E' },
  { value: 'Survival', icon: <Flame size={22} />,     color: '#FF4D8D' },
  { value: 'Strategy', icon: <Brain size={22} />,     color: '#A855F7' },
]

const PLAY_STYLES: { value: PlayStyle; icon: React.ReactNode; desc: string }[] = [
  { value: 'Multiplayer', icon: <Users size={24} />,    desc: 'Dostlarla oyna' },
  { value: 'Solo',        icon: <User size={24} />,     desc: 'Tək öz dünyanda' },
  { value: 'Both',        icon: <UserCheck size={24} />, desc: 'Hər ikisi' },
]

const PLAY_TIMES: { value: DailyPlayTime; icon: React.ReactNode; desc: string }[] = [
  { value: '<1 hour',   icon: <Coffee size={24} />, desc: 'Qısa sessiyalar' },
  { value: '1-2 hours', icon: <Clock size={24} />,  desc: 'Gündəlik doz' },
  { value: '2-4 hours', icon: <Timer size={24} />,  desc: 'Dərin dalış' },
  { value: '4+ hours',  icon: <Infinity size={24} />, desc: 'Həqiqi gamer' },
]

const MOODS: { value: Mood; icon: React.ReactNode; desc: string; color: string }[] = [
  { value: 'Relax',       icon: <Coffee size={24} />,        desc: 'Rahatlamaq istəyirəm',    color: '#22C55E' },
  { value: 'Competitive', icon: <Target size={24} />,        desc: 'Qalib gəlmək istəyirəm',  color: '#EF4444' },
  { value: 'Social',      icon: <MessageCircle size={24} />, desc: 'Dostlarla vaxt keçirmək', color: '#00D4FF' },
  { value: 'Exploration', icon: <Compass size={24} />,       desc: 'Kəşf etmək istəyirəm',   color: '#6C63FF' },
]

const PLATFORMS: { value: Platform; icon: React.ReactNode; color: string }[] = [
  { value: 'PC',          icon: <Monitor size={28} />,   color: '#6C63FF' },
  { value: 'PlayStation', icon: <Gamepad2 size={28} />,  color: '#003087' },
  { value: 'Xbox',        icon: <Gamepad size={28} />,   color: '#107C10' },
  { value: 'Mobile',      icon: <Smartphone size={28} />, color: '#FF4D8D' },
]

// ─── Step components ─────────────────────────────────────────────────────────

function StepGenres({
  selected,
  onChange,
}: {
  selected: Genre[]
  onChange: (v: Genre[]) => void
}) {
  function toggle(g: Genre) {
    onChange(
      selected.includes(g) ? selected.filter((x) => x !== g) : [...selected, g]
    )
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {GENRES.map(({ value, icon, color }) => {
        const active = selected.includes(value)
        return (
          <motion.button
            key={value}
            type="button"
            onClick={() => toggle(value)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={cn(
              'flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all cursor-pointer',
              active
                ? 'border-opacity-60 bg-opacity-15'
                : 'border-white/8 bg-white/5 hover:border-white/20'
            )}
            style={
              active
                ? { borderColor: color, backgroundColor: color + '22' }
                : {}
            }
          >
            <div style={{ color: active ? color : '#9CA3AF' }}>{icon}</div>
            <span
              className="text-sm font-medium"
              style={{ color: active ? color : '#9CA3AF' }}
            >
              {value}
            </span>
            {active && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: color }}
              >
                <Check size={10} className="text-white" />
              </motion.div>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

function SingleSelect<T extends string>({
  options,
  selected,
  onChange,
}: {
  options: { value: T; icon: React.ReactNode; desc: string; color?: string }[]
  selected: T | null
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      {options.map(({ value, icon, desc, color }) => {
        const active = selected === value
        return (
          <motion.button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer text-left',
              active
                ? 'border-[#6C63FF]/60 bg-[#6C63FF]/10'
                : 'border-white/8 bg-white/5 hover:border-white/20'
            )}
            style={active && color ? { borderColor: color + '99', backgroundColor: color + '15' } : {}}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: active ? (color ?? '#6C63FF') + '22' : 'rgba(255,255,255,0.05)',
                color: active ? (color ?? '#6C63FF') : '#9CA3AF',
              }}
            >
              {icon}
            </div>
            <div>
              <div className="font-semibold text-white text-sm">{value}</div>
              <div className="text-xs text-[#9CA3AF] mt-0.5">{desc}</div>
            </div>
            {active && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: color ?? '#6C63FF' }}
              >
                <Check size={11} className="text-white" />
              </motion.div>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

function PlatformSelect({
  selected,
  onChange,
}: {
  selected: Platform | null
  onChange: (v: Platform) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {PLATFORMS.map(({ value, icon, color }) => {
        const active = selected === value
        return (
          <motion.button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={cn(
              'flex flex-col items-center gap-3 p-6 rounded-xl border transition-all cursor-pointer',
              active ? 'border-opacity-60' : 'border-white/8 bg-white/5 hover:border-white/20'
            )}
            style={active ? { borderColor: color, backgroundColor: color + '18' } : {}}
          >
            <div style={{ color: active ? color : '#9CA3AF' }}>{icon}</div>
            <span
              className="text-sm font-semibold"
              style={{ color: active ? color : '#9CA3AF' }}
            >
              {value}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}

// ─── Gaming DNA summary ───────────────────────────────────────────────────────

function GamingDNA({
  genres,
  playStyle,
  dailyPlayTime,
  mood,
  platform,
  username,
}: {
  genres: Genre[]
  playStyle: PlayStyle | null
  dailyPlayTime: DailyPlayTime | null
  mood: Mood | null
  platform: Platform | null
  username: string
}) {
  const dnaItems = [
    { label: 'Janrlar', value: genres.join(' · ') || '—', color: '#6C63FF' },
    { label: 'Stil', value: playStyle ?? '—', color: '#00D4FF' },
    { label: 'Gündəlik', value: dailyPlayTime ?? '—', color: '#22C55E' },
    { label: 'Əhval', value: mood ?? '—', color: '#FF4D8D' },
    { label: 'Platform', value: platform ?? '—', color: '#FF9500' },
  ]

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14 }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#FF4D8D] flex items-center justify-center glow-primary"
      >
        <Dna size={40} className="text-white" />
      </motion.div>

      <div className="text-center">
        <h3 className="text-2xl font-bold text-white">
          Sənin <span className="gradient-text">Gaming DNA</span>-n
        </h3>
        <p className="text-[#9CA3AF] text-sm mt-1">{username}, bu sənin gamer profilindir!</p>
      </div>

      <div className="w-full flex flex-col gap-2">
        {dnaItems.map(({ label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/8"
          >
            <span className="text-xs text-[#9CA3AF] uppercase tracking-wider">{label}</span>
            <span className="text-sm font-semibold" style={{ color }}>
              {value}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Onboarding Page ─────────────────────────────────────────────────────

const STEP_LABELS = [
  'Janrlar', 'Oyun Stili', 'Vaxt', 'Əhval', 'Platform', 'Gaming DNA',
]

export function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const user = useAuthStore((s) => s.user)
  const updateUser = useAuthStore((s) => s.updateUser)
  const {
    genres, setGenres,
    playStyle, setPlayStyle,
    dailyPlayTime, setDailyPlayTime,
    mood, setMood,
    platform, setPlatform,
    completeOnboarding,
  } = usePreferenceStore()

  const TOTAL_STEPS = STEP_LABELS.length

  function canProceed(): boolean {
    if (step === 0) return genres.length > 0
    if (step === 1) return playStyle !== null
    if (step === 2) return dailyPlayTime !== null
    if (step === 3) return mood !== null
    if (step === 4) return platform !== null
    return true
  }

  async function handleNext() {
    if (step < TOTAL_STEPS - 2) { setStep((s) => s + 1); return }
    if (step === TOTAL_STEPS - 2) { setStep((s) => s + 1); return }

    // Final step — save and redirect
    setLoading(true)
    try {
      const preferences = { genres, playStyle: playStyle!, dailyPlayTime: dailyPlayTime!, mood: mood!, platform: platform! }
      const updated = await apiUpdatePreferences(user?.id ?? '', preferences)
      updateUser(updated)
      completeOnboarding()
      toast('Profil hazırlandı! Oyunları kəşf et 🎮', 'success')
      navigate('/dashboard')
    } catch {
      toast('Xəta baş verdi', 'error')
    } finally {
      setLoading(false)
    }
  }

  const stepContent: Record<number, React.ReactNode> = {
    0: <StepGenres selected={genres} onChange={setGenres} />,
    1: (
      <SingleSelect
        options={PLAY_STYLES}
        selected={playStyle}
        onChange={setPlayStyle}
      />
    ),
    2: (
      <SingleSelect
        options={PLAY_TIMES}
        selected={dailyPlayTime}
        onChange={setDailyPlayTime}
      />
    ),
    3: (
      <SingleSelect
        options={MOODS}
        selected={mood}
        onChange={setMood}
      />
    ),
    4: <PlatformSelect selected={platform} onChange={setPlatform} />,
    5: (
      <GamingDNA
        genres={genres}
        playStyle={playStyle}
        dailyPlayTime={dailyPlayTime}
        mood={mood}
        platform={platform}
        username={user?.username ?? 'Gamer'}
      />
    ),
  }

  const stepTitles: Record<number, { title: string; subtitle: string }> = {
    0: { title: 'Sevdiyin janrlar hansılardır?', subtitle: 'Birdən çox seçə bilərsən' },
    1: { title: 'Necə oynamağı sevirsən?', subtitle: 'Bir variant seç' },
    2: { title: 'Gündə neçə saat oynayırsan?', subtitle: 'Ortalama vaxtını seç' },
    3: { title: 'İndi əhvalın necədir?', subtitle: 'Bu gün nə hiss edirsən?' },
    4: { title: 'Hansı platformdan oynayırsan?', subtitle: 'Əsas platformunu seç' },
    5: { title: 'Profilin hazırdır!', subtitle: 'Gaming DNA-n aşkar edildi' },
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="animate-orb absolute top-[-20%] left-[-15%] w-[600px] h-[600px] rounded-full bg-[#6C63FF]/15 blur-[140px]" />
        <div className="animate-orb absolute bottom-[-20%] right-[-15%] w-[600px] h-[600px] rounded-full bg-[#FF4D8D]/10 blur-[140px]" style={{ animationDelay: '3s' }} />
        <div className="dot-pattern absolute inset-0 opacity-30" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] flex items-center justify-center">
              <Gamepad2 size={15} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-white">SmartGame</span>
          </div>
          <span className="text-xs text-[#9CA3AF]">
            {step + 1} / {TOTAL_STEPS}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/8 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-[#00D4FF]"
            animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* Step labels */}
        <div className="flex justify-between mb-8 px-1">
          {STEP_LABELS.map((label, i) => (
            <div
              key={label}
              className={cn(
                'flex flex-col items-center gap-1',
                i > step ? 'opacity-30' : 'opacity-100'
              )}
            >
              <div
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  i < step
                    ? 'bg-[#22C55E]'
                    : i === step
                    ? 'bg-[#6C63FF] scale-150'
                    : 'bg-white/20'
                )}
              />
              <span className="text-[9px] text-[#9CA3AF] hidden sm:block">{label}</span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">{stepTitles[step].title}</h2>
                <p className="text-sm text-[#9CA3AF] mt-1">{stepTitles[step].subtitle}</p>
              </div>

              {stepContent[step]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3 mt-5">
          {step > 0 && (
            <Button
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
              className="gap-1.5"
            >
              <ChevronLeft size={16} />
              Geri
            </Button>
          )}
          <Button
            fullWidth
            loading={loading}
            disabled={!canProceed()}
            onClick={handleNext}
            className="gap-1.5"
          >
            {step === TOTAL_STEPS - 1 ? 'Başla!' : 'Davam et'}
            {step < TOTAL_STEPS - 1 && <ChevronRight size={16} />}
          </Button>
        </div>
      </div>
    </div>
  )
}
