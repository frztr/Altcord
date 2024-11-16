import { createAsyncThunk } from "@reduxjs/toolkit"
import { dispatch, RootState } from "./store"

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: RootState
    dispatch: typeof dispatch
}>()
