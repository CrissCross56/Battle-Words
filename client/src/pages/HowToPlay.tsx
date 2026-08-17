// client/src/pages/HowToPlay.tsx
// Battle-Words How To Play — Updated with Hao-Bin's full game rules

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
  IonChip,
} from '@ionic/react'
import { useIonRouter } from '@ionic/react'

const HowToPlay: React.FC = () => {
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
          <p>A realtime multiplayer word game in two phases.</p>
        </IonText>

        <IonText>
          <h3>🎯 Objective</h3>
          <p>
            Be the first player to reach the target score by unscrambling words
            and guessing the correct answer faster than your opponents.
          </p>
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
                <strong>2. Host Sets the Rounds</strong>
                <p>The host chooses between 1–5 rounds before starting the game.</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <strong>3. Phase 1 — Unscramble the Letters</strong>
                <p>
                  A scrambled 5‑letter word is shown. You have <strong>5 guesses</strong> to
                  unscramble it. Each guess gives you color feedback:
                </p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <IonChip color="success">🟢 Correct letter, right position</IonChip>
                  <IonChip color="warning">🟡 Correct letter, wrong position</IonChip>
                  <IonChip color="danger">🔴 Letter not in the word</IonChip>
                </div>
                <p style={{ marginTop: '8px' }}>
                  Solve it → <strong>earn scramble points</strong> (bonus if you're first!)
                </p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <strong>4. Dual‑Box Color Feedback</strong>
                <p>
                  As you type each letter, the dual‑box below the grid shows you
                  how close your guess is to the correct letter:
                </p>
                <ul>
                  <li><strong>Left fill</strong> → your guess is alphabetically to the left</li>
                  <li><strong>Right fill</strong> → your guess is alphabetically to the right</li>
                  <li><strong>Full green</strong> → you found the correct letter!</li>
                </ul>
                <p>Use this to narrow down each letter faster.</p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <strong>5. Phase 2 — Guess the Word</strong>
                <p>
                  Once you unscramble the letters, a <strong>30‑second timer</strong> starts
                  for you. You must guess the original English word.
                </p>
                <p>
                  ✅ Correct → +1 point<br />
                  ❌ Wrong / Time expires → 0 points
                </p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <strong>6. Round End & Next Round</strong>
                <p>
                  The round ends when all players have finished or the timer runs out.
                  A new scrambled word appears for the next round.
                </p>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <strong>7. Win the Game</strong>
                <p>
                  The player with the most points after all rounds wins!
                  A final scoreboard shows the rankings.
                </p>
              </IonLabel>
            </IonItem>
          </IonList>
        </IonText>

        <IonText>
          <h3>💡 Tips</h3>
          <ul>
            <li>Use the dual‑box color feedback to find each letter faster.</li>
            <li>Be quick in Phase 2 — the 30‑second timer is tight!</li>
            <li>Communicate with your team if playing in a group.</li>
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