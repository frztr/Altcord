"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceChannelDto = void 0;
class VoiceChannelDto {
    constructor(vch) {
        this.id = vch.id;
        this.members = vch.members.map(x => x.id);
        this.type = vch.type;
    }
}
exports.VoiceChannelDto = VoiceChannelDto;
