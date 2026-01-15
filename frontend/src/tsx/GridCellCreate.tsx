import { Category } from "./Categories.tsx"

type GridCellCreateProps = {
    cellData: Record<string, CellData>,
    cellId: string,
    categories: Category[],
    onClick: () => void
}

export type CellData = {
    categoryId: string,
    question: string,
    reponse: string,
    difficulty: 'Facile' | 'Difficile'
}

export function GridCellCreate({cellData, cellId, categories, onClick}: GridCellCreateProps) {
    const getCellColor = () => {
        const cat = categories.find(c => c.id === cellData[cellId]?.categoryId);
        return cat?.color || "transparent";
    }

    const getCellName = () => {
        const cat = categories.find(c => c.id === cellData[cellId]?.categoryId);
        return cat?.name || "";
    }
    return (
        <td onClick={onClick} style={{backgroundColor: getCellColor()}}>{getCellName()}</td>
    );
}