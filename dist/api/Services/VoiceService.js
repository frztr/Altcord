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
exports.VoiceService = void 0;
const __1 = require("../..");
const VoiceChannel_1 = require("../Entities/VoiceChannel");
class VoiceService {
    constructor() {
        this.userRepository = __1.provider.IUserRepository.get();
        this.friendsRepository = __1.provider.IFriendRepository.get();
        this.talkRepository = __1.provider.ITalkRepository.get();
    }
    connect(id, channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            let userDto = yield this.userRepository.getUserById(id);
            let channels = yield this.getAvailableVoiceChannels(id);
            let chan = channels.filter(x => x.id == channelId)[0];
            if (!chan.members.map(x => x.id).includes(userDto.id)) {
                chan.join({
                    name: userDto.name,
                    id: userDto.id,
                    login: userDto.login,
                    passwordHash: "",
                    logo: null
                });
            }
            return chan;
        });
    }
    getAvailableVoiceChannels(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let friendVchs = yield this.friendsRepository.getFriends(id);
            let talksVchs = yield this.talkRepository.getAllById(id);
            let vchs = [...friendVchs.map(x => new VoiceChannel_1.VoiceChannel(x.id, 'user')),
                ...talksVchs.filter(x => x.type != 'user')
                    .map(x => new VoiceChannel_1.VoiceChannel(x.id, x.type == "user" ? 'user' : 'group'))];
            return vchs;
        });
    }
}
exports.VoiceService = VoiceService;
;
