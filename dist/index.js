"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restApp = exports.provider = exports.io = void 0;
const socket_io_1 = require("socket.io");
const userController_1 = __importDefault(require("./api/Controllers/userController"));
const authController_1 = __importDefault(require("./api/Controllers/authController"));
const friendController_1 = __importDefault(require("./api/Controllers/friendController"));
const UserService_1 = __importDefault(require("./api/Services/UserService"));
const UserRepository_1 = require("./api/Repositories/UserRepository");
const AuthService_1 = require("./api/Services/AuthService");
const AuthRepository_1 = require("./api/Repositories/AuthRepository");
const FriendRepository_1 = require("./api/Repositories/FriendRepository");
const FriendService_1 = require("./api/Services/FriendService");
const TalkRepository_1 = require("./api/Repositories/TalkRepository");
const TalkService_1 = require("./api/Services/TalkService");
const talkController_1 = require("./api/Controllers/talkController");
const express_1 = __importDefault(require("express"));
const talkRestController_1 = __importDefault(require("./api/RestControllers/talkRestController"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const voiceChannelController_1 = __importDefault(require("./api/Controllers/voiceChannelController"));
const VoiceService_1 = require("./api/Services/VoiceService");
const VoiceChannelRepository_1 = require("./api/Repositories/VoiceChannelRepository");
const socketPort = 5000;
const restPort = 8000;
const clientPort = 3000;
// const hostUrl = 'http://localhost';
const hostUrl = 'http://172.30.132.70';
exports.io = new socket_io_1.Server({
    cors: {
        origin: `${hostUrl}:${clientPort}`
    }
});
class Factory {
    constructor(type) {
        this.type = type;
    }
}
class Transient extends Factory {
    get() {
        return new this.type();
    }
}
class Singleton extends Factory {
    get() {
        if (!this.ent) {
            this.ent = new this.type();
        }
        return this.ent;
    }
}
exports.provider = {
    IUserService: new Singleton(UserService_1.default),
    IUserRepository: new Transient(UserRepository_1.UserRepository),
    IAuthService: new Singleton(AuthService_1.AuthService),
    IAuthRepository: new Singleton(AuthRepository_1.AuthRepository),
    IFriendRepository: new Transient(FriendRepository_1.FriendRepository),
    IFriendService: new Singleton(FriendService_1.FriendService),
    ITalkRepository: new Transient(TalkRepository_1.TalkRepository),
    ITalkService: new Singleton(TalkService_1.TalkService),
    IVoiceService: new Singleton(VoiceService_1.VoiceService),
    IVoiceChannelRepository: new Singleton(VoiceChannelRepository_1.VoiceChannelRepository)
};
const api = {
    users: userController_1.default,
    auth: authController_1.default,
    friends: friendController_1.default,
    talks: talkController_1.talkController,
    voice: voiceChannelController_1.default
};
exports.io.on('connection', (socket) => {
    console.log(`user connected ${socket.id}`);
    socket.onAny((eventName, ...args) => {
        let [controller, method] = eventName.split('.');
        if (!api[controller])
            return;
        let func = (api[controller](socket))[method];
        if (!func)
            return;
        func(...args);
    });
});
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    origin: `${hostUrl}:${clientPort}`,
    optionsSuccessStatus: 200,
}));
const restApi = {
    talks: (0, talkRestController_1.default)()
};
app.all('/:controller.:method', (req, res) => {
    let { controller, method } = req.params;
    if (!restApi[controller])
        res.json("Controller not found.");
    if (!restApi[controller][method])
        res.json("Method not found.");
    restApi[controller][method](req, res);
});
// app.use('/talks',taskRestContoller);
exports.io.listen(socketPort);
app.listen(restPort, () => {
    console.log(`restApi started on ${restPort}`);
});
exports.restApp = app;
