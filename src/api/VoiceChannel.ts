import { useStore } from "react-redux";
import store, { dispatch } from "../redux/store";
import { getUserInfo } from "../redux/userReducer";
import { selectById, setCurrentVoiceChannel, updateChannel, updateVoiceChannelMembers } from "../redux/voiceChannelReducer";
import socket from "../socket/socket";
import { IVoiceChannel } from "./IVoiceChannel";
import { IVoiceChannelMember } from "./IVoiceChannelMember";





// export class VoiceChannel implements IVoiceChannel {
//     id: string;
//     type: "user" | "group";
//     members: string[];

//     servers = {
//         iceServers: [
//             {
//                 urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
//             },
//         ],
//         iceCandidatePoolSize: 10,
//     };

//     constructor(vch: IVoiceChannel) {
//         this.id = vch.id;
//         this.type = vch.type;
//         this.members = vch.members;
//         this.localStream = vch.localStream;
//     }
//     localStream: MediaStream | undefined = undefined;

//     // onConnected(remote: MediaStream) {
//     //     return (e: any) => {
//     //         console.log((e.target as RTCPeerConnection).iceConnectionState);
//     //         if ((e.target as RTCPeerConnection).iceConnectionState == 'connected') {
//     //             let video: HTMLVideoElement = document.createElement('video');
//     //             video.style.width = '400px';
//     //             video.style.height = '400px';
//     //             video.style.position = 'absolute';
//     //             video.style.zIndex = '100';
//     //             video.autoplay = true;
//     //             video.playsInline = true;
//     //             video.srcObject = remote;
//     //             document.body.appendChild(video);
//     //         }
//     //     }
//     // }


//     // connect(): void {
//     //     socket.on('voice.connected', (channelInfo: IVoiceChannel) => {
//     //         if (channelInfo.id != this.id) return;
//     //         let user = getUserInfo(store.getState());

//     //         dispatch(updateVoiceChannelMembers({
//     //             id: channelInfo.id,
//     //             members: channelInfo.members
//     //         }));

//     //         this.members.filter(x => x.id != user.id).map(async x => {
//     //             let peerCon = await this.createConnection(x.id);

//     //             x.peerConnection = peerCon.peerConnection;
//     //             x.remoteStream = peerCon.remoteStream;
//     //         });

//     //         dispatch(setCurrentVoiceChannel(channelInfo.id));

//     //     });

//     //     socket.on('voice.offerGot', async ({ from, sdpObject }:
//     //         {
//     //             from: string,
//     //             sdpObject: any
//     //         }) => {

//     //         let peerCon = await this.acceptConnection({ from, sdpObject });
//     //         // console.log(this.members);
//     //         setTimeout(() => {
//     //             this.members.filter(x => x.id == from)[0].peerConnection = peerCon.peerConnection;
//     //             this.members.filter(x => x.id == from)[0].remoteStream = peerCon.remoteStream;
//     //         });
//     //     });

//     //     socket.emit('voice.connect', this.id);
//     // }

//     // async initStreams(pc: RTCPeerConnection) {
//     //     try {
//     //         this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     //     }
//     //     catch (e) {
//     //         // localStream = new MediaStream();
//     //         try {
//     //             this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     //         }
//     //         catch {
//     //             this.localStream = undefined;
//     //         }
//     //     }

//     //     // Push tracks from local stream to peer connection
//     //     this.localStream?.getTracks().forEach((track) => {
//     //         pc.addTrack(track, this.localStream!);
//     //     });

//     //     let mutedLocalStream = this.localStream;

//     //     this.localStream && mutedLocalStream?.removeTrack(this.localStream?.getTracks()[0]);

//     //     let remoteStream = new MediaStream();
//     //     // Pull tracks from remote stream, add to video stream
//     //     pc.ontrack = (event) => {
//     //         event.streams[0].getTracks().forEach((track) => {
//     //             console.log(track);
//     //             remoteStream.addTrack(track);
//     //         });
//     //     };

