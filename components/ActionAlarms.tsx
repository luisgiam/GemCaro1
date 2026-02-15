import React, { useState, useEffect } from 'react';
import { Alarm } from '../types';
import { StorageService } from '../services/storageService';
import { Bell, Plus, Trash2, Clock } from 'lucide-react';

export const ActionAlarms: React.FC = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  
  // Custom Time Picker State
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState('AM'); // AM or PM
  const [newLabel, setNewLabel] = useState('');

  useEffect(() => {
    setAlarms(StorageService.getAlarms());
  }, []);

  const addAlarm = () => {
    if (!newLabel) return;

    // Convert 12h format to 24h format for storage/logic
    let hourInt = parseInt(hour, 10);
    if (period === 'PM' && hourInt < 12) hourInt += 12;
    if (period === 'AM' && hourInt === 12) hourInt = 0;
    
    const timeString = `${hourInt.toString().padStart(2, '0')}:${minute}`;

    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time: timeString, // Stored as HH:MM 24h
      label: newLabel,
      active: true,
      days: [0, 1, 2, 3, 4, 5, 6]
    };
    
    const updated = [...alarms, newAlarm];
    setAlarms(updated);
    StorageService.saveAlarms(updated);
    
    // Reset form
    setNewLabel('');
    setHour('12');
    setMinute('00');
    setPeriod('AM');
  };

  const removeAlarm = (id: string) => {
    const updated = alarms.filter(a => a.id !== id);
    setAlarms(updated);
    StorageService.saveAlarms(updated);
  };

  const toggleAlarm = (id: string) => {
    const updated = alarms.map(a => a.id === id ? { ...a, active: !a.active } : a);
    setAlarms(updated);
    StorageService.saveAlarms(updated);
  };

  // Format 24h time to 12h for display
  const formatTimeDisplay = (time24: string) => {
    const [h, m] = time24.split(':');
    let hourInt = parseInt(h, 10);
    const suffix = hourInt >= 12 ? 'PM' : 'AM';
    if (hourInt > 12) hourInt -= 12;
    if (hourInt === 0) hourInt = 12;
    return `${hourInt}:${m} ${suffix}`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-6 h-6 text-black" />
        <h2 className="text-xl font-bold text-black">Recordatorios del Coach</h2>
      </div>

      <div className="space-y-4 mb-6">
        {alarms.length === 0 && (
          <p className="text-black font-medium text-sm italic">No hay alarmas programadas.</p>
        )}
        {alarms.map(alarm => (
          <div key={alarm.id} className="flex items-center justify-between p-3 bg-white border border-black rounded-lg">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => toggleAlarm(alarm.id)}
                className={`w-10 h-6 rounded-full relative transition-colors border border-black ${alarm.active ? 'bg-black' : 'bg-white'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform border border-black ${alarm.active ? 'bg-white left-5' : 'bg-black left-0.5'}`} />
              </button>
              <div>
                <p className="font-bold text-black text-lg">{formatTimeDisplay(alarm.time)}</p>
                <p className="text-sm text-black font-medium">{alarm.label}</p>
              </div>
            </div>
            <button onClick={() => removeAlarm(alarm.id)} className="text-black hover:text-red-600 transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 pt-4 border-t-2 border-black">
        <label className="text-sm font-bold text-black uppercase flex items-center gap-2">
          <Bell className="w-4 h-4" /> Nueva Alarma
        </label>
        
        <div className="bg-gray-50 p-4 rounded-xl border border-black">
          {/* Custom Time Selector */}
          <div className="flex items-end gap-2 mb-4 justify-center">
            <div className="flex flex-col gap-1 w-1/3">
              <label className="text-xs font-bold text-center">Hora</label>
              <select 
                value={hour} 
                onChange={(e) => setHour(e.target.value)}
                className="border-2 border-black rounded-lg p-2 text-lg font-bold bg-white text-center appearance-none"
              >
                {Array.from({length: 12}, (_, i) => i + 1).map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
            <span className="text-2xl font-bold pb-2">:</span>
            <div className="flex flex-col gap-1 w-1/3">
              <label className="text-xs font-bold text-center">Minutos</label>
              <select 
                value={minute} 
                onChange={(e) => setMinute(e.target.value)}
                className="border-2 border-black rounded-lg p-2 text-lg font-bold bg-white text-center appearance-none"
              >
                {Array.from({length: 60}, (_, i) => i).map(m => (
                  <option key={m} value={m.toString().padStart(2, '0')}>
                    {m.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1 w-1/3">
              <label className="text-xs font-bold text-center">AM/PM</label>
              <select 
                value={period} 
                onChange={(e) => setPeriod(e.target.value)}
                className="border-2 border-black rounded-lg p-2 text-lg font-bold bg-white text-center appearance-none"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <input 
            type="text" 
            placeholder="¿Qué debes hacer? (ej. Escuchar audio)" 
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="w-full border-2 border-black rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-black outline-none bg-white text-black placeholder-gray-500 font-bold mb-3"
          />
          
          <button 
            onClick={addAlarm}
            className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white py-3 rounded-lg text-sm font-bold transition-colors shadow-[2px_2px_0px_0px_rgba(100,100,100,1)]"
          >
            <Plus className="w-5 h-5" /> Guardar Recordatorio
          </button>
        </div>
      </div>
    </div>
  );
};