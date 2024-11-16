import React from "react"

const PlusCircleIcon = ({ className }: { className?: string }): JSX.Element =>
    <svg className={className || ''} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_23_39)">
            <path fillRule="evenodd" clipRule="evenodd" d="M27.5 21.25H21.25V27.5C21.25 28.1875 20.6912 28.75 20 28.75C19.3088 28.75 18.75 28.1875 18.75 27.5V21.25H12.5C11.8088 21.25 11.25 20.6875 11.25 20C11.25 19.3125 11.8088 18.75 12.5 18.75H18.75V12.5C18.75 11.8125 19.3088 11.25 20 11.25C20.6912 11.25 21.25 11.8125 21.25 12.5V18.75H27.5C28.1912 18.75 28.75 19.3125 28.75 20C28.75 20.6875 28.1912 21.25 27.5 21.25ZM20 0C8.95375 0 0 8.95 0 20C0 31.05 8.95375 40 20 40C31.0462 40 40 31.05 40 20C40 8.95 31.0462 0 20 0Z" fill="currentColor" />
        </g>
        <defs>
            <clipPath id="clip0_23_39">
                <rect width="40" height="40" fill="white" />
            </clipPath>
        </defs>
    </svg>

export default PlusCircleIcon