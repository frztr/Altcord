import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

type tab = {
    tabName?:string,
    tabProps?:any
};

const initialState : tab = {};

const appSlice = createSlice({
    name: "app",
    initialState: {
        currentTab: initialState
    },
    reducers: {
        setTab: (state, action) => {
            state.currentTab = action.payload
        }
    }
})

export const getCurrentTab = createSelector(
    (state: RootState) => state.app,
    (state) => state.currentTab
);

export const appReducer = appSlice.reducer
export const {setTab} = appSlice.actions