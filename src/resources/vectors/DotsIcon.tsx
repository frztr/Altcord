import React from "react"

const DotsIcon = ({ className }: { className?: string }) =>
    <svg className={className && className} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_68_123)">
            <path d="M16 24C18.2091 24 20 25.7908 20 28C20 30.2092 18.2091 32 16 32C13.7909 32 12 30.2092 12 28C12 25.7908 13.7909 24 16 24Z" fill="currentColor" fillOpacity="0.8" />
            <path d="M16 12C18.2091 12 20 13.7909 20 16C20 18.2091 18.2091 20 16 20C13.7909 20 12 18.2091 12 16C12 13.7909 13.7909 12 16 12Z" fill="currentColor" fillOpacity="0.8" />
            <path d="M20 4C20 1.79086 18.2091 -9.65646e-08 16 0C13.7909 9.65646e-08 12 1.79086 12 4C12 6.20914 13.7909 8 16 8C18.2091 8 20 6.20914 20 4Z" fill="currentColor" fillOpacity="0.8" />
        </g>
        <defs>
            <clipPath id="clip0_68_123">
                <rect width="32" height="32" fill="currentColor" />
            </clipPath>
        </defs>
    </svg>


export default DotsIcon