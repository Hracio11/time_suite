
import React, { useState } from 'react';
import { Task } from '../types';
import ExcelImporter from './ExcelImporter';

interface TasksProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  notify: (msg: string, type: any) => void;
}

const Tasks: React.FC<TasksProps> = ({ tasks, setTasks, notify }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'Baja' | 'Media' | 'Alta'>('Media');

  const addTask = () => {
    if (!newTitle) return;
    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      description: '',
      completed: false,
      priority: newPriority,
      dueDate: new Date().toISOString().split('T')[0],
    };
    setTasks(prev => [task, ...prev]);
    setNewTitle('');
    notify('Tarea programada', 'info');
  };

  const handleExcelImport = (data: any[]) => {
    const importedTasks: Task[] = data.map((item: any) => ({
      id: Math.random().toString(36).substr(2, 9),
      title: item.title || item.Tarea || item.Nombre || "Tarea importada",
      description: item.description || item.Descripcion || "",
      completed: false,
      priority: item.priority || item.Prioridad || 'Media',
      dueDate: item.dueDate || item.Fecha || new Date().toISOString().split('T')[0],
    }));
    setTasks(prev => [...importedTasks, ...prev]);
    notify(`${importedTasks.length} tareas importadas desde Excel`, 'success');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) notify('¡Tarea completada!', 'success');
  };

  const linkToGoogleCalendar = (task: Task) => {
    const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";
    const title = encodeURIComponent(task.title);
    const date = task.dueDate.replace(/-/g, '');
    const url = `${baseUrl}&text=${title}&dates=${date}/${date}&details=Creado+desde+Hestia+AI`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Mis Pendientes</h2>
        <ExcelImporter label="Importar Tareas" onData={handleExcelImport} />
      </div>

      <div className="glass p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
        <input 
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 w-full" 
          placeholder="¿Qué tienes pendiente hoy?" 
          value={newTitle} onChange={e => setNewTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
        />
        <select 
          className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
          value={newPriority} onChange={e => setNewPriority(e.target.value as any)}
        >
          <option>Baja</option>
          <option>Media</option>
          <option>Alta</option>
        </select>
        <button onClick={addTask} className="w-full md:w-auto bg-sky-600 hover:bg-sky-500 px-8 py-3 rounded-xl font-bold transition-all">Añadir</button>
      </div>

      <div className="space-y-3">
        {tasks.map(task => (
          <div key={task.id} className={`glass p-4 rounded-2xl flex items-center justify-between group transition-all ${task.completed ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => toggleTask(task.id)}
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                  task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-700 hover:border-sky-500'
                }`}
              >
                {task.completed && '✓'}
              </button>
              <div>
                <p className={`font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>{task.title}</p>
                <div className="flex gap-2 items-center mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                    task.priority === 'Alta' ? 'bg-rose-500/10 text-rose-500' : 
                    task.priority === 'Media' ? 'bg-amber-500/10 text-amber-500' : 
                    'bg-slate-500/10 text-slate-500'
                  }`}>
                    {task.priority}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{task.dueDate}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!task.completed && (
                <button 
                  onClick={() => linkToGoogleCalendar(task)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg text-sky-400 opacity-0 group-hover:opacity-100 transition-all"
                  title="Añadir a Google Calendar"
                >
                  📅 Google
                </button>
              )}
              <button 
                onClick={() => setTasks(prev => prev.filter(t => t.id !== task.id))}
                className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-500 transition-opacity"
              >✕</button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="py-20 text-center glass rounded-2xl opacity-50">
            <p>No hay tareas pendientes. ¿Planeamos algo nuevo?</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
