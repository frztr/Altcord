
import React from 'react';
import DiceIcon from '../../../resources/vectors/DiceIcon';
import styles from './UserLogo.module.scss';



const UserLogo = ({ image, className }: { image?: string, className?:string }): JSX.Element => {
    return <div className={`${styles.user__logo} ${className}`}
        style={image ? { backgroundImage: `url(${require(`/src/resources/${image}`)})` } : {}}
    >
        {
            !image && <DiceIcon className={styles.logo__icon} />
        }
    </div>
};

export default UserLogo