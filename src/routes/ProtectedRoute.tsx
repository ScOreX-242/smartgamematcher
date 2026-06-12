import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { usePreferenceStore } from '@/store/preferenceStore'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const onboardingComplete = usePreferenceStore((s) => s.onboardingComplete)
  const location = useLocation()

  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />
  if (!onboardingComplete) return <Navigate to="/onboarding" replace />
  return <Outlet />
}

export function AuthRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const onboardingComplete = usePreferenceStore((s) => s.onboardingComplete)

  if (isAuthenticated && onboardingComplete) return <Navigate to="/dashboard" replace />
  if (isAuthenticated && !onboardingComplete) return <Navigate to="/onboarding" replace />
  return <Outlet />
}

export function OnboardingGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const onboardingComplete = usePreferenceStore((s) => s.onboardingComplete)

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (onboardingComplete) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
