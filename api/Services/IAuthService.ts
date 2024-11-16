import { Socket } from "socket.io";

export interface IAuthService{
    createSession(token:string, socket:Socket):  Promise<string | null>;
}