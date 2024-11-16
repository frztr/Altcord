export interface User{
    id: string,
    name: string,
    login:string,
    status: 'online' | 'inactive' | 'notdisturb' | 'offline',
    logo?: string
}