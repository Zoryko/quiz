import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3001", {
const socket: Socket = io("http://wrong-siana-alexp71eperso-8e0806a8.koyeb.app/", {
    autoConnect: false
});

export default socket;