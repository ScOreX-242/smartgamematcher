// TODO(real-api): Replace these functions with actual fetch() calls.
// Each function signature matches the expected real API contract.
// Base URL would be: const BASE_URL = import.meta.env.VITE_API_URL

import type { Game, User, UserPreferences } from '@/types'
import { MOCK_GAMES, MOCK_USER } from './mockData'

const delay = (ms = 600) => new Promise((res) => setTimeout(res, ms))

function generateMatchPercentage(
  game: Game,
  preferences: Partial<UserPreferences>
): number {
  let score = game.matchPercentage
  if (preferences.genres?.includes(game.genre)) score = Math.min(100, score + 5)
  if (preferences.platform && game.platform.includes(preferences.platform))
    score = Math.min(100, score + 3)
  return score
}

// Auth
export async function apiLogin(
  _email: string,
  _password: string
): Promise<{ user: User; token: string }> {
  await delay(800)
  return {
    user: MOCK_USER,
    token: 'mock-jwt-token-' + Math.random().toString(36).slice(2),
  }
}

export async function apiRegister(
  username: string,
  email: string,
  _password: string
): Promise<{ user: User; token: string }> {
  await delay(1000)
  const user: User = { ...MOCK_USER, username, email, id: 'user-' + Date.now() }
  return {
    user,
    token: 'mock-jwt-token-' + Math.random().toString(36).slice(2),
  }
}

// Games
export async function apiGetRecommendations(
  preferences: Partial<UserPreferences>,
  page = 0
): Promise<Game[]> {
  await delay(700)
  const start = page * 10
  return MOCK_GAMES.slice(start, start + 10).map((g) => ({
    ...g,
    matchPercentage: generateMatchPercentage(g, preferences),
  }))
}

export async function apiGetGameById(id: string): Promise<Game | null> {
  await delay(400)
  return MOCK_GAMES.find((g) => g.id === id) ?? null
}

export async function apiGetTrending(): Promise<Game[]> {
  await delay(500)
  return [...MOCK_GAMES].sort((a, b) => b.rating - a.rating).slice(0, 6)
}

export async function apiSearchGames(query: string): Promise<Game[]> {
  await delay(300)
  const q = query.toLowerCase()
  return MOCK_GAMES.filter(
    (g) =>
      g.title.toLowerCase().includes(q) ||
      g.genre.toLowerCase().includes(q) ||
      g.tags.some((t) => t.toLowerCase().includes(q))
  )
}

// User
export async function apiUpdatePreferences(
  _userId: string,
  preferences: UserPreferences
): Promise<User> {
  await delay(600)
  return { ...MOCK_USER, preferences }
}
