import {IonPage, IonTitle, IonButton, IonHeader} from '@ionic/react';
import { IonItem, IonList, IonSelect, IonSelectOption } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { useMutation } from "@tanstack/react-query";
import { Redirect } from 'react-router';
import { useState } from 'react';
import { usePlayerStore } from "../store/gameStore";

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
    const {isHost,setHost,userName,setUsername,numRounds,setNumRounds,roomCode,setRoomCode} = usePlayerStore()
    const [joinLobby, setJoinLobby] = useState(false);


    const{
        register,
        handleSubmit,
        reset,
        watch,
        formState: {errors, isSubmitting},

    } = useForm({
        defaultValues: {
            userName: "",
        }
    })

  

    // const onSubmit = async (data: any) =>{
    //     //replace with tanstack query to send data to backend and get response
    //     console.log(data);
    //     reset();
    // }

    //will need multiple mutations for different actions
    //i.e. making a lobby, joining said lobby and sending in user data

    const lobbyStart = useMutation({
    mutationFn: startLobby,

    onSuccess: (a: any) => {
      reset(); // clear the form after a successful send (optional)
      // Common things to do here later:
      // - queryClient.invalidateQueries({ queryKey: ["messages"] }) to refetch a list
      // - show a toast, redirect, etc.
      //console log a response for what got shown
      console.log(a);
      console.log(a.code);
      
      //consume the response and save it to the zustand
      setRoomCode(a.code);
      console.log('the zustand room code stored is ' + a.code)
      //navigate to the game lobby page after a successful send 
      setJoinLobby(true);
      
    },
  });


    // const [rounds, SetRounds] = useState(1);
    // const [name, SetName] = useState("host");

    const onSubmit = (data: any) =>{
       
        type dataObj = {
            username: string;
            totalRounds: number;
            role: string;
        }
        const dataObj = {
            username: userName,
            totalRounds: numRounds,
            role: "PLAYER"
        }
        lobbyStart.mutate(dataObj);
    }

   
    

    
    
    
    //if a flag has been hit then return a redirect
    if(joinLobby){
        return <Redirect to="/game-lobby" />;
    }
    
    return (
        <IonPage>
            <IonTitle><IonHeader>Make Lobby</IonHeader></IonTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <label> Username: </label>
                <input onInput={(e)=>setUsername((e.target as HTMLInputElement).value)} {...register("userName")} />
                <IonList>
                    <IonItem>
                        <IonSelect onIonChange={(e)=>setNumRounds(Number(e.detail.value))} placeholder="Select Number of Turns">
                            <IonSelectOption value="1">1</IonSelectOption>
                            <IonSelectOption value="2">2</IonSelectOption>
                            <IonSelectOption value="3">3</IonSelectOption>
                            <IonSelectOption value="4">4</IonSelectOption>
                            <IonSelectOption value="5">5</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                </IonList>
                <IonButton type="submit" disabled={isSubmitting}>
                    Make Lobby
                </IonButton>
            </form>

            {/* <IonButton routerLink="/game-lobby">Go to Game Lobby</IonButton> */}
        </IonPage>
    )
}

export default MakeLobby;