import { provider } from "../.."
import { ITalkService } from "../Services/ITalkService"
import express, { Response, Request } from 'express';
import { socketMap, useRestAuth } from "../Repositories/AuthRepository";
import { IncomingMessage } from "node:http";
import { MessageDto } from "../Dto/Messages/MessageDto";

const TalkRestController = (): any => {
    return {
        // sendMessage: useRestAuth(async (
        //     req: Request,
        //     res: Response) => {
        //     try {
        //         let talkService: ITalkService = provider.ITalkService.get();
        //         let { message, talkId, companionId } = req.body;
        //         let { authUserId } = res.locals;
        //         let SendMessageDto = await talkService.sendMessage({
        //             timestamp: message.timestamp,
        //             fromId: authUserId,
        //             text: message.text,
        //             image: message.image
        //         }, {
        //             talkId, companionId
        //         });

        //         let answer = {
        //             message: SendMessageDto.message,
        //             talk: { ...SendMessageDto.talk, messages: undefined }
        //         };

        //         SendMessageDto.talk.members.filter(x => x != authUserId).map(x => {
        //             let sockets = socketMap.get(x);
        //             sockets?.map(y => {
        //                 y.emit('talks.messageGot',
        //                     answer
        //                 );
        //             });
        //         });

        //         res.json(answer);
        //     }
        //     catch (e) {
        //         res.json({ error: (e as Error).message });
        //     }
        // })
        sendMessage: useRestAuth(async (
            req: Request,
            res: Response) => {
            try {
                let talkService: ITalkService = provider.ITalkService.get();
                let { message, talkId } = req.body;
                let { authUserId } = res.locals;
                let SendMessageDto = await talkService.sendMessage({
                    timestamp: message.timestamp,
                    fromId: authUserId,
                    text: message.text,
                    image: message.image
                }, { talkId });

                let answer = {
                    message: SendMessageDto.message,
                    talk: { ...SendMessageDto.talk, messages: undefined }
                };

                if (answer.talk.type == 'user') {
                    SendMessageDto.talk.members
                    // .filter(x => x != authUserId)
                    .map(x => {
                        let sockets = socketMap.get(x);
                        // console.log({x,socks: sockets?.map(s=>s.id)});
                        sockets?.map(y => {
                            y.emit('talks.messageGot',
                                {
                                    ...answer,
                                    talk: { ...answer.talk, 
                                        id: SendMessageDto.talk
                                        .members.filter(t=>t!=x)[0]}
                                }
                            );
                        });
                    });

                    res.json({
                        ...answer,
                        talk: { ...answer.talk, id: talkId }
                    });
                }
                else {
                    SendMessageDto.talk.members.filter(x => x != authUserId).map(x => {
                        let sockets = socketMap.get(x);
                        sockets?.map(y => {
                            y.emit('talks.messageGot',
                                answer
                            );
                        });
                    });

                    res.json(answer);
                }
            }
            catch (e) {
                res.json({ error: (e as Error).message });
            }
        })
    }
}


var talkRestCntrller = express.Router();

talkRestCntrller.all('/sendMessage',
    //     async (req, res) => {
    //     let talkService: ITalkService = provider.ITalkService.get();
    //     let talk = await talkService.getAllById("ffd49400-a9de-4fb7-95bd-14a724083f41");
    //     res.json({ talk });
    // }
    TalkRestController()['sendMessage']
);

export const taskRestContoller = talkRestCntrller;

export default TalkRestController