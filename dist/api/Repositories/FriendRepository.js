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
exports.FriendRepository = void 0;
const client_1 = require("@prisma/client");
class FriendRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    acceptFriendRequest(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prisma.user.update({
                    data: {
                        friendRequestFrom: {
                            disconnect: [{
                                    id: userId
                                }]
                        },
                        friendRequestTo: {
                            disconnect: [{
                                    id: id
                                }]
                        },
                        isFriendsWith: {
                            connect: [{
                                    id: userId
                                }]
                        }
                    },
                    where: {
                        id
                    }
                });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    declineFriendRequest(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prisma.user.update({
                    data: {
                        friendRequestFrom: {
                            disconnect: [{
                                    id: userId
                                }]
                        },
                        friendRequestTo: {
                            disconnect: [{
                                    id
                                }]
                        }
                    },
                    where: {
                        id
                    }
                });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    userAddFriendRequest(id, friendLogin) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.user.update({
                where: {
                    id
                },
                data: {
                    friendRequestTo: {
                        connect: [
                            {
                                login: friendLogin
                            }
                        ]
                    }
                },
                include: {
                    isFriendsWith: true,
                    areFriendsWithHim: true
                }
            });
        });
    }
    getFriendRequests(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.prisma.user.findFirst({
                where: {
                    id: userId
                },
                include: {
                    friendRequestFrom: true
                }
            });
            return (user === null || user === void 0 ? void 0 : user.friendRequestFrom) || [];
        });
    }
    getFriends(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            let userData = yield this.prisma.user.findFirst({
                where: {
                    id: {
                        equals: id
                    }
                },
                include: {
                    isFriendsWith: true,
                    areFriendsWithHim: true
                }
            });
            return [
                ...((_a = userData === null || userData === void 0 ? void 0 : userData.isFriendsWith) !== null && _a !== void 0 ? _a : []),
                ...((_b = userData === null || userData === void 0 ? void 0 : userData.areFriendsWithHim) !== null && _b !== void 0 ? _b : [])
            ];
        });
    }
}
exports.FriendRepository = FriendRepository;
