export class CreateTalkDto{
    type!:'user'|'group';
    members: string[] = [];
}