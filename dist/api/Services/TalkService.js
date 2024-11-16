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
exports.TalkService = void 0;
const __1 = require("../..");
const UserDto_1 = require("../Dto/User/UserDto");
class TalkService {
    constructor() {
        this.userRepository = __1.provider.IUserRepository.get();
        this.talkRepository = __1.provider.ITalkRepository.get();
    }
    getTalkById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let talk = yield this.checkPermissionsToTalk(id, userId);
            let users = yield this.userRepository.getUsersByIds(talk.members);
            return Object.assign(Object.assign({}, talk), { users: users.map(x => new UserDto_1.UserDto(x)) });
        });
    }
    getMessages(talkId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let talk = yield this.checkPermissionsToTalk(talkId, userId);
            let messages = yield this.talkRepository.getMessages(talkId);
            return messages;
        });
    }
    sendMessage(createMessageDto_1, _a) {
        return __awaiter(this, arguments, void 0, function* (createMessageDto, { talkId }) {
            let talk;
            try {
                talk = yield this.talkRepository.getTalkById(talkId);
                console.log({ talk });
            }
            catch (_b) {
                let user = yield this.userRepository.getUserById(talkId);
                if (user) {
                    try {
                        talk = yield this.talkRepository.getUserTalk(createMessageDto.fromId, talkId);
                        console.log({ user, usertalk: talk });
                    }
                    catch (e) {
                        talk = yield this.talkRepository.createTalk({
                            type: "user",
                            members: [createMessageDto.fromId, talkId]
                        });
                    }
                }
                else {
                    throw new Error("Talk not found");
                }
            }
            let message = yield this.talkRepository.sendMessage(createMessageDto, talk.id);
            return { message, talk };
        });
    }
    createTalk(talk, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!talk.members.includes(userId))
                throw new Error("Bad data");
            let talkDto = yield this.talkRepository.createTalk(talk);
            return talkDto;
        });
    }
    getAllById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.talkRepository.getAllById(userId);
        });
    }
    checkPermissionsToTalk(talkId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let talk = yield this.talkRepository.getTalkById(talkId);
            if (!talk.members.includes(userId))
                throw new Error("No permissions");
            return talk;
        });
    }
}
exports.TalkService = TalkService;
