import { createEntityAdapter, createSelector, createSlice, current, EntityState } from "@reduxjs/toolkit";
import { User } from "./entities/user";
import { Talk } from "./entities/talk";
import store, { dispatch, RootState } from "./store";
import { apiSendMessage } from "../socket/api";
import { createAppAsyncThunk } from "./thunks";
import { Message } from "./entities/message";

const talksAdapter = createEntityAdapter<Talk, string>({
    selectId: (state: Talk) => state.id
})

const initState: Talk[] = []

const selectors = talksAdapter.getSelectors<RootState>((state) => state.talks)


const talksSlice = createSlice({
    name: "talks",
    initialState: talksAdapter.addMany(
        talksAdapter.getInitialState({}),
        initState),
    reducers: {
        Add: talksAdapter.addOne,
        setTalks: (state, action) => {
            talksAdapter.setAll(state, action.payload);
        },
        addMessage: (state, action) => {
            state.entities[action.payload.talkid]
                .messages
                .push(action.payload.message);
        },
        updateTalk: talksAdapter.updateOne
    },
    extraReducers: (builder) => {
        builder.addCase(sendMessage.pending, (state, action) => {
            let { talkId, message } = action.meta.arg;
            state.entities[talkId].messages.push(message);
            return state;
        })
            .addCase(sendMessage.fulfilled, (state, action) => {
                let { message, prevId }: { message: any, prevId: string } = action.payload;
                let notProxyState = current(state);
                let talk = notProxyState.entities[message.talk.id];
                if (!talk) return;
                let idleMessage = talk.messages.filter(x => x.id == prevId)[0];
                let existedMessage = talk.messages
                    .filter(x => x.id == message.message.id)[0];
                if (!existedMessage) {
                    let idmesIndex = talk.messages.indexOf(idleMessage);
                    state
                        .entities[message.talk.id]
                        .messages[idmesIndex] = message.message;
                }
                else
                {
                    let exMesIndex = talk.messages.indexOf(existedMessage);
                    state.entities[message.talk.id]
                    .messages.splice(exMesIndex,1);
                }
            })
    }
})

export const sendMessage = createAppAsyncThunk('talks/sendMessage', async ({ message, talkId }: {
    message: Message
    talkId: string
}) => {
    const response = await apiSendMessage(message, talkId);
    return { prevId: message.id, message: response.data };
});


export const talksReducer = talksSlice.reducer

export const getTalks = selectors.selectAll
export const getTalkById = (id: string) =>
    (state: RootState) => selectors.selectById(state, id)
export const { Add, setTalks, addMessage, updateTalk } = talksSlice.actions

export const getTalkIdByUserId = (id: string) =>
    createSelector(
        selectors.selectAll,
        (talks) => {
            let tks = talks.filter(x => x.type == 'user' && x.members.includes(id))
            return tks ? tks[0] : undefined;
        }
    )