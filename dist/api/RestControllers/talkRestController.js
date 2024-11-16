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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRestContoller = void 0;
const __1 = require("../..");
const express_1 = __importDefault(require("express"));
const AuthRepository_1 = require("../Repositories/AuthRepository");
const TalkRestController = () => {
    return {
        // sendMessage: useRestAuth(async (
        //     req: Request,
        //     res: Response) => {
        //     try {
        //         let talkService: ITalkService = provider.ITalkService.get();
        //         let { message, talkId, companionId } = req.body;
        //         let { authUserId } = res.locals;
        //         let SendMessageDto = await talkService.sendMessage({
        //             timestamp: message.timestamp,
        //             fromId: authUserId,
        //             text: message.text,
        //             image: message.image
        //         }, {
        //             talkId, companionId
        //         });
        //         let answer = {
        //             message: SendMessageDto.message,
        //             talk: { ...SendMessageDto.talk, messages: undefined }
        //         };
        //         SendMessageDto.talk.members.filter(x => x != authUserId).map(x => {
        //             let sockets = socketMap.get(x);
        //             sockets?.map(y => {
        //                 y.emit('talks.messageGot',
        //                     answer
        //                 );
        //             });
        //         });
        //         res.json(answer);
        //     }
        //     catch (e) {
        //         res.json({ error: (e as Error).message });
        //     }
        // })
        sendMessage: (0, AuthRepository_1.useRestAuth)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let talkService = __1.provider.ITalkService.get();
                let { message, talkId } = req.body;
                let { authUserId } = res.locals;
                let SendMessageDto = yield talkService.sendMessage({
                    timestamp: message.timestamp,
                    fromId: authUserId,
                    text: message.text,
                    image: message.image
                }, { talkId });
                let answer = {
                    message: SendMessageDto.message,
                    talk: Object.assign(Object.assign({}, SendMessageDto.talk), { messages: undefined })
                };
                if (answer.talk.type == 'user') {
                    SendMessageDto.talk.members
                        // .filter(x => x != authUserId)
                        .map(x => {
                        let sockets = AuthRepository_1.socketMap.get(x);
                        // console.log({x,socks: sockets?.map(s=>s.id)});
                        sockets === null || sockets === void 0 ? void 0 : sockets.map(y => {
                            y.emit('talks.messageGot', Object.assign(Object.assign({}, answer), { talk: Object.assign(Object.assign({}, answer.talk), { id: SendMessageDto.talk
                                        .members.filter(t => t != x)[0] }) }));
                        });
                    });
                    res.json(Object.assign(Object.assign({}, answer), { talk: Object.assign(Object.assign({}, answer.talk), { id: talkId }) }));
                }
                else {
                    SendMessageDto.talk.members.filter(x => x != authUserId).map(x => {
                        let sockets = AuthRepository_1.socketMap.get(x);
                        sockets === null || sockets === void 0 ? void 0 : sockets.map(y => {
                            y.emit('talks.messageGot', answer);
                        });
                    });
                    res.json(answer);
                }
            }
            catch (e) {
                res.json({ error: e.message });
            }
        }))
    };
};
var talkRestCntrller = express_1.default.Router();
talkRestCntrller.all('/sendMessage', 
//     async (req, res) => {
//     let talkService: ITalkService = provider.ITalkService.get();
//     let talk = await talkService.getAllById("ffd49400-a9de-4fb7-95bd-14a724083f41");
//     res.json({ talk });
// }
TalkRestController()['sendMessage']);
exports.taskRestContoller = talkRestCntrller;
exports.default = TalkRestController;
