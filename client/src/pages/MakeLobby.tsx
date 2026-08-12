import {IonPage, IonTitle, IonButton, IonHeader} from '@ionic/react';
import { useForm } from 'react-hook-form';
import { useMutation } from "@tanstack/react-query";
import { Redirect } from 'react-router';

// Function to send data to the backend
async function sendLobbyData(data: any) {
    const res = await fetch("localhost3000/",{
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


    const mutation = useMutation({
    mutationFn: sendLobbyData,
    onSuccess: () => {
      reset(); // clear the form after a successful send (optional)
      // Common things to do here later:
      // - queryClient.invalidateQueries({ queryKey: ["messages"] }) to refetch a list
      // - show a toast, redirect, etc.

      //navigate to the game lobby page after a successful send 
      return <Redirect to="/game-lobby" />;
    },
  });

   const onSubmit = (data: any) => mutation.mutate(data);

    return (
        <IonPage>
            <IonTitle><IonHeader>Make Lobby</IonHeader></IonTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <label> Username: </label>
                <input {...register("userName")} />
                <button type="submit" disabled={isSubmitting}>
                    Make Lobby
                </button>
            </form>

            <IonButton routerLink="/game-lobby">Go to Game Lobby</IonButton>
        </IonPage>
    )
}

export default MakeLobby;