type PlayerCardProps = {
    pseudo: string;
    score: number;
    joker: number;
    ordre: number;
    plays: boolean;
    isHost?: boolean;
    canMoveUp?: boolean;
    canMoveDown?: boolean;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    started?: boolean;
}

export default function PlayerCard({pseudo, score, joker, ordre, plays, isHost, canMoveUp, canMoveDown, onMoveUp, onMoveDown, started}: PlayerCardProps) {
    return (
        <div className="playerCard" style={plays ? {backgroundColor: "yellow"} : {}}>
            <div className="playerOrder">
                {isHost && !started && <button onClick={onMoveUp} disabled={!canMoveUp}>↑</button>}
                <h1>{ordre}</h1>
                {isHost && !started && <button onClick={onMoveDown} disabled={!canMoveDown}>↓</button>}
            </div>
            <div>
                <h3>{pseudo}</h3> {score} {score > 1 ? "pts" : "pt"}
            </div>
            <span>Joker: {joker}</span>
        </div>
    );
}