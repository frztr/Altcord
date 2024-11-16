import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import store, { RootState } from "./store";
import { Server } from "./entities/server";



const serverAdapter = createEntityAdapter<Server,string>({
    selectId: (state:Server) => state.id
})

const initState = serverAdapter.addMany(serverAdapter.getInitialState({}),
[]);

const serverSlice = createSlice({
    name: "servers",
    initialState: initState,
    reducers: {
        Add: serverAdapter.addOne,
        setServers: serverAdapter.setAll
    }
})

const serverReducer = serverSlice.reducer

export default serverReducer

export const {Add, setServers} = serverSlice.actions

const selectors = serverAdapter.getSelectors<RootState>((state)=>state.servers);

export const getAllServers = selectors.selectAll;
