// client/src/pages/GameLobby.tsx
// The waiting room before the game starts

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
  IonSelect,
  IonSelectOption,
} from '@ionic/react'
import { useIonRouter } from '@ionic/react'
import { useParams } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'

interface Player {
  id: string
  username: string
  role: string
}

const GameLobby: React.FC = () => {
  const router = useIonRouter()
  const { roomCode } = useParams<{ roomCode: string }>()
  const [players, setPlayers] = useState<Player[]>([])
  const [isHost, setIsHost] = useState(false)
  const [totalRounds, setTotalRounds] = useState(3)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const roomCodeStore = useGameStore((state) => state.roomCode)

  useEffect(() => {
    if (roomCode) {
      fetchRoomStatus()
    }
  }, [roomCode])

  const fetchRoomStatus = async () => {
    try {
      console.log('Fetching room status for:', roomCode)
    } catch (err) {
      console.error('Error fetching room status:', err)
    }
  }

  const startGame = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`http://localhost:3000/games/${roomCode}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalRounds }),
      })

      if (!response.ok) {
        throw new Error('Failed to start game')
      }

      const game = await response.json()
      console.log('Game started:', game)

      router.push(`/game/${roomCode}`)

    } catch (err) {
      console.error('Error starting game:', err)
      setError('Failed to start game. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Game Lobby</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonText>
          <h2>Room: {roomCode || roomCodeStore}</h2>
          <p>Waiting for players to join...</p>
        </IonText>

        <IonText>
          <h3>Players</h3>
          <IonList>
            <IonItem>
              <IonLabel>Host (You)</IonLabel>
              <IonChip color="primary">Host</IonChip>
            </IonItem>
            <IonItem>
              <IonLabel>Waiting for players...</IonLabel>
            </IonItem>
          </IonList>
        </IonText>

        {isHost && (
          <>
            <IonText>
              <h3>Game Settings</h3>
            </IonText>
            <IonItem>
              <IonLabel position="stacked">Number of Rounds</IonLabel>
              <IonSelect
                value={totalRounds}
                onIonChange={(e) => setTotalRounds(Number(e.detail.value))}
              >
                <IonSelectOption value={1}>1 Round</IonSelectOption>
                <IonSelectOption value={2}>2 Rounds</IonSelectOption>
                <IonSelectOption value={3}>3 Rounds</IonSelectOption>
                <IonSelectOption value={4}>4 Rounds</IonSelectOption>
                <IonSelectOption value={5}>5 Rounds</IonSelectOption>
              </IonSelect>
            </IonItem>

            {error && (
              <IonText color="danger">
                <p>{error}</p>
              </IonText>
            )}

            <IonButton
              expand="block"
              color="success"
              onClick={startGame}
              disabled={isLoading}
            >
              {isLoading ? 'Starting...' : 'Start Game'}
            </IonButton>
          </>
        )}
      </IonContent>
    </IonPage>
  )
}

export default GameLobby