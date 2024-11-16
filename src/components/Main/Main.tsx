import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import MessageIcon from "../../resources/vectors/MessageIcon";
import styles from './Main.module.scss';
import DiceIcon from "../../resources/vectors/DiceIcon";
import MicIcon from "../../resources/vectors/MicIcon";
import HeadphonesIcon from "../../resources/vectors/HeadphonesIcon";
import SettingsIcon from "../../resources/vectors/SettingsIcon";
import { getUserById, getUserInfo } from "../../redux/userReducer";
import { useSelector } from "react-redux";
import { getAllServers } from "../../redux/serverReducer";
import { getTalkById, getTalks } from "../../redux/talksReducer";
import { FriendsIcon } from "../../resources/vectors/FriendsIcon";
import UserLogo from "../Widgets/UserLogo/UserLogo";
import Chat from "../Chat/Chat";
import '../../App.css';
import { redirect, useNavigate } from "react-router-dom";
import FriendsTab from "../FriendsTab/FriendsTab";
import FriendsTabTitle from "../Tabs/FriendsTabTitle";
import Separator from "../Widgets/Separator/Separator";
import ProfileInfoWidget from "../Widgets/ProfileInfoWidget/ProfileInfoWidget";
import { getCurrentTab, setTab } from "../../redux/appReducer";
import { dispatch } from "../../redux/store";


const Talk = (p: {
    id: string
    className?: string,
    props?: any
}): JSX.Element => {

    const { id, className, props } = p;

    const talk = useSelector(getTalkById(id))
    const companion = useSelector(getUserById(id));


    return (
        <button
            className={`${styles.talk} ${className || ''}`}
            {...props}
        >
            <UserLogo image={companion?.logo} />
            <span className={styles.talk_text} >{companion?.name}</span>
        </button>
    );
};

const Main = (): JSX.Element => {

    let navigate = useNavigate();

    const user = useSelector(getUserInfo);

    useEffect(() =>{
    if(!user){
    return navigate("/login");
    }},[user]);    
    const servers = useSelector(getAllServers)
    const talks = useSelector(getTalks)
    

    // let [currentTab, setCurrentTab] = useState<{ tabName: string, tabProps?: any }>();
    let currentTab = useSelector(getCurrentTab);
    let setCurrentTab = (payload:any)=> dispatch(setTab(payload));

    let openFriendsTab = () => setCurrentTab({ tabName: 'friendsTab' })
    let openChat = (chatId: string) => () =>
        setCurrentTab({
            tabName: 'chatTab',
            tabProps: { id: chatId }
        })


    let ChatTab = () => {
        return <Chat talkId={currentTab?.tabProps.id} />
    };

    let component = (
        <div className={styles.main}>
            <div className={styles.sidebar}>
                <button className={`${styles.sidebar__elem} ${styles.imagebutton}`}>
                    <MessageIcon className={styles.imagebutton_svg} />
                </button>
                {/* <span className={`${styles.sidebar__elem} ${styles.separator}`} /> */}
                <Separator className={`${styles.sidebar__elem}`} />
                {
                    servers.map(server =>
                        <button key={server.id} className={`${styles.sidebar__elem} ${styles.textbutton}`}>
                            {server.name.toLocaleUpperCase()[0]}
                        </button>)
                }
                <button className={`${styles.sidebar__elem} ${styles.textbutton}`}>
                    +
                </button>
            </div>
            <div className={styles.main__talkbar}>
                <div className={styles.search_container}>
                    <input type="text" placeholder="Найти беседу" className={styles.search} />
                </div>
                <div className={styles.tabs_control}>
                    <button className={`${styles.tab_button} ${currentTab?.tabName == 'friendsTab' && styles.tab_button_selected}`} onClick={openFriendsTab}>
                        {/* <FriendsIcon className={styles.tab_button__icon} />
                        <span>Друзья</span> */}
                        <FriendsTabTitle />
                    </button>
                </div>
                <div className={styles.talks_container}>
                    {
                        talks.map(talk => {
                            return <Talk key={talk.id} id={talk.id}
                                className={(currentTab?.tabName == 'chatTab' &&
                                    currentTab?.tabProps?.id == talk.id) &&
                                    styles.talk_selected}
                                props={{ onClick: openChat(talk.id) }}
                            />
                        }
                        )
                    }
                </div>
                <div className={styles.profile_bar}>
                    {/* <div className={styles.profile_info}>
                        <UserLogo image={user?.logo} />
                        <div className={styles.text_container}>
                            <span className={styles.username}>{user?.name}</span>
                            <span className={styles.status}>{
                                (user?.status === 'online' && 'В сети') ||
                                (user?.status === 'offline' && 'Не в сети') ||
                                (user?.status === 'notdisturb' && 'Не беспокоить') ||
                                (user?.status === 'inactive' && 'Неактивен')
                            }</span>
                        </div>
                    </div> */}
                    <ProfileInfoWidget user={user} />
                    <div className={styles.profile_controls}>
                        <button><MicIcon status="on" className={styles.control} /></button>
                        <button><HeadphonesIcon className={styles.control} /></button>
                        <button><SettingsIcon className={styles.control} /></button>
                    </div>
                </div>
            </div>
            <div className={styles.main__tab}>
                { 
                    currentTab?.tabName == 'chatTab' &&
                    // <ChatTab />
                    <Chat talkId={currentTab?.tabProps.id} />
                }
                {
                    currentTab?.tabName == 'friendsTab' &&
                    <FriendsTab />
                }               
            </div>
        </div>);



    return component;
}

export default Main