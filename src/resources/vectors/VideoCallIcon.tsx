import React from "react"

const VideocallIcon = ({ className }: { className?: string }): JSX.Element =>
    <svg className={className || ''} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.66671 10H25C26.8334 10 28.3334 11.5 28.3334 13.3333V26.6667C28.3334 28.5 26.8334 30 25 30H6.66671C4.83337 30 3.33337 28.5 3.33337 26.6667V13.3333C3.33337 11.5 4.83337 10 6.66671 10Z" fill="currentColor" />
        <path d="M36.6667 29.1666L28.3334 24.1666V15.8333L36.6667 10.8333V29.1666Z" fill="currentColor" />
    </svg>

export default VideocallIcon