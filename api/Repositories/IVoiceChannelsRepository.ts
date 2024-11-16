import { User } from "@prisma/client";
import { IVoiceChannel } from "../Entities/IVoiceChannel";

export interface IVoiceChannelsRepository{
    push(voiceChannel:IVoiceChannel):void;
    getById(id:string):IVoiceChannel;
    getUniqueId(type:'user'|'group',id:string):string;
}