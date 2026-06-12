import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Genre, PlayStyle, DailyPlayTime, Mood, Platform } from '@/types'

interface PreferenceStore {
  genres: Genre[]
  playStyle: PlayStyle | null
  dailyPlayTime: DailyPlayTime | null
  mood: Mood | null
  platform: Platform | null
  onboardingComplete: boolean
  setGenres: (genres: Genre[]) => void
  setPlayStyle: (style: PlayStyle) => void
  setDailyPlayTime: (time: DailyPlayTime) => void
  setMood: (mood: Mood) => void
  setPlatform: (platform: Platform) => void
  completeOnboarding: () => void
  reset: () => void
}

const defaultState = {
  genres: [] as Genre[],
  playStyle: null as PlayStyle | null,
  dailyPlayTime: null as DailyPlayTime | null,
  mood: null as Mood | null,
  platform: null as Platform | null,
  onboardingComplete: false,
}

export const usePreferenceStore = create<PreferenceStore>()(
  persist(
    (set) => ({
      ...defaultState,
      setGenres: (genres) => set({ genres }),
      setPlayStyle: (playStyle) => set({ playStyle }),
      setDailyPlayTime: (dailyPlayTime) => set({ dailyPlayTime }),
      setMood: (mood) => set({ mood }),
      setPlatform: (platform) => set({ platform }),
      completeOnboarding: () => set({ onboardingComplete: true }),
      reset: () => set(defaultState),
    }),
    { name: 'sgm-preferences' }
  )
)
