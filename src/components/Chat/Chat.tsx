import React, { useEffect, useRef } from "react";
import './Chat.scss';
import UserLogo from "../Widgets/UserLogo/UserLogo";
import CallIcon from "../../resources/vectors/CallIcon";
import VideocallIcon from "../../resources/vectors/VideoCallIcon";
import PinnedIcon from "../../resources/vectors/PinnedIcon";
import AddFriendIcon from "../../resources/vectors/AddFriendIcon";
import ProfileIcon from "../../resources/vectors/ProfileIcon";
import SearchIcon from "../../resources/vectors/SearchIcon";
import PlusCircleIcon from "../../resources/vectors/PlusCircleIcon";
import Message from "./Messages/Message";
import { useSelector } from "react-redux";
import { getTalkById, sendMessage } from "../../redux/talksReducer";
import { getUserById, getUserInfo } from "../../redux/userReducer";
import Call from "./Call/Call";
import '../Animations/animations.scss';
import SearchInput from "../Widgets/SearchInput/SearchInput";
import { dispatch } from "../../redux/store";
import {v4 as uuidv4, v4} from 'uuid';
import { selectById, selectCurrentVoiceChannel } from "../../redux/voiceChannelReducer";
import { IVoiceChannel } from "../../api/IVoiceChannel";
import socket from "../../socket/socket";

const Chat = ({ talkId }: { talkId: string }): JSX.Element => {

    const user = useSelector(getUserInfo);
    const { members, messages, type, id } = useSelector(getTalkById(talkId));
    const companion = useSelector(getUserById(talkId));
    

    let keyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            let input = e.target as HTMLInputElement;
            let text = input.value;
            dispatch(sendMessage({message:{
                id: v4(),
                timestamp: `${Date.now()}`,
                from: user.id,
                text,
            },talkId
        }));
        input.value = "";
        }
    };

    const wrapper = useRef(null);

    useEffect(() => {
        if (wrapper.current) {
            let wrap = (wrapper.current as HTMLDivElement);
            wrap.scrollTop = wrap.scrollHeight;
        }
    }, [messages, wrapper]);

    const currentVoiceChannel = useSelector(selectCurrentVoiceChannel);
    const chatVoiceChannel: IVoiceChannel = useSelector(selectById(talkId))

    const connectVideoChat = () => {
        // chatVoiceChannel.connect();
        socket.emit('voice.connect', talkId);
    }

    return <div className="chat">
        <div className="chat__title-bar">
            <div className="chat__desc">
                <UserLogo className="chat__logo" image={companion.logo} />
                <span className="chat__name">{companion.name}</span>
            </div>
            <div className="chat__controls">
                <button className="chat__btn-control" onClick={connectVideoChat}>
                    <CallIcon className="chat__btn-control__icon" />
                </button>
                <button className="chat__btn-control">
                    <VideocallIcon className="chat__btn-control__icon" />
                </button>
                <button className="chat__btn-control">
                    <PinnedIcon className="chat__btn-control__icon" />
                </button>
                <button className="chat__btn-control">
                    <AddFriendIcon className="chat__btn-control__icon" />
                </button>
                <button className="chat__btn-control">
                    <ProfileIcon className="chat__btn-control__icon" />
                </button>
                <SearchInput />
            </div>
        </div>
        <div className="chat__content">
            <div className="chat__content__main">
                {
                    currentVoiceChannel && currentVoiceChannel == talkId && <Call />
                }
                <div className="chat__field-wrap" ref={wrapper}>
                    <div className="chat_field-container">
                        {messages.map(x =>
                            <Message
                                text={x.text}
                                image={x.image}
                                userId={x.from}
                                timeStamp={x.timestamp}
                                key={`message_${x.id}`}
                            />)}
                    </div>
                </div>
                <div className="chat__send-bar">
                    <div className="chat-sender">
                        <button className="chat-sender__add-file">
                            <PlusCircleIcon />
                        </button>
                        <input type="text" className="chat-sender__input" placeholder="Написать" onKeyUp={keyUp} />
                    </div>
                </div>
            </div>
        </div>
    </div>
};

export default Chat