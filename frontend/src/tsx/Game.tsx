import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "./GameContext";
import socket from '../socket';
import '../css/Game.css';
import PlayerCard from "./PlayerCard";
import GridGame from "./GridGame";
import QuestionPanelHost from "./QuestionPanelHost";
import QuestionPanelPlayer from "./QuestionPanelPlayer";

function Game() {
    let navigate = useNavigate();
    const {player, game} = useContext(GameContext);
    const [playersOrder, setPlayersOrder] = useState(game?.players ||[]);
    const [catSearch, setCatSearch] = useState("");
    const [diffSearch, setDiffSearch] = useState<'Facile' | 'Difficile'>("Facile");

    const handleHostLeft = () => {
        alert("Le host a quitté la partie");
        navigate("/");
    }

    useEffect(() => {
        if(!game?.host) {
            navigate("/");
        }
    }, [game, navigate]);

    useEffect(() => {
        if(game) setPlayersOrder(game.players);
    }, [game]);

    useEffect(() => {
        socket.on("host-left", handleHostLeft);
        return () => {socket.off("host-left");}
    }, []);

    const isHost = player?.role === "HOST";

    const movePlayer = (index: number, direction: "up" | "down") => {
        const newOrder = [...playersOrder];
        if(direction === "up" && index > 1) {
            [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
        }
        if(direction === "down" && index < newOrder.length - 1) {
            [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
        }
        setPlayersOrder(newOrder);

        socket.emit("reorder-players", newOrder.map((p) => p.socketId));
    }

    const importGrid = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const grid = JSON.parse(reader.result as string);
            socket.emit("import-grid", grid);
        };
        reader.readAsText(file);
    };

    if(!game) return null;

    return (
        <>
        <div id="gameGlobal">
            {isHost ?
            (<div id="hostPanel">
                <h3>Contrôles Host</h3>
                <input type='file' id='importInput' accept=".json" style={{display: "none"}} onChange={importGrid}/>
                <button id='import' onClick={() => document.getElementById('importInput')?.click()}>Importer une grille</button> <hr/>
                <button onClick={() => {socket.emit("game-start"); socket.emit("next-turn");}} disabled={game.players.length < 2 || game.started}>Commencer la partie</button> <hr/>
                <button onClick={() => socket.emit("ajouter-demi-point")} disabled={!game.started}>Ajouter 1/2 point</button>
                <button onClick={() => socket.emit("ajouter-point")} disabled={!game.started}>Ajouter 1 point</button>
                <button onClick={() => socket.emit("enlever-point")} disabled={!game.started}>Enlever 1 point</button>
                <button onClick={() => socket.emit("ajouter-joker")} disabled={!game.started}>Ajouter 1 joker</button>
                <button onClick={() => socket.emit("enlever-joker")} disabled={!game.started}>Enlever 1 joker</button> <hr/>
                <button onClick={() => {
                        if(!catSearch || catSearch === "null" || !diffSearch) return;
                        socket.emit("enlever-joker");
                        socket.emit("trouver-question", {categoryId: catSearch, difficulty: diffSearch});
                    }}
                    disabled={!game.started || game.players[game.currentTurnIndex].joker === 0}
                >Trouver une question</button>
                <div id="trouveQuestion">
                    <label htmlFor="category">Catégories : </label>
                    <select name="category" onChange={(e) => setCatSearch(e.target.value)}>
                        <option value="null">Choisir une catégorie</option>
                        {game.grid?.categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <label htmlFor="Facile">Facile</label>
                    <input type="radio" name="difficulty" value="Facile" checked={diffSearch === "Facile"} onChange={() => setDiffSearch("Facile")}/>
                    <label htmlFor="Difficile">Difficile</label>
                    <input type="radio" name="difficulty" value="Difficile" checked={diffSearch === "Difficile"} onChange={() => setDiffSearch("Difficile")}/>
                </div> <hr/>
                <h3>Catégories</h3>
                {game.grid && game.grid.categories.length > 0 && game.grid.cellules &&
                <ul style={{listStyle: "none", padding: 0}}>
                    {game.grid.categories.map(cat => {
                        const remainingCount = Object.entries(game.grid!.cellules)
                            .filter(([cellId, cell]) => cell.categoryId === cat.id && !game.revealedCells[cellId]);

                            const easyCount = remainingCount.filter(([_, cell]) => cell.difficulty === "Facile").length;
                            const hardCount = remainingCount.filter(([_, cell]) => cell.difficulty === "Difficile").length;
                        
                            return(<li key={cat.id}><input className="catColor" type="color" value={cat.color} disabled/> {cat.name} ({easyCount}/{hardCount})</li>);
                    })}
                </ul>}
            </div>) :
            (<div id="playerPanel">
                <h3>Catégories</h3>
                {game.grid && game.grid.categories.length > 0 && game.grid.cellules &&
                <ul style={{listStyle: "none", padding: 0}}>
                    {game.grid.categories.map(cat => {
                        const remainingCount = Object.entries(game.grid!.cellules)
                            .filter(([cellId, cell]) => cell.categoryId === cat.id && !game.revealedCells[cellId]).length;
                        
                            return(<li key={cat.id}><input className="catColor" type="color" value={cat.color} disabled/> {cat.name} ({remainingCount})</li>);
                    })}
                </ul>}
            </div>)}
            <div id="gridPanel">
                {game.grid ? (<GridGame gridWidth={game.grid.colonnes} gridHeight={game.grid.lignes} categories={game.grid.categories} cellData={game.grid.cellules} revealedCells={game.revealedCells} isHost={isHost}/>) : (<p>Aucune grille importée</p>)}
                {game.selectedCell && game.grid && (isHost ? (<QuestionPanelHost cellId={game.selectedCell}  cellData={game.grid.cellules[game.selectedCell]} categories={game.grid.categories}/>) : (<QuestionPanelPlayer cellId={game.selectedCell}  cellData={game.grid.cellules[game.selectedCell]} categories={game.grid.categories}/>))}
            </div>
            <div id='playerList'>
                {game.players.length > 1 ? (
                    game.players.map((p, index) => p.socketId !== game.host?.socketId && <PlayerCard key={p.socketId} ordre={index} pseudo={p.pseudo} score={p.score ?? 0} joker={p.joker ?? 0} plays={index === game.currentTurnIndex} isHost={isHost} canMoveUp={isHost && index > 1} canMoveDown={isHost && index < playersOrder.length - 1} onMoveUp={() => movePlayer(index, "up")} onMoveDown={() => movePlayer(index, "down")} started={game.started}/>)
                ) : (<p>Aucun joueur connecté</p>)}
            </div>
        </div>
        </>
    );
}

export default Game;