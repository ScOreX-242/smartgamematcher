import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Gamepad2, LayoutDashboard, Sparkles, User, LogOut, Menu, X } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { usePreferenceStore } from '@/store/preferenceStore'
import { useRecommendationStore } from '@/store/recommendationStore'
import { cn } from '@/utils/cn'

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/recommendations', label: 'Discover', icon: Sparkles },
  { to: '/profile', label: 'Profile', icon: User },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const resetPrefs = usePreferenceStore((s) => s.reset)
  const resetRecs = useRecommendationStore((s) => s.reset)
  const user = useAuthStore((s) => s.user)

  function handleLogout() {
    logout()
    resetPrefs()
    resetRecs()
    navigate('/login')
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 glass border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] flex items-center justify-center glow-primary transition-all group-hover:scale-110">
            <Gamepad2 size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm tracking-wide hidden sm:block">
            Smart<span className="gradient-text">Game</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  active
                    ? 'bg-[#6C63FF]/20 text-[#6C63FF] glow-primary'
                    : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
                )}
              >
                <Icon size={15} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/[0.08]">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#FF4D8D] flex items-center justify-center text-xs font-bold">
              {user?.username?.[0]?.toUpperCase() ?? 'G'}
            </div>
            <span className="text-xs text-[#9CA3AF] max-w-[80px] truncate">{user?.username}</span>
          </div>

          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-all"
          >
            <LogOut size={15} />
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-all"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-white/[0.06] overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => {
                const active = location.pathname === to
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                      active
                        ? 'bg-[#6C63FF]/20 text-[#6C63FF]'
                        : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                )
              })}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-[#EF4444] hover:bg-[#EF4444]/10 transition-all"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
