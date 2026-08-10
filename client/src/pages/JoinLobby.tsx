import {IonPage, IonTitle} from '@ionic/react';
import { useForm } from 'react-hook-form';


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