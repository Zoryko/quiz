import { io, Socket } from "socket.io-client";

const socket: Socket = io(process.env.REACT_APP_API_URL as string, {
    autoConnect: false,
    transports: ['websocket']
});

export default socket;