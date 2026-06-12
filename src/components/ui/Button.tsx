import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] text-white hover:opacity-90 glow-primary',
  secondary:
    'bg-transparent border border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF]/10',
  ghost: 'bg-transparent text-[#9CA3AF] hover:text-white hover:bg-white/5',
  danger: 'bg-[#EF4444]/10 border border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/20',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        disabled={disabled || loading}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 cursor-pointer select-none',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {loading && <Loader2 size={15} className="animate-spin shrink-0" />}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
