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
} from '@ionic/react'
import './Home.css'

const Home: React.FC = () => {
  const [isDark, setIsDark] = useState(document.body.classList.contains('dark'))

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark')
    setIsDark(!isDark)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>⚔️ Battle Words ⚔️</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonText>
          <h2>Welcome to Battle-Words</h2>
          <p>A realtime multiplayer word game.</p>
        </IonText>

        <IonButton expand="block" routerLink="/join-lobby">
          Join Lobby
        </IonButton>

        <IonButton expand="block" routerLink="/make-lobby">
          Make Lobby
        </IonButton>

        <IonButton expand="block" routerLink="/how-to-play">
          How to Play
        </IonButton>

        <IonButton
          expand="block"
          color="medium"
          onClick={toggleDarkMode}
          style={{ marginTop: '2rem' }}
        >
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </IonButton>
      </IonContent>
    </IonPage>
  )
}

export default Home