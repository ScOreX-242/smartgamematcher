import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gamepad2, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="animate-orb absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#6C63FF]/10 blur-[120px]" />
        <div className="animate-orb absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[#FF4D8D]/10 blur-[100px]" style={{ animationDelay: '3s' }} />
        <div className="dot-pattern absolute inset-0 opacity-30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col items-center gap-6 text-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.1, stiffness: 100 }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#FF4D8D] flex items-center justify-center glow-primary"
        >
          <Gamepad2 size={36} className="text-white" />
        </motion.div>

        <div>
          <h1 className="text-8xl font-bold gradient-text leading-none mb-2">404</h1>
          <h2 className="text-xl font-semibold text-white mb-2">Səhifə tapılmadı</h2>
          <p className="text-[#9CA3AF] text-sm max-w-xs">
            Bu səhifə mövcud deyil və ya silinib. Geri qayıt, oyun seni gözləyir!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to={-1 as unknown as string}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft size={16} /> Geri
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button className="gap-2">
              <Home size={16} /> Ana səhifə
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
