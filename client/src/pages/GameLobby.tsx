import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonList, IonItem, IonLabel } from '@ionic/react'
import { useGameStore } from '../store/gameStore'

const GameLobby: React.FC = () => {
  // Get realtime game state from Zustand store
  const roomCode = useGameStore((state) => state.roomCode)
  const players = useGameStore((state) => state.players)
  const scores = useGameStore((state) => state.scores)
  const currentWord = useGameStore((state) => state.currentWord)
  const gameStatus = useGameStore((state) => state.gameStatus)

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Game Lobby</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonText>
          <h2>Room: {roomCode || 'Not set'}</h2>
          <p>Status: <strong>{gameStatus}</strong></p>
        </IonText>

        <IonText>
          <h3>Players</h3>
          <IonList>
            {players.length === 0 ? (
              <IonItem>
                <IonLabel>No players yet</IonLabel>
              </IonItem>
            ) : (
              players.map((player, index) => (
                <IonItem key={index}>
                  <IonLabel>
                    {player} — Score: {scores[player] || 0}
                  </IonLabel>
                </IonItem>
              ))
            )}
          </IonList>
        </IonText>

        <IonText>
          <h3>Current Word</h3>
          <p>{currentWord || 'Waiting for game to start...'}</p>
        </IonText>
      </IonContent>
    </IonPage>
  )
}

export default GameLobby