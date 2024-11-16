import { PrismaClient, User } from "@prisma/client";
import { IFriendService } from "./IFriendsService";
import { provider } from "../..";
import { FriendsAndRequestsDto } from "../Dto/Friends/FriendRequestDto";
import { AddFriendDto } from "../Dto/Friends/AddFriendDto";

export class FriendService implements IFriendService {
    prisma = new PrismaClient()
    friendRepository = provider.IFriendRepository.get();
    userRepository = provider.IUserRepository.get();

    async acceptFriendRequest(id: string, userId: string): Promise<FriendsAndRequestsDto> {

        await this.friendRepository.acceptFriendRequest(id, userId);
        let user = await this.userRepository.getUserById(id);
        let friend = await this.userRepository.getUserById(userId);

        return {
            requestId: userId,
            user: user!,
            friend: friend!
        };
    }
    async declineFriendRequest(id: string, userId: string): Promise<FriendsAndRequestsDto> {
        await this.friendRepository.declineFriendRequest(id, userId);
        return {
            requestId: userId
        };
    }

    async addFriend(id: string, friendLogin: string): Promise<AddFriendDto> {
        let result = await this.friendRepository.userAddFriendRequest(id, friendLogin);
        let friendId = (await this.userRepository.getIdByLogin(friendLogin))!;
        let user = (await this.userRepository.getUserById(id))!;
        return {requestId:friendId,  user};
    }
}