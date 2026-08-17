// client/src/store/gameStore.ts
import { create } from 'zustand'

export interface Player {
  id: string
  username: string
  isReady: boolean
  isHost: boolean
  score: number
}

export interface RoomMember {
  id: string
  username: string
  role: 'HOST' | 'PLAYER'
}

interface GameState {
  // === ROOM STATE ===
  roomCode: string | null
  roomMembers: RoomMember[]
  gameId: string | null  // ✅ Added: store gameId for API calls

  // === GAME STATE ===
  players: Player[]
  currentWord: string | null
  scrambledWord: string | null
  scores: Record<string, number>
  gameStatus: 'waiting' | 'playing' | 'finished'
  round: number
  maxRounds: number
  currentRound: number

  // === TIMER STATE ===
  timer: number
  isTimerActive: boolean

  // === ACTIONS ===
  setRoom: (code: string) => void
  setGameId: (id: string) => void  // ✅ New: store gameId
  addRoomMember: (member: RoomMember) => void
  setRoomMembers: (members: RoomMember[]) => void

  addPlayer: (name: string) => void
  removePlayer: (name: string) => void
  setPlayers: (players: Player[]) => void

  setCurrentWord: (word: string) => void
  setScrambledWord: (word: string) => void
  updateScore: (player: string, points: number) => void

  startGame: () => void
  nextRound: () => void
  resetGame: () => void

  setTimer: (seconds: number) => void
  startTimer: () => void
  stopTimer: () => void
  resetTimer: () => void

  setGameState: (state: Partial<GameState>) => void
}

const initialState = {
  roomCode: null,
  roomMembers: [],
  gameId: null,
  players: [],
  currentWord: null,
  scrambledWord: null,
  scores: {},
  gameStatus: 'waiting' as const,
  round: 0,
  maxRounds: 10,
  currentRound: 0,
  timer: 30,
  isTimerActive: false,
}

export const useGameStore = create<GameState>()((set, get) => ({
  ...initialState,

  // === ROOM ACTIONS ===
  setRoom: (code) => set({ roomCode: code }),

  setGameId: (id) => set({ gameId: id }),

  addRoomMember: (member) =>
    set((state) => ({
      roomMembers: [...state.roomMembers, member],
    })),

  setRoomMembers: (members) => set({ roomMembers: members }),

  // === PLAYER ACTIONS ===
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
      return {
        players: newPlayers,
        scores: newScores,
        roomMembers: newPlayers.map((p) => ({
          id: p.id,
          username: p.username,
          role: p.isHost ? 'HOST' : 'PLAYER',
        })),
      }
    }),

  setPlayers: (players) => set({ players }),

  // === GAME ACTIONS ===
  setCurrentWord: (word) => set({ currentWord: word }),

  setScrambledWord: (word) => set({ scrambledWord: word }),

  updateScore: (player, points) =>
    set((state) => ({
      scores: {
        ...state.scores,
        [player]: (state.scores[player] || 0) + points,
      },
    })),

  startGame: () =>
    set({
      gameStatus: 'playing',
      round: 1,
      currentRound: 1,
      timer: 30,
      isTimerActive: true,
    }),

  nextRound: () =>
    set((state) => ({
      round: state.round + 1,
      currentRound: state.currentRound + 1,
      currentWord: null,
      scrambledWord: null,
      timer: 30,
      isTimerActive: true,
    })),

  resetGame: () => set(initialState),

  // === TIMER ACTIONS ===
  setTimer: (seconds) => set({ timer: seconds }),

  startTimer: () => set({ isTimerActive: true }),

  stopTimer: () => set({ isTimerActive: false }),

  resetTimer: () => set({ timer: 30, isTimerActive: false }),

  setGameState: (state) => set(state),
}))