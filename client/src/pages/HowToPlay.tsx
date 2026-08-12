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
          <IonTitle>🤔 How To Play</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonText>
          <h2>⚔️ Battle Words ⚔️</h2>
          <p>A realtime multiplayer word guessing game.</p>
        </IonText>

        <IonText>
          <h3>🎯 Objective</h3>
          <p>Be the first to unscramble the word and score the most points!</p>
        </IonText>

        <IonText>
          <h3>📋 How It Works</h3>
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
                <strong>3. Guess the Scrabled Letters</strong>
                <p>Five empty boxes will appear. Type your guesses and submit it — the first to correctly guess the scmabled letters, scores points!</p>
              </IonLabel>
            </IonItem>
            <IonItem>
                <IonLabel>
                    <strong>4.Unscramble the Letters! </strong>
                    <p>Now unscramble the letter soup, and try to find the correct word. Best of luck..</p>
             </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <strong>5. Chain Through The Scramble</strong>
                <p>After a word is guessed, the next scrambled word loads automatically. Keep going until all words are used.</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <strong>6. Win the Game</strong>
                <p>The player with the most points at the end of 5 rounds, wins!</p>
              </IonLabel>
            </IonItem>
          </IonList>
        </IonText>

        <IonText>
          <h3>💡 Tips</h3>
          <ul>
            <li>The colors don't lie chico - the brighter the color the closer you are!</li>
            <li>Think fast — the first correct scrambled guess gets bonus point!</li>
            <li>Save on guesses - less guesses = more bonus points awareded!</li>
            <li>Stay focused — time can run out from you very quickly!</li>
            <li>Communicate with your team - if you're playing in a group, work together!</li>
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