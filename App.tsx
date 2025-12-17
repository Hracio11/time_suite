
import React, { useState, useEffect, useCallback } from 'react';
import { PersonaType, Task, InventoryItem, Recipe, Notification, User } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Tasks from './components/Tasks';
import Recipes from './components/Recipes';
import CalendarView from './components/CalendarView';
import JarvisChat from './components/JarvisChat';
import Auth from './components/Auth';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'inventory' | 'recipes' | 'calendar'>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load user from storage
  useEffect(() => {
    const savedUser = localStorage.getItem('hestia_active_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Load user-specific data
  useEffect(() => {
    if (user) {
      localStorage.setItem('hestia_active_user', JSON.stringify(user));
      
      const userKey = `hestia_data_${user.id}`;
      const savedData = localStorage.getItem(userKey);
      if (savedData) {
        const { tasks: t, inventory: i, recipes: r } = JSON.parse(savedData);
        setTasks(t || []);
        setInventory(i || []);
        setRecipes(r || []);
      } else {
        setTasks([]);
        setInventory([]);
        setRecipes([]);
      }
    }
  }, [user]);

  // Save data on change
  useEffect(() => {
    if (user) {
      const userKey = `hestia_data_${user.id}`;
      localStorage.setItem(userKey, JSON.stringify({ tasks, inventory, recipes }));
    }
  }, [tasks, inventory, recipes, user]);

  const addNotification = useCallback((message: string, type: 'info' | 'warning' | 'success' = 'info') => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      timestamp: Date.now(),
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 5));
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('hestia_active_user');
    addNotification('Sesión terminada correctamente', 'info');
  };

  if (!user) {
    return <Auth onAuthSuccess={setUser} />;
  }

  // Safety fallback if persona is somehow missing
  if (!user.persona) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
        <div className="glass p-8 rounded-2xl text-center">
          <p className="text-rose-400 mb-4">Error: Perfil no definido. Por favor re-registra tu cuenta.</p>
          <button onClick={handleLogout} className="bg-sky-600 px-6 py-2 rounded-xl font-bold">Volver</button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard persona={user.persona!} tasks={tasks} inventory={inventory} recipes={recipes} notifications={notifications} />;
      case 'inventory': return <Inventory inventory={inventory} setInventory={setInventory} notify={addNotification} />;
      case 'tasks': return <Tasks tasks={tasks} setTasks={setTasks} notify={addNotification} />;
      case 'recipes': return <Recipes recipes={recipes} setRecipes={setRecipes} inventory={inventory} notify={addNotification} />;
      case 'calendar': return <CalendarView tasks={tasks} setTasks={setTasks} />;
      default: return <Dashboard persona={user.persona!} tasks={tasks} inventory={inventory} recipes={recipes} notifications={notifications} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        persona={user.persona} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
              HESTIA AI
            </h1>
            <p className="text-slate-400 text-sm">Bienvenido, {user.name} • {user.persona}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-500">ID: {user.id}</p>
              <p className="text-sm font-medium text-emerald-400">Canal Seguro</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sky-400 uppercase shadow-inner">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {renderContent()}
      </main>

      <JarvisChat 
        persona={user.persona} 
        context={{ tasks, inventory, recipes, notifications }} 
        setTasks={setTasks}
        setInventory={setInventory}
        addNotification={addNotification}
      />
    </div>
  );
};

export default App;
