"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDto = void 0;
class MessageDto {
    constructor(message) {
        var _a, _b;
        this.id = message.id;
        this.text = (_a = message.text) !== null && _a !== void 0 ? _a : undefined;
        this.image = (_b = message.image) !== null && _b !== void 0 ? _b : undefined;
        this.from = message.fromId;
        this.timestamp = message.timestamp.toString();
    }
}
exports.MessageDto = MessageDto;
