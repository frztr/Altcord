import { Server } from 'socket.io';
import userController from './api/Controllers/userController';
import authController from './api/Controllers/authController';
import friendController from './api/Controllers/friendController';
import { IUserService } from './api/Services/IUserService';
import UserService from './api/Services/UserService';
import { IUserRepository } from './api/Repositories/IUserRepository';
import { UserRepository } from './api/Repositories/UserRepository';
import { AuthService } from './api/Services/AuthService';
import { IAuthService } from './api/Services/IAuthService';
import { IAuthRepository } from './api/Repositories/IAuthRepository';
import { AuthRepository } from './api/Repositories/AuthRepository';
import { IFriendRepository } from './api/Repositories/IFriendRepository';
import { IFriendService } from './api/Services/IFriendsService';
import { FriendRepository } from './api/Repositories/FriendRepository';
import { FriendService } from './api/Services/FriendService';
import { ITalkService } from './api/Services/ITalkService';
import { ITalkRepository } from './api/Repositories/ITalkRepository';
import { TalkRepository } from './api/Repositories/TalkRepository';
import { TalkService } from './api/Services/TalkService';
import { talkController } from './api/Controllers/talkController';
import express from 'express';
import TalkRestController
,{ taskRestContoller }
 from './api/RestControllers/talkRestController';
import bodyParser from 'body-parser';
import cors from 'cors';
import voiceController from './api/Controllers/voiceChannelController';
import { IVoiceService } from './api/Services/IVoiceService';
import { VoiceService } from './api/Services/VoiceService';
import { IVoiceChannelsRepository } from './api/Repositories/IVoiceChannelsRepository';
import { VoiceChannelRepository } from './api/Repositories/VoiceChannelRepository';

const socketPort = 5000;
const restPort = 8000;
const clientPort = 3000;

// const hostUrl = 'http://localhost';
const hostUrl = 'http://172.30.132.70';

export const io = new Server({
    cors: {
        origin: `${hostUrl}:${clientPort}`
    }
});

abstract class Factory<T> {
    type:any;

    constructor(type: new () => T)
    {
        this.type = type;
    }
    
    abstract get():T;
}

class Transient<T> extends Factory<T> {

    get(): T {
        return new this.type();
    }
}

class Singleton<T> extends Factory<T> {

    ent!: T;

    get(): T {
        if (!this.ent) {
            this.ent = new this.type();
        }
        return this.ent;
    }
}

type Provider = {
    IAuthService: Factory<IAuthService>
    IUserService: Factory<IUserService>,
    IUserRepository: Factory<IUserRepository>,
    IAuthRepository: Factory<IAuthRepository>,
    IFriendRepository: Factory<IFriendRepository>,
    IFriendService: Factory<IFriendService>,
    ITalkRepository: Factory<ITalkRepository>,
    ITalkService: Factory<ITalkService>,
    IVoiceService: Factory<IVoiceService>,
    IVoiceChannelRepository: Factory<IVoiceChannelsRepository>
};

export const provider: Provider = {
    IUserService: new Singleton<IUserService>(UserService),
    IUserRepository: new Transient<IUserRepository>(UserRepository),
    IAuthService: new Singleton<IAuthService>(AuthService),
    IAuthRepository: new Singleton<IAuthRepository>(AuthRepository),
    IFriendRepository: new Transient<IFriendRepository>(FriendRepository),
    IFriendService: new Singleton<IFriendService>(FriendService),
    ITalkRepository: new Transient<ITalkRepository>(TalkRepository),
    ITalkService: new Singleton<ITalkService>(TalkService),
    IVoiceService: new Singleton<IVoiceService>(VoiceService),
    IVoiceChannelRepository: new Singleton<IVoiceChannelsRepository>(VoiceChannelRepository)
};

const api: { [index: string]: any } = {
    users: userController,
    auth: authController,
    friends: friendController,
    talks:talkController,
    voice:voiceController
};



io.on('connection', (socket) => {
    console.log(`user connected ${socket.id}`);

    socket.onAny((eventName: string, ...args: any[]) => {
        let [controller, method] = eventName.split('.');
        if (!api[controller]) return;
        let func = (api[controller](socket))[method];
        if (!func) return;
        func(...args);
    });
});

const app = express();

app.use(bodyParser.json());
app.use(cors({
    origin: `${hostUrl}:${clientPort}`,
    optionsSuccessStatus:200,
}));

const restApi: {[index:string]:any} = {
    talks: TalkRestController()
};

app.all('/:controller.:method',(req,res)=>{
    let {controller, method} = req.params;
    if(!restApi[controller]) res.json("Controller not found.");
    if(!restApi[controller][method]) res.json("Method not found.");
    restApi[controller][method](req,res);
});

// app.use('/talks',taskRestContoller);

io.listen(socketPort);
app.listen(restPort,()=>{
    console.log(`restApi started on ${restPort}`);
});

export const restApp = app;


