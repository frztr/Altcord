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
const client_1 = require("@prisma/client");
const authController_1 = require("./Controllers/authController");
const prisma = new client_1.PrismaClient();
const friendController = (socket) => {
    let useAuth = (0, authController_1.AuthMiddleware)(socket);
    return {
        addFriendRequest: useAuth((_a, friendName_1) => __awaiter(void 0, [_a, friendName_1], void 0, function* ({ username }, friendName) {
            console.log({ friendName, username });
            try {
                let user = yield prisma.user.update({
                    where: {
                        name: username
                    },
                    data: {
                        friendRequestTo: {
                            connect: [
                                {
                                    name: friendName
                                }
                            ]
                        }
                    },
                    include: {
                        isFriendsWith: true,
                        areFriendsWithHim: true
                    }
                });
                socket.emit('users.getFriends', {
                    friends: [...user === null || user === void 0 ? void 0 : user.isFriendsWith, ...user === null || user === void 0 ? void 0 : user.areFriendsWithHim].map(x => x.id),
                    users: user === null || user === void 0 ? void 0 : user.isFriendsWith
                });
            }
            catch (e) {
                console.log(e);
            }
        }))
    };
};
exports.default = friendController;
