import { PrismaClient, User } from "@prisma/client";
import { IFriendRepository } from "./IFriendRepository";

export class FriendRepository implements IFriendRepository {
    async acceptFriendRequest(id: string, userId: string): Promise<void> {
        try {
            await this.prisma.user.update({
                data: {
                    friendRequestFrom: {
                        disconnect: [{
                            id: userId
                        }]
                    },
                    friendRequestTo:{
                        disconnect: [{
                            id: id
                        }]
                    },
                    isFriendsWith: {
                        connect: [{
                            id: userId
                        }]
                    }
                },
                where: {
                    id
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    async declineFriendRequest(id: string, userId: string): Promise<void> {
        try {
            await this.prisma.user.update({
                data: {
                    friendRequestFrom: {
                        disconnect: [{
                            id: userId
                        }]
                    },
                    friendRequestTo: {
                        disconnect: [{
                            id
                        }]
                    }
                },
                where: {
                    id
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    prisma = new PrismaClient();

    async userAddFriendRequest(id: string, friendLogin: string): Promise<void> {
        await this.prisma.user.update({
            where: {
                id
            },
            data: {
                friendRequestTo: {
                    connect: [
                        {
                            login: friendLogin
                        }
                    ]
                }
            },
            include:
            {
                isFriendsWith: true,
                areFriendsWithHim: true
            }
        });
    }

    async getFriendRequests(userId: string): Promise<User[]> {

        let user = await this.prisma.user.findFirst({
            where: {
                id: userId
            },
            include: {
                friendRequestFrom: true
            }
        });

        return user?.friendRequestFrom || [];
    }
    async getFriends(id: string): Promise<User[]> {
        let userData = await this.prisma.user.findFirst({
            where: {
                id:{
                    equals: id
                }
            },
            include: {
                isFriendsWith: true,
                areFriendsWithHim: true
            }
        });

        return [
            ...(userData?.isFriendsWith ?? []),
            ...(userData?.areFriendsWithHim ?? [])];
    }
}