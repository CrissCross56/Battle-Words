import { create } from "zustand"

//we will need to store the game room id
//and the user name, so when someone enters their name and and the room code
//then in their browser, we can store that information in the zustand store and then use it to send to the backend
//when they play the game



// type PlayerStore = {
//     formData: FormData | null;
//     setFormData: (data: FormData) => void;
//     setUserName: 

// }

type PlayerStore = {
    userName: string,
    setUsername: (newUserName: string) => void,
    numRounds: number,
    setNumRounds: (numR : number) => void,
    isHost: boolean,
    setHost: (hostBool: boolean) => void,
    roomCode: string,
    setRoomCode: (rCode: string) => void,
    memberId: string,
    setMemberId: (memberId: string) => void,
    roomId: string,
    setRoomId: (roomId: string) => void,
    gameId: string,
    setGameId: (gameId: string) => void,
    clearSession: () => void
}

export const usePlayerStore = create<PlayerStore>((set) => ({
    userName: "",
    setUsername: (newUserName) => set({
        userName: newUserName
    }),
    numRounds: 1,
    setNumRounds: (numR) => set({
        numRounds: numR
    }),
    isHost: false,
    setHost: (hostBool) => set({
        isHost: hostBool
    }),
    roomCode: "",
    setRoomCode: (rCode) => set({
        roomCode: rCode
    }),
    memberId: "",
    setMemberId: (memberId) => set({
        memberId
    }),
    roomId: "",
    setRoomId: (roomId) => set({
        roomId
    }),
    gameId: "",
    setGameId: (gameId) => set({
        gameId
    }),
    clearSession: () => set({
        userName: "",
        numRounds: 1,
        isHost: false,
        roomCode: "",
        memberId: "",
        roomId: "",
        gameId: ""
    })
}))