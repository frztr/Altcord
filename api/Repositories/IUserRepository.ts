import { User } from "@prisma/client";
import { UserDto } from "../Dto/User/UserDto";

export interface IUserRepository {
    getByLoginPassword(login:string, password:string) : Promise<User | null>;
    getUserById(id:string): Promise<UserDto | null>;
    addUser(name:string, login:string, passwordHash:string): Promise<User | null>;   
    getUsersByIds(ids:string[]):Promise<User[]>;  
    getIdByLogin(login:string) : Promise<string|null>;


   
}