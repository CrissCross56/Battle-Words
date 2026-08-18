import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonRippleEffect } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { usePlayerStore } from '../store/gameStore';

const Home: React.FC = () => {
  const {isHost, setHost} = usePlayerStore()
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>⚔️ Battle Words ⚔️</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Battle Words</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonButton routerLink="/join-lobby" onClick={(e)=>{setHost(false)}}>Join Lobby</IonButton>
        <IonButton routerLink="/make-lobby" onClick={(e)=>{setHost(true)}}>Make Lobby</IonButton>
        <IonButton routerLink="/how-to-play">How to Play!</IonButton>
        <IonButton routerLink="/lobby/TEST1234">Go to Lobby (Test)</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;