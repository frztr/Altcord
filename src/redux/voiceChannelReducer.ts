import { createEntityAdapter, createSelector, createSlice, current } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { IVoiceChannel } from "../api/IVoiceChannel";
import { User } from "./entities/user";

const voiceChannelsAdapter = createEntityAdapter<IVoiceChannel, string>({
    selectId: (model: IVoiceChannel) => model.id
})

const voiceChannelSlice = createSlice({
    name: "voiceChannels",
    initialState: voiceChannelsAdapter.getInitialState<
        { currentVoiceChannel?: string }
    >({}),
    reducers: {
        connectVoiceChannel: (state, action) => {
            state.currentVoiceChannel = action.payload
        },
        setVoiceChannels: voiceChannelsAdapter.setMany,
        updateChannel: voiceChannelsAdapter.updateOne,
        addChannel: voiceChannelsAdapter.addOne,
        setCurrentVoiceChannel: (state, action) => {
            state.currentVoiceChannel = action.payload
        },
        updateVoiceChannelMembers: (state, action) => {
            voiceChannelsAdapter.updateOne(state, {
                id: action.payload.id,
                changes:{
                members: action.payload.members
                }
            })
        }
        // updateVoiceChannelMembers: (state, action) => {
        //     let _state = current(state);

        //     let vch = _state.entities[action.payload.id];
        //     let nextMembers: User[] = action.payload.members;
        //     let oldmembers: User[] = nextMembers.filter(x => vch.members.map(y => y.id).includes(x.id));
        //     let newMembers: User[] = nextMembers.filter(x => !vch.members.map(y => y.id).includes(x.id));

        //     let ins = vch.members.map(x => {
        //         let memb = nextMembers.filter(y => y.id == x.id)[0];
        //         return { 
        //             ...x,
        //             ...memb,
        //             peerConnection: memb.peerConnection,
        //             remoteStream: memb.remoteStream
        //         };
        //     });

        //     // console.log(Object.keys(vch));
        //     voiceChannelsAdapter.updateOne(state, {
        //         id: action.payload.id,
        //         changes: 
        //         {
        //             // ...vch,
        //             id: vch.id,
        //             type: vch.type,
        //             localStream:vch.localStream,



        //             ///ФУНКЦИИ ПЫТАЮТСЯ ПОЛУЧИТЬ ДОСТУП К ПРЕДЫДУЩЕМУ ОБЪЕКТУ
        //             // connect: vch.connect,
        //             // initStreams: vch.initStreams,
        //             // createConnection: vch.createConnection,
        //             // acceptConnection: vch.acceptConnection,
        //             members: [...oldmembers, ...newMembers]
        //         }
        //     });

        //     // state.entities[action.payload.id].members = [...vch.members, ...newMembers];

        //     // _state.entities[action.payload.id].members.forEach(x => {
        //     //     let _i = members.filter(y => y.id == x.id)[0];
        //     //     x.login = _i.login;
        //     //     x.name = _i.name;
        //     // });

        //     // state.entities[action.payload.id].members = [..._state.entities[action.payload.id].members, ...newMembs];

        //     // state.entities[action.payload.id].members = action.payload.members;

        //     // console.log(action);
        //     // voiceChannelsAdapter.updateOne(state, {
        //     //     id: action.payload.id,
        //     //     changes: {
        //     //         members: action.payload.members
        //     //     }
        //     // })


        // }
    }
});

export default voiceChannelSlice.reducer

export const {
    connectVoiceChannel,
    setVoiceChannels,
    updateChannel,
    addChannel,
    setCurrentVoiceChannel,
    updateVoiceChannelMembers
} = voiceChannelSlice.actions

export const selectCurrentVoiceChannel = (state: RootState) => {
    return state.voiceChannels.currentVoiceChannel
}

const selectors = voiceChannelsAdapter.getSelectors<RootState>((state) => state.voiceChannels)

export const selectById = (id?: string) =>
    (state: RootState) => selectors.selectById(state, id ? id : "")

export const selectCurrentChannelMembers = createSelector(
    [selectors.selectAll, (state: RootState) => state.voiceChannels.currentVoiceChannel],
    (chans, curChanId) => chans.filter(x => x.id == curChanId)[0]?.members
)
