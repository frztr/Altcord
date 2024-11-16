import React from "react";
import SearchIcon from "../../../resources/vectors/SearchIcon";
import styles from './SearchInput.module.scss';

const SearchInput = ({className, inputClassName}:{ className?: string, inputClassName?: string}) =>
<div className={`${styles['search-control']} ${className}`}>
    <input type="text" className={`${styles['search-control__input']} ${inputClassName && inputClassName}`} placeholder="Поиск" />
    <div className={styles['search-control__btn']}>
        <SearchIcon />
    </div>
</div>

export default SearchInput