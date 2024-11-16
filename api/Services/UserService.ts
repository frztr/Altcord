import { PrismaClient, User } from "@prisma/client";
import { IUserService } from "./IUserService";
import { IUserRepository } from "../Repositories/IUserRepository";
import { provider } from "../..";
import SHA256 from "../../crypto/sha256";
import jwt from 'jsonwebtoken';
import { IFriendRepository } from "../Repositories/IFriendRepository";
import { UserExtendedDto } from "../Dto/User/UserExtendedDto";
import { TalkDto } from "../Dto/Talks/TalkDto";
import { UserDto } from "../Dto/User/UserDto";
import { ITalkRepository } from "../Repositories/ITalkRepository";

class UserService implements IUserService {

    private userRepository: IUserRepository = provider.IUserRepository.get();
    private friendRepository : IFriendRepository = provider.IFriendRepository.get();
    private talkRepository : ITalkRepository = provider.ITalkRepository.get();

    async login(login: string, password: string): Promise<string | null> {
        let user = await this.userRepository.getByLoginPassword(
            login,
            SHA256(password)
        );
        if (!user) return null;

        let token = jwt.sign({ login: user?.login }, `${process.env.JWT_PRIVATE_KEY}`);

        return token;
    }

    async signup(name: string, login: string, password: string): Promise<User | null> {
        return await this.userRepository.addUser(name, login, SHA256(password));
    }

    prisma = new PrismaClient();
    async getUserInfoById(id: string): Promise<UserExtendedDto> {
        
        let user = await this.userRepository.getUserById(id);
        let talks = await this.talkRepository.getAllById(id);

        let servers = [{
            id: "1",
            name: "Server"
        }];

        let friends = await this.friendRepository.getFriends(id);
        let friendRequests = await this.friendRepository.getFriendRequests(id);

        let users = [
            ...friends,
            ...friendRequests].filter(x => x.id != user?.id).map(
                x=> ({
                    id: x.id,
                    login:x.login,
                    logo: (x.logo)??undefined,
                    name:x.name
                })
            );

        return {
            id:user!.id,
            login: user!.login,
            logo: user?.logo,
            name: user!.name,
            talks: talks,
            servers: servers,
            friends: friends.map(x => x.id),
            users: users,
            friendRequests: friendRequests.map(x => x.id)
        };
    }
}

export default UserService