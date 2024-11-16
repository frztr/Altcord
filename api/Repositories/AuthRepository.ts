import { Socket } from "socket.io";
import { IUserRepository } from "./IUserRepository";
import { provider } from "../..";
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";

export const socketMap: Map<string, Socket[]> = new Map<string, Socket[]>();
export class AuthRepository {
    async addSession(id: string, socket: Socket): Promise<void> {
        let sm: Socket[] | undefined;
        sm = socketMap.get(id);
        if (!sm) sm = [];
        sm.push(socket);

        socketMap.set(id!, sm);
    }
}

export const identificateSocket = (socket: Socket) => {
    let userN = undefined;
    for (let id of socketMap.keys()) {
        if (socketMap.get(id)?.includes(socket)) userN = id;

    }
    return userN;
}

export type authedFunc = ({ id }: { id: string }, ...args: any[]) => any

export const AuthMiddleware = (socket: Socket) => (next: authedFunc) => (...args: any[]) => {
    let id = identificateSocket(socket);
    if (id) {
        let res = next({ id }, ...args)
        return res;
    }
    return;
}

type middlewareFunc = (next: Function) => (req: Request, res: Response) => any;

export const useRestAuth: middlewareFunc = (next: Function) =>
    async (
        req: Request,
        res: Response
    ): Promise<any> => {
        if (!req.headers.authorization) return res.json("Error Authorization");
        let token = req.headers.authorization!.split(' ')[1];
        let decoded = jwt.verify(token, `${process.env.JWT_PRIVATE_KEY}`);
        let login: string;
        if (typeof (decoded) === "string") {
            login = JSON.parse(decoded).login;
        }
        else {
            login = decoded.login;
        }
        let userRepository: IUserRepository = provider.IUserRepository.get();
        res.locals.authUserId = await userRepository.getIdByLogin(login);
        next(req, res);
    }