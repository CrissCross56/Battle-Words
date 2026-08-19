// client/src/pages/Results.tsx
// Final scoreboard page displayed after the game ends.

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
  IonCard,
  IonCardContent,
} from '@ionic/react'
import { useIonRouter } from '@ionic/react'
import { useEffect, useState } from 'react'
import '../styles/Results.css'

interface PlayerScore {
  id: string
  username: string
  score: number
}

// Temporary dummy data — replace with real API data later
const DUMMY_SCORES: PlayerScore[] = [
  { id: '1', username: 'Host', score: 5 },
  { id: '2', username: 'Guest 1', score: 4 },
  { id: '3', username: 'Guest 2', score: 2 },
  { id: '4', username: 'Guest 3', score: 1 },
]

const Results: React.FC = () => {
  const router = useIonRouter()
  const [players, setPlayers] = useState<PlayerScore[]>([])

  // TODO: Fetch scores from backend
  useEffect(() => {
    // Replace with actual API call:
    // fetch(`http://localhost:3000/games/${gameId}/results`)
    //   .then(res => res.json())
    //   .then(data => setPlayers(data.players))

    // Sort by score (highest first)
    const sorted = [...DUMMY_SCORES].sort((a, b) => b.score - a.score)
    setPlayers(sorted)
  }, [])

  const goHome = () => {
    router.push('/home')
  }

  const getRankLabel = (index: number) => {
    if (index === 0) return '1st'
    if (index === 1) return '2nd'
    if (index === 2) return '3rd'
    return `${index + 1}th`
  }

  const getRankColor = (index: number) => {
    if (index === 0) return 'gold'
    if (index === 1) return 'silver'
    if (index === 2) return '#cd7f32' // bronze
    return '#6b7280' // gray
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>⚔️ Game Over</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard className="card-shadow results-card">
          <IonCardContent>
            <IonText>
              <h2>🏆 Final Scores</h2>
              <p>Here's how everyone did.</p>
            </IonText>

            <IonList>
              {players.map((player, index) => (
                <IonItem key={player.id} className="score-item">
                  <IonLabel>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="rank-badge">
                        {getRankLabel(index)}
                      </span>
                      <strong>{player.username}</strong>
                    </div>
                  </IonLabel>
                  <IonChip
                    className="score-chip"
                    style={{
                      backgroundColor: getRankColor(index),
                      color: index < 3 ? '#ffffff' : '#1a1a2e',
                    }}
                  >
                    {player.score} pts
                  </IonChip>
                </IonItem>
              ))}
            </IonList>

            <IonButton expand="block" className="button-primary" onClick={goHome}>
              🏠 Back to Home
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default Results