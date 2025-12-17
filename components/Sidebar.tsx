
import React from 'react';
import { PersonaType } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  persona: PersonaType;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, persona, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Inicio', icon: '⚡' },
    { id: 'calendar', label: 'Calendario', icon: '📅' },
    { id: 'tasks', label: 'Tareas', icon: '📝' },
    { id: 'inventory', label: 'Inventario', icon: '📦' },
    { id: 'recipes', label: 'Recetas', icon: '🥘' },
  ];

  return (
    <aside className="w-20 md:w-64 glass border-r border-slate-800 flex flex-col transition-all">
      <div className="p-6 hidden md:block">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center font-bold text-xl">H</div>
          <div>
            <p className="font-bold text-sm">HESTIA</p>
            <p className="text-[10px] text-sky-400 font-mono">v3.1 ONLINE</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 mt-6 space-y-2 px-3">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-center md:justify-start gap-4 p-3 rounded-xl transition-colors ${
              activeTab === item.id ? 'bg-sky-500/10 text-sky-400' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="hidden md:block font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center md:justify-start gap-4 p-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
        >
          <span className="text-xl">🚪</span>
          <span className="hidden md:block text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
