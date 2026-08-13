// src/pages/Game.tsx
// The main game page where players guess words.
// This is a UI-focused component — logic will be integrated later.

import { useState } from 'react'
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
  IonIcon,
} from '@ionic/react'
import { useIonRouter } from '@ionic/react'

// Dummy game state for UI development
const DUMMY_GUESSES = [
  ['C', 'R', 'A', 'N', 'E'],
  ['R', 'E', 'A', 'C', 'T'],
  ['T', 'R', 'E', 'A', 'D'],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
]

const DUMMY_COLORS = [
  ['green', 'green', 'green', 'green', 'green'],
  ['green', 'green', 'green', 'green', 'green'],
  ['yellow', 'green', 'yellow', 'green', 'gray'],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
]

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
]

const Game: React.FC = () => {
  const router = useIonRouter()
  const [guesses] = useState(DUMMY_GUESSES)
  const [colors] = useState(DUMMY_COLORS)

  // Temporary: go back to home
  const goHome = () => {
    router.push('/')
  }

  // Determine the color class for each cell
  const getColorClass = (color: string) => {
    if (!color) return 'cell-empty'
    if (color === 'green') return 'cell-green'
    if (color === 'yellow') return 'cell-yellow'
    if (color === 'gray') return 'cell-gray'
    return 'cell-empty'
  }

  // Determine the color for keyboard keys
  const getKeyColor = (letter: string) => {
    // For demo: assign some dummy colors
    const keyColors: Record<string, string> = {
      C: 'green',
      R: 'green',
      A: 'green',
      N: 'green',
      E: 'green',
      T: 'yellow',
      D: 'gray',
    }
    return keyColors[letter] || ''
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
                        <div
                          className={`cell ${getColorClass(colors[rowIndex]?.[colIndex] || '')}`}
                        >
                          {letter}
                        </div>
                      </IonCol>
                    ))}
                  </IonRow>
                ))}
              </div>
            </IonCol>
          </IonRow>

          {/* Scores */}
          <IonRow className="ion-justify-content-center ion-margin-top">
            <IonCol size="12" sizeMd="8" sizeLg="6">
              <IonText>
                <h4>🏆 Scores</h4>
              </IonText>
              <div className="scores">
                <div>
                  <strong>Player 1:</strong> 1000
                </div>
                <div>
                  <strong>Player 2:</strong> 750
                </div>
                <div>
                  <strong>Player 3:</strong> 500
                </div>
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
                        className={`key key-${getKeyColor(key)}`}
                      >
                        {key === 'Enter' ? '↵' : key === 'Backspace' ? '⌫' : key}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </IonCol>
          </IonRow>

          {/* Temporary: Back to Home */}
          <IonRow className="ion-justify-content-center ion-margin-top">
            <IonCol size="12" sizeMd="8" sizeLg="6">
              <IonButton expand="block" color="medium" onClick={goHome}>
                Back to Home (Temporary)
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default Game