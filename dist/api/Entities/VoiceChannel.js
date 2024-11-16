"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceChannel = void 0;
const __1 = require("../..");
class VoiceChannel {
    constructor(id, type) {
        this.voiceChannelRepository = __1.provider.IVoiceChannelRepository.get();
        this.members = [];
        this.active = false;
        this.id = id;
        this.unique_id = id;
        this.type = type;
        try {
            this.unique_id = this.voiceChannelRepository.getUniqueId(type, id);
            let activeVoiceChannel = this.voiceChannelRepository.getById(this.unique_id);
            id = activeVoiceChannel.id;
            this.members = activeVoiceChannel.members;
        }
        catch (e) {
            // console.log(e);
        }
    }
    join(user) {
        if (!this.active) {
            this.voiceChannelRepository.push(this);
            this.active = true;
            this.members.push(user);
        }
    }
    leave(user) {
        throw new Error("Method not implemented.");
    }
}
exports.VoiceChannel = VoiceChannel;
