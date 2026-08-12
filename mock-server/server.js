const io = require('socket.io')(3001, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

console.log('🔌 Mock Socket.io server running on port 3001')

// Mock state
let players = ['Player1', 'Player2']
let currentWord = 'REACT'
let scores = { Player1: 5, Player2: 3 }
let gameStatus = 'playing'

// Emit initial state when a client connects
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id)

  // Send initial state to the client
  socket.emit('player-joined', { players })
  socket.emit('word-updated', { word: currentWord })
  socket.emit('game-started', { status: gameStatus })

  // Send score updates periodically
  let scoreInterval = setInterval(() => {
    const randomPlayer = Math.random() > 0.5 ? 'Player1' : 'Player2'
    const points = Math.floor(Math.random() * 3) + 1
    scores[randomPlayer] = (scores[randomPlayer] || 0) + points
    socket.emit('score-updated', { player: randomPlayer, points })
  }, 5000)

  // Simulate a new word every 8 seconds
  let wordInterval = setInterval(() => {
    const words = ['REACT', 'TYPESCRIPT', 'JAVASCRIPT', 'NODE', 'EXPRESS']
    currentWord = words[Math.floor(Math.random() * words.length)]
    socket.emit('word-updated', { word: currentWord })
  }, 8000)

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id)
    clearInterval(scoreInterval)
    clearInterval(wordInterval)
  })
})