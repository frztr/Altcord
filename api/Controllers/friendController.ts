import { Socket } from "socket.io";
import { AuthMiddleware, socketMap } from "../Repositories/AuthRepository";
import { provider } from "../..";
import { IFriendService } from "../Services/IFriendsService";
import { IUserService } from "../Services/IUserService";

const friendController = (socket: Socket) => {
    let useAuth = AuthMiddleware(socket);
    let friendService: IFriendService = provider.IFriendService.get();
    return {
        addFriendRequest: useAuth(async ({ id }: { id: string }, friendLogin: string) => {
            try {
                let res = await friendService.addFriend(id, friendLogin);
                let userSockets : Socket[] = socketMap.get(res.requestId) ?? [];
                userSockets.map(s=>{
                    s.emit('friends.friendRequestsAdded', {
                        requestId: id,
                        user: res.user
                    });
                });              
            }
            catch (e) {
                console.log(e);
            }
        }),
        acceptFriendRequest: useAuth(async ({ id }: { id: string }, userId: string) => {
            let answer = await friendService.acceptFriendRequest(id, userId);

            let userSockets: Socket[] = socketMap.get(id) ?? [];
            userSockets.map(s => {
                s.emit('friends.added', {
                    requestId: answer.requestId,
                    friend: answer.friend
                });
            });

            let friendSockets: Socket[] = socketMap.get(answer.requestId) ?? [];
            friendSockets.map(s => {
                s.emit("friends.added", {
                    requestId: id,
                    friend: answer.user
                });
            });
        }),
        declineFriendRequest: useAuth(async ({ id }: { id: string }, userId: string) => {
            let answer = await friendService.declineFriendRequest(id, userId);

            socket.emit('friends.requestDeclined', {
                requestId: answer.requestId
            });
        })
    }
};

export default friendController