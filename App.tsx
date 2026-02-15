import React, { useState, useEffect, useRef } from 'react';
import { Entry, UserProfile, Alarm } from './types';
import { StorageService } from './services/storageService';
import { GeminiService } from './services/geminiService';
import { Dashboard } from './components/Dashboard';
import { EntryForm } from './components/EntryForm';
import { HistoryList } from './components/HistoryList';
import { ActionAlarms } from './components/ActionAlarms';
import { Auth } from './components/Auth';
import { LayoutDashboard, PlusCircle, History, Settings, Sparkles, LogOut, BellRing, X } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'new' | 'history' | 'alarms'>('dashboard');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [weeklyInsight, setWeeklyInsight] = useState<string>('');
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Alarm State
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);
  const lastCheckedMinute = useRef<string>('');

  const loadData = () => {
    const loadedEntries = StorageService.getEntries();
    setEntries(loadedEntries);
    const loadedProfile = StorageService.getProfile();
    if (loadedProfile && loadedProfile.name && loadedProfile.name !== 'Usuario') {
      setUser(loadedProfile);
    }
    return loadedEntries;
  };

  useEffect(() => {
    const data = loadData();
    if (data.length > 0) {
      GeminiService.generateWeeklyInsight(data).then(setWeeklyInsight);
    }
  }, []);

  // Alarm Checker Interval
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const timeString = `${currentHours}:${currentMinutes}`;
      
      // Prevent double trigger within the same minute
      if (lastCheckedMinute.current === timeString) return;
      lastCheckedMinute.current = timeString;

      const alarms = StorageService.getAlarms();
      const matchingAlarm = alarms.find(a => a.active && a.time === timeString);

      if (matchingAlarm) {
        triggerAlarm(matchingAlarm);
      }
    };

    const intervalId = setInterval(checkAlarms, 2000); // Check every 2 seconds
    return () => clearInterval(intervalId);
  }, []);

  const triggerAlarm = (alarm: Alarm) => {
    setActiveAlarm(alarm);
    
    // 1. Play System Sound (Beep simulation using AudioContext or simple beep)
    // Using a data URI for a simple beep to avoid external assets
    const beep = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"); // Placeholder valid wave header, triggers browser audio engine
    // A more effective beep using Speech Synthesis which is more reliable on modern browsers
    
    // 2. Text to Speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`Atención. Recordatorio del Coach: ${alarm.label}`);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleEntrySaved = () => {
    loadData();
  };

  const handleLoginSuccess = () => {
    loadData();
  };

  const handleLogout = () => {
    localStorage.removeItem('tc_profile');
    setUser(null);
  };

  // If no user is logged in, show Auth screen
  if (!user) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans relative">
      
      {/* Alarm Modal Overlay */}
      {activeAlarm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 animate-fade-in">
           <div className="bg-white border-4 border-black rounded-2xl p-8 max-w-sm w-full shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col items-center text-center">
              <div className="bg-black text-white p-4 rounded-full mb-4 animate-bounce">
                <BellRing className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-black text-black mb-2 uppercase">¡Alarma!</h2>
              <p className="text-xl font-bold text-indigo-700 mb-6">{activeAlarm.label}</p>
              
              <div className="w-full space-y-3">
                <button 
                  onClick={() => {
                    setActiveAlarm(null);
                    window.speechSynthesis.cancel();
                  }}
                  className="w-full bg-black text-white font-bold py-4 rounded-xl text-lg hover:bg-gray-800 transition-colors"
                >
                  Entendido, lo haré
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b-2 border-black sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-black">
              Transformación Consciente
            </h1>
            <span className="text-xs text-black font-semibold">Hola, {user.name}</span>
          </div>
          <button onClick={handleLogout} className="text-black p-2 hover:bg-gray-100 rounded-full" title="Cerrar Sesión">
             <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Weekly Insight Banner */}
      {view === 'dashboard' && weeklyInsight && (
        <div className="max-w-3xl mx-auto px-4 mt-6">
          <div className="bg-white border-2 border-black text-black p-5 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 font-black text-indigo-700 text-sm uppercase tracking-wider">
                  <Sparkles className="w-5 h-5" /> Insight Semanal
                </div>
                <p className="text-base leading-relaxed font-medium">
                  {weeklyInsight}
                </p>
             </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 mb-24">
        {view === 'dashboard' && <Dashboard entries={entries} />}
        {view === 'new' && <EntryForm onEntrySaved={handleEntrySaved} />}
        {view === 'history' && <HistoryList entries={entries} />}
        {view === 'alarms' && <ActionAlarms />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black safe-area-bottom pb-safe z-20">
        <div className="max-w-3xl mx-auto flex justify-around items-center">
          <button 
            onClick={() => setView('dashboard')}
            className={`p-4 flex flex-col items-center gap-1 ${view === 'dashboard' ? 'text-indigo-700 font-bold' : 'text-gray-900'}`}
          >
            <LayoutDashboard className={`w-6 h-6 ${view === 'dashboard' ? 'stroke-2' : 'stroke-1'}`} />
            <span className="text-[10px] font-bold uppercase">Inicio</span>
          </button>
          
          <button 
            onClick={() => setView('new')}
            className={`p-4 flex flex-col items-center gap-1 ${view === 'new' ? 'text-indigo-700 font-bold' : 'text-gray-900'}`}
          >
            <PlusCircle className={`w-6 h-6 ${view === 'new' ? 'stroke-2' : 'stroke-1'}`} />
            <span className="text-[10px] font-bold uppercase">Registrar</span>
          </button>

          <button 
            onClick={() => setView('history')}
            className={`p-4 flex flex-col items-center gap-1 ${view === 'history' ? 'text-indigo-700 font-bold' : 'text-gray-900'}`}
          >
            <History className={`w-6 h-6 ${view === 'history' ? 'stroke-2' : 'stroke-1'}`} />
            <span className="text-[10px] font-bold uppercase">Historial</span>
          </button>

          <button 
            onClick={() => setView('alarms')}
            className={`p-4 flex flex-col items-center gap-1 ${view === 'alarms' ? 'text-indigo-700 font-bold' : 'text-gray-900'}`}
          >
            <Settings className={`w-6 h-6 ${view === 'alarms' ? 'stroke-2' : 'stroke-1'}`} />
            <span className="text-[10px] font-bold uppercase">Alarmas</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;