import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton
} from '@ionic/react'
import './Home.css'

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Battle Words </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse='condense'>
          <IonToolbar>
            <IonTitle size='large'>Battle Words</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonButton routerLink='/join-lobby'>Join Lobby</IonButton>
        <IonButton routerLink='/make-lobby'>Make Lobby</IonButton>
        <IonButton routerLink='/how-to-play'>How to Play!</IonButton>
      </IonContent>
    </IonPage>
  )
}

export default Home
