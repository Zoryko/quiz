const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const socketHandlers = require("./socket/socketHandlers");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    },
    pingInterval: 25000,
    pingTimeout: 2100000
});

socketHandlers(io);

server.listen(3001, () => {
    console.log("Backend lancé sur http://localhost:3001");
});