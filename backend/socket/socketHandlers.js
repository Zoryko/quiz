const {hostGame, joinGame, leaveGame, importGrid} = require("../game/gameLogic");
const gameState = require("../game/gameState");

module.exports = function(io) {
    io.on("connection", socket => {
        console.log("Connexion: ", socket.id);

        socket.on("host-game", pseudo => {
            const result = hostGame(socket, pseudo);
            if(result.error) {
                socket.emit("error", result.error);
                return;
            }
            socket.emit("join-success", result);
            io.emit("game-update", gameState);
        });

        socket.on("join-game", pseudo => {
            const result = joinGame(socket, pseudo);
            if(result.error) {
                socket.emit("error", result.error);
                return;
            }
            socket.emit("join-success", result);
            io.emit("game-update", gameState);
        });

        socket.on("import-grid", grid => {
            const result = importGrid(socket, grid);
            if(result.error) {
                socket.emit("error", result.error);
                return;
            }
            io.emit("game-update", gameState);
        });

        socket.on("disconnect", () => {
            const wasHost = gameState.host?.socketId === socket.id;
            leaveGame(socket, io);
            io.emit("game-update", gameState);

            if(wasHost) {
                io.sockets.sockets.forEach(s => {
                    if(s.id !== socket.id) s.emit("host-left");
                });
            }
        });

        socket.on("reorder-players", newOrder => {
            if(!gameState.host || socket.id !== gameState.host.socketId) return;

            const idToPlayer = {};
            gameState.players.forEach(p => idToPlayer[p.socketId] = p);

            const reordered = [];
            newOrder.forEach(id => {
                if(idToPlayer[id]) reordered.push(idToPlayer[id]);
            });
            gameState.players = reordered;
            io.emit("game-update", gameState);
        });

        socket.on("reveal-cell", cellId => {
            if(!gameState.host || socket.id !== gameState.host.socketId) return;
            if(gameState.revealedCells[cellId]) return;

            gameState.revealedCells[cellId] = true;
            gameState.selectedCell = cellId;
            io.emit("game-update", gameState);
        });

        socket.on("end-question", () => {
            if(!gameState.host || socket.id !== gameState.host.socketId) return;
            gameState.selectedCell = null;
            io.emit("game-update", gameState);
        });

        socket.on("next-turn", () => {
            gameState.currentTurnIndex = (gameState.currentTurnIndex + 1) % gameState.players.length;
            if(gameState.players[gameState.currentTurnIndex].socketId === gameState.host.socketId) {gameState.currentTurnIndex += 1;}
            io.emit("game-update", gameState);
        });

        socket.on("game-start", () => {
            if(!gameState.host || socket.id !== gameState.host.socketId) return;
            gameState.started = true;
            io.emit("game-update", gameState);
        })

        socket.on("ajouter-point", () => {
            if(!gameState.host || socket.id !== gameState.host.socketId) return;
            gameState.players[gameState.currentTurnIndex].score += 1;
            io.emit("game-update", gameState);
        });

        socket.on("enlever-point", () => {
            if(!gameState.host || socket.id !== gameState.host.socketId) return;
            gameState.players[gameState.currentTurnIndex].score -= 1;
            io.emit("game-update", gameState);
        });

        socket.on("ajouter-2-points", () => {
            if(!gameState.host || socket.id !== gameState.host.socketId) return;
            gameState.players[gameState.currentTurnIndex].score += 2;
            io.emit("game-update", gameState);
        });

        socket.on("ajouter-demi-point", () => {
            if(!gameState.host || socket.id !== gameState.host.socketId) return;
            gameState.players[gameState.currentTurnIndex].score += 0.5;
            io.emit("game-update", gameState);
        });

        socket.on("ajouter-joker", () => {
            if(!gameState.host || socket.id !== gameState.host.socketId) return;
            gameState.players[gameState.currentTurnIndex].joker += 1;
            io.emit("game-update", gameState);
        });

        socket.on("enlever-joker", () => {
            if(!gameState.host || socket.id !== gameState.host.socketId) return;
            if(gameState.players[gameState.currentTurnIndex].joker > 0) gameState.players[gameState.currentTurnIndex].joker -= 1;
            else return;
            io.emit("game-update", gameState);
        });

        socket.on("trouver-question", ({categoryId, difficulty}) => {
            if(!gameState.host || socket.id !== gameState.host.socketId) return;
            if(!gameState.grid) return;
            const cellules = gameState.grid.cellules;
            const availableCells = Object.entries(cellules)
                .filter(([cellId, cell]) => {
                    return (
                        cell.categoryId === categoryId &&
                        cell.difficulty === difficulty &&
                        !gameState.revealedCells[cellId]
                    );
            });
            if(availableCells.length === 0) {socket.emit("error", "Aucune case disponible"); return;}
            const [cellId] = availableCells[Math.floor(Math.random() * availableCells.length)];
            gameState.revealedCells[cellId] = true;
            gameState.selectedCell = cellId;
            io.emit("game-update", gameState);
        });
    });
};