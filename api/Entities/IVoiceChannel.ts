import { User } from "@prisma/client";

export interface IVoiceChannel{
    id:string;
    unique_id:string;
    join(user:User):void;
    leave(user:User):void;
    type:'user'|'group';
    members:User[];
    // getInfo():void;
}