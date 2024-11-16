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
const __1 = require("../..");
const AuthRepository_1 = require("../Repositories/AuthRepository");
const VoiceChannelDto_1 = require("../Dto/VoiceChannel/VoiceChannelDto");
const voiceController = (socket) => {
    let voiceService = __1.provider.IVoiceService.get();
    let useAuth = (0, AuthRepository_1.AuthMiddleware)(socket);
    return {
        getAvailableChannels: useAuth((_a) => __awaiter(void 0, [_a], void 0, function* ({ id }) {
            let vchans = yield voiceService.getAvailableVoiceChannels(id);
            socket.emit('voice.availableChannelsGot', vchans.map(x => new VoiceChannelDto_1.VoiceChannelDto(x)));
        })),
        connect: useAuth((_a, channelId_1) => __awaiter(void 0, [_a, channelId_1], void 0, function* ({ id }, channelId) {
            let vch = yield voiceService.connect(id, channelId);
            if (vch.type == 'user') {
                let sockets = AuthRepository_1.socketMap.get(channelId);
                let outVch = new VoiceChannelDto_1.VoiceChannelDto(vch);
                outVch.id = id;
                sockets === null || sockets === void 0 ? void 0 : sockets.map(x => {
                    x.emit('voice.userConnectedtoChannel', outVch);
                });
            }
            socket.emit('voice.connected', new VoiceChannelDto_1.VoiceChannelDto(vch));
        })),
        sendSdp: useAuth((_a, toId_1, sdpObject_1) => __awaiter(void 0, [_a, toId_1, sdpObject_1], void 0, function* ({ id }, toId, sdpObject) {
            let sockets = AuthRepository_1.socketMap.get(toId);
            sockets === null || sockets === void 0 ? void 0 : sockets.map(x => {
                x.emit(`voice.${sdpObject.type}Got`, {
                    from: id,
                    sdpObject
                });
            });
        })),
        sendCandidate: useAuth((_a, toId_1, candidate_1) => __awaiter(void 0, [_a, toId_1, candidate_1], void 0, function* ({ id }, toId, candidate) {
            let sockets = AuthRepository_1.socketMap.get(toId);
            sockets === null || sockets === void 0 ? void 0 : sockets.map(x => {
                x.emit(`voice.${candidate.type}CandidateGot`, {
                    fromId: id,
                    candidate
                });
            });
        }))
    };
};
exports.default = voiceController;
