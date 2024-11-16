import React from 'react';
import styles from './ProfileInfoWidget.module.scss';
import { User } from '../../../redux/entities/user';
import UserLogo from '../UserLogo/UserLogo';

const ProfileInfoWidget = ({user}:{user:{
    id:string,
    logo?:string,
     status?:'online' | 'inactive' | 'notdisturb' | 'offline',
     name:string
     }}) => <div className={styles.profile_info}>
<UserLogo image={user?.logo} />
<div className={styles.text_container}>
    <span className={styles.username}>{user?.name}</span>
    {user?.status && <span className={styles.status}>{
        (user?.status === 'online' && 'В сети') ||
        (user?.status === 'offline' && 'Не в сети') ||
        (user?.status === 'notdisturb' && 'Не беспокоить') ||
        (user?.status === 'inactive' && 'Неактивен')
    }</span>}
</div>
</div>

export default ProfileInfoWidget