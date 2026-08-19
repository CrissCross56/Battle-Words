import React, { useEffect, useRef, useState } from 'react'
import { IonPage } from '@ionic/react'
import './Gameplay.css'
import { usePlayerStore } from '../store/gameStore'

type HintDirection = 'left' | 'right' | 'correct'
type CellCoverage = 'empty' | 'left' | 'right' | 'full'

type HintState = {
  letter: string
  range: string
  direction: HintDirection
}

type SubmittedGuess = {
  guess: string
  hints: HintState[]
}

type GameStatus = {
  currentRound: number
  totalRounds: number
}

type GamePhase =
  | 'scramble'
  | 'phase-transition'
  | 'unscramble'
  | 'waiting'
  | 'timeout'
  | 'game-ended'

type ScoreboardEntry = {
  username: string
  score: number
}

const GRID_SIZE = 5
const MAX_GUESSES = 5
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function getGameContext () {
  if (typeof window === 'undefined') {
    return { gameId: '', memberId: '' }
  }

  const params = new URLSearchParams(window.location.search)
  const queryGameId =
    params.get('gameId') || localStorage.getItem('battleWordsGameId') || ''
  const queryMemberId =
    params.get('memberId') || localStorage.getItem('battleWordsMemberId') || ''

  return {
    gameId: queryGameId,
    memberId: queryMemberId
  }
}

const RANGE_COLORS: Record<string, string> = {
  '0': '#22c55e',
  '1': '#facc15',
  '2': '#f97316',
  '3-7': '#ef4444',
  '8-12': '#3b82f6',
  '13-17': '#a855f7',
  '18-22': '#a16207',
  '23-25': '#111827'
}

function getDistanceRange (distance: number): string {
  const ranges = [
    { min: 0, max: 0 },
    { min: 1, max: 1 },
    { min: 2, max: 2 },
    { min: 3, max: 7 },
    { min: 8, max: 12 },
    { min: 13, max: 17 },
    { min: 18, max: 22 },
    { min: 23, max: 25 }
  ]

  const range = ranges.find(
    entry => distance >= entry.min && distance <= entry.max
  )

  if (!range) return '23-25'

  if (range.min === range.max) return `${range.min}`
  return `${range.min}-${range.max}`
}

export function getHintColor (range: string): string {
  return RANGE_COLORS[range] ?? '#94a3b8'
}

export function getHintSide (direction: HintDirection | string): CellCoverage {
  if (direction === 'correct') return 'full'
  if (direction === 'left') return 'left'
  if (direction === 'right') return 'right'
  return 'empty'
}

