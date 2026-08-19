import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardContent,
  IonText,
} from '@ionic/react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from "@tanstack/react-query";
import { Redirect } from 'react-router-dom';
import { useState } from 'react';
import { usePlayerStore } from "../store/gameStore";
import '../styles/JoinLobby.css';

// Function to get data on all games from the backend
async function getAllGames() {
  const res = await fetch("my get request goes here");
  if (!res.ok) throw new Error("Something went wrong while getting the game data from the backend");
  return res.json();
}

// Function to send data to the backend
async function startLobby(data: any) {
  const res = await fetch(`http://localhost:3000/rooms/${data.code}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Something went wrong while sending lobby data to the backend");
  return res.json();
}

const JoinLobby: React.FC = () => {
  const { userName, setUsername, roomCode, setRoomCode } = usePlayerStore();
  const [localCode, setLocalCode] = useState("");
  const [joinLobby, setJoinLobby] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      userName: "",
      lobbyCode: "",
    }
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["games"],
    queryFn: getAllGames,
  });

  const lobbyStart = useMutation({
    mutationFn: startLobby,
    onSuccess: (a: any) => {
      setRoomCode(localCode);
      setJoinLobby(true);
    },
  });

  const onSubmit = (data: any) => {
    const dataObj = {
      username: userName,
      role: "PLAYER",
      code: localCode
    };
    lobbyStart.mutate(dataObj);
  };

  if (joinLobby) {
    return <Redirect to="/game-lobby" />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>⚔️ Battle Words ⚔️ - Join A Game</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard className="card-shadow form-card">
          <IonCardContent>
            <IonText>
              <h2>🔗 Join a Game</h2>
              <p>Enter the room code and your username to join.</p>
            </IonText>

            <form onSubmit={handleSubmit(onSubmit)} className="form-container">
              {/* Username Input */}
              <div className="form-group">
                <label>Username</label>
                <input
                  onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
                  {...register("userName", { required: "Username is required" })}
                  placeholder="Enter your username..."
                />
                {errors.userName && (
                  <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.85rem', marginTop: '4px' }}>
                    {errors.userName.message as string}
                  </p>
                )}
              </div>

              {/* Lobby Code Input */}
              <div className="form-group">
                <label>Lobby Code</label>
                <input
                  onInput={(e) => setLocalCode((e.target as HTMLInputElement).value)}
                  {...register("lobbyCode", { required: "Lobby code is required" })}
                  placeholder="Enter room code..."
                />
                {errors.lobbyCode && (
                  <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.85rem', marginTop: '4px' }}>
                    {errors.lobbyCode.message as string}
                  </p>
                )}
              </div>

              {/* Buttons - Back on left, Join Game on right */}
              <div className="button-row">
                <IonButton
                  fill="outline"
                  routerLink="/home"
                  expand="block"
                >
                  Back
                </IonButton>
                <IonButton
                  type="submit"
                  className="button-primary"
                  disabled={isSubmitting}
                  expand="block"
                >
                  {isSubmitting ? 'Joining...' : '🎮 Join Game'}
                </IonButton>
              </div>
            </form>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default JoinLobby;