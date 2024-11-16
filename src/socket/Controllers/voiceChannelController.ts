import { Socket } from "socket.io-client";
import { IVoiceChannel } from "../../api/IVoiceChannel";
import store, { dispatch } from "../../redux/store";
import { addChannel, selectById, setCurrentVoiceChannel, setVoiceChannels, updateChannel, updateVoiceChannelMembers } from "../../redux/voiceChannelReducer";
import { channel } from "diagnostics_channel";
import { getUserInfo } from "../../redux/userReducer";
import { pcManager } from "../../PeerConnectionManager";
import { IVoiceChannelMember } from "../../api/IVoiceChannelMember";

const voiceChannelController = (socket: Socket) => ({
    availableChannelsGot: (channels: IVoiceChannel[]) => {

        // let vchs = channels.map(x=>new VoiceChannel(x));
        // dispatch(setVoiceChannels(vchs));
        dispatch(setVoiceChannels(channels));
    },
    userConnectedtoChannel: (channel: any) => {
        // console.log('voice.userConnectedtoChannel',channel);
        let ch = selectById(channel.id)(store.getState());
        // console.log({ch,channel});
        if (!ch) {
            // dispatch(addChannel(new VoiceChannel(channel)));
            dispatch(addChannel({
                ...channel,
                members: (channel.members as []).map(x=>({id:x}))
            }))
        }
        else {
            console.log({ ch, channel });
            dispatch(updateVoiceChannelMembers({
                id: ch.id,
                members: (channel.members as []).map(x=>({id:x}))
            }));
            // ch.members = channel.members;


            // let ch2 = selectById(channel.id)(store.getState());
            // console.log({
            //     diff: ch.members,
            //     actual: ch2.members
            // })


            // dispatch(updateChannel({
            //     id: "",
            //     changes: new VoiceChannel(channel)
            // }));
        }

    },
    connected: (channelInfo: any) => {
        // if (channelInfo.id != this.id) return;
        let user = getUserInfo(store.getState());
        let members: IVoiceChannelMember[] = (channelInfo.members as any[])
            .map(x => ({ id: x, connectionStatus: 'idle' }));
        dispatch(updateVoiceChannelMembers({
            id: channelInfo.id,
            members: members
        }));

        members.filter(x => x != user.id).map(async x => {
            await pcManager.createConnectionWithPeer(x.id);
        });

        dispatch(setCurrentVoiceChannel(channelInfo.id));

    },
    offerGot: async ({ from, sdpObject }:
        {
            from: string,
            sdpObject: any
        }) => {

        await pcManager.acceptConnectionFromPeer({ from, sdpObject });
    }
})

export default voiceChannelController