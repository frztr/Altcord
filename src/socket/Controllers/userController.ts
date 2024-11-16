import { User } from "../../redux/entities/user";
import { addUsers, setUser } from "../../redux/userReducer";
import store, { dispatch } from "../../redux/store";
import { Talk } from "../../redux/entities/talk";
import { setTalks } from "../../redux/talksReducer";
import { setServers } from "../../redux/serverReducer";
import { Server } from "../../redux/entities/server";
import { setFriendRequests, setFriends } from "../../redux/friendReducer";
import { Socket } from "socket.io-client";

const userController = (socket: Socket) => ({
    getUserInfo: ({id,name,status,logo, talks, servers, friends, users, friendRequests}:User&{ talks: Talk[], servers: Server[], friends:string[], users:User[], friendRequests: string[]})=>{
        dispatch(setUser({id,name,status,logo}));
        dispatch(setTalks(talks));
        dispatch(setServers(servers));
        dispatch(setFriends(friends));
        dispatch(addUsers(users))
        dispatch(setFriendRequests(friendRequests))
        socket.emit('voice.getAvailableChannels');
    },
    loginSuccessful: (info:any) =>{
        document.cookie = `user=${info.token}`;
        socket.emit('auth.createSession',info.token);
    }
});

export default userController;



