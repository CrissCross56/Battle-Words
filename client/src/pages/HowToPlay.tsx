// client/src/pages/HowToPlay.tsx
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
  IonCard,
  IonCardContent,
} from '@ionic/react'
import { useIonRouter } from '@ionic/react'
import '../styles/HowToPlay.css'

const HowToPlay: React.FC = () => {
  const router = useIonRouter()

  const goBack = () => {
    router.goBack()
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>⚔️ How To Play</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard className="card-shadow how-to-play-card">
          <IonCardContent>
            <IonText>
              <h2>Battle-Words</h2>
              <p>A realtime multiplayer word game in two phases.</p>
            </IonText>

            {/* ===== OBJECTIVE ===== */}
            <IonText>
              <h3>🎯 Objective</h3>
              <p>
                Be the first player to reach the target score by unscrambling words
                and guessing the correct answer faster than your opponents.
              </p>
            </IonText>

            {/* ===== HOW IT WORKS ===== */}
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
                    <strong>3. Phase 1 — Find the Letters</strong>
                    <p>
                      The game shows you a scrambled 5‑letter word. You have up to <strong>5 guesses</strong> to find the correct letters.
                      As you type each letter, a <strong>dual‑box</strong> below the grid gives you color feedback:
                    </p>
                    <ul>
                      <li>🟢 Left half fills green → your guess is alphabetically to the <strong>left</strong> of the correct letter.</li>
                      <li>🟢 Right half fills green → your guess is alphabetically to the <strong>right</strong> of the correct letter.</li>
                      <li>🟢 Both halves turn green → you found the correct letter!</li>
                    </ul>
                    <p>
                      Use this feedback to narrow down each letter and solve the scramble as fast as possible.
                    </p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <strong>4. Phase 2 — Guess the Word</strong>
                    <p>
                      Once you solve the scramble, a <strong>30‑second timer</strong> starts. You must now guess the original English word.
                    </p>
                    <ul>
                      <li>✅ Correct guess → +1 point</li>
                      <li>❌ Wrong guess or time expires → 0 points</li>
                    </ul>
                    <p>
                      The game pauses after each word to let other players submit their answers before the next round begins.
                    </p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <strong>5. Round End & Next Round</strong>
                    <p>
                      The round ends when all players have finished or the timer runs out.
                      A new scrambled word appears for the next round.
                    </p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <strong>6. Win the Game</strong>
                    <p>
                      The player with the most points after all rounds wins!
                      A final scoreboard shows the rankings.
                    </p>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonText>

            {/* ===== TIPS ===== */}
            <IonText>
              <h3>💡 Tips</h3>
              <ul>
                <li>Use the dual‑box color feedback to find each letter faster — the left/right fill tells you exactly where the correct letter is.</li>
                <li>Be quick in Phase 2 — the 30‑second timer is tight and there's no second chance.</li>
                <li>Communicate with your team if you're playing in a group — sharing letter positions can help everyone.</li>
              </ul>
            </IonText>

            <IonButton expand="block" color="medium" onClick={goBack}>
              Back to Menu
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default HowToPlay