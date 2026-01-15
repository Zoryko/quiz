import socket from "../socket";
import { Category, CellData } from "./GameContext"

type QuestionPanelHostProps = {
    cellId: string,
    cellData: CellData
    categories: Category[]
}

export default function QuestionPanelHost({cellId, cellData, categories}: QuestionPanelHostProps) {
    const category = categories.find(c => c.id === cellData.categoryId);

    const endQuestion = () => {
        socket.emit("end-question");
        socket.emit("next-turn");
    }

    const validerReponse = () => {
        if(cellData.difficulty === "Facile") { console.log("Facile"); socket.emit("ajouter-point");}
        else {console.log("Difficile"); socket.emit("ajouter-2-points");}
        endQuestion();
    }

    return (
        <div id="questionHost" className="questionPanel">
            <div id="cellInfo">
                <h2>{cellId}</h2>
                <h3>{category?.name} ({cellData.difficulty})</h3>
            </div>
            <div id="questionReponse">
                <h2>Question : {cellData.question}</h2>
                <h2>Réponse : {cellData.reponse}</h2>
            </div>
            <div id="boutonQuestion">
                <button id="valider" onClick={validerReponse}>Valider</button>
                <button id="refuser" onClick={endQuestion}>Refuser</button>
            </div>
        </div>
    );
}