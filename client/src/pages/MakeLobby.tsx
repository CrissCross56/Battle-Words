import {IonPage, IonTitle, IonButton} from '@ionic/react';

const MakeLobby: React.FC = () => {
    return (
        <IonPage>
            <IonTitle>Make Lobby</IonTitle>
            <IonButton routerLink="/game-lobby">Go to Game Lobby</IonButton>
        </IonPage>
    )
}

export default MakeLobby;