import React from "react"

const ProfileIcon = ({ className }: { className?: string }): JSX.Element =>
    <svg className={className || ''} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.2 21.3C20.0834 21.2833 19.9334 21.2833 19.8 21.3C16.8667 21.2 14.5333 18.8 14.5333 15.85C14.5333 12.8333 16.9667 10.3833 20 10.3833C23.0167 10.3833 25.4667 12.8333 25.4667 15.85C25.45 18.8 23.1334 21.2 20.2 21.3Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M31.2334 32.3002C28.2667 35.0168 24.3334 36.6668 20 36.6668C15.6667 36.6668 11.7334 35.0168 8.76672 32.3002C8.93339 30.7335 9.93339 29.2002 11.7167 28.0002C16.2834 24.9668 23.75 24.9668 28.2834 28.0002C30.0667 29.2002 31.0667 30.7335 31.2334 32.3002Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 36.6666C29.2047 36.6666 36.6667 29.2046 36.6667 20C36.6667 10.7952 29.2047 3.33331 20 3.33331C10.7953 3.33331 3.33337 10.7952 3.33337 20C3.33337 29.2046 10.7953 36.6666 20 36.6666Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

export default ProfileIcon