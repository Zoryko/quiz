import { Category } from "./Categories";
import { CellData } from "./GridCellCreate";
import socket from "../socket";

type GridGameProps = {
    gridWidth: number,
    gridHeight: number,
    categories: Category[],
    cellData: Record<string, CellData>,
    revealedCells: Record<string, boolean>,
    isHost?: boolean
}

export default function GridGame({gridWidth, gridHeight, categories, cellData, revealedCells, isHost}: GridGameProps) {
    const getColumnIndex = (colIndex: number) => String.fromCharCode(65 + colIndex);

    const getCellName = (cellId: string) => {
        const cat = categories.find(c => c.id === cellData[cellId]?.categoryId);
        return cat?.name || "";
    }

    const getCellColor = (cellId: string) => {
        const cat = categories.find(c => c.id === cellData[cellId]?.categoryId);
        return cat?.color || "transparent";
    }

    const revealCell = (cellId: string) => {
        if(!isHost) return;
        socket.emit("reveal-cell", cellId);
    }

    return (
        <table id='grid'>
            <thead>
                <tr>
                    <th></th>
                    {Array.from({length: gridWidth}).map((_, col) => (
                        <th key={col}>{getColumnIndex(col)}</th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {Array.from({length: gridHeight}).map((_, row) => (
                    <tr key={row}>
                        <th>{row + 1}</th>
                        {Array.from({length: gridWidth}).map((_, col) => {
                            const cellId = `${getColumnIndex(col)}${row+1}`;
                            const isRevealed = revealedCells[cellId];

                            return (
                                <td
                                    key={cellId}
                                    onClick={() => revealCell(cellId)}
                                    style={{
                                        color: isRevealed ? "black" : "white",
                                        backgroundColor: isRevealed ? getCellColor(cellId) : "transparent"
                                    }}
                                >
                                    {isRevealed ? getCellName(cellId) : ""}
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}