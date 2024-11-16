import React, { useRef } from "react"
import './Call.scss';
import UserLogo from "../../Widgets/UserLogo/UserLogo";
import VideocallIcon from "../../../resources/vectors/VideoCallIcon";
import StreamIcon from "../../../resources/vectors/StreamIcon";
import MicIcon from "../../../resources/vectors/MicIcon";
import CallStopIcon from "../../../resources/vectors/CallStopIcon";
import { useSelector } from "react-redux";
import { selectById, selectCurrentChannelMembers, selectCurrentVoiceChannel } from "../../../redux/voiceChannelReducer";
import { pcManager, PeerConnection } from "../../../PeerConnectionManager";
import { getUserInfo } from "../../../redux/userReducer";
import { getAllPeerConnections } from "../../../redux/peerConnectionReducer";

const Call = () => {

    const curVchId = useSelector(selectCurrentVoiceChannel);
    const activeChannel = useSelector(selectById(curVchId));
    const user = useSelector(getUserInfo);
    const userId:string = user.id;
    const connectionsInfo = useSelector(getAllPeerConnections);


    return <div className="call">
        <div className="call__members">
            {
                activeChannel.members.map((x, i) => {
                    // <UserLogo key={`userlogo_${x}`} className="call__member" />
                    
                    console.log({ userId, user, x });
                    let stream: MediaStream | undefined;
                    let conState:'idle'|'ready'|'error';
                    if (userId !== x.id) {
                        let peerCon: PeerConnection | undefined = pcManager.getPeerConnection(x.id);
                        let peerConnectionInfo = connectionsInfo.filter(y=>y.id == x.id)[0];
                        conState = peerConnectionInfo ?  peerConnectionInfo.connectionStatus: 'idle';
                        stream = peerCon?.remoteStream;
                        console.log(peerCon);
                    }
                    else {
                        stream = pcManager.mutedStream;
                        console.log(stream);
                        conState = 'ready';
                    }
                    let tracks = stream?.getTracks().map(y => y.kind);
                    console.log(tracks);
                    const videoMember =
                        tracks?.includes('video') && conState == 'ready' ?
                            <video
                                className="call__videomember"
                                ref={(ref) => {
                                    if (ref && stream) ref.srcObject = stream;
                                }}
                                autoPlay playsInline />
                            : <>
                                <UserLogo className="call__member" />
                                <video style={{display:'none'}}
                                ref={(ref) => {
                                    if (ref && stream) ref.srcObject = stream;
                                }}
                                autoPlay playsInline />
                            </>
                        ;

                    return <div key={`member_${x}`} className="call__member_wrapper">
                        {videoMember}
                    </div>;
                })
            }
        </div>
        <div className="call__controls">
            <button className="call__controls__btn">
                <VideocallIcon className="call__controls__btn-icon" />
            </button>
            <button className="call__controls__btn">
                <StreamIcon className="call__controls__btn-icon" />
            </button>
            <button className="call__controls__btn">
                <MicIcon className="call__controls__btn-icon" status="on" />
            </button>
            <button className="call__controls__btn">
                <CallStopIcon className="call__controls__btn-icon" />
            </button>
        </div>
    </div>
}
export default Call