import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { PeerConnectionEntity } from "../api/PeerConnectionEntity";
import { RootState } from "./store";

const adapter = createEntityAdapter<PeerConnectionEntity, string>(
    {
        selectId: function (model: PeerConnectionEntity): string {
            return model.id;
        }
    }
)

const peerConnectionSlice = createSlice({
    name: "peerConnecitons",
    initialState: adapter.getInitialState({}),
    reducers: {
        addPeerConnection: adapter.addOne,
        updatePeerConnection:adapter.updateOne
    }
})

export const peerConnectionReducer = peerConnectionSlice.reducer

export const {
    addPeerConnection,
    updatePeerConnection
} = peerConnectionSlice.actions

const selectors = adapter.getSelectors<RootState>(state=>state.peerConnections)

export const getAllPeerConnections = selectors.selectAll