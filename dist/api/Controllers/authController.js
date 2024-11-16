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
const __1 = require("../..");
const authController = (socket) => {
    const authService = __1.provider.IAuthService.get();
    const userService = __1.provider.IUserService.get();
    return {
        createSession: (token) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let id = yield authService.createSession(token, socket);
                let userInfo;
                if (id) {
                    userInfo = yield userService.getUserInfoById(id);
                }
                socket.emit('users.getUserInfo', Object.assign(Object.assign({}, userInfo), { talks: userInfo.talks.map(x => {
                        if (x.type == 'user') {
                            x.id = x.members.filter(y => y != id)[0];
                        }
                        return x;
                    }), status: 'online' }));
            }
            catch (e) {
                console.log(e);
            }
        })
    };
};
exports.default = authController;
