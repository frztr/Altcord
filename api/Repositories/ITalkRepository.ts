import { CreateMessageDto } from "../Dto/Messages/CreateMessageDto";
import { MessageDto } from "../Dto/Messages/MessageDto";
import { CreateTalkDto } from "../Dto/Talks/CreateTalkDto";
import { TalkDto } from "../Dto/Talks/TalkDto";

export interface ITalkRepository {
    getAllById(userId:string): Promise<TalkDto[]>;
    getTalkById(id:string):Promise<TalkDto>;
    getMessages(talkId:string):Promise<MessageDto[]>;
    sendMessage(messageDto:CreateMessageDto,talkId:string):Promise<MessageDto>;
    createTalk(talk: CreateTalkDto): Promise<TalkDto>;
    getUserTalk(userId:string,companionId:string): Promise<TalkDto>
};