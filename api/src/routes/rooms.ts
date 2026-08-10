import { Router } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const room = await prisma.room.create({
      data: {
        code: 'TEST123'
      }
    })

    res.status(201).json({
      id: room.id,
      code: room.code
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to create room'
    })
  }
})

export default router
