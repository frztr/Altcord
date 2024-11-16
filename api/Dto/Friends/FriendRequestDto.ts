import { UserDto } from "../User/UserDto";

export class FriendsAndRequestsDto {
    requestId!:string;
    user?: UserDto;
    friend?: UserDto;
};