import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { generateRoomCode } from '../lib/gameUtils'

const router = Router()

router.post('/', async (req, res) => {
  try {
    let roomCode: string
    let existingRoom

    do {
      roomCode = generateRoomCode()

      existingRoom = await prisma.room.findUnique({
        where: {
          code: roomCode
        }
      })
    } while (existingRoom)

    const room = await prisma.room.create({
      data: {
        code: roomCode
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
