import {IonPage, IonTitle} from '@ionic/react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from "@tanstack/react-query";

//function to get data on all games from the backend
async function getAllGames(){
    const res = await fetch("my api route goes here");
    if(!res.ok) throw new Error("Something went wrong while getting the game data from the backend")
    return res.json();
}


// Function to send data to the backend
async function sendLobbyData(data: any){
    const res = await fetch("my api route goes here",{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    if(!res.ok) throw new Error("Something went wrong while sending lobby data to the backend")
        return res.json();
}


const JoinLobby: React.FC = () => {
    const{
        register,
        handleSubmit,
        reset,
        watch,
        formState: {errors, isSubmitting},
    } = useForm({
        defaultValues: {
            userName: "",
            lobbyCode: "",
        }
    })

    const onSubmit = async (data: any) => {
        //replace with tanstack query to send data to backend and get response
        console.log(data);
        reset();
    }

    const {data, isLoading, isError} = useQuery({
        queryKey: ["games"],
        queryFn: getAllGames,
    })

    const mutation = useMutation({
    mutationFn: sendLobbyData,
    onSuccess: () => {
      // Common things to do here later:
      // - queryClient.invalidateQueries({ queryKey: ["messages"] }) to refetch a list
      // - show a toast, redirect, etc.
    },
    });

    
    return (
        <IonPage>
            <IonTitle>Join Lobby</IonTitle>
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <label> Username: </label>
                <input {...register("userName")} />
                <label> Lobby Code: </label>
                <input {...register("lobbyCode")} />
                <button type="submit" disabled={isSubmitting}>
                    Join Lobby
                </button>
            </form>

        </IonPage>
    )
}

export default JoinLobby;