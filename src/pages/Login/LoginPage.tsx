import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Gamepad2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from '@/components/ui/Toast'
import { useAuthStore } from '@/store/authStore'
import { apiLogin } from '@/services/mockApi'

interface FormErrors {
  email?: string
  password?: string
}

function validate(email: string, password: string): FormErrors {
  const errors: FormErrors = {}
  if (!email) errors.email = 'Email tələb olunur'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Email düzgün deyil'
  if (!password) errors.password = 'Şifrə tələb olunur'
  else if (password.length < 6) errors.password = 'Ən azı 6 simvol olmalıdır'
  return errors
}

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(email, password)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      const { user, token } = await apiLogin(email, password)
      login(user, token)
      toast('Xoş gəldiniz! 🎮', 'success')
      navigate('/onboarding')
    } catch {
      toast('Giriş uğursuz oldu', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="animate-orb absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#6C63FF]/20 blur-[120px]" />
        <div
          className="animate-orb absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#00D4FF]/15 blur-[120px]"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="animate-orb absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-[#FF4D8D]/10 blur-[100px]"
          style={{ animationDelay: '4s' }}
        />
        <div className="dot-pattern absolute inset-0 opacity-40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] flex items-center justify-center glow-primary mb-4"
          >
            <Gamepad2 size={28} className="text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white">
            Smart<span className="gradient-text">Game</span> Matcher
          </h1>
          <p className="text-sm text-[#9CA3AF] mt-1">Oyun dünyasına qayıt</p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Daxil ol</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="oyuncu@example.com"
              icon={<Mail size={16} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />

            <Input
              label="Şifrə"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={16} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="current-password"
            />

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRememberMe((v) => !v)}
                className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${rememberMe ? 'bg-[#6C63FF] border-[#6C63FF]' : 'border-white/20 bg-transparent'}`}
              >
                {rememberMe && (
                  <svg viewBox="0 0 10 10" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="1.5,5 4,7.5 8.5,2.5" />
                  </svg>
                )}
              </button>
              <span className="text-xs text-[#9CA3AF] cursor-pointer" onClick={() => setRememberMe((v) => !v)}>
                Məni xatırla
              </span>
            </div>

            <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
              Daxil ol
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="text-xs text-[#9CA3AF]">Yeni istifadəçi?</span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          <Link to="/register">
            <Button variant="secondary" fullWidth>
              Hesab yarat
            </Button>
          </Link>
        </div>

        <p className="text-center text-xs text-[#9CA3AF]/50 mt-6">
          © 2026 SmartGame Matcher · Hackathon Demo
        </p>
      </motion.div>
    </div>
  )
}
