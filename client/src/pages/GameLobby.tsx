// client/src/pages/GameLobby.tsx
import { useState, useEffect } from 'react'
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
  IonSpinner,
} from '@ionic/react'
import { useIonRouter } from '@ionic/react'
import { useParams } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'

const GameLobby: React.FC = () => {
  const router = useIonRouter()
  const { roomCode } = useParams<{ roomCode: string }>()
  const [totalRounds, setTotalRounds] = useState(3)
  const [isStarting, setIsStarting] = useState(false)
  const [error, setError] = useState('')
  const [members, setMembers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isHost, setIsHost] = useState(false)

  const roomCodeFromStore = useGameStore((state) => state.roomCode)
  const roomMembers = useGameStore((state) => state.roomMembers)
  const players = useGameStore((state) => state.players)
  const setGameState = useGameStore((state) => state.setGameState)

  const effectiveRoomCode = roomCode || roomCodeFromStore

  // Poll for room status
  useEffect(() => {
    const fetchRoomStatus = async () => {
      if (!effectiveRoomCode) return
      try {
        const response = await fetch(`http://localhost:3000/rooms/${effectiveRoomCode}`)
        if (response.ok) {
          const data = await response.json()
          if (data.members) {
            setMembers(data.members)
            const host = data.members.find((m: any) => m.role === 'HOST')
            setIsHost(!!host)
          }
        } else {
          // Fallback to store data
          const storeMembers = roomMembers.length > 0 ? roomMembers : 
            players.map(p => ({ id: p.id, username: p.username, role: p.isHost ? 'HOST' : 'PLAYER' }))
          setMembers(storeMembers)
          setIsHost(storeMembers.some((m: any) => m.role === 'HOST'))
        }
      } catch (err) {
        console.error('Polling error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoomStatus()
    const interval = setInterval(fetchRoomStatus, 3000)
    return () => clearInterval(interval)
  }, [effectiveRoomCode, roomMembers, players])

  const startGame = async () => {
    if (!effectiveRoomCode) {
      setError('No room code found')
      return
    }

    setIsStarting(true)
    setError('')

    try {
      const response = await fetch(`http://localhost:3000/games/${effectiveRoomCode}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalRounds }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to start game')
      }

      const game = await response.json()
      console.log('Game started:', game)
      setGameState({ maxRounds: totalRounds, currentRound: 1 })
      router.push(`/game/${effectiveRoomCode}`)

    } catch (err) {
      console.error('Error starting game:', err)
      setError(err instanceof Error ? err.message : 'Failed to start game')
    } finally {
      setIsStarting(false)
    }
  }

  const goBack = () => router.goBack()

  if (isLoading) {
    return (
      <IonPage>
        <IonContent className="ion-padding" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <IonSpinner name="crescent" />
          <IonText className="ion-padding-start">Loading lobby...</IonText>
        </IonContent>
      </IonPage>
    )
  }

  if (!effectiveRoomCode) {
    return (
      <IonPage>
        <IonHeader><IonToolbar><IonTitle>Game Lobby</IonTitle></IonToolbar></IonHeader>
        <IonContent className="ion-padding">
          <IonText color="danger"><h2>No room code found</h2></IonText>
          <IonButton expand="block" onClick={goBack}>Go Back</IonButton>
        </IonContent>
      </IonPage>
    )
  }

  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Game Lobby</IonTitle></IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        <IonText><h2>Room: {effectiveRoomCode}</h2><p>Share this code with friends to join.</p></IonText>

        <IonText><h3>Players ({members.length})</h3></IonText>
        <IonList>
          {members.length === 0 ? (
            <IonItem><IonLabel>No players yet</IonLabel></IonItem>
          ) : (
            members.map((member) => (
              <IonItem key={member.id}>
                <IonLabel>{member.username}{member.role === 'HOST' && ' 👑'}</IonLabel>
                <IonChip color={member.role === 'HOST' ? 'primary' : 'medium'}>{member.role || 'PLAYER'}</IonChip>
              </IonItem>
            ))
          )}
        </IonList>

        {isHost && (
          <>
            <IonText><h3>Game Settings</h3></IonText>
            <IonItem>
              <IonLabel position="stacked">Rounds</IonLabel>
              <IonSelect value={totalRounds} onIonChange={e => setTotalRounds(Number(e.detail.value))}>
                {[1,2,3,4,5].map(n => <IonSelectOption key={n} value={n}>{n} Round{n>1?'s':''}</IonSelectOption>)}
              </IonSelect>
            </IonItem>
            {error && <IonText color="danger"><p>{error}</p></IonText>}
            <IonButton expand="block" color="success" onClick={startGame} disabled={isStarting || members.length < 1}>
              {isStarting ? 'Starting...' : 'Start Game'}
            </IonButton>
          </>
        )}
        {!isHost && <IonText color="medium"><p>Waiting for the host to start...</p></IonText>}
        <IonButton expand="block" color="medium" onClick={goBack}>Go Back</IonButton>
      </IonContent>
    </IonPage>
  )
}

export default GameLobby