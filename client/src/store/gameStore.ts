import { create } from "zustand"

//we will need to store the game room id
//and the user name, so when someone enters their name and and the room code
//then in their browser, we can store that information in the zustand store and then use it to send to the backend
//when they play the game

type FormData = {  
    userName: string;
    roomCode: string;
    isHost: boolean;
}

type PlayerStore = {
    formData: FormData | null;
    setFormData: (data: FormData) => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
    formData: null,
    setFormData: (data: FormData) => set({ formData: data }),
}))