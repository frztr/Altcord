import { PrismaClient, User } from "@prisma/client";
import { IUserRepository } from "./IUserRepository";
import { UserDto } from "../Dto/User/UserDto";

export class UserRepository implements IUserRepository {
    async getIdByLogin(login: string): Promise<string | null> {
        return (await this.prisma.user.findFirst({
            where:{
                login
            }
        }))?.id ?? null;
    }
    
    async getUsersByIds(ids: string[]): Promise<User[]> {
        let users = await this.prisma.user.findMany({
            where:{
                id: {in:ids}
            }
        });

        return users;
    }
    
    prisma = new PrismaClient();
    async getByLoginPassword(login: string, password: string): Promise<User | null> {

        let user = await this.prisma.user.findFirst({
            where: {
                login,
                passwordHash: password
            }
        });
        return user;
    }

    async getUserById(id: string): Promise<UserDto | null> {

        try {
            let user = await this.prisma.user.findFirst({
                select: {
                    id: true,
                    name: true,
                    login: true,
                    logo: true,
                    isFriendsWith: true,
                    areFriendsWithHim: true,
                    friendRequestFrom: true
                },
                where: {
                    id
                }
            });
            return {
                ...user!,
                logo: user?.logo ?? undefined
            };    
            
        }
        catch (e) {
            throw new Error();
        }        
    }

    async addUser(name: string, login: string, passwordHash: string): Promise<User | null> {
        let user = await this.prisma.user.create({
            data: {
                name,
                login,
                passwordHash
            }
        });

        return user;
    }

    

}