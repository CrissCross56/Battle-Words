import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

const MakeLobby: React.FC = () => {
  // Zustand store hooks
  const connectSocket = useGameStore((state) => state.connectSocket)
  const roomCode = useGameStore((state) => state.roomCode)
  const players = useGameStore((state) => state.players)
  const gameStatus = useGameStore((state) => state.gameStatus)

  // Connect socket when room code is set
  useEffect(() => {
    if (roomCode) {
      connectSocket(roomCode)
    }
  }, [roomCode, connectSocket])

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      userName: '',
    },
  })

  const onSubmit = async (data: any) => {
    // TODO: Replace with TanStack Query to send data to backend
    console.log('Creating lobby for user:', data.userName)
    // Reset form after submission
    reset()
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Make Lobby</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonItem>
            <IonLabel position="stacked">Username</IonLabel>
            <IonInput
              {...register('userName')}
              placeholder="Enter your username"
            />
          </IonItem>

          <IonButton
            type="submit"
            expand="block"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Make Lobby'}
          </IonButton>
        </form>

        {/* Temporary navigation — later this will happen automatically */}
        <IonButton
          expand="block"
          color="medium"
          routerLink="/game-lobby"
        >
          Go to Game Lobby (Manual)
        </IonButton>
      </IonContent>
    </IonPage>
  )
}

export default MakeLobby