"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalkRepository = void 0;
const client_1 = require("@prisma/client");
const MessageDto_1 = require("../Dto/Messages/MessageDto");
const TalkDto_1 = require("../Dto/Talks/TalkDto");
class TalkRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    getUserTalk(userId, companionId) {
        return __awaiter(this, void 0, void 0, function* () {
            let talk = yield this.prisma.talk.findFirst({
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
                        }
                    ]
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
            if (!talk)
                throw new Error("UserTalk not found");
            return new TalkDto_1.TalkDto(talk === null || talk === void 0 ? void 0 : talk.id, talk === null || talk === void 0 ? void 0 : talk.talktype.name, talk.TalkMembers.map(x => x.userId), talk.Message.map(x => new MessageDto_1.MessageDto(x)));
        });
    }
    getTalkById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let talk = yield this.prisma.talk.findFirst({
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
            if (!talk)
                throw new Error("Talk not found");
            return new TalkDto_1.TalkDto(talk === null || talk === void 0 ? void 0 : talk.id, talk === null || talk === void 0 ? void 0 : talk.talktype.name, talk.TalkMembers.map(x => x.userId), talk.Message.map(x => new MessageDto_1.MessageDto(x)));
        });
    }
    getMessages(talkId) {
        return __awaiter(this, void 0, void 0, function* () {
            let messages = yield this.prisma.message.findMany({
                where: {
                    talkId: talkId
                },
                orderBy: {
                    timestamp: 'desc'
                }
            });
            return messages.map(x => new MessageDto_1.MessageDto(x));
        });
    }
    sendMessage(messageDto, talkId) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.prisma.message.create({
                data: Object.assign(Object.assign({}, messageDto), { timestamp: BigInt(messageDto.timestamp), talkId: talkId })
            });
            return new MessageDto_1.MessageDto(res);
        });
    }
    createTalk(talk) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.prisma.talk.create({
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
            let talkDto = new TalkDto_1.TalkDto(res.id, res.talktype.name, res.TalkMembers.map(x => x.userId));
            return talkDto;
        });
    }
    getAllById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let talks = yield this.prisma.talk.findMany({
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
            return talks.map(x => (new TalkDto_1.TalkDto(x.id, x.talktype.name, x.TalkMembers.map(t => t.userId), x.Message.map(y => (new MessageDto_1.MessageDto(y))))));
        });
    }
}
exports.TalkRepository = TalkRepository;
