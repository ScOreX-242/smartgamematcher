import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'w-full h-11 rounded-xl border bg-white/5 text-white text-sm placeholder:text-[#9CA3AF]/60',
              'focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50 focus:border-[#6C63FF]/50 transition-all',
              error
                ? 'border-[#EF4444]/50 focus:ring-[#EF4444]/30'
                : 'border-white/[0.08] hover:border-white/[0.15]',
              icon ? 'pl-10 pr-4' : 'px-4',
              isPassword && 'pr-11',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {error && <p className="text-xs text-[#EF4444]">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
