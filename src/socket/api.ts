import axios from "axios"
import { getCookies } from "../utils/cookies";
import { Message } from "../redux/entities/message";

export const apiSendMessage = async (message:Message,talkId:string): Promise<any> => {

    let res = await axios.post('http://172.30.132.70:8000/talks.sendMessage', {
        "message": {
            "text": message.text,
            // "image": "https://i.pinimg.com/originals/d2/5f/4c/d25f4c8d98b5fb547ba14976fbe0daf5.jpg",
            "timestamp": message.timestamp
        }
        , "talkId": talkId
        // , "companionId": "b3107fbe-5a8e-442a-a2c4-be921a2f69bc"
    },{
        headers: {
            Authorization:`Bearer ${getCookies().get('user')}`,
        }
    });

    return res;
}