const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const PORT = process.env.PORT || 8000;

const socketHandlers = require("./socket/socketHandlers");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["https://quiz-des-copains.netlify.app", "https://www.quiz-des-copains.netlify.app"],
        methods: ["GET", "POST"],
        credentials: true
    },
    pingInterval: 25000,
    pingTimeout: 2100000
});

socketHandlers(io);

server.listen(PORT, () => {
    console.log("Backend lancé sur http://wrong-siana-alexp71eperso-8e0806a8.koyeb.app/ avec le port ", PORT);

});
