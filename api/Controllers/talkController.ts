import { Socket } from "socket.io";
import { AuthMiddleware } from "../Repositories/AuthRepository";
import { provider } from "../..";

export const talkController = (socket: Socket) => {
    let useAuth = AuthMiddleware(socket);
    let talkService = provider.ITalkService.get();
    return {
        getTalks: useAuth(async ({id}:{id:string}) => {
            let talks = await talkService.getAllById(id);
            socket.emit('talks.talksGot',{talks});
        }),
        //userTalk = userId
        //groupTalk = id
        getTalk: useAuth(async({id}:{id:string},talkId: string) => {
            let talk = await talkService.getTalkById(talkId,id);
            socket.emit('talks.talkGot',{talk});
        }),
        getMessages: useAuth(async ({id}:{id:string},talkId: string) => {
            let messages = await talkService.getMessages(talkId,id);
            socket.emit('talks.messagesAdd',{messages});
        }),
        createTalk: useAuth(async (
            {id}:{id:string},
            members:string[],
            type:'user'|'group')=>{
                let talk = await talkService.createTalk({
                    type, members
                }, id);

                socket.emit('talk.created',{talk});
        })
    };
}