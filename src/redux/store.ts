import { configureStore, createAsyncThunk, UnknownAction } from "@reduxjs/toolkit"
import userReducer from "./userReducer"
import serverReducer from "./serverReducer"
import { talksReducer } from "./talksReducer"
import friendsReducer from "./friendReducer"
import { appReducer } from "./appReducer"
import voiceChannelReducer from "./voiceChannelReducer"
import { peerConnectionReducer } from "./peerConnectionReducer"

const store = configureStore({
    reducer: {
        user: userReducer,
        servers: serverReducer,
        talks: talksReducer,
        friends: friendsReducer,
        app: appReducer,
        voiceChannels: voiceChannelReducer,
        peerConnections: peerConnectionReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export const dispatch = store.dispatch;

export type RootState = ReturnType<typeof store.getState>

export default store