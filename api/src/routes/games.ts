import { Router } from 'express'
import { prisma } from '../lib/prisma'
import {
  getLetterHints,
  generateScramble,
  isGameExpired,
  isRoundPlayerFinished
} from '../lib/gameUtils'
const router = Router()

async function checkRoundCompletion (gameId: string) {
  const game = await prisma.game.findUnique({
    where: {
      id: gameId
    }
  })

  if (!game || game.endedAt) {
    return
  }

  const round = await prisma.round.findUnique({
    where: {
      gameId_roundNumber: {
        gameId,
        roundNumber: game.currentRound
      }
    }
  })

  if (!round || round.endedAt) {
    return
  }

  const roundPlayers = await prisma.roundPlayer.findMany({
    where: {
      roundId: round.id
    }
  })

  let everyoneIsFinished = true

  for (const roundPlayer of roundPlayers) {
    const scrambleGuessCount = await prisma.scrambleGuess.count({
      where: {
        roundPlayerId: roundPlayer.id
      }
    })

    const finished = isRoundPlayerFinished(
      roundPlayer.scrambleSolved,
      roundPlayer.answerSolved,
      scrambleGuessCount,
      roundPlayer.unscrambleStartedAt
    )

    if (!finished) {
      everyoneIsFinished = false
      break
    }
  }

  if (!everyoneIsFinished) {
    return
  }

  // Everyone is finished
  await prisma.round.update({
    where: {
      id: round.id
    },
    data: {
      endedAt: new Date()
    }
  })

  // Check if there are more rounds to play
  const isLastRound = game.currentRound >= game.totalRounds

  if (!isLastRound) {
    // More rounds remain - create the next one
    const nextRoundNumber = game.currentRound + 1

    const wordCount = await prisma.word.count()

    if (wordCount === 0) {
      throw new Error('No words available')
    }

    const randomIndex = Math.floor(Math.random() * wordCount)

    const answer = await prisma.word.findFirst({
      skip: randomIndex
    })

    if (!answer) {
      throw new Error('No words available')
    }

    const scramble = generateScramble(answer.value)

    await prisma.$transaction(async tx => {
      await tx.game.update({
        where: {
          id: game.id
        },
        data: {
          currentRound: nextRoundNumber
        }
      })

      const nextRound = await tx.round.create({
        data: {
          gameId: game.id,
          roundNumber: nextRoundNumber,
          answerId: answer.id,
          scramble
        }
      })

      const gamePlayers = await tx.gamePlayer.findMany({
        where: {
          gameId: game.id
        }
      })

      for (const gamePlayer of gamePlayers) {
        await tx.roundPlayer.create({
          data: {
            roundId: nextRound.id,
            gamePlayerId: gamePlayer.id
          }
        })
      }
    })

    return
  }

  // This was the final round.
  await prisma.game.update({
    where: {
      id: game.id
    },
    data: {
      endedAt: new Date()
    }
  })
}

async function expireGameIfNeeded (gameId: string) {
  const game = await prisma.game.findUnique({
    where: {
      id: gameId
    }
  })

  if (!game || game.endedAt) {
    return false
  }

  if (!isGameExpired(game.startedAt)) {
    return false
  }

  const now = new Date()

  await prisma.$transaction(async tx => {
    // End the current round if it is still active
    await tx.round.updateMany({
      where: {
        gameId: game.id,
        endedAt: null
      },
      data: {
        endedAt: now
      }
    })

    // End the game
    await tx.game.update({
      where: {
        id: game.id
      },
      data: {
        endedAt: now
      }
    })
  })

  return true
}

