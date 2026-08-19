// client/src/pages/Home.tsx
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
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Battle Words</IonTitle>
          {/* Dark mode toggle is now in App.tsx — no need here */}
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
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default Home