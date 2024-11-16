"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalkDto = void 0;
class TalkDto {
    constructor(id, type, members = [], messages = []) {
        this.id = id;
        this.type = type;
        this.members = members;
        this.messages = messages;
    }
}
exports.TalkDto = TalkDto;
;
