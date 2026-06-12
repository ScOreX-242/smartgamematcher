import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Game } from '@/types'

interface RecommendationStore {
  recommendations: Game[]
  currentIndex: number
  likedGames: Game[]
  dislikedGames: Game[]
  savedGames: Game[]
  recentlyViewed: Game[]
  setRecommendations: (games: Game[]) => void
  appendRecommendations: (games: Game[]) => void
  nextGame: () => void
  likeGame: (game: Game) => void
  dislikeGame: (game: Game) => void
  saveGame: (game: Game) => void
  removeSavedGame: (gameId: string) => void
  addRecentlyViewed: (game: Game) => void
  reset: () => void
}

const defaultState = {
  recommendations: [] as Game[],
  currentIndex: 0,
  likedGames: [] as Game[],
  dislikedGames: [] as Game[],
  savedGames: [] as Game[],
  recentlyViewed: [] as Game[],
}

export const useRecommendationStore = create<RecommendationStore>()(
  persist(
    (set, get) => ({
      ...defaultState,
      setRecommendations: (recommendations) =>
        set({ recommendations, currentIndex: 0 }),
      appendRecommendations: (games) =>
        set((s) => ({ recommendations: [...s.recommendations, ...games] })),
      nextGame: () => set((s) => ({ currentIndex: s.currentIndex + 1 })),
      likeGame: (game) =>
        set((s) => {
          const already = s.likedGames.some((g) => g.id === game.id)
          return already ? {} : { likedGames: [...s.likedGames, game] }
        }),
      dislikeGame: (game) =>
        set((s) => {
          const already = s.dislikedGames.some((g) => g.id === game.id)
          return already ? {} : { dislikedGames: [...s.dislikedGames, game] }
        }),
      saveGame: (game) =>
        set((s) => {
          const already = s.savedGames.some((g) => g.id === game.id)
          return already ? {} : { savedGames: [...s.savedGames, game] }
        }),
      removeSavedGame: (gameId) =>
        set((s) => ({ savedGames: s.savedGames.filter((g) => g.id !== gameId) })),
      addRecentlyViewed: (game) =>
        set((s) => {
          const filtered = s.recentlyViewed.filter((g) => g.id !== game.id)
          return { recentlyViewed: [game, ...filtered].slice(0, 10) }
        }),
      reset: () => {
        const { currentIndex: _ci, ...rest } = get()
        void rest
        set(defaultState)
      },
    }),
    { name: 'sgm-recommendations' }
  )
)
