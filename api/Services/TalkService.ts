import { provider } from "../..";
import { CreateMessageDto } from "../Dto/Messages/CreateMessageDto";
import { MessageDto } from "../Dto/Messages/MessageDto";
import { SendMessageDto } from "../Dto/Messages/SendMessageDto";
import { CreateTalkDto } from "../Dto/Talks/CreateTalkDto";
import { TalkDto } from "../Dto/Talks/TalkDto";
import { UserDto } from "../Dto/User/UserDto";
import { ITalkService } from "./ITalkService";

export class TalkService implements ITalkService {
    userRepository = provider.IUserRepository.get();
    talkRepository = provider.ITalkRepository.get();

    async getTalkById(id: string, userId: string): Promise<TalkDto & { users: UserDto[]; }> {
        let talk = await this.checkPermissionsToTalk(id, userId);
        let users = await this.userRepository.getUsersByIds(talk.members);
        return { ...talk, users: users.map(x => new UserDto(x)) };
    }
    async getMessages(talkId: string, userId: string): Promise<MessageDto[]> {
        let talk = await this.checkPermissionsToTalk(talkId, userId);
        let messages = await this.talkRepository.getMessages(talkId);
        return messages;
    }
    async sendMessage(
        createMessageDto: CreateMessageDto,
        { talkId }: { talkId: string }
    ): Promise<SendMessageDto> {
        let talk: TalkDto;
        try {
            talk = await this.talkRepository.getTalkById(talkId);
            console.log({talk});
        } catch {
            let user = await this.userRepository.getUserById(talkId);
            
            if (user) {
                try {
                    talk = await this.talkRepository.getUserTalk(createMessageDto.fromId, talkId);
                    console.log({user,usertalk:talk});
                }
                catch (e) {
                    talk = await this.talkRepository.createTalk({
                        type: "user",
                        members: [createMessageDto.fromId, talkId]
                    });
                }
            }
            else {
                throw new Error("Talk not found");
            }
        }

        let message = await this.talkRepository.sendMessage(createMessageDto, talk.id);

        return { message, talk };

    }
    async createTalk(talk: CreateTalkDto, userId: string): Promise<TalkDto> {
        if (!talk.members.includes(userId)) throw new Error("Bad data");
        let talkDto = await this.talkRepository.createTalk(talk);
        return talkDto;
    }
    async getAllById(userId: string): Promise<TalkDto[]> {
        return await this.talkRepository.getAllById(userId);
    }
    async checkPermissionsToTalk(talkId: string, userId: string): Promise<TalkDto> {
        let talk = await this.talkRepository.getTalkById(talkId);
        if (!talk.members.includes(userId)) throw new Error("No permissions");
        return talk;
    }

}