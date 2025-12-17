
import React, { useState } from 'react';
import { Task } from '../types';

interface CalendarViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const days = daysInMonth(currentMonth, currentYear);
  const startDay = startDayOfMonth(currentMonth, currentYear);

  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

  const getTasksForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(t => t.dueDate === dateStr);
  };

  const renderCalendar = () => {
    const cells = [];
    // Padding for previous month
    for (let i = 0; i < startDay; i++) {
      cells.push(<div key={`pad-${i}`} className="h-32 border border-slate-800/30 opacity-20"></div>);
    }
    // Days of the month
    for (let day = 1; day <= days; day++) {
      const dayTasks = getTasksForDay(day);
      const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString();
      
      cells.push(
        <div key={day} className={`h-32 border border-slate-800 p-2 flex flex-col gap-1 overflow-hidden transition-colors hover:bg-slate-800/40 ${isToday ? 'bg-sky-500/5' : ''}`}>
          <span className={`text-xs font-bold ${isToday ? 'text-sky-400 bg-sky-500/20 w-6 h-6 rounded-full flex items-center justify-center' : 'text-slate-500'}`}>{day}</span>
          <div className="flex-1 overflow-y-auto space-y-1">
            {dayTasks.map(t => (
              <div key={t.id} className={`text-[9px] p-1 rounded border-l-2 truncate ${
                t.completed ? 'bg-slate-800 text-slate-500 border-slate-600' :
                t.priority === 'Alta' ? 'bg-rose-500/10 text-rose-400 border-rose-500' :
                'bg-sky-500/10 text-sky-400 border-sky-500'
              }`}>
                {t.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="glass rounded-2xl overflow-hidden flex flex-col h-full max-h-[85vh]">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <div>
          <h2 className="text-2xl font-bold text-white">{monthNames[currentMonth]} {currentYear}</h2>
          <p className="text-slate-500 text-xs">Visualización de agenda inteligente</p>
        </div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors">◀</button>
          <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors text-xs font-bold">Hoy</button>
          <button onClick={nextMonth} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors">▶</button>
        </div>
      </div>

      <div className="calendar-grid bg-slate-900/20 flex-1">
        {dayNames.map(d => (
          <div key={d} className="p-4 text-center border-b border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-widest">{d}</div>
        ))}
        {renderCalendar()}
      </div>
    </div>
  );
};

export default CalendarView;
