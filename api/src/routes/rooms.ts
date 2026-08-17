import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { generateRoomCode } from '../lib/gameUtils'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { username, role } = req.body

    if (typeof username !== 'string' || username.trim() === '') {
      return res.status(400).json({
        error: 'Username is required'
      })
    }

    if (role !== 'PLAYER' && role !== 'SPECTATOR') {
      return res.status(400).json({
        error: 'Invalid role'
      })
    }

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

    const result = await prisma.$transaction(async tx => {
      const room = await tx.room.create({
        data: {
          code: roomCode
        }
      })

      const member = await tx.roomMember.create({
        data: {
          username: username.trim(),
          role,
          roomId: room.id
        }
      })

      return { room, member }
    })

    res.status(201).json({
      id: result.room.id,
      code: result.room.code,
      member: {
        id: result.member.id,
        username: result.member.username,
        role: result.member.role,
        roomId: result.member.roomId
      }
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to create room'
    })
  }
})

router.post('/:roomCode/join', async (req, res) => {
  try {
    const { roomCode } = req.params
    const { username, role } = req.body

    const room = await prisma.room.findUnique({
      where: {
        code: roomCode
      }
    })

    if (!room) {
      return res.status(404).json({
        error: 'Room not found'
      })
    }

    if (typeof username !== 'string' || username.trim() === '') {
      return res.status(400).json({
        error: 'Username is required'
      })
    }

    if (role !== 'PLAYER' && role !== 'SPECTATOR') {
      return res.status(400).json({
        error: 'Invalid role'
      })
    }

    const member = await prisma.roomMember.create({
      data: {
        username: username.trim(),
        role,
        roomId: room.id
      }
    })

    res.status(201).json({
      id: member.id,
      username: member.username,
      role: member.role,
      roomId: member.roomId
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to join room'
    })
  }
})

export default router
