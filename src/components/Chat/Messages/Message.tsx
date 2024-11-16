import React from "react";
import UserLogo from "../../Widgets/UserLogo/UserLogo";
import styles from './Message.module.scss';
import { useSelector } from "react-redux";
import { getUserById } from "../../../redux/userReducer";

const Message = ({ text, image, userId, timeStamp }: {
    text?: string,
    image?: string,
    userId: string,
    timeStamp: string
}) => {

    const user = useSelector(getUserById(userId));

    return <div className={styles.message__container}>
        <UserLogo className={styles.sender__logo} image={user?.logo} />
        <div className={styles.message__content}>
            <div className={styles.message__title}>
                <span className={styles.message__username}>{user?.name}</span>
                <span className={styles.message__date}>{new Date(parseInt(timeStamp)).toLocaleDateString("ru-RU",{
                    year:'numeric',month:'2-digit',day:'2-digit', hour:'2-digit', minute:'2-digit'
                })}</span>
            </div>
            {image &&
                <div className={styles.message__image_wrap}>
                    <img className={styles.message__image}
                        // src={require(`../../../resources/${image}`)} 
                        src={image}
                        alt="" />
                </div>
            }
            {text && <span className={styles.message__text}>
                {text}
            </span>}
        </div>
    </div>
};

export default Message