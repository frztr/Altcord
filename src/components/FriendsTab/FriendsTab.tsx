import React, { FormEvent, useState } from "react"
import './FriendsTab.scss';
import Separator from "../Widgets/Separator/Separator";
import FriendsTabTitle from "../Tabs/FriendsTabTitle";
import '../Animations/animations.scss';
import SearchInput from "../Widgets/SearchInput/SearchInput";
import MessagePlusIcon from "../../resources/vectors/MessagePlusIcon";
import ProfileInfoWidget from "../Widgets/ProfileInfoWidget/ProfileInfoWidget";
import ChatMessageCloudIcon from "../../resources/vectors/ChatMessageCloudIcon";
import DotsIcon from "../../resources/vectors/DotsIcon";
import { User } from "../../redux/entities/user";
import { useSelector } from "react-redux";
import { getAllFriends, getAllFriendsRequests } from "../../redux/friendReducer";
import { getUserInfo, getUsersByIds } from "../../redux/userReducer";
import { createSelector } from "@reduxjs/toolkit";
import CheckIcon from "../../resources/vectors/CheckIcon";
import CloseIcon from "../../resources/vectors/CloseIcon";
import socket, { acceptFriendRequest, addFriend, declineFriendRequest } from "../../socket/socket";
import store, { dispatch } from "../../redux/store";
import { setTab } from "../../redux/appReducer";
import { Add, getTalkIdByUserId } from "../../redux/talksReducer";

const FriendsTab = () => {

    const friends = useSelector(getAllFriends);
    const friendsRequests = useSelector(getAllFriendsRequests);

    const usersSelector = getUsersByIds(friends);
    const users = useSelector(usersSelector);
    const usersOnline = useSelector(
        createSelector(usersSelector, (state) =>
            state.filter(x => x.status === 'online')
        ));
    const requestUsers = useSelector(getUsersByIds(friendsRequests));

    type friendsWindow = 'all' | 'online' | 'requests' | 'friendAdd';

    const [currentWindow, setCurrentWindow] = useState<friendsWindow>('online');


    const setOnline = () => setCurrentWindow('online');
    const setAll = () => setCurrentWindow('all');
    const setRequests = () => setCurrentWindow('requests');
    const setFriendAdd = () => setCurrentWindow('friendAdd');

    const openChat = (userId: string) => () => {

        let talk = getTalkIdByUserId(userId)(store.getState());
        let talkId: string;
        if (!talk) {
            dispatch(Add({
                id: userId,
                type: "user",
                members: [userId, getUserInfo(store.getState())],
                messages: []
            }));
            talkId = userId;
        }
        else
        {
            talkId = talk.id;
        }
        dispatch(setTab({
            tabName: 'chatTab',
            tabProps: { id: talkId }
        }));
    };

    const AllFriends = () => {
        return <>
            <span className="friends_table__counter">Все - {users.length}</span>
            <div className="friends_table">
                {users.map(x =>
                (<div className="friends_table__item" key={`profileinfo_${x.id}`} onClick={openChat(x.id)}>
                    <ProfileInfoWidget user={x} />
                    <div className="friends_table__item__control_bar">
                        <button>
                            <ChatMessageCloudIcon className="friends_table__item__control" />
                        </button>
                        <button>
                            <DotsIcon className="friends_table__item__control" />
                        </button>
                    </div>
                </div>))
                }
            </div>
        </>;
    };

    const OnlineFriends = () => {
        return <>
            <span className="friends_table__counter">В сети - {usersOnline.length}</span>
            <div className="friends_table">
                {usersOnline.map(x =>
                (<button className="friends_table__item" key={`profileonlineinfo_${x.id}`} onClick={openChat(x.id)}>
                    <ProfileInfoWidget user={x} />
                    <div className="friends_table__item__control_bar">
                        <button>
                            <ChatMessageCloudIcon className="friends_table__item__control" />
                        </button>
                        <button>
                            <DotsIcon className="friends_table__item__control" />
                        </button>
                    </div>
                </button>))
                }
            </div>
        </>
    };

    const RequestsTab = () => {

        const acceptFriendRequestAction = (id: string) => () => {
            acceptFriendRequest(id);
        }

        const declineFriendRequestAction = (id: string) => () => {
            declineFriendRequest(id);
        }

        return <>
            <span className="friends_table__counter">Заявки - {requestUsers.length}</span>
            <div className="friends_table">
                {requestUsers.map(x =>
                (<div className="friends_table__item" key={`profilereqinfo_${x.id}`}>
                    <ProfileInfoWidget user={{ id: x.id, logo: x.logo, name: x.name }} />
                    <div className="friends_table__item__control_bar">
                        <button onClick={acceptFriendRequestAction(x.id)} >
                            <CheckIcon className="friends_table__item__control" />
                        </button>
                        <button onClick={declineFriendRequestAction(x.id)}>
                            <CloseIcon className="friends_table__item__control" />
                        </button>
                    </div>
                </div>))
                }
            </div>
        </>
    };

    const Wrapper = () => <>{currentWindow === 'all' && <AllFriends />}
        {currentWindow === 'online' && <OnlineFriends />}
        {currentWindow === 'requests' && <RequestsTab />}
    </>;


    const addFriendAction = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let form = e.target as HTMLFormElement;
        addFriend(form['friendName'].value);
    };

    return <div className='friends-tab'>
        <div className="friends-tab__top-bar">
            <div className="friends-tab__top-bar__main">
                <FriendsTabTitle className="friends-tab_title" />
                <Separator className="friends-tab__separator" />
                <button onClick={setOnline} className={`friends-tab__filter ${currentWindow == 'online' && 'filter-active'}`}>
                    В сети
                </button>
                <button onClick={setAll} className={`friends-tab__filter ${currentWindow == 'all' && 'filter-active'}`}>
                    Все
                </button>
                <button onClick={setRequests} className={`friends-tab__filter ${currentWindow == 'requests' && 'filter-active'}`}>
                    Заявки
                </button>
                <button onClick={setFriendAdd} className={`friends-tab__filter filter_negative ${currentWindow == 'friendAdd' && 'filter-active'}`}>
                    Добавить в друзья
                </button>
            </div>
            <button>
                <MessagePlusIcon className="friends-tab__add-chat" />
            </button>
        </div>
        <div className="friends_tab__content_wrapper">
            {currentWindow != 'friendAdd' ?
                <div className="friends_tab__content">
                    <SearchInput className="friends_tab__search" inputClassName="friends_tab__search-input" />
                    <Wrapper />
                </div> :
                <div className="friends_tab__add_friend_content">
                    <div className="add_friend_content_desc">
                        <span className="add_friend_content__title">Добавить в друзья</span>
                        <span className="add_friend_content__secondary">Вы можете добавить друзей по имени пользователя</span>
                    </div>
                    <form className="add_friend_content__input_field" onSubmit={addFriendAction}>
                        <input placeholder="Вы можете добавить друзей по имени пользователя" type="text" name="friendName" id="" className="add_friend_content__input" />
                        <button type="submit" className="add_friend_content__btn">Отправить запрос дружбы</button>
                    </form>
                </div>}
        </div>
    </div>
}
export default FriendsTab