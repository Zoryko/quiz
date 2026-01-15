import { Dispatch, SetStateAction } from 'react';
import { CellData, GridCellCreate } from './GridCellCreate.tsx'
import { Category } from './Categories.tsx';

type GridCreateProps = {
    gridWidth: number;
    gridHeight: number;
    cellData: Record<string, CellData>;
    categories: Category[]
    setSelectedCell: Dispatch<SetStateAction<string>>;
}

export function GridCreate({gridWidth, gridHeight, cellData, categories, setSelectedCell}: GridCreateProps) {
    const getColumnLetter = (colIndex: number) => String.fromCharCode(65 + colIndex);

    return (
        <table>
            <thead>
                <tr>
                    <th className="prefix"></th>
                    {Array.from({length: gridWidth}).map((_, col) => (
                        <th key={col} className="prefix">{getColumnLetter(col)}</th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {Array.from({length: gridHeight}).map((_, row) => (
                    <tr key={row}>
                        <th className="prefix">{row + 1}</th>
                        {Array.from({length: gridWidth}).map((_, col) => {
                            const cellId = `${getColumnLetter(col)}${row + 1}`;

                            return (
                                <GridCellCreate key={col} cellData={cellData} cellId={cellId} categories={categories} onClick={() => setSelectedCell(cellId)}/>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}