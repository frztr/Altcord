import React from 'react';
import { FriendsIcon } from '../../resources/vectors/FriendsIcon';
import styles from './FriendsTabTitle.module.scss';

const FriendsTabTitle = ({className}:{className?:string}) => <div className={`${styles.friends_title} ${className}`}>
    <FriendsIcon className={styles.friends_tab__icon} />
    <span>Друзья</span>
</div>

export default FriendsTabTitle