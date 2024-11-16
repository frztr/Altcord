import { IVoiceChannel } from "../Entities/IVoiceChannel";

export interface IVoiceService {
    getAvailableVoiceChannels(id:string): Promise<IVoiceChannel[]>;
    connect(id:string,channelId:string): Promise<IVoiceChannel>
}