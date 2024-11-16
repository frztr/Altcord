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
const sha256_1 = __importDefault(require("../crypto/sha256"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const userController = (socket) => ({
    login: (login, password) => __awaiter(void 0, void 0, void 0, function* () {
        if (!login || !password) {
            socket.emit('users.error', 'Empty fields');
            return;
        }
        let user = yield prisma.user.findFirst({
            where: {
                login: login,
                passwordHash: (0, sha256_1.default)(password)
            }
        });
        let token = jsonwebtoken_1.default.sign({ username: user === null || user === void 0 ? void 0 : user.name }, `${process.env.JWT_PRIVATE_KEY}`);
        if (user == null) {
            socket.emit('users.error', 'Bad login/password.');
            return;
        }
        socket.emit('users.loginSuccessful', { token });
    }),
    signup: (name, login, password) => __awaiter(void 0, void 0, void 0, function* () {
        if (!name || !login || !password) {
            socket.emit('users.error', 'Bad request');
        }
        let hash = (0, sha256_1.default)(password);
        try {
            let user = yield prisma.user.create({
                data: {
                    name,
                    login,
                    passwordHash: hash
                }
            });
            socket.emit('users.userCreated', {
                name: user.name,
                login: user.login
            });
        }
        catch (_a) {
            socket.emit('users.error', 'Bad credentials');
        }
    })
});
exports.default = userController;
