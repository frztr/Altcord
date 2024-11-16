export class Candidate{
    constructor(
        candidate:string, 
        sdpMLineIndex:number, 
        sdpMid:string, 
        usernameFragment: string, 
        public type:'answer'|'group'){}
}