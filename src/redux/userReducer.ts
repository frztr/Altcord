import { createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import { User } from "./entities/user";
import store, { RootState } from "./store";
import socket from "../socket/socket";

const userAdapter = createEntityAdapter<User, string>({
    selectId: (state: User) => state.id
})

const initialState: User[] = [];


const userSlice = createSlice({
    name: "user",
    initialState: userAdapter.addMany(userAdapter.getInitialState<
        {user?:User}
        >({}), initialState),
    reducers: {
        setUser:(state,action)=>{
            state.user = action.payload;
        },
        addUsers: userAdapter.addMany
    }
})

export default userSlice.reducer

export const { setUser, addUsers } = userSlice.actions

const selectors = userAdapter.getSelectors<RootState>((state) => state.user)

const selectUser = (state: any) => {

    return state.user.user;
}

export const getUserInfo = selectUser;

const getAllUsers =  createSelector(
    [selectors.selectAll,(state:any):User=>state.user.user],
    (a,b)=>[...a,b]
)

export const getUserById = (id:string) => createSelector(
    getAllUsers,
    (users) => users.filter(x=>x && x.id == id)[0]
)

export const getUsersByIds = (ids:string[]) => createSelector(getAllUsers,
    (users)=> users.filter(x=> ids.includes(x.id)));

