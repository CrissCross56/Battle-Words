import { create } from 'zustand'
import { io, Socket } from 'socket.io-client'

interface GameState {
  // === STATE ===
  socket: Socket | null
  roomCode: string | null
  players: string[]
  currentWord: string | null
  scores: Record<string, number>
  gameStatus: 'waiting' | 'playing' | 'finished'

  // === SOCKET ACTIONS ===
  connectSocket: (roomCode: string) => void
  disconnectSocket: () => void

  // === GAME ACTIONS ===
  setRoom: (code: string) => void
  addPlayer: (name: string) => void
  setCurrentWord: (word: string) => void
  updateScore: (player: string, points: number) => void
  startGame: () => void
  resetGame: () => void
}

export const useGameStore = create<GameState>()((set, get) => ({
  // === INITIAL STATE ===
  socket: null,
  roomCode: null,
  players: [],
  currentWord: null,
  scores: {},
  gameStatus: 'waiting',

  // === SOCKET ACTIONS ===
  connectSocket: (roomCode) => {
    const socket = io('http://localhost:3001') // Chnaged from 3000 to 3001

    // Listen for socket events and update Zustand state
    socket.on('player-joined', (data: { players: string[] }) => {
      set({ players: data.players })
    })

    socket.on('word-updated', (data: { word: string }) => {
      set({ currentWord: data.word })
    })

    socket.on('score-updated', (data: { player: string; points: number }) => {
      const { updateScore } = get()
      updateScore(data.player, data.points)
    })

    socket.on('game-started', () => {
      set({ gameStatus: 'playing' })
    })

    socket.on('game-finished', () => {
      set({ gameStatus: 'finished' })
    })

    set({ socket })
  },

  disconnectSocket: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
      set({ socket: null })
    }
  },

  // === GAME ACTIONS ===
  setRoom: (code) => set({ roomCode: code }),

  addPlayer: (name) =>
    set((state) => ({
      players: [...state.players, name],
      scores: { ...state.scores, [name]: 0 },
    })),

  setCurrentWord: (word) => set({ currentWord: word }),

  updateScore: (player, points) =>
    set((state) => ({
      scores: {
        ...state.scores,
        [player]: (state.scores[player] || 0) + points,
      },
    })),

  startGame: () => set({ gameStatus: 'playing' }),

  resetGame: () =>
    set({
      roomCode: null,
      players: [],
      currentWord: null,
      scores: {},
      gameStatus: 'waiting',
    }),
}))