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
exports.talkController = void 0;
const AuthRepository_1 = require("../Repositories/AuthRepository");
const __1 = require("../..");
const talkController = (socket) => {
    let useAuth = (0, AuthRepository_1.AuthMiddleware)(socket);
    let talkService = __1.provider.ITalkService.get();
    return {
        getTalks: useAuth((_a) => __awaiter(void 0, [_a], void 0, function* ({ id }) {
            let talks = yield talkService.getAllById(id);
            socket.emit('talks.talksGot', { talks });
        })),
        //userTalk = userId
        //groupTalk = id
        getTalk: useAuth((_a, talkId_1) => __awaiter(void 0, [_a, talkId_1], void 0, function* ({ id }, talkId) {
            let talk = yield talkService.getTalkById(talkId, id);
            socket.emit('talks.talkGot', { talk });
        })),
        getMessages: useAuth((_a, talkId_1) => __awaiter(void 0, [_a, talkId_1], void 0, function* ({ id }, talkId) {
            let messages = yield talkService.getMessages(talkId, id);
            socket.emit('talks.messagesAdd', { messages });
        })),
        createTalk: useAuth((_a, members_1, type_1) => __awaiter(void 0, [_a, members_1, type_1], void 0, function* ({ id }, members, type) {
            let talk = yield talkService.createTalk({
                type, members
            }, id);
            socket.emit('talk.created', { talk });
        }))
    };
};
exports.talkController = talkController;
