import socket from "./socket/socket";
import store, {dispatch} from "./redux/store";
import { selectById, updateChannel, updateVoiceChannelMembers } from "./redux/voiceChannelReducer";
import { addPeerConnection, updatePeerConnection } from "./redux/peerConnectionReducer";

export type PeerConnection = {
    peerConnection: RTCPeerConnection,
    remoteStream: MediaStream
};

// export const PeersContext = createContext(new Map<string, PeerConnection>());

class PeerConnectionManager {
    private peerMap: Map<string, PeerConnection> = new Map<string, PeerConnection>();
    private localStream: MediaStream | undefined;
    mutedStream: MediaStream | undefined;
    private servers = {
        iceServers: [
            {
                urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
            },
        ],
        iceCandidatePoolSize: 10,
    };
    constructor()
    {
        this.localStreamInit();
    }

    async createConnectionWithPeer(userId: string) {
        dispatch(addPeerConnection({
            id: userId,
            connectionStatus: "idle"
        }))
        let peerCon = await this.createConnection(userId);
        this.peerMap.set(userId, peerCon);

    }

    async acceptConnectionFromPeer({ from, sdpObject }: { from: string, sdpObject: any }) {
        dispatch(addPeerConnection({
            id: from,
            connectionStatus: "idle"
        }))
        let peerCon = await this.acceptConnection({ from, sdpObject });
        this.peerMap.set(from, peerCon);
    }

    getPeerConnection(id: string): PeerConnection | undefined {
        return this.peerMap.get(id);
    }

    private async localStreamInit()
    {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        }
        catch (e) {
            console.log(e);
            // localStream = new MediaStream();
            try {
                this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            }
            catch(e2) {
                console.log(e2);
                this.localStream = undefined;
            }
        }

        this.mutedStream = this.localStream?.clone();
        this.mutedStream?.getAudioTracks().map(x=>{
            this.mutedStream?.removeTrack(x);
        });

        // this.localStream && mutedLocalStream?.removeTrack(this.localStream?.getTracks()[0]);
        // console.log(this.localStream);
        // console.log(this.localStream?.getTracks());
        

