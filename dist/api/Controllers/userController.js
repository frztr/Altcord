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
const userController = (socket) => {
    const userService = __1.provider.IUserService.get();
    return {
        login: (login, password) => __awaiter(void 0, void 0, void 0, function* () {
            if (!login || !password) {
                socket.emit('users.error', 'Empty fields');
                return;
            }
            let token = yield userService.login(login, password);
            if (token == null) {
                socket.emit('users.error', 'Bad login/password.');
                return;
            }
            socket.emit('users.loginSuccessful', { token });
        }),
        signup: (name, login, password) => __awaiter(void 0, void 0, void 0, function* () {
            if (!name || !login || !password) {
                socket.emit('users.error', 'Bad request');
            }
            try {
                let user = yield userService.signup(name, login, password);
                socket.emit('users.userCreated', {
                    name: user === null || user === void 0 ? void 0 : user.name,
                    login: user === null || user === void 0 ? void 0 : user.login
                });
            }
            catch (_a) {
                socket.emit('users.error', 'Bad credentials');
            }
        })
    };
};
exports.default = userController;
