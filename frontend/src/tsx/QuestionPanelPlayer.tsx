import { Category, CellData } from "./GameContext"

type QuestionPanelHostProps = {
    cellId: string,
    cellData: CellData
    categories: Category[]
}

export default function QuestionPanelHost({cellId, cellData, categories}: QuestionPanelHostProps) {
    const category = categories.find(c => c.id === cellData.categoryId);

    return (
        <div id="questionPlayer" className="questionPanel">
            <div id="cellInfo">
                <h2>{cellId}</h2>
                <h3>{category?.name} ({cellData.difficulty})</h3>
            </div>
            <div id="questionReponse">
                <h2>Question : {cellData.question}</h2>
            </div>
        </div>
    );
}