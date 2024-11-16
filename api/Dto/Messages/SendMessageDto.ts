import { TalkDto } from "../Talks/TalkDto";
import { MessageDto } from "./MessageDto";

export class SendMessageDto{
    message!: MessageDto;
    talk!: TalkDto;
}