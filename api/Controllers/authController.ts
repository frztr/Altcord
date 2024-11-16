import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { provider } from '../..';
import { TalkDto } from '../Dto/Talks/TalkDto';


const authController = (socket: Socket) => {
    const authService = provider.IAuthService.get();
    const userService = provider.IUserService.get();
    return {
        createSession: async (token: string) => {
            try {

                let id = await authService.createSession(token, socket);
                let userInfo;
                if (id) {
                    userInfo = await userService.getUserInfoById(id);
                }

                socket.emit('users.getUserInfo', {
                    ...userInfo,
                    talks:(userInfo.talks as TalkDto[]).map(x=>{
                        if(x.type == 'user')
                        {
                            x.id = x.members.filter(y=>y!=id)[0];
                        }
                        return x;
                    }),
                    status: 'online',
                });
            }
            catch (e) {
                console.log(e);
            }
        }
    }
};



export default authController
