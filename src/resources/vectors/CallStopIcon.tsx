import React from "react"

const CallStopIcon = ({ className }: { className?: string }): JSX.Element =>
    <svg className={className && className} width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_43_195)">
            <path d="M53.3789 43.9307C51.9434 45.3662 49.6289 45.3662 48.1787 43.9307L44.2822 40.0342L40.3857 36.123C38.9355 34.6875 38.9355 32.373 40.3857 30.9229L42.2314 29.0771C34.5996 24.917 25.3564 24.917 17.7246 29.0771L19.5703 30.9229C21.0205 32.373 21.0205 34.6875 19.5703 36.123L15.6738 40.0342L11.7773 43.9307C10.3271 45.3662 8.0127 45.3662 6.57715 43.9307L2.66602 40.0342C-0.922852 36.4453 -0.922852 30.6152 2.66602 27.0264L3.96973 25.7227C18.2813 11.4111 41.6748 11.4111 55.9863 25.7227L57.29 27.0264C60.8789 30.6152 60.8789 36.4453 57.29 40.0342L53.3789 43.9307Z" fill="currentColor" />
        </g>
        <defs>
            <clipPath id="clip0_43_195">
                <rect width="60" height="60" fill="white" />
            </clipPath>
        </defs>
    </svg>


export default CallStopIcon