// The actual word is resolved by the backend route below, using the DB-backed word bank
// seeded from api/prisma/wordles.json. Do not hardcode a target word in the client.
const Gameplay: React.FC = () => {
  const {
    userName,
    gameId: storeGameId,
    memberId: storeMemberId
  } = usePlayerStore()
  const [draftGuess, setDraftGuess] = useState('')
  const [submittedGuesses, setSubmittedGuesses] = useState<SubmittedGuess[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [gameStatus, setGameStatus] = useState<GameStatus>({
    currentRound: 1,
    totalRounds: 1
  })
  const [scoreboard, setScoreboard] = useState<ScoreboardEntry[]>([])
  const [gamePhase, setGamePhase] = useState<GamePhase>('scramble')
  const [scrambleWord, setScrambleWord] = useState('')
  const [unscrambleGuess, setUnscrambleGuess] = useState('')
  const [unscrambleTimer, setUnscrambleTimer] = useState(30)
  const [phaseTransitionSeconds, setPhaseTransitionSeconds] = useState(5)
  const [timeoutCountdown, setTimeoutCountdown] = useState(5)
  const [roundTimer, setRoundTimer] = useState(300) // 5 minutes in seconds
  const previousRoundRef = useRef(1)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const gamePhaseRef = useRef<GamePhase>('scramble')
  const lastTimeoutRoundRef = useRef<number | null>(null)

  useEffect(() => {
    gamePhaseRef.current = gamePhase
  }, [gamePhase])

  const gameContext = {
    gameId: getGameContext().gameId || storeGameId,
    memberId: getGameContext().memberId || storeMemberId
  }
  const [isGameEnded, setIsGameEnded] = useState(false)

  useEffect(() => {
    if (gamePhase !== 'unscramble') {
      return
    }

    const timer = window.setInterval(() => {
      setUnscrambleTimer(current => {
        if (current <= 1) {
          window.clearInterval(timer)
          setGamePhase('waiting')
          setErrorMessage('Waiting for other players')
          return 0
        }

        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [gamePhase])

  useEffect(() => {
    if (gamePhase !== 'phase-transition') {
      return
    }

    const transitionTimer = window.setInterval(() => {
      setPhaseTransitionSeconds(current => {
        if (current <= 1) {
          window.clearInterval(transitionTimer)
          setGamePhase('unscramble')
          setErrorMessage('Phase 2! Guess the Scrambled Word!')
          return 0
        }

        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(transitionTimer)
  }, [gamePhase])

  useEffect(() => {
    if (gamePhase !== 'timeout') {
      return
    }

    const timeoutTimer = window.setInterval(() => {
      setTimeoutCountdown(current => {
        if (current <= 1) {
          window.clearInterval(timeoutTimer)
          setGamePhase('scramble')
          setSubmittedGuesses([])
          setDraftGuess('')
          setUnscrambleGuess('')
          setScrambleWord('')
          setErrorMessage('')
          return 5
        }

        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(timeoutTimer)
  }, [gamePhase])

  useEffect(() => {
    if (!gameContext.gameId || isGameEnded) {
      return
    }

    const refreshState = async () => {
      try {
        const statusResponse = await fetch(
          `http://localhost:3000/games/${gameContext.gameId}/status`
        )
        const statusData = await statusResponse.json()

        if (statusResponse.ok) {
          const nextGameStatus = {
            currentRound: statusData?.currentRound ?? 1,
            totalRounds: statusData?.totalRounds ?? 1
          }

          setGameStatus(nextGameStatus)

          if (nextGameStatus.currentRound !== previousRoundRef.current) {
            previousRoundRef.current = nextGameStatus.currentRound
            setSubmittedGuesses([])
            setDraftGuess('')
            setUnscrambleGuess('')
            setScrambleWord('')
            setGamePhase('scramble')
            setErrorMessage('')
          }

          // Update the 5-minute game timer from the game's original start time.
          if (statusData?.gameStartedAt) {
            const gameStartedAt = new Date(statusData.gameStartedAt).getTime()

            const elapsedSeconds = Math.floor(
              (Date.now() - gameStartedAt) / 1000
            )

            const remainingSeconds = Math.max(0, 300 - elapsedSeconds)

            setRoundTimer(remainingSeconds)
          }

          const isGameEndedByServer = statusData?.gameEnded === true

          if (isGameEndedByServer) {
            setGamePhase('game-ended')
            setIsGameEnded(true)
            setErrorMessage('Game has ended! Tallying the scores...')
            return
          }

          const isRoundEnded = statusData?.round?.endedAt

          if (
            isRoundEnded &&
            gamePhaseRef.current !== 'timeout' &&
            lastTimeoutRoundRef.current !== nextGameStatus.currentRound
          ) {
            setGamePhase('timeout')
            setTimeoutCountdown(5)
            setErrorMessage('Time ran out! Next round is starting!')
            lastTimeoutRoundRef.current = nextGameStatus.currentRound
          }
        }
      } catch (error) {
        console.error('Unable to fetch status', error)
      }

      try {
        const scoreboardResponse = await fetch(
          `http://localhost:3000/games/${gameContext.gameId}/scoreboard`
        )
        const scoreboardData = await scoreboardResponse.json()

        if (scoreboardResponse.ok) {
          setScoreboard(
            Array.isArray(scoreboardData?.scoreboard)
              ? scoreboardData.scoreboard
              : []
          )
        }
      } catch (error) {
        console.error('Unable to fetch scoreboard', error)
      }
    }

    refreshState()
    const intervalId = window.setInterval(refreshState, 2000)

    return () => window.clearInterval(intervalId)
  }, [gameContext.gameId, isGameEnded])

  useEffect(() => {
    if (gamePhase === 'scramble') {
      inputRef.current?.focus()
    }
  }, [gamePhase])

  const rows = Array.from({ length: MAX_GUESSES }, (_, rowIndex) => {
    const submittedGuess = submittedGuesses[rowIndex]

    if (submittedGuess) {
      return {
        guess: submittedGuess.guess.padEnd(GRID_SIZE, ''),
        hints: submittedGuess.hints,
        isDraft: false
      }
    }

    if (rowIndex === submittedGuesses.length) {
      return {
        guess: draftGuess.padEnd(GRID_SIZE, ''),
        hints: null,
        isDraft: true
      }
    }

    return {
      guess: ''.padEnd(GRID_SIZE, ''),
      hints: null,
      isDraft: false
    }
  })

  const handleSubmitGuess = async () => {
    if (draftGuess.length !== GRID_SIZE) {
      setErrorMessage('Guess must be exactly 5 letters.')
      return
    }

    if (!gameContext.gameId || !gameContext.memberId) {
      setErrorMessage(
        'Missing game or player context. Start from a valid multiplayer game session.'
      )
      return
    }

    try {
      const response = await fetch(
        `http://localhost:3000/games/${gameContext.gameId}/scramble-guess`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            memberId: gameContext.memberId,
            guess: draftGuess
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(data?.error || 'Unable to submit guess.')
        return
      }

      setErrorMessage('')

      if (data?.correct === true) {
        setScrambleWord(draftGuess.toUpperCase())
        setPhaseTransitionSeconds(5)
        setUnscrambleGuess('')
        setDraftGuess('')
        setErrorMessage('Phase 2 starts in 5 seconds!')

        if (data.unscrambleStartedAt) {
          const startedAt = new Date(data.unscrambleStartedAt).getTime()
          const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000)

          const remainingSeconds = Math.max(0, 30 - elapsedSeconds)
          setUnscrambleTimer(remainingSeconds)
        }

        setGamePhase('phase-transition')
        return
      }

      const nextSubmittedGuesses = [
        ...submittedGuesses,
        {
          guess: draftGuess,
          hints: Array.isArray(data?.hints) ? data.hints : []
        }
      ]

      setSubmittedGuesses(nextSubmittedGuesses)
      setDraftGuess('')

      if (nextSubmittedGuesses.length >= MAX_GUESSES) {
        setGamePhase('waiting')
        setErrorMessage('Waiting for other players')
        setScrambleWord('')
      } else {
        inputRef.current?.focus()
      }
    } catch (error) {
      setErrorMessage(
        'Could not reach the server. Check the backend connection.'
      )
    }
  }

  const handleSubmitUnscrambleGuess = async () => {
    if (unscrambleGuess.length !== GRID_SIZE) {
      setErrorMessage('Your answer must be exactly 5 letters.')
      return
    }

    if (!gameContext.gameId || !gameContext.memberId) {
      setErrorMessage(
        'Missing game or player context. Start from a valid multiplayer game session.'
      )
      return
    }

    try {
      const response = await fetch(
        `http://localhost:3000/games/${gameContext.gameId}/unscramble-guess`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            memberId: gameContext.memberId,
            guess: unscrambleGuess
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(data?.error || 'Unable to submit answer.')
        return
      }

      if (data?.correct === true) {
        setErrorMessage('Correct! Waiting for other players')
        setGamePhase('waiting')
        setUnscrambleGuess('')
        setUnscrambleTimer(0)
        return
      }

      setErrorMessage('Not quite. Keep guessing before the timer expires.')
      setUnscrambleGuess('')
    } catch (error) {
      setErrorMessage('Could not reach the server for the final answer.')
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSubmitGuess()
      return
    }

    const key = event.key.toUpperCase()

    if (
      !/^[A-Z]$/.test(key) &&
      event.key !== 'Backspace' &&
      event.key !== 'Tab'
    ) {
      event.preventDefault()
      return
    }

    if (event.key === 'Backspace') {
      setDraftGuess(current => current.slice(0, -1))
      return
    }

    if (draftGuess.length >= GRID_SIZE) {
      event.preventDefault()
      return
    }

    if (/^[A-Z]$/.test(key)) {
      event.preventDefault()
      setDraftGuess(current => `${current}${key}`)
    }
  }

  return (
    <IonPage>
      <div className='gameplay-page'>
        <div className='gameplay-shell'>
          <div className='gameplay-header'>
            <div className='title-block'>
              <p className='eyebrow'>Battle Words</p>
              <h1 className='gameplay-title'>Scramble</h1>
            </div>
            {userName && (
              <div className='player-info'>
                <p className='player-name'>{userName}</p>
              </div>
            )}
          </div>

          <div className='status-panel'>
            <div className='status-row'>
              <span>Round</span>
              <strong>
                {gameStatus.currentRound} / {gameStatus.totalRounds}
              </strong>
            </div>
            <div className='status-row'>
              <span>Guesses</span>
              <strong>{MAX_GUESSES - submittedGuesses.length}</strong>
            </div>
            {gamePhase === 'unscramble' && (
              <div className='status-row'>
                <span>Timer</span>
                <strong>{unscrambleTimer}s</strong>
              </div>
            )}
            {gamePhase !== 'game-ended' && (
              <div className='status-row'>
                <span>Round Time</span>
                <strong>
                  {Math.floor(roundTimer / 60)}:
                  {String(roundTimer % 60).padStart(2, '0')}
                </strong>
              </div>
            )}
          </div>

          <div className='gameplay-main'>
            <div className='gameplay-stage'>
              <div className='phase-card'>
                <div className='phase-header'>
                  <span className='phase-badge'>
                    {gamePhase === 'scramble'
                      ? 'Round 1: Solve the scramble'
                      : 'Round 2: Unscramble the word'}
                  </span>
                  {gamePhase === 'unscramble' && (
                    <span className='phase-timer'>30s challenge</span>
                  )}
                </div>

                {gamePhase === 'scramble' ? (
                  <div className='board-shell'>
                    <div className='board'>
                      {rows.map((row, rowIndex) => (
                        <div
                          key={`guess-row-${rowIndex}`}
                          className='board-row'
                        >
                          {Array.from({ length: GRID_SIZE }, (_, colIndex) => {
                            const letter = row.guess[colIndex] ?? ''
                            const hint = row.hints?.[colIndex]
                            const coverage = hint
                              ? getHintSide(hint.direction)
                              : 'empty'
                            const color = hint
                              ? getHintColor(hint.range)
                              : 'transparent'

                            return (
                              <div
                                key={`cell-${rowIndex}-${colIndex}`}
                                className={`cell ${letter ? 'is-filled' : ''} ${
                                  row.isDraft ? 'is-active' : ''
                                }`}
                                data-coverage={coverage}
                                style={{ ['--cell-color' as string]: color }}
                                onClick={() => inputRef.current?.focus()}
                              >
                                <span className='cell-color' />
                                <span className='cell-letter'>{letter}</span>
                              </div>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : gamePhase === 'phase-transition' ? (
                  <div className='transition-panel'>
                    <div className='phase-transition-badge'>Phase 2!</div>
                    <h2>Guess the Scrambled Word!</h2>
                    <div className='transition-countdown'>
                      {phaseTransitionSeconds}s
                    </div>
                    <p>
                      The first phase will vanish in {phaseTransitionSeconds}{' '}
                      seconds.
                    </p>
                  </div>
                ) : gamePhase === 'unscramble' ? (
                  <div className='unscramble-panel'>
                    <div className='unscramble-word'>
                      <span>Scrambled word</span>
                      <strong>{scrambleWord || '------'}</strong>
                    </div>
                    <label className='unscramble-input-wrap'>
                      <span>Enter the word you think it is</span>
                      <input
                        type='text'
                        value={unscrambleGuess}
                        onChange={event =>
                          setUnscrambleGuess(event.target.value.toUpperCase())
                        }
                        maxLength={5}
                        placeholder='FIVE LETTERS'
                        onKeyDown={event => {
                          if (event.key === 'Enter') {
                            event.preventDefault()
                            handleSubmitUnscrambleGuess()
                          }
                        }}
                      />
                    </label>
                    <button
                      className='submit-answer-button'
                      onClick={handleSubmitUnscrambleGuess}
                    >
                      Submit answer
                    </button>
                  </div>
                ) : gamePhase === 'waiting' ? (
                  <div className='waiting-panel'>
                    <h2>Waiting for other players</h2>
                  </div>
                ) : gamePhase === 'game-ended' ? (
                  <div className='end-game-panel'>
                    <h2>Game Complete!</h2>
                    <p>Final results are showing on the scoreboard →</p>
                  </div>
                ) : (
                  <div className='waiting-panel'>
                    <h2>Time ran out! Next round is starting!</h2>
                    <div className='countdown-value'>{timeoutCountdown}s</div>
                  </div>
                )}
              </div>
            </div>

            <div className='scoreboard-panel'>
              <div className='panel-label'>Scoreboard</div>
              <div className='scoreboard-list'>
                {scoreboard.length === 0 ? (
                  <p className='empty-scoreboard'>Waiting for scores…</p>
                ) : (
                  scoreboard.map((entry, index) => (
                    <div
                      key={`${entry.username}-${index}`}
                      className='score-row'
                    >
                      <span>{entry.username}</span>
                      <strong>{entry.score}</strong>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className='error-banner' role='alert'>
              {errorMessage}
            </div>
          )}

          <div className='alphabet-bar' aria-label='alphabet selector'>
            {ALPHABET.split('').map(letter => (
              <span key={letter} className='alphabet-letter'>
                {letter}
              </span>
            ))}
          </div>

          <div className='keyboard-hint' aria-label='hint legend'>
            <span className='legend-item'>
              <span
                className='legend-swatch'
                style={{ background: '#22c55e' }}
              />{' '}
              0
            </span>
            <span className='legend-item'>
              <span
                className='legend-swatch'
                style={{ background: '#facc15' }}
              />{' '}
              1
            </span>
            <span className='legend-item'>
              <span
                className='legend-swatch'
                style={{ background: '#f97316' }}
              />{' '}
              2
            </span>
            <span className='legend-item'>
              <span
                className='legend-swatch'
                style={{ background: '#ef4444' }}
              />{' '}
              3-7
            </span>
            <span className='legend-item'>
              <span
                className='legend-swatch'
                style={{ background: '#3b82f6' }}
              />{' '}
              8-12
            </span>
            <span className='legend-item'>
              <span
                className='legend-swatch'
                style={{ background: '#a855f7' }}
              />{' '}
              13-17
            </span>
            <span className='legend-item'>
              <span
                className='legend-swatch'
                style={{ background: '#a16207' }}
              />{' '}
              18-22
            </span>
            <span className='legend-item'>
              <span
                className='legend-swatch'
                style={{ background: '#111827' }}
              />{' '}
              23-25
            </span>
          </div>

          <input
            ref={inputRef}
            type='text'
            value={draftGuess}
            onChange={() => undefined}
            onKeyDown={handleKeyDown}
            aria-label='Guess input'
            className='sr-only-input'
            autoFocus
          />
        </div>
      </div>
    </IonPage>
  )
}

export default Gameplay
