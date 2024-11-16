import { Socket } from "socket.io";
import SHA256 from '../../crypto/sha256';
import jwt from 'jsonwebtoken';
import { provider } from "../..";
import { IUserService } from "../Services/IUserService";


const userController = (socket: Socket) => {
    const userService: IUserService = provider.IUserService.get();

    return {
        login: async (login: string, password: string) => {

            if (!login || !password) {
                socket.emit('users.error', 'Empty fields');
                return;
            }

            let token = await userService.login(login,password);            

            if (token == null) {
                socket.emit('users.error', 'Bad login/password.');
                return;
            }

            socket.emit('users.loginSuccessful', { token });
        },
        signup: async (name: string, login: string, password: string) => {

            if (!name || !login || !password) {
                socket.emit('users.error', 'Bad request');
            }

            try {
                let user = await userService.signup(name,login,password);

                socket.emit('users.userCreated', {
                    name: user?.name,
                    login: user?.login
                });

            }
            catch {
                socket.emit('users.error', 'Bad credentials');
            }
        }
    }
}

export default userController