// client/src/pages/Game.tsx
import { useState, useEffect } from 'react'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonText,
  IonSpinner,
} from '@ionic/react'
import { useIonRouter } from '@ionic/react'
import { useParams } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import './Game.css'

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
]

const MAX_GUESSES = 6
const WORD_LENGTH = 5

const Game: React.FC = () => {
  const router = useIonRouter()
  const { roomCode } = useParams<{ roomCode: string }>()
  const [guesses, setGuesses] = useState<string[][]>([])
  const [colors, setColors] = useState<string[][]>([])
  const [currentRow, setCurrentRow] = useState(0)
  const [currentCol, setCurrentCol] = useState(0)

  // Dual-box UI state
  const [currentLetter, setCurrentLetter] = useState('')
  const [letterFeedback, setLetterFeedback] = useState<'left' | 'right' | 'correct' | null>(null)

  // Game state from store
  const currentWord = useGameStore((state) => state.currentWord)
  const scrambledWord = useGameStore((state) => state.scrambledWord)
  const players = useGameStore((state) => state.players)
  const scores = useGameStore((state) => state.scores)
  const gameStatus = useGameStore((state) => state.gameStatus)
  const round = useGameStore((state) => state.round)
  const maxRounds = useGameStore((state) => state.maxRounds)
  const timer = useGameStore((state) => state.timer)
  const isTimerActive = useGameStore((state) => state.isTimerActive)
  const updateScore = useGameStore((state) => state.updateScore)

  // Initialize grid
  useEffect(() => {
    const emptyGrid = Array.from({ length: MAX_GUESSES }, () => Array(WORD_LENGTH).fill(''))
    const emptyColors = Array.from({ length: MAX_GUESSES }, () => Array(WORD_LENGTH).fill(''))
    setGuesses(emptyGrid)
    setColors(emptyColors)
  }, [])

  // Handle keyboard input
  const handleLetter = (letter: string) => {
    if (letter === 'Enter') {
      // Submit guess
      const guess = guesses[currentRow].join('')
      if (guess.length === WORD_LENGTH && currentWord) {
        // Check guess against current word
        const result = checkGuess(guess, currentWord)
        const newColors = [...colors]
        newColors[currentRow] = result
        setColors(newColors)
        setCurrentRow(currentRow + 1)
        setCurrentCol(0)
        // Update scores if correct
        if (result.every(c => c === 'green')) {
          updateScore('player', 1000) // TODO: Replace with actual player
        }
      }
      return
    }

    if (letter === 'Backspace') {
      if (currentCol > 0) {
        const newGuesses = [...guesses]
        newGuesses[currentRow][currentCol - 1] = ''
        setGuesses(newGuesses)
        setCurrentCol(currentCol - 1)
      }
      return
    }

    if (currentCol < WORD_LENGTH) {
      const newGuesses = [...guesses]
      newGuesses[currentRow][currentCol] = letter
      setGuesses(newGuesses)
      setCurrentCol(currentCol + 1)
      setCurrentLetter(letter)
      // Simulate dual-box feedback
      const random = Math.random()
      if (random < 0.33) setLetterFeedback('left')
      else if (random < 0.66) setLetterFeedback('right')
      else setLetterFeedback('correct')
    }
  }

  const checkGuess = (guess: string, target: string): string[] => {
    const result: string[] = []
    const targetArr = target.split('')
    const guessArr = guess.split('')
    const used = new Array(WORD_LENGTH).fill(false)

    // Check green
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guessArr[i] === targetArr[i]) {
        result[i] = 'green'
        used[i] = true
      }
    }

    // Check yellow
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (result[i] !== 'green') {
        let found = false
        for (let j = 0; j < WORD_LENGTH; j++) {
          if (!used[j] && guessArr[i] === targetArr[j]) {
            found = true
            used[j] = true
            break
          }
        }
        result[i] = found ? 'yellow' : 'gray'
      }
    }
    return result
  }

  const goBack = () => router.push(`/game-lobby/${roomCode}`)

  if (!currentWord) {
    return (
      <IonPage>
        <IonContent className="ion-padding" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <IonSpinner name="crescent" />
          <IonText className="ion-padding-start">Loading game...</IonText>
        </IonContent>
      </IonPage>
    )
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Battle-Words</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonGrid>
          {/* Game Grid */}
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="8" sizeLg="6">
              <div className="game-grid">
                {guesses.map((row, rowIndex) => (
                  <IonRow key={rowIndex} className="ion-justify-content-center">
                    {row.map((letter, colIndex) => (
                      <IonCol key={colIndex} size="auto">
                        <div className={`cell ${colors[rowIndex]?.[colIndex] || 'cell-empty'}`}>
                          {letter}
                        </div>
                      </IonCol>
                    ))}
                  </IonRow>
                ))}
              </div>
            </IonCol>
          </IonRow>

          {/* Dual-Box UI */}
          <IonRow className="ion-justify-content-center ion-margin-top">
            <IonCol size="12" sizeMd="8" sizeLg="6">
              <div className="letter-hint-container">
                <div className="letter-box upper">
                  <span className="letter">{currentLetter || '?'}</span>
                </div>
                <div className="letter-box lower">
                  <div
                    className={`color-fill ${letterFeedback === 'correct' ? 'full' : ''}`}
                    style={{
                      width: letterFeedback === 'left' ? '50%' : letterFeedback === 'right' ? '50%' : '0%',
                      marginRight: letterFeedback === 'right' ? '0' : 'auto',
                      marginLeft: letterFeedback === 'left' ? '0' : 'auto',
                    }}
                  />
                </div>
              </div>
            </IonCol>
          </IonRow>

          {/* Scrambled Word Display */}
          <IonRow className="ion-justify-content-center ion-margin-top">
            <IonCol size="12" sizeMd="8" sizeLg="6">
              <div className="scrambled-display">
                <IonText>
                  <h3>Scrambled Word:</h3>
                  <p className="scrambled-word">{scrambledWord || '?????'}</p>
                </IonText>
              </div>
            </IonCol>
          </IonRow>

          {/* Round & Timer */}
          <IonRow className="ion-justify-content-center ion-margin-top">
            <IonCol size="12" sizeMd="8" sizeLg="6">
              <div className="game-info">
                <IonText>
                  <p>Round: <strong>{round}</strong> / {maxRounds}</p>
                  <p>Time: <strong>{timer}</strong>s {isTimerActive ? '⏳' : ''}</p>
                </IonText>
              </div>
            </IonCol>
          </IonRow>

          {/* Scores */}
          <IonRow className="ion-justify-content-center ion-margin-top">
            <IonCol size="12" sizeMd="8" sizeLg="6">
              <div className="scores-container">
                <IonText><h4>Scores</h4></IonText>
                {players.length === 0 ? (
                  <p>No players</p>
                ) : (
                  players.map((p) => (
                    <div key={p.id} className="player-score">
                      <span>{p.username} {p.isHost && '👑'}</span>
                      <span className="score-value">{scores[p.username] || 0}</span>
                    </div>
                  ))
                )}
              </div>
            </IonCol>
          </IonRow>

          {/* Keyboard */}
          <IonRow className="ion-justify-content-center ion-margin-top">
            <IonCol size="12" sizeMd="8" sizeLg="6">
              <div className="keyboard">
                {KEYBOARD_ROWS.map((row, rowIndex) => (
                  <div key={rowIndex} className="keyboard-row">
                    {row.map((key) => (
                      <button
                        key={key}
                        className="key"
                        onClick={() => handleLetter(key)}
                      >
                        {key === 'Enter' ? '↵' : key === 'Backspace' ? '⌫' : key}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </IonCol>
          </IonRow>

          {/* Go Back Button */}
          <IonRow className="ion-justify-content-center ion-margin-top">
            <IonCol size="12" sizeMd="8" sizeLg="6">
              <IonButton expand="block" color="medium" onClick={goBack}>
                Back to Lobby
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default Game