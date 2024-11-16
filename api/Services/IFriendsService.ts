import { User } from "@prisma/client";
import { FriendsAndRequestsDto } from "../Dto/Friends/FriendRequestDto";
import { AddFriendDto } from "../Dto/Friends/AddFriendDto";



export interface IFriendService{
    
    addFriend(id:string,friendName:string) : Promise<AddFriendDto>
    acceptFriendRequest(id:string, userId:string) : Promise<FriendsAndRequestsDto>
    declineFriendRequest(id:string, userId:string) : Promise<FriendsAndRequestsDto>
}