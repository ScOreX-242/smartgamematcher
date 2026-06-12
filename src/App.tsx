import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute, AuthRoute, OnboardingGuard } from '@/routes/ProtectedRoute'
import { LoginPage } from '@/pages/Login/LoginPage'
import { RegisterPage } from '@/pages/Register/RegisterPage'
import { OnboardingPage } from '@/pages/Onboarding/OnboardingPage'
import { DashboardPage } from '@/pages/Dashboard/DashboardPage'
import { RecommendationsPage } from '@/pages/Recommendations/RecommendationsPage'
import { GameDetailsPage } from '@/pages/GameDetails/GameDetailsPage'
import { ProfilePage } from '@/pages/Profile/ProfilePage'
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Unauthenticated only */}
        <Route element={<AuthRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Auth required, onboarding NOT complete */}
        <Route element={<OnboardingGuard />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>

        {/* Auth + onboarding complete */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/game/:id" element={<GameDetailsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Public 404 */}
        <Route path="/404" element={<NotFoundPage />} />

        {/* Catch-all → login for unauthenticated, 404 for authenticated */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
