const gameState = require("./gameState");

function hostGame(socket, pseudo) {
    if(gameState.host) {
        return {error: "Il y a déjà un host."};
    }

    gameState.host = {socketId: socket.id, pseudo};
    gameState.players = [{socketId: socket.id, pseudo, score: -1, joker: -1}];
    gameState.started = false;

    return {success: true, role: "HOST", gameState};
}

function joinGame(socket, pseudo) {
    if(!gameState.host) {
        return {error: "Aucune partie trouvée."};
    }

    gameState.players.push({socketId: socket.id, pseudo, score: 0, joker: 0});
    return {success: true, role: "PLAY", gameState};
}

function leaveGame(socket, io) {
    if(gameState.host?.socketId === socket.id) {
        resetGame(io);
    } else {
        gameState.players = gameState.players.filter(p => p.socketId !== socket.id);
    }
}

function resetGame(io) {
    gameState.host = null;
    gameState.players = [];
    gameState.grid = null;
    gameState.started = false;

    io.emit("game-end");
}

function importGrid(socket, grid) {
    if(gameState.host?.socketId !== socket.id || !gameState.host) {
        return {error: "Seul le host peut importer une grille"};
    }

    gameState.grid = grid;
    return {success: true};
}

module.exports = {hostGame, joinGame, leaveGame, importGrid};