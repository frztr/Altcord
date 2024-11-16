import { User } from "@prisma/client";
import { IVoiceChannel } from "../Entities/IVoiceChannel";
import { IVoiceChannelsRepository } from "./IVoiceChannelsRepository";
import { v4 } from "uuid";

export class VoiceChannelRepository implements IVoiceChannelsRepository {
    getUniqueId(type: "user" | "group", id: string): string {
        let activeChannels = Array.from(this.activeVoiceChannels);
        let channel;
        if (type == 'user') {
            channel = activeChannels.filter(x =>
                x[1].type == 'user' &&
                x[1].members.map(y => y.id).includes(id)
            )[0];

            if (!channel) channel = activeChannels.filter(x =>
                x[1].id == id
            )[0];

        }
        else {
            channel = activeChannels.filter(x =>
                x[1].id == id
            )[0];
        }

        if (!channel) throw new Error("Voicechannel not found");
        return channel[0];
    }

    activeVoiceChannels: Map<string, IVoiceChannel> = new Map<string, IVoiceChannel>();

    getById(id: string): IVoiceChannel {
        let voiceChannel = this.activeVoiceChannels.get(id);
        if (!voiceChannel) throw new Error("VoiceChannelNotFound");
        return voiceChannel;
    }

    async push(voiceChannel: IVoiceChannel) {
        let id = v4();
        this.activeVoiceChannels.set(id, voiceChannel);
    }


}