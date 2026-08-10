import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { getLetterHints } from '../lib/gameUtils'
const router = Router()

router.get('/', async (req, res) => {
  try {
    const games = await prisma.game.findMany({
      select: {
        id: true,
        roomId: true,
        scramble: true,
        startedAt: true,
        endedAt: true,
        players: true
      },
      orderBy: {
        startedAt: 'desc'
      }
    })

    res.json(games)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to fetch games'
    })
  }
})

router.post('/:gameId/guess', async (req, res) => {
  try {
    const { gameId } = req.params
    const { guess } = req.body

    if (typeof guess !== 'string' || guess.length !== 5) {
      return res.status(400).json({
        error: 'Guess must be exactly 5 letters'
      })
    }

    const game = await prisma.game.findUnique({
      where: {
        id: gameId
      }
    })

    if (!game) {
      return res.status(404).json({
        error: 'Game not found'
      })
    }

    const hints = getLetterHints(guess, game.scramble)

    res.json({
      hints
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to process guess'
    })
  }
})
export default router
