import React from "react";

const MicIcon = ({ className, status }: { className?: string, status: 'on' | 'off' }): JSX.Element => {
    return (
        status === 'on' ?
            <svg width="32" height="32" viewBox="0 0 32 32" className={className && className} fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25.3333 13.3333V16C25.3333 21.1547 21.1547 25.3333 16 25.3333M16 25.3333C10.8453 25.3333 6.66666 21.1547 6.66666 16V13.3333M16 25.3333V29.3333M10.6667 29.3333H21.3333M16 20C13.7908 20 12 18.2092 12 16V6.66666C12 4.45752 13.7908 2.66666 16 2.66666C18.2092 2.66666 20 4.45752 20 6.66666V16C20 18.2092 18.2092 20 16 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg> :
            <svg width="800px" height="800px" viewBox="0 0 24 24" className={className && className} fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 9.4V5C15 3.34315 13.6569 2 12 2C10.8224 2 9.80325 2.67852 9.3122 3.66593M12 19V22M8 22H16M3 3L21 21M5.00043 10C5.00043 10 3.50062 19 12.0401 19C14.51 19 16.1333 18.2471 17.1933 17.1768M19.0317 13C19.2365 11.3477 19 10 19 10M12 15C10.3431 15 9 13.6569 9 12V9L14.1226 14.12C13.5796 14.6637 12.8291 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
    );

};

export default MicIcon  