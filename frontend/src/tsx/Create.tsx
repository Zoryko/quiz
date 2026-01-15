import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/Create.css';
import { GridCreate } from './GridCreate.tsx';
import { Category, Categories } from './Categories.tsx';
import { CellData } from "./GridCellCreate.tsx";

function Create() {
    let navigate = useNavigate();

    const [gridWidth, setGridWidth] = useState(3);
    const [gridHeight, setGridHeight] = useState(3);

    const [categories, setCategories] = useState<Category[]>([]);

    const [selectedCell, setSelectedCell] = useState<string>("")
    const [cellData, setCellData] = useState<Record<string, CellData>>({});
    const [formData, setFormData] = useState({question: "", reponse: "", categoryId: "null", difficulty: 'Facile' as 'Facile' | 'Difficile'});

    const [cellsToSwap, setCellsToSwap] = useState<{cell1: string, cell2: string}>({cell1: "A1", cell2: "A1"});

    useEffect(() => {
        if(selectedCell && cellData[selectedCell]) {
            const data = cellData[selectedCell];
            setFormData({question: data.question, reponse: data.reponse, categoryId: data.categoryId, difficulty: data.difficulty});
        } else {
            setFormData({question: "", reponse: "", categoryId: "null", difficulty: 'Facile'});
        }
    }, [selectedCell, cellData]);

    const saveCellData = () => {
        if(!selectedCell) return;
        setCellData((prev) => ({
            ...prev,
            [selectedCell]: {question: formData.question.trim(), reponse: formData.reponse.trim(), categoryId: formData.categoryId, difficulty: formData.difficulty}
        }));
        setSelectedCell("");
    }

    const exportGrid = () => {
        const dataToExport = {
            lignes: gridHeight,
            colonnes: gridWidth,
            cellules: cellData,
            categories: categories
        };

        const data = JSON.stringify(dataToExport, null, 2);

        const blob = new Blob([data], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "grille.json";
        link.click();
        URL.revokeObjectURL(url);
    }

    const importGrid = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target?.result as string);
                console.log(imported);
                
                setGridWidth(imported.colonnes ? imported.colonnes : 3);
                setGridHeight(imported.lignes ? imported.lignes : 3);
                setCellData(imported.cellules ? imported.cellules : {});
                setCategories(imported.categories ? imported.categories : []);
            } catch(err) {
                console.error(err);
            }
        }

        reader.readAsText(file);
    }

    const shuffleGrid = () => {
        const allCellIds: string[] = [];
        for(let row = 1; row <= gridHeight; row++) {
            for(let col = 1; col <= gridWidth; col++) {
                const cId = String.fromCharCode(64 + col) + row;
                allCellIds.push(cId);
            }
        }

        const allCells: CellData[] = allCellIds.map(id => cellData[id] ?? {categoryId: "null", question: "", reponse: "", difficulty: 'Facile'});

        for(let i = allCells.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            [allCells[i], allCells[j]] = [allCells[j], allCells[i]];
        }

        const shuffled: Record<string, CellData> = {};
        allCellIds.forEach((id, index) => {
            shuffled[id] = {...allCells[index]};
        });

        setCellData(shuffled);
    }

    const cleanGrid = (newW: number, newH: number) => {
        const newIds: string[] = [];
        for(let row = 1; row <= newH; row++) {
            for(let col = 1; col <= newW; col++) {
                const cId = String.fromCharCode(64 + col) + row;
                newIds.push(cId);
            }
        }

        setCellData(prev => {
            const filtered: Record<string, CellData> = {};
            newIds.forEach(id => {
                if(prev[id]) filtered[id] = prev[id];
            });
            return filtered;
        });
    }

    const swapCells = () => {
        if(!cellsToSwap.cell1 || !cellsToSwap.cell2 || cellsToSwap.cell1 === cellsToSwap.cell2) return;
        const newCellsData = {...cellData};
        [newCellsData[cellsToSwap.cell1], newCellsData[cellsToSwap.cell2]] = [newCellsData[cellsToSwap.cell2], newCellsData[cellsToSwap.cell1]];
        setCellData(newCellsData);
    }

    return (
        <div id='createGlobal'>
            <div id='panelGauche'>
                <button onClick={() => navigate('/')}>Retour au menu</button>
                <hr/>
                <h3>Nombre de colonnes</h3>
                <button className="setter" onClick={() => {const newW = gridWidth - 1; setGridWidth(newW); cleanGrid(newW, gridHeight)}} disabled={gridWidth === 3}>-</button>
                <span>{gridWidth}</span>
                <button className="setter" onClick={() => setGridWidth(gridWidth + 1)} disabled={gridWidth === 10}>+</button>
                <h3>Nombre de lignes</h3>
                <button className="setter" onClick={() => {const newH = gridHeight - 1; setGridHeight(newH); cleanGrid(gridWidth, newH)}} disabled={gridHeight === 3}>-</button>
                <span>{gridHeight}</span>
                <button className="setter" onClick={() => setGridHeight(gridHeight + 1)} disabled={gridHeight === 10}>+</button>
                <hr/>
                <button onClick={shuffleGrid}>Mélanger la grille</button>
                <button onClick={swapCells}>Échanger les cellules</button>
                <span id="swap">Échanger
                <select name="swapCell1" value={cellsToSwap.cell1} onChange={(e) => setCellsToSwap({cell1: e.target.value, cell2: cellsToSwap.cell2})}>
                    {Object.keys(cellData).map(cId => (
                        <option key={cId} value={cId}>{cId}</option>
                    ))}
                </select>
                et
                <select name="swapCell2" value={cellsToSwap.cell2} onChange={(e) => setCellsToSwap({cell1: cellsToSwap.cell1, cell2: e.target.value})}>
                    {Object.keys(cellData).map(cId => (
                        <option key={cId} value={cId}>{cId}</option>
                    ))}
                </select></span>

                <div id='importExport'>
                    <input type='file' id='importInput' accept=".json" style={{display: "none"}} onChange={importGrid}/>
                    <button id='import' onClick={() => document.getElementById('importInput')?.click()}>Importer une grille</button> <br/>
                    <button id='export' onClick={() => exportGrid()}>Exporter une grille</button>
                </div>
            </div>

            <div id='panelGrid'>
                <GridCreate gridWidth={gridWidth} gridHeight={gridHeight} cellData={cellData} categories={categories} setSelectedCell={setSelectedCell} />
            </div>

            <Categories categories={categories} setCategories={setCategories} />

            {selectedCell !== "" && 
            <div id="overlay">
                <div id='popup'>
                    <h1>{selectedCell}</h1>
                    <form id='cellInfo'>
                        <div id="question">
                            <label className="labelQuestionReponse" htmlFor="question">Question : </label>
                            <input className="questionReponse" type="text" name="question" value={formData.question} onChange={(e) => setFormData((prev) => ({...prev, question: e.target.value}))} />
                        </div>
                        <div id="reponse">
                            <label className="labelQuestionReponse" htmlFor="reponse">Réponse : </label>
                            <input className="questionReponse" type="text" name="reponse" value={formData.reponse} onChange={(e) => setFormData((prev) => ({...prev, reponse: e.target.value}))}/>
                        </div>
                        <div id="categoryDifficulty">
                            <div id="category">
                                <label htmlFor="category">Catégorie : </label>
                                <select name="category" value={formData.categoryId} onChange={(e) => setFormData((prev) => ({...prev, categoryId: e.target.value}))}>
                                    <option value="null">Choisir une catégorie</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div id="difficulty">
                                <div>
                                    <label htmlFor="Facile">Facile</label>
                                    <input type="radio" name="difficulty" value="Facile" checked={formData.difficulty === 'Facile'} onChange={() => setFormData((prev) => ({...prev, difficulty: 'Facile'}))}/>
                                </div>
                                <div>
                                    <label htmlFor="Difficile">Difficile</label>
                                    <input type="radio" name="difficulty" value="Difficile" checked={formData.difficulty === 'Difficile'} onChange={() => setFormData((prev) => ({...prev, difficulty: 'Difficile'}))}/>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div id='popupButtons'>
                        <button onClick={saveCellData}>Valider</button>
                        <button onClick={() => setSelectedCell("")}>Fermer</button>
                    </div>
                </div>
            </div>}
        </div>
    );
}

export default Create;