import { io } from "socket.io-client";
import userController from "./Controllers/userController";
import { getCookies } from "../utils/cookies";
import friendController from "./Controllers/friendController";
import talkController from "./Controllers/talkController";
import voiceChannelController from "./Controllers/voiceChannelController";

const socket = io(`${process.env.REACT_APP_HOST_URL}:5000`);

socket.on('connect', () => {
    if (document.cookie) {
        let cookies = getCookies();
        socket.emit('auth.createSession', cookies.get('user'));
    }
    // socket.emit('users.login','Admin','password');
});

const api: { [index: string]: any } = {
    users: userController,
    friends: friendController,
    talks:talkController,
    voice:voiceChannelController
};

socket.onAny((...args) => {
    let [eventName, ...values] = args;
    let [controller, method] = eventName.split('.');
    // console.log({ controller, method, values });

    let func = (api[controller](socket))[method];
    if (func) func(...values);
});

// socket.on('users.loginSuccessful',(info:any) =>{
//     document.cookie = `user=${info.token}`;
//     socket.emit('auth.createSession',info.token);
// });

export function login(login:string,password:string){
    
    socket.emit('users.login',login,password);
};

export function addFriend(id:string)
{  
    socket.emit('friends.addFriendRequest', id);
}

export function acceptFriendRequest(id:string)
{
    socket.emit('friends.acceptFriendRequest',id);
}

export function declineFriendRequest(id:string)
{
    socket.emit('friends.declineFriendRequest',id);
}

export default socket;