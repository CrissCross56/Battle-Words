import { IonPage, IonTitle, IonButton, IonHeader, IonItem, IonList, IonSelect, IonSelectOption } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useHistory } from 'react-router-dom';
import { usePlayerStore } from '../store/gameStore';

async function createRoom (data: { username: string, totalRounds: number, role: 'PLAYER' | 'SPECTATOR' }) {
  const res = await fetch('http://localhost:3000/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!res.ok) {
    throw new Error('Something went wrong while creating the room')
  }

  return res.json()
}

const MakeLobby: React.FC = () => {
  const history = useHistory()

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      userName: ''
    }
  })

  const {
    userName,
    setUsername,
    numRounds,
    setNumRounds,
    setRoomCode,
    setMemberId,
    setRoomId,
    setHost
  } = usePlayerStore()

  const lobbyStart = useMutation({
    mutationFn: createRoom,
    onSuccess: (response: any) => {
      setRoomCode(response.code)
      setMemberId(response.member.id)
      setRoomId(response.id)
      setHost(true)
      localStorage.setItem('battleWordsRoomCode', response.code)
      localStorage.setItem('battleWordsMemberId', response.member.id)
      localStorage.setItem('battleWordsRoomId', response.id)
      reset()
      history.push('/game-lobby')
    }
  })

  const onSubmit = () => {
    const dataObj = {
      username: userName,
      totalRounds: numRounds,
      role: 'PLAYER' as const
    }

    lobbyStart.mutate(dataObj)
  }

  return (
    <IonPage>
      <IonTitle><IonHeader>Make Lobby</IonHeader></IonTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label> Username: </label>
        <input onInput={(e) => setUsername((e.target as HTMLInputElement).value)} {...register('userName')} />
        <IonList>
          <IonItem>
            <IonSelect onIonChange={(e) => setNumRounds(Number(e.detail.value))} placeholder='Select Number of Turns'>
              <IonSelectOption value={1}>1</IonSelectOption>
              <IonSelectOption value={2}>2</IonSelectOption>
              <IonSelectOption value={3}>3</IonSelectOption>
              <IonSelectOption value={4}>4</IonSelectOption>
              <IonSelectOption value={5}>5</IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>
        <IonButton type='submit' disabled={isSubmitting}>
          Make Lobby
        </IonButton>
      </form>
    </IonPage>
  )
}

export default MakeLobby;