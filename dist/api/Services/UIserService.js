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
const client_1 = require("@prisma/client");
const __1 = require("../..");
const sha256_1 = __importDefault(require("../../crypto/sha256"));
class userService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
        this.userRepository = __1.provider.IUserRepository;
    }
    getUserByLoginPasswordHash(login, password) {
        let user = this.userRepository.getByLoginPassword(login, (0, sha256_1.default)(password));
        return user;
    }
    createUser(name, login, password) {
        throw new Error("Method not implemented.");
    }
    getUserInfoByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.prisma.user.findFirst({
                select: {
                    id: true,
                    name: true,
                    login: true,
                    logo: true,
                    isFriendsWith: true,
                    areFriendsWithHim: true,
                    friendRequestFrom: true
                },
                where: {
                    name: username
                }
            });
            let talks = [
                {
                    id: "2",
                    type: 'user',
                    members: ["2"],
                    messages: []
                },
                {
                    id: "1",
                    type: 'user',
                    members: ["1"],
                    messages: [{
                            id: "123",
                            timestamp: "01.02.1970",
                            from: "1",
                            image: "https://i.pinimg.com/originals/d2/5f/4c/d25f4c8d98b5fb547ba14976fbe0daf5.jpg"
                        },
                        {
                            id: "124",
                            timestamp: "01.03.1970",
                            from: "AEZAKMI",
                            image: "https://avatars.mds.yandex.net/get-shedevrum/12161431/cropped_original_8c78be05ffca11ee80f4ae5494798a57/orig"
                        },
                        {
                            id: "125",
                            timestamp: "01.04.1970",
                            from: "1",
                            image: "https://i.pinimg.com/originals/d2/5f/4c/d25f4c8d98b5fb547ba14976fbe0daf5.jpg"
                        },
                        {
                            id: "126",
                            timestamp: "01.05.1970",
                            from: "1",
                            image: "https://avatars.mds.yandex.net/i?id=a3c723338d1999d8dc743868f638444b_l-4576423-images-thumbs&n=13"
                        }]
                }
            ];
            let servers = [{
                    id: "1",
                    name: "Server"
                }];
            let friends = [...((user === null || user === void 0 ? void 0 : user.isFriendsWith) || []),
                ...((user === null || user === void 0 ? void 0 : user.areFriendsWithHim) || [])];
            let friendRequests = (user === null || user === void 0 ? void 0 : user.friendRequestFrom) || [];
            let users = [
                ...friends,
                ...friendRequests
            ].filter(x => x.id != (user === null || user === void 0 ? void 0 : user.id));
            return {
                id: user === null || user === void 0 ? void 0 : user.id,
                name: user === null || user === void 0 ? void 0 : user.name,
                logo: user === null || user === void 0 ? void 0 : user.logo,
                talks: talks,
                servers: servers,
                friends: friends.map(x => x.id),
                users: users,
                friendRequests: friendRequests.map(x => x.id)
            };
        });
    }
}
exports.default = userService;
