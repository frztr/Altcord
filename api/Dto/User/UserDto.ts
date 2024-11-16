import { User } from "@prisma/client";

export class UserDto {
    constructor(user:User){
        this.id = user.id;
        this.name = user.name;
        this.login = user.login;
        this.logo = user.logo??undefined;
    }

    id!: string;
    name!: string;
    login!: string;
    logo?: string;
};