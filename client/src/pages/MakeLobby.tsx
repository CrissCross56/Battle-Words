// client/src/pages/MakeLobby.tsx
// Create a new game lobby with API integration

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
  IonSelect,
  IonSelectOption,
} from '@ionic/react'
import { useIonRouter } from '@ionic/react'
import { useGameStore } from '../store/gameStore'

const MakeLobby: React.FC = () => {
  const router = useIonRouter()
  const [username, setUsername] = useState('')
  const [totalRounds, setTotalRounds] = useState(3)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const setRoom = useGameStore((state) => state.setRoom)
  const addPlayer = useGameStore((state) => state.addPlayer)

  const createRoom = async () => {
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Step 1: Create the room
      const roomResponse = await fetch('http://localhost:3000/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!roomResponse.ok) {
        throw new Error('Failed to create room')
      }

      const room = await roomResponse.json()
      console.log('Room created:', room)

      // Step 2: Join the room as host
      const joinResponse = await fetch(`http://localhost:3000/rooms/${room.code}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          role: 'PLAYER',
        }),
      })

      if (!joinResponse.ok) {
        throw new Error('Failed to join room')
      }

      await joinResponse.json()

      // Step 3: Update Zustand store
      setRoom(room.code)
      addPlayer(username.trim())

      // Step 4: Navigate to the lobby
      router.push(`/game-lobby/${room.code}`)

    } catch (err) {
      console.error('Error creating room:', err)
      setError('Failed to create room. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Make Lobby</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonText>
          <h2>Create a Game</h2>
          <p>Enter your username and choose the number of rounds.</p>
        </IonText>

        <IonItem>
          <IonLabel position="stacked">Username</IonLabel>
          <IonInput
            value={username}
            placeholder="Enter your username"
            onIonInput={(e) => setUsername(e.detail.value || '')}
          />
        </IonItem>

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
          onClick={createRoom}
          disabled={isLoading || !username.trim()}
        >
          {isLoading ? 'Creating...' : 'Create Lobby'}
        </IonButton>
      </IonContent>
    </IonPage>
  )
}

export default MakeLobby