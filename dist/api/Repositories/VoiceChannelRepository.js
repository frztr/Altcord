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
exports.VoiceChannelRepository = void 0;
const uuid_1 = require("uuid");
class VoiceChannelRepository {
    constructor() {
        this.activeVoiceChannels = new Map();
    }
    getUniqueId(type, id) {
        let activeChannels = Array.from(this.activeVoiceChannels);
        let channel;
        if (type == 'user') {
            channel = activeChannels.filter(x => x[1].type == 'user' &&
                x[1].members.map(y => y.id).includes(id))[0];
            if (!channel)
                channel = activeChannels.filter(x => x[1].id == id)[0];
        }
        else {
            channel = activeChannels.filter(x => x[1].id == id)[0];
        }
        if (!channel)
            throw new Error("Voicechannel not found");
        return channel[0];
    }
    getById(id) {
        let voiceChannel = this.activeVoiceChannels.get(id);
        if (!voiceChannel)
            throw new Error("VoiceChannelNotFound");
        return voiceChannel;
    }
    push(voiceChannel) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = (0, uuid_1.v4)();
            this.activeVoiceChannels.set(id, voiceChannel);
        });
    }
}
exports.VoiceChannelRepository = VoiceChannelRepository;