router.get('/', async (req, res) => {
  try {
    const games = await prisma.game.findMany({
      select: {
        id: true,
        roomId: true,
        startedAt: true,
        endedAt: true
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

router.get('/:gameId/status', async (req, res) => {
  try {
    const { gameId } = req.params

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

    // End the game if the 5-minute limit has expired.
    const gameExpired = await expireGameIfNeeded(gameId)

    if (gameExpired) {
      const endedGame = await prisma.game.findUnique({
        where: {
          id: gameId
        }
      })

      return res.json({
        gameEnded: true,
        game: endedGame
      })
    }

    // Check whether the current round has finished.
    await checkRoundCompletion(gameId)

    const updatedGame = await prisma.game.findUnique({
      where: {
        id: gameId
      }
    })

    if (!updatedGame) {
      return res.status(404).json({
        error: 'Game not found'
      })
    }

    const round = await prisma.round.findUnique({
      where: {
        gameId_roundNumber: {
          gameId,
          roundNumber: updatedGame.currentRound
        }
      },
      select: {
        id: true,
        gameId: true,
        roundNumber: true,
        startedAt: true,
        endedAt: true
      }
    })

    res.json({
      gameEnded: updatedGame.endedAt !== null,
      currentRound: updatedGame.currentRound,
      totalRounds: updatedGame.totalRounds,
      gameStartedAt: updatedGame.startedAt,
      round
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to fetch game status'
    })
  }
})

router.post('/:roomCode/start', async (req, res) => {
  try {
    const { roomCode } = req.params

    const room = await prisma.room.findUnique({
      where: {
        code: roomCode
      },
      include: {
        members: true
      }
    })

    if (!room) {
      return res.status(404).json({
        error: 'Room not found'
      })
    }

    const activeGame = await prisma.game.findFirst({
      where: {
        roomId: room.id,
        endedAt: null
      }
    })

    if (activeGame) {
      return res.status(409).json({
        error: 'Room already has an active game'
      })
    }

    const players = room.members.filter(member => member.role === 'PLAYER')

    if (players.length < 2) {
      return res.status(400).json({
        error: 'Room must have at least two players'
      })
    }

    const wordCount = await prisma.word.count()

    if (wordCount === 0) {
      return res.status(500).json({
        error: 'No words available'
      })
    }

    const randomIndex = Math.floor(Math.random() * wordCount)

    const answer = await prisma.word.findFirst({
      skip: randomIndex
    })

    if (!answer) {
      return res.status(500).json({
        error: 'No words available'
      })
    }

    const scramble = generateScramble(answer.value)

    const game = await prisma.$transaction(async tx => {
      const game = await tx.game.create({
        data: {
          roomId: room.id,
          currentRound: 1,
          totalRounds: room.totalRounds
        }
      })

      const gamePlayers = []

      for (const player of players) {
        const gamePlayer = await tx.gamePlayer.create({
          data: {
            gameId: game.id,
            memberId: player.id
          }
        })

        gamePlayers.push(gamePlayer)
      }

      const round = await tx.round.create({
        data: {
          gameId: game.id,
          roundNumber: 1,
          answerId: answer.id,
          scramble
        }
      })

      for (const gamePlayer of gamePlayers) {
        await tx.roundPlayer.create({
          data: {
            roundId: round.id,
            gamePlayerId: gamePlayer.id
          }
        })
      }

      return game
    })

    res.status(201).json({
      id: game.id,
      roomId: game.roomId,
      currentRound: game.currentRound,
      startedAt: game.startedAt
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to start game'
    })
  }
})

router.post('/:gameId/scramble-guess', async (req, res) => {
  try {
    const { gameId } = req.params
    const { memberId, guess } = req.body

    if (typeof memberId !== 'string') {
      return res.status(400).json({
        error: 'memberId is required'
      })
    }

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

    if (isGameExpired(game.startedAt)) {
      return res.status(400).json({
        error: 'Game has ended'
      })
    }

    if (game.endedAt) {
      return res.status(400).json({
        error: 'Game has ended'
      })
    }

    const round = await prisma.round.findUnique({
      where: {
        gameId_roundNumber: {
          gameId,
          roundNumber: game.currentRound
        }
      }
    })

    if (!round) {
      return res.status(404).json({
        error: 'Current round not found'
      })
    }

    if (round.endedAt) {
      return res.status(400).json({
        error: 'Round has ended'
      })
    }

    const gamePlayer = await prisma.gamePlayer.findUnique({
      where: {
        gameId_memberId: {
          gameId,
          memberId
        }
      }
    })

    if (!gamePlayer) {
      return res.status(403).json({
        error: 'Player is not part of this game'
      })
    }

    const roundPlayer = await prisma.roundPlayer.findUnique({
      where: {
        roundId_gamePlayerId: {
          roundId: round.id,
          gamePlayerId: gamePlayer.id
        }
      }
    })

    if (!roundPlayer) {
      return res.status(403).json({
        error: 'Player is not part of this round'
      })
    }

    if (roundPlayer.scrambleSolved) {
      return res.status(400).json({
        error: 'Scramble already solved'
      })
    }

    const previousGuessCount = await prisma.scrambleGuess.count({
      where: {
        roundPlayerId: roundPlayer.id
      }
    })

    if (previousGuessCount >= 5) {
      return res.status(400).json({
        error: 'No guesses remaining'
      })
    }

    const guessNumber = previousGuessCount + 1
    const normalizedGuess = guess.toLowerCase()
    const correct = normalizedGuess === round.scramble

    await prisma.scrambleGuess.create({
      data: {
        roundPlayerId: roundPlayer.id,
        guess: normalizedGuess,
        guessNumber,
        correct
      }
    })

    if (!correct) {
      const finished = isRoundPlayerFinished(false, false, guessNumber, null)

      if (finished) {
        await checkRoundCompletion(gameId)
      }

      return res.json({
        correct: false,
        guessNumber,
        guessesRemaining: 5 - guessNumber,
        finished,
        hints: getLetterHints(normalizedGuess, round.scramble)
      })
    }
    const scramblePoints = 6 - guessNumber

    const winnerUpdate = await prisma.round.updateMany({
      where: {
        id: round.id,
        scrambleWinnerId: null
      },
      data: {
        scrambleWinnerId: roundPlayer.id
      }
    })

    const isFirstSolver = winnerUpdate.count === 1

    let totalScramblePoints = scramblePoints

    if (isFirstSolver) {
      totalScramblePoints += 1
    }

    const scrambleSolvedAt = new Date()

    const updatedRoundPlayer = await prisma.roundPlayer.update({
      where: {
        id: roundPlayer.id
      },
      data: {
        scrambleSolved: true,
        scramblePoints: totalScramblePoints,
        scrambleSolvedAt,
        unscrambleStartedAt: scrambleSolvedAt,
        totalPoints: {
          increment: totalScramblePoints
        }
      }
    })

    await prisma.gamePlayer.update({
      where: {
        id: gamePlayer.id
      },
      data: {
        totalPoints: {
          increment: totalScramblePoints
        }
      }
    })

    await checkRoundCompletion(gameId)
    return res.json({
      correct: true,
      guessNumber,
      scramblePoints: totalScramblePoints,
      firstSolver: isFirstSolver,
      unscrambleStartedAt: updatedRoundPlayer.unscrambleStartedAt
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to process scramble guess'
    })
  }
})

router.post('/:gameId/unscramble-guess', async (req, res) => {
  try {
    const { gameId } = req.params
    const { memberId, guess } = req.body

    if (typeof memberId !== 'string') {
      return res.status(400).json({
        error: 'memberId is required'
      })
    }

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

    if (isGameExpired(game.startedAt)) {
      return res.status(400).json({
        error: 'Game has ended'
      })
    }

    if (game.endedAt) {
      return res.status(400).json({
        error: 'Game has ended'
      })
    }

    const round = await prisma.round.findUnique({
      where: {
        gameId_roundNumber: {
          gameId,
          roundNumber: game.currentRound
        }
      },
      include: {
        answer: true
      }
    })

    if (!round) {
      return res.status(404).json({
        error: 'Current round not found'
      })
    }

    if (round.endedAt) {
      return res.status(400).json({
        error: 'Round has ended'
      })
    }

    const gamePlayer = await prisma.gamePlayer.findUnique({
      where: {
        gameId_memberId: {
          gameId,
          memberId
        }
      }
    })

    if (!gamePlayer) {
      return res.status(403).json({
        error: 'Player is not part of this game'
      })
    }

    const roundPlayer = await prisma.roundPlayer.findUnique({
      where: {
        roundId_gamePlayerId: {
          roundId: round.id,
          gamePlayerId: gamePlayer.id
        }
      }
    })

    if (!roundPlayer) {
      return res.status(403).json({
        error: 'Player is not part of this round'
      })
    }

    // Player must solve the scramble before they can unscramble it
    if (!roundPlayer.scrambleSolved) {
      return res.status(400).json({
        error: 'You must solve the scramble first'
      })
    }

    // Player can only solve the answer once
    if (roundPlayer.answerSolved) {
      return res.status(400).json({
        error: 'Answer already solved'
      })
    }

    // Make sure the unscramble timer actually started
    if (!roundPlayer.unscrambleStartedAt) {
      return res.status(400).json({
        error: 'Unscramble timer has not started'
      })
    }

    const now = new Date()

    // Player has 30 seconds to unscramble
    const unscrambleDeadline = new Date(
      roundPlayer.unscrambleStartedAt.getTime() + 30 * 1000
    )

    if (now >= unscrambleDeadline) {
      return res.status(400).json({
        error: 'Unscramble time has expired'
      })
    }

    const normalizedGuess = guess.toLowerCase()
    const correct = normalizedGuess === round.answer.value

    await prisma.unscrambleGuess.create({
      data: {
        roundPlayerId: roundPlayer.id,
        guess: normalizedGuess,
        correct
      }
    })

    if (!correct) {
      return res.json({
        correct: false
      })
    }

    const answerPoints = 1
    const answerSolvedAt = new Date()

    const updatedRoundPlayer = await prisma.roundPlayer.update({
      where: {
        id: roundPlayer.id
      },
      data: {
        answerSolved: true,
        answerPoints,
        answerSolvedAt,
        totalPoints: {
          increment: answerPoints
        }
      }
    })

    await prisma.gamePlayer.update({
      where: {
        id: gamePlayer.id
      },
      data: {
        totalPoints: {
          increment: answerPoints
        }
      }
    })

    await checkRoundCompletion(gameId)

    return res.json({
      correct: true,
      answerPoints,
      answerSolvedAt: updatedRoundPlayer.answerSolvedAt
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to process unscramble guess'
    })
  }
})

router.get('/:gameId/scoreboard', async (req, res) => {
  const { gameId } = req.params

  const players = await prisma.gamePlayer.findMany({
    where: {
      gameId
    },
    select: {
      totalPoints: true,
      member: {
        select: {
          username: true
        }
      }
    },
    orderBy: {
      totalPoints: 'desc'
    }
  })

  res.json({
    gameId,
    scoreboard: players.map(player => ({
      username: player.member.username,
      score: player.totalPoints
    }))
  })
})

export default router
