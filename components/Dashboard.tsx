
import React from 'react';
import { PersonaType, Task, InventoryItem, Recipe, Notification } from '../types';

interface DashboardProps {
  persona: PersonaType;
  tasks: Task[];
  inventory: InventoryItem[];
  recipes: Recipe[];
  notifications: Notification[];
}

const Dashboard: React.FC<DashboardProps> = ({ persona, tasks, inventory, recipes, notifications }) => {
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const lowStock = inventory.filter(i => i.quantity <= i.minQuantity).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Tareas Pendientes" value={pendingTasks} icon="📝" color="sky" />
        <StatCard title="Artículos Bajos" value={lowStock} icon="📦" color="amber" />
        <StatCard title="Total Recetas" value={recipes.length} icon="🥘" color="rose" />
        <StatCard title="Perfil Activo" value={persona} icon="👤" color="emerald" isString />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>🔔</span> Notificaciones Recientes
          </h3>
          <div className="space-y-4">
            {notifications.length > 0 ? notifications.map(n => (
              <div key={n.id} className={`p-4 rounded-xl border-l-4 ${
                n.type === 'warning' ? 'bg-amber-500/10 border-amber-500' : 
                n.type === 'success' ? 'bg-emerald-500/10 border-emerald-500' : 
                'bg-sky-500/10 border-sky-500'
              }`}>
                <p className="text-sm">{n.message}</p>
                <p className="text-[10px] text-slate-500 mt-1">{new Date(n.timestamp).toLocaleTimeString()}</p>
              </div>
            )) : (
              <p className="text-slate-500 text-sm text-center py-8">No hay alertas del sistema.</p>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>🚀</span> Próximas Tareas
          </h3>
          <div className="space-y-3">
            {tasks.filter(t => !t.completed).slice(0, 5).map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors">
                <div>
                  <p className="text-sm font-medium">{t.title}</p>
                  <p className="text-xs text-slate-500">{t.priority}</p>
                </div>
                <div className="text-xs text-sky-400 font-mono">{t.dueDate}</div>
              </div>
            ))}
            {tasks.filter(t => !t.completed).length === 0 && (
              <p className="text-slate-500 text-sm text-center py-8">Agenda despejada. ¡Buen trabajo!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, isString = false }: any) => (
  <div className="glass p-6 rounded-2xl flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl bg-${color}-500/20 text-${color}-400 flex items-center justify-center text-2xl`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <p className={`text-xl font-bold ${isString ? 'text-slate-100' : 'text-slate-100 font-mono'}`}>{value}</p>
    </div>
  </div>
);

export default Dashboard;
