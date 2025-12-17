
import React from 'react';
import { PersonaType } from '../types';

interface ProfileSelectorProps {
  onSelect: (p: PersonaType) => void;
}

const ProfileSelector: React.FC<ProfileSelectorProps> = ({ onSelect }) => {
  const profiles = [
    { type: PersonaType.HOUSEWIFE, icon: '🏠', desc: 'Gestión del hogar, compras y recetas familiares.' },
    { type: PersonaType.STUDENT, icon: '🎓', desc: 'Organización académica, tareas y comidas rápidas.' },
    { type: PersonaType.COMMON, icon: '👤', desc: 'Gestión personal balanceada y recordatorios diarios.' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <div className="max-w-4xl w-full text-center">
        <div className="mb-12">
          <div className="inline-block w-20 h-20 rounded-full bg-sky-500/20 jarvis-glow mb-4 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-sky-500 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Bienvenido a HESTIA</h1>
          <p className="text-slate-400">Selecciona tu perfil de usuario para inicializar el asistente inteligente</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {profiles.map(p => (
            <button
              key={p.type}
              onClick={() => onSelect(p.type)}
              className="glass p-8 rounded-2xl hover:border-sky-500 transition-all group hover:scale-105"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{p.icon}</div>
              <h2 className="text-xl font-bold mb-2 group-hover:text-sky-400">{p.type}</h2>
              <p className="text-sm text-slate-500">{p.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSelector;
