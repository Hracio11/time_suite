
import React, { useState, useRef, useEffect } from 'react';
import { PersonaType } from '../types';
import { askJarvis } from '../services/geminiService';

interface JarvisChatProps {
  persona: PersonaType;
  context: any;
  setTasks: any;
  setInventory: any;
  addNotification: any;
}

const JarvisChat: React.FC<JarvisChatProps> = ({ persona, context, setTasks, setInventory, addNotification }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'jarvis' | 'user', text: string }[]>([
    { role: 'jarvis', text: `Saludos, ${persona}. Soy HESTIA. ¿En qué puedo asistirte hoy?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    const response = await askJarvis(userText, persona, context);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'jarvis', text: response }]);
    
    // Simulating some notification if JARVIS does something "cool"
    if (userText.toLowerCase().includes('tarea') || userText.toLowerCase().includes('comprar')) {
      addNotification("Jarvis está analizando tu petición...", "info");
    }
  };

  return (
    <>
      {/* JARVIS Floating Orb */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full glass jarvis-glow z-50 flex items-center justify-center group overflow-hidden"
      >
        <div className={`w-10 h-10 rounded-full border-2 border-sky-400 flex items-center justify-center transition-all ${isTyping ? 'animate-spin' : ''}`}>
          <div className="w-6 h-6 rounded-full bg-sky-500 animate-pulse" />
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[70vh] glass rounded-3xl z-40 flex flex-col overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300">
          <div className="p-5 border-b border-slate-800 bg-sky-500/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="font-bold text-sky-400">HESTIA - Jarvis Mode</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white text-xl">✕</button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl ${
                  m.role === 'user' 
                  ? 'bg-sky-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-800">
            <div className="flex gap-2">
              <input 
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                placeholder="Pregúntale algo a Jarvis..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={isTyping}
                className="bg-sky-600 hover:bg-sky-500 p-2 rounded-xl disabled:opacity-50 transition-colors"
              >
                <span className="block transform rotate-90">▲</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JarvisChat;