//     //     return remoteStream;
//     // }

//     // async createConnection(userId: string): Promise<PeerConnection> {
//     //     // socket.emit()
//     //     const pc = new RTCPeerConnection(this.servers);
//     //     let remote = await this.initStreams(pc);
//     //     pc.oniceconnectionstatechange = this.onConnected(remote);


//     //     pc.onicecandidate = (event) => {
//     //         let message = {
//     //             ...event.candidate?.toJSON(),
//     //             type: 'offer'
//     //         };
//     //         console.log(`offerCand:${event.candidate?.toJSON()}`);
//     //         // console.log(event.candidate?.toJSON());
//     //         // console.log(message);
//     //         event.candidate && socket.emit('voice.sendCandidate',
//     //             userId, message);
//     //     };

//     //     const offerDescription = await pc.createOffer();
//     //     await pc.setLocalDescription(offerDescription);
//     //     const offer = {
//     //         sdp: offerDescription.sdp,
//     //         type: offerDescription.type
//     //     };

//     //     socket.emit('voice.sendSdp', userId, offer);

//     //     let answerGot = ({ from, sdpObject }: {
//     //         from: string,
//     //         sdpObject: any
//     //     }) => {
//     //         if (from != userId) return;

//     //         if (!pc.currentRemoteDescription && sdpObject) {
//     //             const answerDescription = new RTCSessionDescription(sdpObject);
//     //             pc.setRemoteDescription(answerDescription);
//     //         }
//     //     };

//     //     socket.on(`voice.answerGot`, answerGot);

//     //     let answerCandidatesUpdater = (
//     //         { fromId, candidate }:
//     //             { fromId: string, candidate: any }) => {
//     //         try {
//     //             if (userId != fromId) return;
//     //             const cand = new RTCIceCandidate(candidate);
//     //             pc.addIceCandidate(cand);
//     //         }
//     //         catch (e) {
//     //             console.log(e);
//     //         }
//     //     };

//     //     socket.on(`voice.answerCandidateGot`, answerCandidatesUpdater);

//     //     return {
//     //         peerConnection: pc,
//     //         remoteStream: remote
//     //     }
//     // }

//     // async acceptConnection({ from, sdpObject }: {
//     //     from: string;
//     //     sdpObject: any;
//     // }): Promise<PeerConnection> {
//     //     const pc = new RTCPeerConnection(this.servers);
//     //     let remote: MediaStream = await this.initStreams(pc);
//     //     pc.oniceconnectionstatechange = this.onConnected(remote);
//     //     pc.onicecandidate = (event) => {
//     //         if (!event.candidate) return;
//     //         let message = {
//     //             ...event.candidate?.toJSON(),
//     //             type: 'answer'
//     //         };
//     //         event.candidate && socket.emit('voice.sendCandidate', from,
//     //             message);
//     //     };

//     //     const offerDescription = sdpObject;
//     //     await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

//     //     const answerDescription = await pc.createAnswer();
//     //     await pc.setLocalDescription(answerDescription);

//     //     const answer = {
//     //         type: answerDescription.type,
//     //         sdp: answerDescription.sdp,
//     //     };

//     //     socket.emit('voice.sendSdp', from, answer);

//     //     let offerCandidatesUpdater = (
//     //         { fromId, candidate }:
//     //             { fromId: string, candidate: any }) => {
//     //         try {
//     //             if (fromId != from) return;
//     //             const cand = new RTCIceCandidate(candidate);
//     //             pc.addIceCandidate(cand);
//     //         }
//     //         catch (e) {
//     //             console.log(e);
//     //         }
//     //     };

//     //     socket.on(`voice.offerCandidateGot`, offerCandidatesUpdater);

//     //     return {
//     //         peerConnection: pc,
//     //         remoteStream: remote
//     //     }
//     // }
// }