import { IonPage, IonTitle, IonButton } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useHistory } from 'react-router-dom';
import { usePlayerStore } from '../store/gameStore';

async function joinRoom (roomCode: string, data: { username: string, role: 'PLAYER' | 'SPECTATOR' }) {
  const res = await fetch(`http://localhost:3000/rooms/${roomCode}/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!res.ok) {
    throw new Error('Something went wrong while joining the room')
  }

  return res.json()
}

const JoinLobby: React.FC = () => {
  const history = useHistory()

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      userName: '',
      lobbyCode: ''
    }
  })

  const {
    setUsername,
    setRoomCode,
    setMemberId,
    setRoomId,
    setHost
  } = usePlayerStore()

  const mutation = useMutation({
    mutationFn: ({ roomCode, username }: { roomCode: string, username: string }) => joinRoom(roomCode, {
      username,
      role: 'PLAYER'
    }),
    onSuccess: (response: any, variables) => {
      setUsername(variables.username)
      setRoomCode(variables.roomCode)
      setMemberId(response.id)
      setRoomId(response.roomId)
      setHost(false)
      localStorage.setItem('battleWordsRoomCode', variables.roomCode)
      localStorage.setItem('battleWordsMemberId', response.id)
      localStorage.setItem('battleWordsRoomId', response.roomId)
      reset()
      history.push('/game-lobby')
    }
  })

  const onSubmit = (data: { userName: string, lobbyCode: string }) => {
    mutation.mutate({
      roomCode: data.lobbyCode.trim(),
      username: data.userName.trim()
    })
  }

  return (
    <IonPage>
      <IonTitle>Join Lobby</IonTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label> Username: </label>
        <input {...register('userName')} />
        <label> Lobby Code: </label>
        <input {...register('lobbyCode')} />
        <IonButton type='submit' disabled={isSubmitting}>
          Join Lobby
        </IonButton>
      </form>
    </IonPage>
  )
}

export default JoinLobby;