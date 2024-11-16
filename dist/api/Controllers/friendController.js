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
const AuthRepository_1 = require("../Repositories/AuthRepository");
const __1 = require("../..");
const friendController = (socket) => {
    let useAuth = (0, AuthRepository_1.AuthMiddleware)(socket);
    let friendService = __1.provider.IFriendService.get();
    return {
        addFriendRequest: useAuth((_a, friendLogin_1) => __awaiter(void 0, [_a, friendLogin_1], void 0, function* ({ id }, friendLogin) {
            var _b;
            try {
                let res = yield friendService.addFriend(id, friendLogin);
                let userSockets = (_b = AuthRepository_1.socketMap.get(res.requestId)) !== null && _b !== void 0 ? _b : [];
                userSockets.map(s => {
                    s.emit('friends.friendRequestsAdded', {
                        requestId: id,
                        user: res.user
                    });
                });
            }
            catch (e) {
                console.log(e);
            }
        })),
        acceptFriendRequest: useAuth((_a, userId_1) => __awaiter(void 0, [_a, userId_1], void 0, function* ({ id }, userId) {
            var _b, _c;
            let answer = yield friendService.acceptFriendRequest(id, userId);
            let userSockets = (_b = AuthRepository_1.socketMap.get(id)) !== null && _b !== void 0 ? _b : [];
            userSockets.map(s => {
                s.emit('friends.added', {
                    requestId: answer.requestId,
                    friend: answer.friend
                });
            });
            let friendSockets = (_c = AuthRepository_1.socketMap.get(answer.requestId)) !== null && _c !== void 0 ? _c : [];
            friendSockets.map(s => {
                s.emit("friends.added", {
                    requestId: id,
                    friend: answer.user
                });
            });
        })),
        declineFriendRequest: useAuth((_a, userId_1) => __awaiter(void 0, [_a, userId_1], void 0, function* ({ id }, userId) {
            let answer = yield friendService.declineFriendRequest(id, userId);
            socket.emit('friends.requestDeclined', {
                requestId: answer.requestId
            });
        }))
    };
};
exports.default = friendController;