        // this.mutedStream = this.localStream?.clone();
        // this.mutedStream?.getAudioTracks().map(x=>{
        //     this.mutedStream?.removeTrack(x);
        // });
    }

    private initStreams(pc: RTCPeerConnection) {


        // Push tracks from local stream to peer connection
        this.localStream?.getTracks().forEach((track) => {
            pc.addTrack(track, this.localStream!);
        });      

        let remoteStream = new MediaStream();
        // Pull tracks from remote stream, add to video stream
        pc.ontrack = (event) => {
            console.log(event.streams[0].getTracks());
            event.streams[0].getTracks().forEach((track) => {
                console.log(track);
                remoteStream.addTrack(track);
            });
        };

        return remoteStream;
    }

    private async createConnection(userId: string): Promise<PeerConnection> {
        // socket.emit()
        const pc = new RTCPeerConnection(this.servers);
        let remote = this.initStreams(pc);
        pc.oniceconnectionstatechange = this.onConnected(remote,userId);


        pc.onicecandidate = (event) => {
            let message = {
                ...event.candidate?.toJSON(),
                type: 'offer'
            };
            console.log(`offerCand:${event.candidate?.toJSON()}`);
            // console.log(event.candidate?.toJSON());
            // console.log(message);
            event.candidate && socket.emit('voice.sendCandidate',
                userId, message);
        };

        const offerDescription = await pc.createOffer();
        await pc.setLocalDescription(offerDescription);
        const offer = {
            sdp: offerDescription.sdp,
            type: offerDescription.type
        };

        socket.emit('voice.sendSdp', userId, offer);

        let answerGot = ({ from, sdpObject }: {
            from: string,
            sdpObject: any
        }) => {
            if (from != userId) return;

            if (!pc.currentRemoteDescription && sdpObject) {
                const answerDescription = new RTCSessionDescription(sdpObject);
                pc.setRemoteDescription(answerDescription);
            }
        };

        socket.on(`voice.answerGot`, answerGot);

        let answerCandidatesUpdater = (
            { fromId, candidate }:
                { fromId: string, candidate: any }) => {
            try {
                if (userId != fromId) return;
                const cand = new RTCIceCandidate(candidate);
                pc.addIceCandidate(cand);
            }
            catch (e) {
                console.log(e);
            }
        };

        socket.on(`voice.answerCandidateGot`, answerCandidatesUpdater);

        return {
            peerConnection: pc,
            remoteStream: remote
        }
    }

    private async acceptConnection({ from, sdpObject }: {
        from: string;
        sdpObject: any;
    }): Promise<PeerConnection> {
        const pc = new RTCPeerConnection(this.servers);
        let remote: MediaStream = await this.initStreams(pc);
        pc.oniceconnectionstatechange = this.onConnected(remote, from);
        pc.onicecandidate = (event) => {
            if (!event.candidate) return;
            let message = {
                ...event.candidate?.toJSON(),
                type: 'answer'
            };
            event.candidate && socket.emit('voice.sendCandidate', from,
                message);
        };

        const offerDescription = sdpObject;
        await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

        const answerDescription = await pc.createAnswer();
        await pc.setLocalDescription(answerDescription);

        const answer = {
            type: answerDescription.type,
            sdp: answerDescription.sdp,
        };

        socket.emit('voice.sendSdp', from, answer);

        let offerCandidatesUpdater = (
            { fromId, candidate }:
                { fromId: string, candidate: any }) => {
            try {
                if (fromId != from) return;
                const cand = new RTCIceCandidate(candidate);
                pc.addIceCandidate(cand);
            }
            catch (e) {
                console.log(e);
            }
        };

        socket.on(`voice.offerCandidateGot`, offerCandidatesUpdater);

        return {
            peerConnection: pc,
            remoteStream: remote
        }
    }

    private onConnected(remote: MediaStream, userId:string) {
        return (e: any) => {
            console.log((e.target as RTCPeerConnection).iceConnectionState);
            if ((e.target as RTCPeerConnection).iceConnectionState == 'connected') {
                console.log({remote});

                dispatch(updatePeerConnection({
                    id: userId,
                    changes: {
                        connectionStatus:'ready'
                    }
                }))

                // let chan = selectById(chanId)(store.getState());
                // chan.members.filter(x=>x.id == userId)
                // store.dispatch(updateVoiceChannelMembers({
                //     id: chanId,
                //     changes: undefined
                // }))


                // let video = document.createElement('video');
                // video.srcObject = remote;
                // video.style.width = '400px';
                // video.style.height = '400px';
                // video.style.opacity = '0.1';
                // video.style.background = 'purple';
                // video.style.zIndex = '100';
                // video.style.position = 'absolute';
                // document.body.appendChild(video);
            }
        }
    }
};

export const pcManager = new PeerConnectionManager()

// const PeerConnectionManager = () => {
//     let peerMap: Map<string, PeerConnection> = new Map<string, PeerConnection>();
//     let localStream: MediaStream | undefined;
//     let mutedStream: MediaStream | undefined;
//     // let [mutedStream,setMutedStream] = useState<MediaStream>();
//     let [ms,sms] = useState();
//     let servers = {
//         iceServers: [
//             {
//                 urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
//             },
//         ],
//         iceCandidatePoolSize: 10,
//     };


//     const createConnectionWithPeer = async (userId: string) => {
//         let peerCon = await createConnection(userId);
//         peerMap.set(userId, peerCon);

//     }

//     const acceptConnectionFromPeer = async (
//         { from, sdpObject }:
//             { from: string, sdpObject: any }) => {
//         let peerCon = await acceptConnection({ from, sdpObject });
//         peerMap.set(from, peerCon);
//     }

//     const getPeerConnection = (id: string): PeerConnection | undefined => {
//         return peerMap.get(id);
//     }

//     const localStreamInit = async () => {
//         try {
//             localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         }
//         catch (e) {
//             // localStream = new MediaStream();
//             try {
//                 localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             }
//             catch {
//                 localStream = undefined;
//             }
//         }

         
//         // let mute = localStream?.clone();
//         // mute?.getAudioTracks().map(x=>{
//         //     mute?.removeTrack(x);
//         // });
//         // setMutedStream(mute);

//         let mutedStream = localStream?.clone();
//         mutedStream?.getAudioTracks().map(x=>{
//             mutedStream?.removeTrack(x);
//         });
//     }

//     const initStreams = async (pc: RTCPeerConnection) => {


