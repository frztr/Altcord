import { CreateMessageDto } from "../Dto/Messages/CreateMessageDto";
import { MessageDto } from "../Dto/Messages/MessageDto";
import { SendMessageDto } from "../Dto/Messages/SendMessageDto";
import { CreateTalkDto } from "../Dto/Talks/CreateTalkDto";
import { TalkDto } from "../Dto/Talks/TalkDto";
import { UserDto } from "../Dto/User/UserDto";

export interface ITalkService {
    getTalkById(id:string,userId:string):Promise<TalkDto&{users:UserDto[]}>;
    getMessages(talkId:string,userId:string):Promise<MessageDto[]>
    sendMessage(
        createMessageDto:CreateMessageDto,
        {talkId,companionId}:
        {talkId?:string,companionId?: string}
    ):Promise<SendMessageDto>
    createTalk(talk:CreateTalkDto,userId: string):Promise<TalkDto>
    getAllById(userId:string): Promise<TalkDto[]>
}