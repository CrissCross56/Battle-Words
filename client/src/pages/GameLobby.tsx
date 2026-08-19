import { IonPage, IonTitle, IonButton, useIonRouter } from '@ionic/react'
import { usePlayerStore } from '../store/gameStore'
import { useEffect } from 'react'

const GameLobby: React.FC = () => {
  const router = useIonRouter()
  const { roomCode, memberId, userName, setGameId, isHost } = usePlayerStore()

  // Poll for game start and auto-navigate all players
  useEffect(() => {
    if (!roomCode || !memberId) {
      return
    }

    const pollGameStart = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/rooms/${roomCode}/status`
        )
        const data = await response.json()

        if (data.gameId && typeof data.gameId === 'string') {
          setGameId(data.gameId)
          localStorage.setItem('battleWordsGameId', data.gameId)
          localStorage.setItem('battleWordsMemberId', memberId)
          router.push(
            `/gameplay?gameId=${data.gameId}&memberId=${memberId}`,
            'forward',
            'push'
          )
        }
      } catch (error) {
        console.error('Error polling for game start', error)
      }
    }

    const interval = setInterval(pollGameStart, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [roomCode, memberId, router, setGameId])

  const startGame = async () => {
    if (!roomCode || !memberId) {
      console.error('Room code or member ID missing')
      return
    }

    try {
      const response = await fetch(
        `http://localhost:3000/games/${roomCode}/start`,
        {
          method: 'POST'
        }
      )

      if (!response.ok) {
        throw new Error('Unable to start the game')
      }

      const data = await response.json()
      setGameId(data.id)
      localStorage.setItem('battleWordsGameId', data.id)
      localStorage.setItem('battleWordsMemberId', memberId)
      router.push(
        `/gameplay?gameId=${data.id}&memberId=${memberId}`,
        'forward',
        'push'
      )
    } catch (error) {
      console.error('Failed to start game', error)
    }
  }

  return (
    <IonPage>
      <IonTitle>Game Lobby</IonTitle>
      <div style={{ padding: '16px' }}>
        <p>
          <strong>Room code:</strong> {roomCode || 'Not available'}
        </p>
        <p>
          <strong>Player:</strong> {userName}
        </p>
        <p>
          <strong>Member ID:</strong> {memberId || 'Not available'}
        </p>

        {isHost && <IonButton onClick={startGame}>Start Game</IonButton>}
      </div>
    </IonPage>
  )
}

export default GameLobby
