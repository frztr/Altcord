import { User } from "@prisma/client";
import { provider } from "../..";
import { IVoiceChannel } from "../Entities/IVoiceChannel";
import { VoiceChannel } from "../Entities/VoiceChannel";
import { IFriendRepository } from "../Repositories/IFriendRepository";
import { ITalkRepository } from "../Repositories/ITalkRepository";
import { IUserRepository } from "../Repositories/IUserRepository";
import { IVoiceService } from "./IVoiceService";

export class VoiceService implements IVoiceService {
    userRepository: IUserRepository = provider.IUserRepository.get();
    async connect(id: string, channelId: string): Promise<IVoiceChannel> {
        let userDto = await this.userRepository.getUserById(id);
        let channels = await this.getAvailableVoiceChannels(id);
        let chan = channels.filter(x => x.id == channelId)[0];
        if (!chan.members.map(x => x.id).includes(userDto!.id)) {
            chan.join({
                name: userDto!.name,
                id: userDto!.id,
                login: userDto!.login,
                passwordHash: "",
                logo: null
            });
        }
        return chan;

    }
    friendsRepository: IFriendRepository = provider.IFriendRepository.get();
    talkRepository: ITalkRepository = provider.ITalkRepository.get();

    async getAvailableVoiceChannels(id: string): Promise<IVoiceChannel[]> {
        let friendVchs = await this.friendsRepository.getFriends(id);
        let talksVchs = await this.talkRepository.getAllById(id);

        let vchs = [...friendVchs.map(x => new VoiceChannel(x.id, 'user')),
        ...talksVchs.filter(x => x.type != 'user')
            .map(x => new VoiceChannel(x.id,
                x.type == "user" ? 'user' : 'group'
            ))];

        return vchs;
    }

};