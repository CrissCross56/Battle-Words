import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonRippleEffect } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Battle Words</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Battle Words</IonTitle>
          </IonToolbar>
        </IonHeader>
        {/* make a form here with react hook form that has 2 buttons for 
        routing to either the join lobby page or the create lobby page. The form should have a text input for the user to enter their name and a select input for the user to choose a lobby to join. The form should also have a submit button that will route the user to the appropriate page based on their selection. */}
        <IonButton routerLink="/join-lobby">Join Lobby</IonButton>
        <IonButton routerLink="/make-lobby">Make Lobby</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
