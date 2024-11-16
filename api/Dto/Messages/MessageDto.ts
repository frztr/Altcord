import { Message } from "@prisma/client";

export class MessageDto {

    constructor(message:Message){
        this.id = message.id;
        this.text = message.text??undefined;
        this.image = message.image ?? undefined;
        this.from = message.fromId;
        this.timestamp = message.timestamp.toString()
    }
    id!: string;
    timestamp!: string;
    from!: string;
    image?: string;
    text?: string;
}