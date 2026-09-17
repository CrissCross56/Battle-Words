import { IonContent, IonPage, IonButton } from '@ionic/react'
import './Home.css'

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen className='home-content'>
        <div className='home-container'>
          <div className='home-hero'>
            <h1>Battle Words</h1>
            <p>
              Challenge your friends, scramble words, and be the first player to
              solve them.
            </p>
          </div>

          <div className='home-actions'>
            <IonButton expand='block' size='large' routerLink='/make-lobby'>
              Make a Lobby
            </IonButton>

            <IonButton
              expand='block'
              size='large'
              fill='outline'
              routerLink='/join-lobby'
            >
              Join a Lobby
            </IonButton>

            <IonButton expand='block' fill='clear' routerLink='/how-to-play'>
              How to Play
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Home
