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
exports.useRestAuth = exports.AuthMiddleware = exports.identificateSocket = exports.AuthRepository = exports.socketMap = void 0;
const __1 = require("../..");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.socketMap = new Map();
class AuthRepository {
    addSession(id, socket) {
        return __awaiter(this, void 0, void 0, function* () {
            let sm;
            sm = exports.socketMap.get(id);
            if (!sm)
                sm = [];
            sm.push(socket);
            exports.socketMap.set(id, sm);
        });
    }
}
exports.AuthRepository = AuthRepository;
const identificateSocket = (socket) => {
    var _a;
    let userN = undefined;
    for (let id of exports.socketMap.keys()) {
        if ((_a = exports.socketMap.get(id)) === null || _a === void 0 ? void 0 : _a.includes(socket))
            userN = id;
    }
    return userN;
};
exports.identificateSocket = identificateSocket;
const AuthMiddleware = (socket) => (next) => (...args) => {
    let id = (0, exports.identificateSocket)(socket);
    if (id) {
        let res = next({ id }, ...args);
        return res;
    }
    return;
};
exports.AuthMiddleware = AuthMiddleware;
const useRestAuth = (next) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization)
        return res.json("Error Authorization");
    let token = req.headers.authorization.split(' ')[1];
    let decoded = jsonwebtoken_1.default.verify(token, `${process.env.JWT_PRIVATE_KEY}`);
    let login;
    if (typeof (decoded) === "string") {
        login = JSON.parse(decoded).login;
    }
    else {
        login = decoded.login;
    }
    let userRepository = __1.provider.IUserRepository.get();
    res.locals.authUserId = yield userRepository.getIdByLogin(login);
    next(req, res);
});
exports.useRestAuth = useRestAuth;
