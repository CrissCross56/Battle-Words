import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonRippleEffect } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {
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
        <IonButton routerLink="/join-lobby">Join Lobby</IonButton>
        <IonButton routerLink="/make-lobby">Make Lobby</IonButton>
        <IonButton routerLink="/how-to-play">How to Play!</IonButton>
        <IonButton routerLink="/lobby/TEST1234">Go to Lobby (Test)</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;