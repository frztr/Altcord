import { User } from "@prisma/client";

export interface IUserService {
    getUserInfoById(id:string): Promise<any>;
    signup(name:string, login:string, passwordHash:string): Promise<User | null>;
    login(login:string, password:string) : Promise<string | null>;
    
};