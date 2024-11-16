import { Message } from "./message";
import { User } from "./user";

export class Talk
{
    id!: string
    type!:'user'|'group'
    members: string[] = []
    messages: Message[] = []
}