
import React, { useState } from 'react';
import { User, PersonaType } from '../types';

interface AuthProps {
  onAuthSuccess: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<PersonaType | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulated auth delay
    setTimeout(() => {
      if (!email || !password || (!isLogin && (!name || !selectedPersona))) {
        setError('Por favor, completa todos los campos, incluyendo tu perfil.');
        setLoading(false);
        return;
      }

      // Mocking account storage in localStorage
      const users = JSON.parse(localStorage.getItem('hestia_users') || '[]');
      
      if (isLogin) {
        const found = users.find((u: any) => u.email === email && u.password === password);
        if (found) {
          onAuthSuccess({ 
            id: found.id, 
            email: found.email, 
            name: found.name, 
            persona: found.persona 
          });
        } else {
          setError('Credenciales incorrectas o cuenta inexistente.');
        }
      } else {
        const exists = users.some((u: any) => u.email === email);
        if (exists) {
          setError('El correo electrónico ya está registrado.');
        } else {
          const newUser = { 
            id: Math.random().toString(36).substr(2, 9), 
            email, 
            password, 
            name, 
            persona: selectedPersona 
          };
          users.push(newUser);
          localStorage.setItem('hestia_users', JSON.stringify(users));
          onAuthSuccess({ 
            id: newUser.id, 
            email: newUser.email, 
            name: newUser.name, 
            persona: newUser.persona 
          });
        }
      }
      setLoading(false);
    }, 1000);
  };

  const personaOptions = [
    { type: PersonaType.HOUSEWIFE, icon: '🏠', label: 'Ama de Casa' },
    { type: PersonaType.STUDENT, icon: '🎓', label: 'Estudiante' },
    { type: PersonaType.COMMON, icon: '👤', label: 'Persona Común' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>

      <div className={`w-full glass p-8 rounded-3xl jarvis-glow relative z-10 animate-in fade-in zoom-in duration-500 ${!isLogin ? 'max-w-2xl' : 'max-w-md'}`}>
        <div className="text-center mb-8">
          <div className="inline-block w-16 h-16 rounded-2xl bg-sky-600 flex items-center justify-center font-bold text-3xl mb-4 jarvis-glow shadow-sky-500/50">H</div>
          <h1 className="text-3xl font-bold text-white tracking-tight">HESTIA AI</h1>
          <p className="text-slate-400 mt-2 text-sm">
            {isLogin ? 'Inicia sesión para acceder al sistema' : 'Crea tu cuenta inteligente hoy'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={`grid gap-6 ${!isLogin ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
            <div className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">Nombre Completo</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 transition-colors"
                    placeholder="Tony Stark"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">Correo Electrónico</label>
                <input 
                  type="email" 
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 transition-colors"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">Contraseña</label>
                <input 
                  type="password" 
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1 text-center md:text-left">Selecciona tu Perfil</label>
                <div className="grid grid-cols-1 gap-3">
                  {personaOptions.map((opt) => (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => setSelectedPersona(opt.type)}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        selectedPersona === opt.type 
                          ? 'bg-sky-500/10 border-sky-500 shadow-[0_0_15px_rgba(56,189,248,0.3)]' 
                          : 'bg-slate-900/30 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl">{opt.icon}</span>
                      <div className="text-left">
                        <p className={`font-bold text-sm ${selectedPersona === opt.type ? 'text-sky-400' : 'text-slate-300'}`}>
                          {opt.label}
                        </p>
                      </div>
                      {selectedPersona === opt.type && (
                        <div className="ml-auto text-sky-500">✓</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/50 rounded-xl text-rose-500 text-xs text-center animate-shake">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-sky-900/20 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Sincronizando...
              </div>
            ) : (isLogin ? 'Acceder al Sistema' : 'Finalizar Registro')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-slate-400 hover:text-sky-400 text-sm transition-colors"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
