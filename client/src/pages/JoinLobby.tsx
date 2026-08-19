import {IonPage, IonTitle} from '@ionic/react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from "@tanstack/react-query";
import { Redirect } from 'react-router-dom';
import { useState } from 'react';
import { usePlayerStore } from "../store/gameStore";

//function to get data on all games from the backend
async function getAllGames(){
    const res = await fetch("my get request goes here");
    if(!res.ok) throw new Error("Something went wrong while getting the game data from the backend")
    return res.json();
}


// Function to send data to the backend
async function startLobby(data: any){
    const res = await fetch(`http://localhost:3000/rooms/${data.code}/join`,{
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
    const {userName,setUsername,roomCode,setRoomCode} = usePlayerStore();
    const [localCode, setLocalCode] = useState("");
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
            lobbyCode: "",
        }
    })

    // const onSubmit = async (data: any) => {
    //     //replace with tanstack query to send data to backend and get response
    //     console.log(data);
    //     reset();
    // }

    const {data, isLoading, isError} = useQuery({
        queryKey: ["games"],
        queryFn: getAllGames,
    })

    const lobbyStart = useMutation({
    mutationFn: startLobby,
    onSuccess: (a: any) => {
        // Common things to do here later:
        // - queryClient.invalidateQueries({ queryKey: ["messages"] }) to refetch a list
        // - show a toast, redirect, etc.

        //on success, console log the data and pass the returned data into the zustand store i.e. the code for the lobby
        // console.log(a);
        // console.log(a.code);
        // console.log('the zustand room code stored is ' + a.code)
        // setRoomCode(a.code);

        //if the lobbycode they submitted was correct then store it in the zustand
        setRoomCode(localCode);

        //change state to redirect to the right component
        setJoinLobby(true);
    },
    });

     const onSubmit = (data: any) =>{
       
        type dataObj = {
            username: string;
            role: string;
            code: string;
        }
        const dataObj = {
            username: userName,
            role: "PLAYER",
            code: localCode
        }
        lobbyStart.mutate(dataObj);
    }




    
    
    if(joinLobby){
        return <Redirect to={`/lobby/${roomCode}`} />;
    }
    return (
        <IonPage>
            <IonTitle>Join Lobby</IonTitle>
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <label> Username: </label>
                <input onInput={(e)=>setUsername((e.target as HTMLInputElement).value)} {...register("userName")} />
                <label> Lobby Code: </label>
                <input onInput={(e)=>setLocalCode((e.target as HTMLInputElement).value)} {...register("lobbyCode")} />
                <button type="submit" disabled={isSubmitting}>
                    Join Lobby
                </button>
            </form>

        </IonPage>
    )
}

export default JoinLobby;