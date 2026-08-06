import express from 'express'
import gameRoutes from './routes/games'

const app = express()

const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())

// Routes
app.use('/games', gameRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
