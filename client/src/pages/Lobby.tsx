// client/src/pages/Lobby.tsx

// Grant - Add the appropriate ones for this.
//      router.push(`/lobby/${roomCode}`)
//      router.push(`/lobby/${roomCode}`)

import { useEffect, useState } from 'react'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonText,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonChip,
} from '@ionic/react'
import { useIonRouter } from '@ionic/react'
import { useParams } from 'react-router-dom'

interface Player {
  id: string
  username: string
  isHost: boolean
  isReady: boolean
}

const Lobby: React.FC = () => {
  const router = useIonRouter()
  const { roomCode } = useParams<{ roomCode: string }>()
  const [players, setPlayers] = useState<Player[]>([])
  const [isHost, setIsHost] = useState(false)

  // TODO: Fetch players from backend
  useEffect(() => {
    // Replace with actual API call
    setPlayers([
      { id: '1', username: 'You', isHost: true, isReady: true },
      { id: '2', username: 'Guest 1', isHost: false, isReady: true },
      { id: '3', username: 'Guest 2', isHost: false, isReady: false },
    ])
    setIsHost(true)
  }, [roomCode])

  const startGame = () => {
    // TODO: Call POST /games/:roomCode/start
    console.log('Start game!')
  }

  const goBack = () => router.goBack()

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Game Lobby</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonText>
          <h2>Room: {roomCode}</h2>
          <p>Share this code with friends to join.</p>
        </IonText>

        <IonText>
          <h3>Players ({players.length})</h3>
        </IonText>
        <IonList>
          {players.map((player) => (
            <IonItem key={player.id}>
              <IonLabel>
                {player.isHost}
                {player.username}
              </IonLabel>
              {player.isHost ? (
                <IonChip color="primary">Host</IonChip>
              ) : player.isReady ? (
                <IonChip color="success">Ready</IonChip>
              ) : (
                <IonChip color="medium">Waiting...</IonChip>
              )}
            </IonItem>
          ))}
        </IonList>

        {!isHost && (
          <IonText color="medium">
            <p>Waiting for the host to start the game...</p>
          </IonText>
        )}

        {isHost && (
          <IonButton expand="block" color="success" onClick={startGame}>
            Start Game
          </IonButton>
        )}

        <IonButton expand="block" color="medium" onClick={goBack}>
          Back to Home
        </IonButton>
      </IonContent>
    </IonPage>
  )
}

export default Lobby