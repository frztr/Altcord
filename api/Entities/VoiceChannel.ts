import { User } from "@prisma/client";
import { IVoiceChannel } from "./IVoiceChannel";
import { IVoiceChannelsRepository } from "../Repositories/IVoiceChannelsRepository";
import { provider } from "../..";

export class VoiceChannel implements IVoiceChannel {
    private voiceChannelRepository: IVoiceChannelsRepository = provider.IVoiceChannelRepository.get();
    constructor(id: string, type: 'user' | 'group') {
        this.id = id;
        this.unique_id = id;
        this.type = type;
        try {
            this.unique_id = this.voiceChannelRepository.getUniqueId(type, id);
            let activeVoiceChannel: IVoiceChannel = this.voiceChannelRepository.getById(this.unique_id);
            id = activeVoiceChannel.id;
            this.members = activeVoiceChannel.members;
        }
        catch(e) {
            // console.log(e);
        }
    }

    members: User[] = [];

    type: "user" | "group";
    id: string;
    unique_id: string;
    active: boolean = false;

    join(user: User): void {
        if (!this.active) {
            this.voiceChannelRepository.push(this);
            this.active = true;
            this.members.push(user);
        }
    }
    leave(user: User): void {
        throw new Error("Method not implemented.");
    }

}