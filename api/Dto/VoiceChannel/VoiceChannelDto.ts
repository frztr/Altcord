import { User } from "@prisma/client";
import { UserDto } from "../User/UserDto";
import { IVoiceChannel } from "../../Entities/IVoiceChannel";

export class VoiceChannelDto{
    id:string;
    // members: UserDto[];
    members: string[];
    type: 'user'| 'group';
    constructor(vch:IVoiceChannel){
      this.id = vch.id;
      this.members = vch.members.map(x=>x.id);
      this.type = vch.type;
    }
}