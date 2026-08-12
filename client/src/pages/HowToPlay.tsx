// src/pages/HowToPlay.tsx
// This page displays the game rules and instructions for new players.

import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonText,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react'
import { useIonRouter } from '@ionic/react'

const HowToPlay = () => {
  const router = useIonRouter()

  const goBack = () => {
    router.goBack()
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>How To Play</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonText>
          <h2>Battle-Words</h2>
          <p>A realtime multiplayer word game.</p>
        </IonText>

        <IonText>
          <h3>Objective</h3>
          <p>
            Be the first player to reach the target score by finding letters and unscrambling words faster
            than your opponents.
          </p>
        </IonText>

        <IonText>
          <h3>How It Works</h3>
          <IonList>
            <IonItem>
              <IonLabel>
                <strong>1. Create or Join a Room</strong>
                <p>Create a new game room or join an existing one with a room code.</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <strong>2. Wait for the Host to Start</strong>
                <p>The host starts the game when all players are ready.</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <strong>3. Find the Letters</strong>
                <p>
                  The game shows you a scrambled word, but you don't have to guess the whole word at once.
                  Instead, you guess individual letters. The closer your guess is to the correct letter,
                  the brighter the color feedback. Use the color clues to find each letter in order.
                  Each correct letter you find gets locked in, making the unscramble easier.
                </p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <strong>4. Unscramble the Word</strong>
                <p>
                  Once all the letters are revealed, unscramble them to form the correct word.
                  This plays like a classic word unscramble game — arrange the letters in the right order
                  to match the target word. The faster you unscramble, the more points you earn.
                </p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <strong>5. The Game Pauses After Each Word</strong>
                <p>
                  After a word is unscrambled, the game pauses briefly to allow other players to submit their answers.
                  Then the next word loads automatically.
                </p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <strong>6. Win the Game</strong>
                <p>
                  The first player to reach the target score wins the game.
                  A leaderboard is displayed showing the final rankings.
                </p>
                <p>
                  <em>Note: Point system details are still being finalized.</em>
                </p>
              </IonLabel>
            </IonItem>
          </IonList>
        </IonText>

        <IonText>
          <h3>Tips</h3>
          <ul>
            <li>Think fast — the faster you find letters and unscramble, the more points you earn.</li>
            <li>Pay attention to color feedback — it tells you how close your guess is to the correct letter.</li>
            <li>Each correct letter you find gets locked in, so focus on one letter at a time.</li>
          </ul>
        </IonText>

        <IonButton expand="block" color="medium" onClick={goBack}>
          Back to Menu
        </IonButton>
      </IonContent>
    </IonPage>
  )
}

export default HowToPlay