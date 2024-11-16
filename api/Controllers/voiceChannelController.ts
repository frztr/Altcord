import { Socket } from "socket.io";
import { provider } from "../..";
import { IVoiceService } from "../Services/IVoiceService";
import { AuthMiddleware, socketMap } from "../Repositories/AuthRepository";
import { VoiceChannel } from "../Entities/VoiceChannel";
import { IVoiceChannel } from "../Entities/IVoiceChannel";
import { User } from "@prisma/client";
import { VoiceChannelDto } from "../Dto/VoiceChannel/VoiceChannelDto";
import { IAuthService } from "../Services/IAuthService";
import { SdpObject } from "../Entities/SdpObject";
import { Candidate } from "../Entities/Candidate";

const voiceController = (socket: Socket) => {
    let voiceService: IVoiceService = provider.IVoiceService.get();
    let useAuth = AuthMiddleware(socket);

    return {
        getAvailableChannels: useAuth(async ({ id }: { id: string }) => {
            let vchans = await voiceService.getAvailableVoiceChannels(id);
            socket.emit('voice.availableChannelsGot', vchans.map(x => new VoiceChannelDto(x)));
        }),
        connect: useAuth(async ({ id }: { id: string }, channelId: string) => {
            let vch = await voiceService.connect(id, channelId);
            if (vch.type == 'user') {
                let sockets = socketMap.get(channelId);
                let outVch = new VoiceChannelDto(vch);
                outVch.id = id;
                sockets?.map(x => {
                    x.emit('voice.userConnectedtoChannel', outVch);
                });
            }
            socket.emit('voice.connected', new VoiceChannelDto(vch));
        }),
        sendSdp: useAuth(async ({ id }: { id: string },
            toId: string,
            sdpObject: SdpObject) => {
            
            let sockets = socketMap.get(toId);

            sockets?.map(x => {
                x.emit(`voice.${sdpObject.type}Got`, { 
                    from: id,
                    sdpObject 
                });
            });
        }),
        sendCandidate: useAuth(async ({ id }: { id: string }, 
            toId: string, 
            candidate: Candidate) => {
            let sockets = socketMap.get(toId);
            sockets?.map(x => {
                x.emit(`voice.${candidate.type}CandidateGot`,{
                    fromId: id,
                    candidate
                });
            });
        })
    }
}

export default voiceController