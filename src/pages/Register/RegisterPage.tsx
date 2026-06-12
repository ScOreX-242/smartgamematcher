import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Gamepad2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from '@/components/ui/Toast'
import { useAuthStore } from '@/store/authStore'
import { apiRegister } from '@/services/mockApi'

interface FormErrors {
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
}

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  const map = [
    { label: '', color: '' },
    { label: 'Zəif', color: '#EF4444' },
    { label: 'Orta', color: '#FF9500' },
    { label: 'Yaxşı', color: '#00D4FF' },
    { label: 'Güclü', color: '#22C55E' },
  ]
  return { score, ...map[score] }
}

function validate(
  username: string,
  email: string,
  password: string,
  confirmPassword: string
): FormErrors {
  const errors: FormErrors = {}
  if (!username) errors.username = 'İstifadəçi adı tələb olunur'
  else if (username.length < 3) errors.username = 'Ən azı 3 simvol olmalıdır'
  if (!email) errors.email = 'Email tələb olunur'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Email düzgün deyil'
  if (!password) errors.password = 'Şifrə tələb olunur'
  else if (password.length < 6) errors.password = 'Ən azı 6 simvol olmalıdır'
  if (password !== confirmPassword) errors.confirmPassword = 'Şifrələr uyğun deyil'
  return errors
}

export function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const strength = getPasswordStrength(password)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(username, email, password, confirmPassword)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      const { user, token } = await apiRegister(username, email, password)
      login(user, token)
      toast('Hesab yaradıldı! 🎮', 'success')
      navigate('/onboarding')
    } catch {
      toast('Qeydiyyat uğursuz oldu', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="animate-orb absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#FF4D8D]/15 blur-[120px]" />
        <div
          className="animate-orb absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#6C63FF]/20 blur-[120px]"
          style={{ animationDelay: '3s' }}
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
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF4D8D] to-[#6C63FF] flex items-center justify-center glow-accent mb-4"
          >
            <Gamepad2 size={28} className="text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white">
            Smart<span className="gradient-text">Game</span> Matcher
          </h1>
          <p className="text-sm text-[#9CA3AF] mt-1">Gamer profili yarat</p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Hesab yarat</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="İstifadəçi adı"
              type="text"
              placeholder="CoolGamer99"
              icon={<User size={16} />}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
              autoComplete="username"
            />

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

            <div className="flex flex-col gap-1.5">
              <Input
                label="Şifrə"
                type="password"
                placeholder="••••••••"
                icon={<Lock size={16} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                autoComplete="new-password"
              />
              {/* Password strength bar */}
              {password && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: i <= strength.score ? strength.color : 'rgba(255,255,255,0.08)',
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </motion.div>
              )}
            </div>

            <Input
              label="Şifrəni təsdiqlə"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={16} />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
              Hesab yarat
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="text-xs text-[#9CA3AF]">Artıq hesabın var?</span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          <Link to="/login">
            <Button variant="secondary" fullWidth>
              Daxil ol
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
