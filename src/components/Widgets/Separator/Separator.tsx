import React from 'react';
import styles from './Separator.module.scss';

const Separator = ({className}:{className?:string}) => 
<span className={`${className && className} ${styles.separator}`} />

export default Separator