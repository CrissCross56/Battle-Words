import {IonPage, IonTitle, IonButton, IonHeader} from '@ionic/react';
import { useForm } from 'react-hook-form';
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

    const onSubmit = async (data: any) =>{
        //replace with tanstack query to send data to backend and get response
        console.log(data);
        reset();
    }

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