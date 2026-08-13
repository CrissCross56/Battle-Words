import { create } from "zustand"

//we will need to store the game room id
//and the user name, so when someone enters their name and and the room code
//then in their browser, we can store that information in the zustand store and then use it to send to the backend
//when they play the game

type PlayerData = {  
    userName: string;
    roomCode: string;

}

type PlayerStore = {
    lastSumbission: PlayerData | null;
    setLastSubmission: (data: PlayerData) => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
    lastSumbission: null,
    setLastSubmission: (data: PlayerData) => set({ lastSumbission: data }),
}))