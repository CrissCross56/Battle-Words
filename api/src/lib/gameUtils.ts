const DISTANCE_RANGES = [
  { min: 1, max: 1 },
  { min: 2, max: 2 },
  { min: 3, max: 7 },
  { min: 8, max: 12 },
  { min: 13, max: 17 },
  { min: 18, max: 22 },
  { min: 23, max: 25 }
] as const

function getDistanceRange (distance: number): string {
  const range = DISTANCE_RANGES.find(
    range => distance >= range.min && distance <= range.max
  )

  if (!range) {
    throw new Error(`Invalid alphabet distance: ${distance}`)
  }

  return range.min === range.max ? `${range.min}` : `${range.min}-${range.max}`
}

export function getLetterHints (guess: string, target: string) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'

  return guess.split('').map((letter, index) => {
    const targetLetter = target[index]

    const guessIndex = alphabet.indexOf(letter)
    const targetIndex = alphabet.indexOf(targetLetter)

    const distance = targetIndex - guessIndex

    if (distance === 0) {
      return {
        letter,
        range: '0',
        direction: 'correct'
      }
    }

    return {
      letter,
      range: getDistanceRange(Math.abs(distance)),
      direction: distance > 0 ? 'right' : 'left'
    }
  })
}
export function generateRoomCode (length: number = 8): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ1234567890'
  let code = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    code += characters[randomIndex]
  }

  return code
}

export function generateScramble (word: string): string {
  const letters = word.split('')

  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    ;[letters[i], letters[j]] = [letters[j], letters[i]]
  }

  return letters.join('')
}

export function isRoundPlayerFinished (
  scrambleSolved: boolean,
  answerSolved: boolean,
  scrambleGuessCount: number,
  unscrambleStartedAt: Date | null
): boolean {
  // Solved the final answer
  if (answerSolved) {
    return true
  }

  // Failed to solve the scramble after 5 guesses
  if (!scrambleSolved && scrambleGuessCount >= 5) {
    return true
  }

  // Solved the scramble, but the 30-second
  // unscramble period has expired
  if (scrambleSolved && unscrambleStartedAt) {
    const deadline = new Date(unscrambleStartedAt.getTime() + 30 * 1000)

    if (new Date() >= deadline) {
      return true
    }
  }

  return false
}
// Big Timer of 5 minutes. Terminate the game if 5 minutes elasped
const GAME_DURATION_MS = 5 * 60 * 1000

export function isGameExpired (startedAt: Date): boolean {
  const gameDeadline = new Date(startedAt.getTime() + GAME_DURATION_MS)

  return new Date() >= gameDeadline
}

export function isRoundFinished (
  players: Array<{
    scrambleSolved: boolean
    answerSolved: boolean
    scrambleGuessCount: number
    unscrambleStartedAt: Date | null
  }>
): boolean {
  return players.every(player =>
    isRoundPlayerFinished(
      player.scrambleSolved,
      player.answerSolved,
      player.scrambleGuessCount,
      player.unscrambleStartedAt
    )
  )
}
