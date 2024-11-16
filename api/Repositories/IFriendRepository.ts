import { User } from "@prisma/client";

export interface IFriendRepository
{
    userAddFriendRequest(id:string, friendLogin:string): Promise<void>;
    getFriends(id:string):Promise<User[]>;
    getFriendRequests(userId:string): Promise<User[]>;
    acceptFriendRequest(id:string,userId:string): Promise<void>;
    declineFriendRequest(id:string,userId:string): Promise<void>;
}