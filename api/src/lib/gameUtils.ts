export function letterDistance (guess: string, target: string): number {
  const guessPosition = guess.toUpperCase().charCodeAt(0) - 65
  const targetPosition = target.toUpperCase().charCodeAt(0) - 65

  return Math.abs(guessPosition - targetPosition)
}

export function getLetterHints (guess: string, target: string): number[] {
  const guessLetters = guess.toUpperCase().split('')
  const targetLetters = target.toUpperCase().split('')

  return guessLetters.map((letter, index) => {
    return letterDistance(letter, targetLetters[index])
  })
}
