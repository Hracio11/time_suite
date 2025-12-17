
import React, { useState } from 'react';
import { InventoryItem } from '../types';
import ExcelImporter from './ExcelImporter';

interface InventoryProps {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  notify: (msg: string, type: any) => void;
}

const Inventory: React.FC<InventoryProps> = ({ inventory, setInventory, notify }) => {
  const [newItem, setNewItem] = useState({ name: '', category: '', quantity: 0, unit: 'unid', minQuantity: 1 });

  const addItem = () => {
    if (!newItem.name) return;
    const item: InventoryItem = { ...newItem, id: Math.random().toString(36).substr(2, 9) };
    setInventory(prev => [...prev, item]);
    setNewItem({ name: '', category: '', quantity: 0, unit: 'unid', minQuantity: 1 });
    notify(`Añadido: ${item.name}`, 'success');
  };

  const handleExcelImport = (data: any[]) => {
    const importedItems: InventoryItem[] = data.map((item: any) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: item.name || item.Nombre || item.Articulo || "Articulo importado",
      category: item.category || item.Categoria || "General",
      quantity: parseInt(item.quantity || item.Cantidad || 0),
      unit: item.unit || item.Unidad || "unid",
      minQuantity: parseInt(item.minQuantity || item.Minimo || 1),
    }));
    setInventory(prev => [...prev, ...importedItems]);
    notify(`${importedItems.length} artículos importados desde Excel`, 'success');
  };

  const updateQuantity = (id: string, delta: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        if (newQty <= item.minQuantity && item.quantity > item.minQuantity) {
          notify(`¡Stock bajo!: ${item.name}`, 'warning');
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Gestión de Stock</h2>
        <ExcelImporter label="Importar Inventario" onData={handleExcelImport} />
      </div>

      <div className="glass p-6 rounded-2xl">
        <h2 className="text-sm font-bold mb-4 text-slate-400">Añadir Nuevo Artículo</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2" 
            placeholder="Nombre" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})}
          />
          <input 
            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2" 
            placeholder="Categoría (ej: Despensa)" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}
          />
          <div className="flex gap-2">
            <input 
              type="number" className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 w-full" 
              placeholder="Cant." value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
            />
            <button onClick={addItem} className="bg-sky-600 hover:bg-sky-500 px-4 py-2 rounded-xl font-bold transition-colors text-xs">Añadir</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventory.map(item => (
          <div key={item.id} className={`glass p-5 rounded-2xl relative border-t-4 transition-all hover:scale-[1.02] ${item.quantity <= item.minQuantity ? 'border-amber-500' : 'border-emerald-500'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{item.name}</h3>
                <span className="text-xs bg-slate-800 px-2 py-1 rounded-full text-slate-400">{item.category}</span>
              </div>
              <button 
                onClick={() => setInventory(prev => prev.filter(i => i.id !== item.id))}
                className="text-slate-600 hover:text-rose-500"
              >✕</button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-2xl font-mono font-bold">
                {item.quantity} <span className="text-sm font-normal text-slate-500">{item.unit}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateQuantity(item.id, -1)} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 font-bold">-</button>
                <button onClick={() => updateQuantity(item.id, 1)} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 font-bold">+</button>
              </div>
            </div>
            {item.quantity <= item.minQuantity && <p className="text-[10px] text-amber-500 mt-3 font-bold uppercase tracking-wider">Stock insuficiente</p>}
          </div>
        ))}
        {inventory.length === 0 && (
          <div className="col-span-full py-20 text-center glass rounded-2xl opacity-50">
            <p>El inventario está vacío. Comienza a gestionar tus recursos.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
