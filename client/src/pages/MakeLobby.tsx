import {IonPage, IonTitle, IonButton, IonHeader} from '@ionic/react';
import { IonItem, IonList, IonSelect, IonSelectOption } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { useMutation } from "@tanstack/react-query";
import { Redirect } from 'react-router';
import { useState } from 'react';

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

    const [lobbyObject , setLobbyObject] = useState<any>({

    });

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
      //take the data from the result of the mutation and set it to the lobbyObject state
      console.log(a);
      //navigate to the game lobby page after a successful send 
      return <Redirect to="/game-lobby" />;
    },
  });

  const sendName = useMutation({
    
  })

   const onSubmit = (data: any) => lobbyStart.mutate(data);
 
    return (
        <IonPage>
            <IonTitle><IonHeader>Make Lobby</IonHeader></IonTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <label> Username: </label>
                <input {...register("userName")} />
                <IonList>
                    <IonItem>
                        <IonSelect placeholder="Select Number of Turns">
                            <IonSelectOption value="1">1</IonSelectOption>
                            <IonSelectOption value="2">2</IonSelectOption>
                            <IonSelectOption value="3">3</IonSelectOption>
                            <IonSelectOption value="4">4</IonSelectOption>
                            <IonSelectOption value="5">5</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                </IonList>
                <button type="submit" disabled={isSubmitting}>
                    Make Lobby
                </button>
            </form>

            <IonButton routerLink="/game-lobby">Go to Game Lobby</IonButton>
        </IonPage>
    )
}

export default MakeLobby;