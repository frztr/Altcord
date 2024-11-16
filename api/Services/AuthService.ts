import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { IAuthService } from './IAuthService';
import { IUserRepository } from '../Repositories/IUserRepository';
import { provider } from '../..';
import { IAuthRepository } from '../Repositories/IAuthRepository';


export class AuthService implements IAuthService {
    userRepository:IUserRepository = provider.IUserRepository.get();
    authRepository: IAuthRepository = provider.IAuthRepository.get();

    async createSession(token: string, socket: Socket): Promise<string | null>{
        
        var decoded = jwt.verify(token, `${process.env.JWT_PRIVATE_KEY}`);
        
        let login: string;
        if (typeof (decoded) === "string") {
            login = JSON.parse(decoded).login;
        }
        else {
            login = decoded.login;
        }

        let id = await this.userRepository.getIdByLogin(login);
        
        this.authRepository.addSession(id!,socket);

        return id;
    } 
}

