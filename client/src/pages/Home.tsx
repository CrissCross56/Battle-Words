// client/src/pages/Home.tsx
import { useState } from 'react'
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonText,
  IonCard,
  IonCardContent,
} from '@ionic/react'
import '../styles/Home.css'

const Home: React.FC = () => {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'))

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark')
    setIsDark(!isDark)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Battle Words</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard className="card-shadow">
          <IonCardContent className="ion-text-center">
            <IonText>
              <h1>⚔️ Battle Words ⚔️</h1>
              <p>A realtime multiplayer word game.</p>
            </IonText>
          </IonCardContent>
        </IonCard>

        <IonCard className="card-shadow">
          <IonCardContent>
            {/* Two buttons side by side */}
            <div className="button-row">
              <IonButton className="button-primary" routerLink="/make-lobby">
                Make Lobby
              </IonButton>
              <IonButton className="button-primary" routerLink="/join-lobby">
                Join Lobby
              </IonButton>
            </div>

            <IonButton expand="block" fill="outline" routerLink="/how-to-play">
              How to Play
            </IonButton>

            <IonButton
              expand="block"
              color="medium"
              fill="clear"
              onClick={toggleDarkMode}
              style={{ marginTop: '1rem' }}
            >
              {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default Home