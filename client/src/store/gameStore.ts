// client/src/store/gameStore.ts
// Zustand store for Battle-Words game state

import { create } from 'zustand'

// ============================================
// TYPES
// ============================================
export interface Player {
  id: string
  username: string
  isReady: boolean
  isHost: boolean
  score: number
}

interface GameState {
  // === GAME STATE ===
  roomCode: string | null
  players: Player[]
  currentWord: string | null
  scores: Record<string, number>
  gameStatus: 'waiting' | 'playing' | 'finished'
  round: number
  maxRounds: number

  // === ACTIONS ===
  setRoom: (code: string) => void
  addPlayer: (name: string) => void
  removePlayer: (name: string) => void
  setPlayers: (players: Player[]) => void
  setCurrentWord: (word: string) => void
  updateScore: (player: string, points: number) => void
  startGame: () => void
  nextRound: () => void
  resetGame: () => void
  setGameState: (state: Partial<GameState>) => void
}

// ============================================
// INITIAL STATE
// ============================================
const initialState = {
  roomCode: null,
  players: [],
  currentWord: null,
  scores: {},
  gameStatus: 'waiting' as const,
  round: 0,
  maxRounds: 10,
}

// ============================================
// ZUSTAND STORE
// ============================================
export const useGameStore = create<GameState>()((set, get) => ({
  ...initialState,

  // --- ACTIONS ---

  setRoom: (code) => set({ roomCode: code }),

  addPlayer: (name) =>
    set((state) => ({
      players: [
        ...state.players,
        {
          id: Date.now().toString(),
          username: name,
          isReady: false,
          isHost: state.players.length === 0,
          score: 0,
        },
      ],
      scores: { ...state.scores, [name]: 0 },
    })),

  removePlayer: (name) =>
    set((state) => {
      const newPlayers = state.players.filter((p) => p.username !== name)
      const newScores = { ...state.scores }
      delete newScores[name]
      return { players: newPlayers, scores: newScores }
    }),

  setPlayers: (players) => set({ players }),

  setCurrentWord: (word) => set({ currentWord: word }),

  updateScore: (player, points) =>
    set((state) => ({
      scores: {
        ...state.scores,
        [player]: (state.scores[player] || 0) + points,
      },
    })),

  startGame: () => set({ gameStatus: 'playing', round: 1 }),

  nextRound: () =>
    set((state) => ({
      round: state.round + 1,
      currentWord: null,
    })),

  resetGame: () => set(initialState),

  setGameState: (state) => set(state),
}))

// ============================================
// EXPORT THE STORE AS DEFAULT (for convenience)
// ============================================
export default useGameStore