//         // Push tracks from local stream to peer connection
//         localStream?.getTracks().forEach((track) => {
//             pc.addTrack(track, localStream!);
//         });

//         let remoteStream = new MediaStream();
//         // Pull tracks from remote stream, add to video stream
//         pc.ontrack = (event) => {
//             event.streams[0].getTracks().forEach((track) => {
//                 console.log(track);
//                 remoteStream.addTrack(track);
//             });
//         };

//         return remoteStream;
//     }

//     const createConnection = async (userId: string): Promise<PeerConnection> => {
//         // socket.emit()
//         const pc = new RTCPeerConnection(servers);
//         let remote = await initStreams(pc);
//         pc.oniceconnectionstatechange = onConnected(remote);


//         pc.onicecandidate = (event) => {
//             let message = {
//                 ...event.candidate?.toJSON(),
//                 type: 'offer'
//             };
//             console.log(`offerCand:${event.candidate?.toJSON()}`);
//             // console.log(event.candidate?.toJSON());
//             // console.log(message);
//             event.candidate && socket.emit('voice.sendCandidate',
//                 userId, message);
//         };

//         const offerDescription = await pc.createOffer();
//         await pc.setLocalDescription(offerDescription);
//         const offer = {
//             sdp: offerDescription.sdp,
//             type: offerDescription.type
//         };

//         socket.emit('voice.sendSdp', userId, offer);

//         let answerGot = ({ from, sdpObject }: {
//             from: string,
//             sdpObject: any
//         }) => {
//             if (from != userId) return;

//             if (!pc.currentRemoteDescription && sdpObject) {
//                 const answerDescription = new RTCSessionDescription(sdpObject);
//                 pc.setRemoteDescription(answerDescription);
//             }
//         };

//         socket.on(`voice.answerGot`, answerGot);

//         let answerCandidatesUpdater = (
//             { fromId, candidate }:
//                 { fromId: string, candidate: any }) => {
//             try {
//                 if (userId != fromId) return;
//                 const cand = new RTCIceCandidate(candidate);
//                 pc.addIceCandidate(cand);
//             }
//             catch (e) {
//                 console.log(e);
//             }
//         };

//         socket.on(`voice.answerCandidateGot`, answerCandidatesUpdater);

//         return {
//             peerConnection: pc,
//             remoteStream: remote
//         }
//     }

//     const acceptConnection = async ({ from, sdpObject }: {
//         from: string;
//         sdpObject: any;
//     }): Promise<PeerConnection> => {
//         const pc = new RTCPeerConnection(servers);
//         let remote: MediaStream = await initStreams(pc);
//         pc.oniceconnectionstatechange = onConnected(remote);
//         pc.onicecandidate = (event) => {
//             if (!event.candidate) return;
//             let message = {
//                 ...event.candidate?.toJSON(),
//                 type: 'answer'
//             };
//             event.candidate && socket.emit('voice.sendCandidate', from,
//                 message);
//         };

//         const offerDescription = sdpObject;
//         await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

//         const answerDescription = await pc.createAnswer();
//         await pc.setLocalDescription(answerDescription);

//         const answer = {
//             type: answerDescription.type,
//             sdp: answerDescription.sdp,
//         };

//         socket.emit('voice.sendSdp', from, answer);

//         let offerCandidatesUpdater = (
//             { fromId, candidate }:
//                 { fromId: string, candidate: any }) => {
//             try {
//                 if (fromId != from) return;
//                 const cand = new RTCIceCandidate(candidate);
//                 pc.addIceCandidate(cand);
//             }
//             catch (e) {
//                 console.log(e);
//             }
//         };

//         socket.on(`voice.offerCandidateGot`, offerCandidatesUpdater);

//         return {
//             peerConnection: pc,
//             remoteStream: remote
//         }
//     }

//     const onConnected = (remote: MediaStream) => {
//         return (e: any) => {
//             console.log((e.target as RTCPeerConnection).iceConnectionState);
//             if ((e.target as RTCPeerConnection).iceConnectionState == 'connected') {
//                 console.log({ remote });
//             }
//         }
//     }

//     localStreamInit();

//     return {
//         getPeerConnection,
//         mutedStream,
//         createConnectionWithPeer,
//         acceptConnectionFromPeer
//     }
// };

// export const pcManager = PeerConnectionManager()