import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, XCircle, X } from 'lucide-react'
import { useEffect, useState } from 'react'

type ToastType = 'success' | 'error'

interface ToastMessage {
  id: number
  message: string
  type: ToastType
}

let listeners: ((toast: ToastMessage) => void)[] = []
let counter = 0

export function toast(message: string, type: ToastType = 'success') {
  const payload: ToastMessage = { id: ++counter, message, type }
  listeners.forEach((fn) => fn(payload))
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    const handler = (t: ToastMessage) => {
      setToasts((prev) => [...prev, t])
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id))
      }, 3500)
    }
    listeners.push(handler)
    return () => {
      listeners = listeners.filter((l) => l !== handler)
    }
  }, [])

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl glass-strong min-w-[260px] max-w-[340px]"
          >
            {t.type === 'success' ? (
              <CheckCircle size={18} className="text-[#22C55E] shrink-0" />
            ) : (
              <XCircle size={18} className="text-[#EF4444] shrink-0" />
            )}
            <span className="text-sm text-white flex-1">{t.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              className="text-[#9CA3AF] hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
