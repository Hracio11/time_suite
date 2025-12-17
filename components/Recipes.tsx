
import React, { useState } from 'react';
import { Recipe, InventoryItem } from '../types';
import ExcelImporter from './ExcelImporter';

interface RecipesProps {
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  inventory: InventoryItem[];
  notify: (msg: string, type: any) => void;
}

const Recipes: React.FC<RecipesProps> = ({ recipes, setRecipes, inventory, notify }) => {
  const [showForm, setShowForm] = useState(false);
  const [newRecipe, setNewRecipe] = useState<Recipe>({ id: '', title: '', ingredients: [], instructions: [], prepTime: '' });

  const addRecipe = () => {
    if (!newRecipe.title) return;
    setRecipes(prev => [...prev, { ...newRecipe, id: Math.random().toString(36).substr(2, 9) }]);
    setNewRecipe({ id: '', title: '', ingredients: [], instructions: [], prepTime: '' });
    setShowForm(false);
    notify('Receta guardada', 'success');
  };

  const handleExcelImport = (data: any[]) => {
    const importedRecipes: Recipe[] = data.map((item: any) => ({
      id: Math.random().toString(36).substr(2, 9),
      title: item.title || item.Nombre || "Receta importada",
      prepTime: item.prepTime || item.Tiempo || "30 min",
      ingredients: (item.ingredients || item.Ingredientes || "").split(',').map((i: string) => i.trim()),
      instructions: (item.instructions || item.Pasos || "").split('.').map((i: string) => i.trim()),
    }));
    setRecipes(prev => [...prev, ...importedRecipes]);
    notify(`${importedRecipes.length} recetas importadas desde Excel`, 'success');
  };

  const checkAvailability = (recipeIngredients: string[]) => {
    const missing = recipeIngredients.filter(ing => 
      !inventory.some(inv => inv.name.toLowerCase().includes(ing.toLowerCase()) && inv.quantity > 0)
    );
    return missing;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Libro de Recetas</h2>
        <div className="flex gap-4">
          <ExcelImporter label="Importar Recetas" onData={handleExcelImport} />
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-sky-600 hover:bg-sky-500 px-6 py-2 rounded-xl font-bold transition-all text-sm"
          >
            {showForm ? 'Cerrar' : 'Añadir Receta'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="glass p-6 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input 
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2" 
              placeholder="Nombre del Plato" value={newRecipe.title} onChange={e => setNewRecipe({...newRecipe, title: e.target.value})}
            />
            <input 
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2" 
              placeholder="Tiempo (ej: 30 min)" value={newRecipe.prepTime} onChange={e => setNewRecipe({...newRecipe, prepTime: e.target.value})}
            />
          </div>
          <textarea 
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 mb-4 h-24" 
            placeholder="Ingredientes (separados por comas o líneas)" 
            onChange={e => setNewRecipe({...newRecipe, ingredients: e.target.value.replace(/\n/g, ',').split(',').map(i => i.trim()).filter(i => i !== '')})}
          />
          <button onClick={addRecipe} className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-bold transition-colors">Guardar Receta</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {recipes.map(recipe => {
          const missing = checkAvailability(recipe.ingredients);
          return (
            <div key={recipe.id} className="glass rounded-2xl overflow-hidden hover:border-slate-600 transition-all flex flex-col group">
              <div className="bg-slate-800/80 p-5 border-b border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-sky-400">{recipe.title}</h3>
                  <span className="text-xs text-slate-500">⏱ {recipe.prepTime}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {missing.length === 0 ? (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold">✓ DISPONIBLE</span>
                  ) : (
                    <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-bold">FALTAN {missing.length} INGREDIENTES</span>
                  )}
                </div>
              </div>
              <div className="p-5 flex-1 space-y-4">
                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-500 mb-2">Ingredientes</h4>
                  <ul className="text-sm space-y-1">
                    {recipe.ingredients.slice(0, 5).map((ing, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span> {ing}
                      </li>
                    ))}
                    {recipe.ingredients.length > 5 && <li className="text-slate-500 text-xs italic">+ {recipe.ingredients.length - 5} más</li>}
                  </ul>
                </div>
                <button 
                  onClick={() => setRecipes(prev => prev.filter(r => r.id !== recipe.id))}
                  className="w-full border border-slate-800 hover:bg-rose-500/10 hover:text-rose-500 py-2 rounded-xl text-xs transition-colors"
                >Eliminar Receta</button>
              </div>
            </div>
          );
        })}
        {recipes.length === 0 && !showForm && (
          <div className="col-span-full py-20 text-center glass rounded-2xl opacity-50">
            <p>Tu recetario está vacío. Jarvis puede sugerirte algunas si le preguntas.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;
