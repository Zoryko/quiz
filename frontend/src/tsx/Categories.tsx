import { Dispatch, SetStateAction } from "react";
import { v4 as uuidv4 } from "uuid";

export type Category = {
    id: string,
    name: string,
    color: string
}

type CategoriesProps = {
    categories: Category[];
    setCategories: Dispatch<SetStateAction<Category[]>>;
}

export function Categories({categories, setCategories}: CategoriesProps) {
    const addCategory = () => {
        const newId = uuidv4();
        setCategories([
            ...categories,
            {id: newId, name: "Nouvelle catégorie", color: "#ffffff"}
        ]);
    }

    const delCategory = (id: string) => {
        setCategories(prev => prev.filter((cat) => cat.id !== id))
    }

    const updateName = (id: string, newName: string) => {
        setCategories(prev => prev.map((cat) => cat.id === id ? {...cat, name: newName} : cat));
    }

    const updateColor = (id: string, newColor: string) => {
        setCategories(prev => prev.map((cat) => cat.id === id ? {...cat, color: newColor} : cat));
    }

    return (
        <div id='panelDroite'>
            <h3>Catégories</h3>
            <ul id='categories'>
                {categories.map((cat) => (
                    <li className="category" key={cat.id}>
                        <input className="catColor" type='color' value={cat.color} onChange={(e) => updateColor(cat.id, e.target.value)}/>
                        <input className="catName" type='text' value={cat.name} onChange={(e) => updateName(cat.id, e.target.value)}/>
                        <button className="catDel" onClick={() => delCategory(cat.id)}>X</button>
                    </li>
                ))}
            </ul>
            <button id='addCategory' onClick={addCategory}>Ajouter une catégorie</button>
        </div>
    );
}