export interface PeerConnectionEntity {
    id:string;
    connectionStatus:'idle'|'error'|'ready'
}