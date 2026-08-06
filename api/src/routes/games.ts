import { Router } from 'express'
import { prisma } from '../lib/prisma'

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

export default router
