export type Genre = 'FPS' | 'RPG' | 'MOBA' | 'Racing' | 'Adventure' | 'Survival' | 'Strategy'

export type PlayStyle = 'Multiplayer' | 'Solo' | 'Both'

export type DailyPlayTime = '<1 hour' | '1-2 hours' | '2-4 hours' | '4+ hours'

export type Mood = 'Relax' | 'Competitive' | 'Social' | 'Exploration'

export type Platform = 'PC' | 'PlayStation' | 'Xbox' | 'Mobile'

export interface UserPreferences {
  genres: Genre[]
  playStyle: PlayStyle | null
  dailyPlayTime: DailyPlayTime | null
  mood: Mood | null
  platform: Platform | null
}

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  preferences: UserPreferences
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export interface Game {
  id: string
  title: string
  genre: Genre
  subGenres?: Genre[]
  rating: number
  playTime: string
  platform: Platform[]
  description: string
  image: string
  screenshots: string[]
  matchPercentage: number
  releaseDate: string
  developer: string
  tags: string[]
  trailer?: string
}

export interface GameInteraction {
  gameId: string
  action: 'liked' | 'disliked' | 'saved'
  timestamp: string
}

export interface RecommendationState {
  recommendations: Game[]
  currentIndex: number
  likedGames: Game[]
  dislikedGames: Game[]
  savedGames: Game[]
  recentlyViewed: Game[]
  interactions: GameInteraction[]
}
