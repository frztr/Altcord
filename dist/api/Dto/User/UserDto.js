"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDto = void 0;
class UserDto {
    constructor(user) {
        var _a;
        this.id = user.id;
        this.name = user.name;
        this.login = user.login;
        this.logo = (_a = user.logo) !== null && _a !== void 0 ? _a : undefined;
    }
}
exports.UserDto = UserDto;
;
