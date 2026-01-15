import { io, Socket } from "socket.io-client";

const socket: Socket = io(import.meta.env.VITE_API_URL as string, {
    autoConnect: false,
    transports: ['websocket']
});

export default socket;