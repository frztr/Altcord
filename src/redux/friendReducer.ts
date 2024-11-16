import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

const friendsAdapter = createEntityAdapter<string, string>({
    selectId: (state:string) => state
})

const friendRequestsAdapter = createEntityAdapter<string,string>({
    selectId: (state: string) => state
});

const initState = [
    "1","2"
];

const friendsSelectors = friendsAdapter.getSelectors<RootState>((state)=>state.friends.friends)
const friendRequestsSelectors = friendRequestsAdapter.getSelectors<RootState>((state)=>state.friends.friendRequests)


const friendSlice = createSlice({
    name: "friends",
    initialState: {
        friends: friendsAdapter.addMany(friendsAdapter.getInitialState({}),initState),
        friendRequests: friendsAdapter.getInitialState()
    },
    reducers: {
        setFriends: (state,action) =>  {
            friendsAdapter.setAll(state.friends,action.payload)
        },
        setFriendRequests: (state,action) => {
            friendRequestsAdapter.setAll(state.friendRequests, action.payload)
        },
        addFriendRequest:(state,action) => {
            friendRequestsAdapter.addOne(state.friendRequests,action.payload)
        },
        removeFriendRequest: (state,action) =>{
            friendRequestsAdapter.removeOne(state.friendRequests,action.payload)
        },
        addFriend: (state,action) => {
            friendsAdapter.addOne(state.friends,action.payload)
        }
    }    
})

const friendsReducer = friendSlice.reducer

export default friendsReducer

export const {
    setFriends,
    setFriendRequests,
    addFriendRequest,
    removeFriendRequest,
    addFriend
} = friendSlice.actions

export const getAllFriends = friendsSelectors.selectAll

export const getAllFriendsRequests = friendRequestsSelectors.selectAll