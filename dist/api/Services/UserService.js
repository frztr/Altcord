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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserService {
    constructor() {
        this.userRepository = __1.provider.IUserRepository.get();
        this.friendRepository = __1.provider.IFriendRepository.get();
        this.talkRepository = __1.provider.ITalkRepository.get();
        this.prisma = new client_1.PrismaClient();
    }
    login(login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.getByLoginPassword(login, (0, sha256_1.default)(password));
            if (!user)
                return null;
            let token = jsonwebtoken_1.default.sign({ login: user === null || user === void 0 ? void 0 : user.login }, `${process.env.JWT_PRIVATE_KEY}`);
            return token;
        });
    }
    signup(name, login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.addUser(name, login, (0, sha256_1.default)(password));
        });
    }
    getUserInfoById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.getUserById(id);
            let talks = yield this.talkRepository.getAllById(id);
            let servers = [{
                    id: "1",
                    name: "Server"
                }];
            let friends = yield this.friendRepository.getFriends(id);
            let friendRequests = yield this.friendRepository.getFriendRequests(id);
            let users = [
                ...friends,
                ...friendRequests
            ].filter(x => x.id != (user === null || user === void 0 ? void 0 : user.id)).map(x => {
                var _a;
                return ({
                    id: x.id,
                    login: x.login,
                    logo: (_a = (x.logo)) !== null && _a !== void 0 ? _a : undefined,
                    name: x.name
                });
            });
            return {
                id: user.id,
                login: user.login,
                logo: user === null || user === void 0 ? void 0 : user.logo,
                name: user.name,
                talks: talks,
                servers: servers,
                friends: friends.map(x => x.id),
                users: users,
                friendRequests: friendRequests.map(x => x.id)
            };
        });
    }
}
exports.default = UserService;
