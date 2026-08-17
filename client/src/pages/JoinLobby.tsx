// client/src/pages/JoinLobby.tsx
// Join an existing game lobby with API integration

import { useState } from 'react'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
} from '@ionic/react'
import { useIonRouter } from '@ionic/react'
import { useGameStore } from '../store/gameStore'

const JoinLobby: React.FC = () => {
  const router = useIonRouter()
  const [roomCode, setRoomCode] = useState('')
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const setRoom = useGameStore((state) => state.setRoom)
  const addPlayer = useGameStore((state) => state.addPlayer)

  const joinRoom = async () => {
    if (!roomCode.trim() || !username.trim()) {
      setError('Please enter both a room code and username')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`http://localhost:3000/rooms/${roomCode.trim().toUpperCase()}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          role: 'PLAYER',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to join room')
      }

      await response.json()

      setRoom(roomCode.trim().toUpperCase())
      addPlayer(username.trim())

      router.push(`/game-lobby/${roomCode.trim().toUpperCase()}`)

    } catch (err) {
      console.error('Error joining room:', err)
      setError(err instanceof Error ? err.message : 'Failed to join room. Please check the room code.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Join Lobby</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonText>
          <h2>Join a Game</h2>
          <p>Enter the room code and your username to join.</p>
        </IonText>

        <IonItem>
          <IonLabel position="stacked">Room Code</IonLabel>
          <IonInput
            value={roomCode}
            placeholder="Enter room code"
            onIonInput={(e) => setRoomCode(e.detail.value?.toUpperCase() || '')}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Username</IonLabel>
          <IonInput
            value={username}
            placeholder="Enter your username"
            onIonInput={(e) => setUsername(e.detail.value || '')}
          />
        </IonItem>

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        <IonButton
          expand="block"
          onClick={joinRoom}
          disabled={isLoading || !roomCode.trim() || !username.trim()}
        >
          {isLoading ? 'Joining...' : 'Join Lobby'}
        </IonButton>
      </IonContent>
    </IonPage>
  )
}

export default JoinLobby