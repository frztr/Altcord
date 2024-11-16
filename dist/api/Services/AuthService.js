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
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const __1 = require("../..");
class AuthService {
    constructor() {
        this.userRepository = __1.provider.IUserRepository.get();
        this.authRepository = __1.provider.IAuthRepository.get();
    }
    createSession(token, socket) {
        return __awaiter(this, void 0, void 0, function* () {
            var decoded = jsonwebtoken_1.default.verify(token, `${process.env.JWT_PRIVATE_KEY}`);
            let login;
            if (typeof (decoded) === "string") {
                login = JSON.parse(decoded).login;
            }
            else {
                login = decoded.login;
            }
            let id = yield this.userRepository.getIdByLogin(login);
            this.authRepository.addSession(id, socket);
            return id;
        });
    }
}
exports.AuthService = AuthService;
