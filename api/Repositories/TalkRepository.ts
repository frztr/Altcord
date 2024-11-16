import { PrismaClient } from "@prisma/client";
import { MessageDto } from "../Dto/Messages/MessageDto";
import { TalkDto } from "../Dto/Talks/TalkDto";
import { ITalkRepository } from "./ITalkRepository";
import { CreateTalkDto } from "../Dto/Talks/CreateTalkDto";
import { CreateMessageDto } from "../Dto/Messages/CreateMessageDto";

export class TalkRepository implements ITalkRepository {
    async getUserTalk(userId: string, companionId: string): Promise<TalkDto> {
        let talk = await this.prisma.talk.findFirst({
            where: {
                talktype: {
                    name: 'user'
                },
                AND: [
                    {
                        TalkMembers: {
                            some: {
                                userId: userId
                            },
                        }
                    },
                    {
                        TalkMembers: {
                            some: {
                                userId: companionId
                            }
                        }
                    }]
            },
            include: {
                TalkMembers: true,
                talktype: {
                    select: {
                        name: true
                    }
                },
                Message: true
            }
        });
        if (!talk) throw new Error("UserTalk not found");

        return new TalkDto(
            talk?.id,
            talk?.talktype.name,
            talk.TalkMembers.map(x => x.userId),
            talk.Message.map(x => new MessageDto(x))
        );
    }
    async getTalkById(id: string): Promise<TalkDto> {
        let talk = await this.prisma.talk.findFirst({
            where: {
                id: {
                    equals: id
                }
            },
            include: {
                talktype: {
                    select: {
                        name: true
                    }
                },
                TalkMembers: true,
                Message: true
            }
        });
        if (!talk) throw new Error("Talk not found");

        return new TalkDto(
            talk?.id,
            talk?.talktype.name,
            talk.TalkMembers.map(x => x.userId),
            talk.Message.map(x => new MessageDto(x))
        )
    }
    async getMessages(talkId: string): Promise<MessageDto[]> {
        let messages = await this.prisma.message.findMany({
            where: {
                talkId: talkId
            },
            orderBy: {
                timestamp: 'desc'
            }
        });

        return messages.map(x => new MessageDto(x));
    }
    async sendMessage(messageDto: CreateMessageDto, talkId: string): Promise<MessageDto> {
        let res = await this.prisma.message.create({
            data: {
                ...messageDto,
                timestamp: BigInt(messageDto.timestamp),
                talkId: talkId 
            }
        });
        return new MessageDto(res);
    }
    async createTalk(talk: CreateTalkDto): Promise<TalkDto> {
        let res = await this.prisma.talk.create({
            data: {
                TalkMembers: {
                    createMany: {
                        data: [
                            ...talk.members.map(x => ({ userId: x }))
                        ]
                    }
                },
                talktype: {
                    connectOrCreate: {
                        where: {
                            name: talk.type
                        },
                        create: {
                            name: talk.type
                        }
                    }
                }
            },
            include: {
                TalkMembers: true,
                talktype: {
                    select: {
                        name: true,
                    }
                }
            }
        });
        let talkDto = new TalkDto(
            res.id,
            res.talktype.name,
            res.TalkMembers.map(x => x.userId),
        )

        return talkDto;
    }
    prisma = new PrismaClient()
    async getAllById(userId: string): Promise<TalkDto[]> {
        let talks = await this.prisma.talk.findMany({
            where: {
                TalkMembers: {
                    some: {
                        userId: {
                            equals: userId
                        }
                    }
                }
            },
            include: {
                TalkMembers: true,
                talktype: {
                    select: {
                        name: true
                    }
                },
                Message: true
            }
        });
        return talks.map(x => (new TalkDto(
            x.id,
            x.talktype.name,
            x.TalkMembers.map(t => t.userId),
            x.Message.map(y => (new MessageDto(y)))
        )));
    }
}