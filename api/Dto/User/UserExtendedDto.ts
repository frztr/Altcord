import { Server, Talk, User } from "@prisma/client";
import { UserDto } from "./UserDto";
import { TalkDto } from "../Talks/TalkDto";

export class UserExtendedDto 
// extends UserDto 
{
    id!: string;
    name!: string;
    login!: string;
    logo?: string;
    talks!: TalkDto[];
    servers!: Server[];
    friends!: string[];
    users!: UserDto[];
    friendRequests!: string[];
}