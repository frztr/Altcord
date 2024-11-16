import { Socket } from "socket.io-client";
import { Message } from "../../redux/entities/message";
import { Talk } from "../../redux/entities/talk";
import { Add, addMessage, getTalkById, getTalkIdByUserId, updateTalk } from "../../redux/talksReducer";
import store, { dispatch } from "../../redux/store";
import { getUserInfo } from "../../redux/userReducer";
import { getCurrentTab, setTab } from "../../redux/appReducer";

const talkController = (socket: Socket) => ({
    messageGot: ({ message, talk }: { message: Message, talk: Talk }) => {

        let existedTalk = getTalkById(talk.id)(store.getState());
        // console.log({message,talk});
        // if (talk.type == 'user') {
        // console.log({existedTalk});
        if (!existedTalk) {
            dispatch(Add({ ...talk, messages: [] }));
        }
        // }
        if (!existedTalk.messages.map(x => x.id)
            .includes(message.id)) {
            dispatch(addMessage({ message, talkid: talk.id }));
        }
    }
})

export default talkController