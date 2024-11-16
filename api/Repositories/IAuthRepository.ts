import { Socket } from "socket.io";

export interface IAuthRepository{
    addSession(id: string, socket: Socket): Promise<void>
}