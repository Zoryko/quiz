import { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction} from "react";
import socket from "../socket.ts";

export type PlayerRole = "HOST" | "PLAY";

export interface Player {
    pseudo: string;
    role: PlayerRole;
}

export interface Grid {
    colonnes: number;
    lignes: number;
    categories: Category[];
    cellules: Record<string, CellData>;
}

export interface Category {
    id: string;
    name: string;
    color: string;
}

export interface CellData {
    categoryId: string;
    question: string;
    reponse: string;
    difficulty: 'Facile' | 'Difficile';
}

export interface GameState {
    host: {socketId: string; pseudo: string} | null;
    players: {socketId: string; pseudo: string, score: number, joker: number}[];
    grid: Grid | null;
    started: boolean;
    revealedCells: Record<string, boolean>;
    selectedCell: string;
    currentTurnIndex: number;
}

interface GameContextType {
    player: Player | null;
    setPlayer: Dispatch<SetStateAction<Player | null>>;
    game: GameState |null;
    setGame: Dispatch<SetStateAction<GameState | null>>;
}

export const GameContext = createContext<GameContextType>({} as GameContextType);

export function GameProvider({children}: {children: ReactNode}) {
    const [player, setPlayer] = useState<Player | null>(null);
    const [game, setGame] = useState<GameState | null>(null);

    useEffect(() => {
        socket.on("game-update", (state: GameState) => {
            setGame(state);
        });

        socket.on("game-end", () => {
            setGame(null);
            setPlayer(null);
        });

        return () => {
            socket.off("game-update");
            socket.off("game-end");
        };
    }, []);

    return (
        <GameContext.Provider value={{ player, setPlayer, game, setGame}}>
            {children}
        </GameContext.Provider>
    );
}