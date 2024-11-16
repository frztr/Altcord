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
exports.UserRepository = void 0;
const client_1 = require("@prisma/client");
class UserRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    getIdByLogin(login) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            return (_b = (_a = (yield this.prisma.user.findFirst({
                where: {
                    login
                }
            }))) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null;
        });
    }
    getUsersByIds(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            let users = yield this.prisma.user.findMany({
                where: {
                    id: { in: ids }
                }
            });
            return users;
        });
    }
    getByLoginPassword(login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.prisma.user.findFirst({
                where: {
                    login,
                    passwordHash: password
                }
            });
            return user;
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
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
                        id
                    }
                });
                return Object.assign(Object.assign({}, user), { logo: (_a = user === null || user === void 0 ? void 0 : user.logo) !== null && _a !== void 0 ? _a : undefined });
            }
            catch (e) {
                throw new Error();
            }
        });
    }
    addUser(name, login, passwordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.prisma.user.create({
                data: {
                    name,
                    login,
                    passwordHash
                }
            });
            return user;
        });
    }
}
exports.UserRepository = UserRepository;
