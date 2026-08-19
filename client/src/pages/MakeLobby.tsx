import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButton, 
  IonContent,
  IonItem, 
  IonList, 
  IonSelect, 
  IonSelectOption,
  IonCard,
  IonCardContent,
  IonText,
} from '@ionic/react';
import { useForm } from 'react-hook-form';
import { useMutation } from "@tanstack/react-query";
import { Redirect } from 'react-router';
import { useState } from 'react';
import { usePlayerStore } from "../store/gameStore";
import '../styles/MakeLobby.css';

// Function to data to the backend
async function startLobby(data: any) {
    const res = await fetch("http://localhost:3000/rooms",{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    if(!res.ok) throw new Error("Something went wrong while sending data to the backend")
    return res.json();
}

const MakeLobby: React.FC = () => {
    const {userName, setUsername, numRounds, setNumRounds, roomCode, setRoomCode} = usePlayerStore()
    const [joinLobby, setJoinLobby] = useState(false);

    const{
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm({
        defaultValues: {
            userName: "",
        }
    })

    const lobbyStart = useMutation({
        mutationFn: startLobby,
        onSuccess: (a: any) => {
            reset();
            console.log(a);
            console.log(a.code);
            setRoomCode(a.code);
            console.log('the zustand room code stored is ' + a.code)
            setJoinLobby(true);
        },
    });

    const onSubmit = (data: any) => {
        const dataObj = {
            username: userName,
            totalRounds: numRounds,
            role: "PLAYER"
        }
        lobbyStart.mutate(dataObj);
    }

    if(joinLobby){
        return <Redirect to="/game-lobby" />;
    }
    
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>⚔️ Battle Words ⚔️ - Create A Game</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <IonCard className="card-shadow form-card">
                    <IonCardContent>
                        <IonText>
                            <h2>🛡️ Create a Game</h2>
                            <p>Set up your game room and invite friends.</p>
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

                            {/* Rounds Select */}
                            <div className="form-group">
                                <label>Number of Rounds</label>
                                <IonList>
                                    <IonItem>
                                        <IonSelect 
                                            className="ion-select-custom"
                                            onIonChange={(e) => setNumRounds(Number(e.detail.value))} 
                                            placeholder="Select Number of Turns"
                                        >
                                            <IonSelectOption value="1">1</IonSelectOption>
                                            <IonSelectOption value="2">2</IonSelectOption>
                                            <IonSelectOption value="3">3</IonSelectOption>
                                            <IonSelectOption value="4">4</IonSelectOption>
                                            <IonSelectOption value="5">5</IonSelectOption>
                                        </IonSelect>
                                    </IonItem>
                                </IonList>
                            </div>

                            {/* Buttons - Back on left, Create Game on right */}
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
                                    {isSubmitting ? 'Creating...' : '🎮 Create Game'}
                                </IonButton>
                            </div>
                        </form>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    )
}

export default MakeLobby;