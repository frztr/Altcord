import { Socket } from "socket.io-client";
import { User } from "../../redux/entities/user";
import { dispatch } from "../../redux/store";
import { addFriend, addFriendRequest, removeFriendRequest } from "../../redux/friendReducer";
import { addUsers } from "../../redux/userReducer";

const friendController = (socket: Socket) => ({
    friendRequestsAdded: ({requestId, user}:{
        requestId:string
        user: User
    }) => {
        
        dispatch(addUsers([user]));
        dispatch(addFriendRequest(requestId));
    },
    added: ({requestId,friend}:{
        requestId:string,
        friend:User
    }) => {        
        dispatch(addUsers([friend]));
        dispatch(addFriend(requestId));
        dispatch(removeFriendRequest(requestId));
    },
    requestDeclined: ({requestId}:{requestId:string}) =>{
        dispatch(removeFriendRequest(requestId));
    }
});

export default friendController;