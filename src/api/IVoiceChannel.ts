import { IVoiceChannelMember } from "./IVoiceChannelMember";

export interface IVoiceChannel{
    id:string;
    members: IVoiceChannelMember[];
    type: 'user'| 'group';
    localStream?: MediaStream;
}