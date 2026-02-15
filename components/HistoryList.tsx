import React from 'react';
import { Entry } from '../types';
import { Shield, Activity, Headphones, Calendar } from 'lucide-react';

interface HistoryListProps {
  entries: Entry[];
}

export const HistoryList: React.FC<HistoryListProps> = ({ entries }) => {
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-black font-medium">
        No hay registros aún.
      </div>
    );
  }

  const getIcon = (category: string) => {
    switch(category) {
      case 'boundary': return <Shield className="w-5 h-5 text-indigo-700" />;
      case 'physical': return <Activity className="w-5 h-5 text-green-700" />;
      case 'audio': return <Headphones className="w-5 h-5 text-amber-700" />;
      default: return <Calendar className="w-5 h-5 text-black" />;
    }
  };

  const getTitle = (entry: Entry) => {
    if (entry.category === 'boundary') return 'Límite Establecido';
    if (entry.category === 'physical') return 'Actividad Física';
    if (entry.category === 'audio') return 'Audio Coach';
    return entry.customCategoryName || 'Registro Personalizado';
  };

  return (
    <div className="space-y-4 pb-20">
      {sortedEntries.map(entry => (
        <div key={entry.id} className="bg-white p-5 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white border border-black rounded-lg">
                {getIcon(entry.category)}
              </div>
              <div>
                <h4 className="font-bold text-black text-lg">{getTitle(entry)}</h4>
                <p className="text-xs text-black font-medium">
                  {new Date(entry.date).toLocaleDateString('es-ES', { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            {entry.category === 'boundary' && (
              <span className="px-2 py-1 bg-white border border-black text-black text-xs font-bold rounded">
                Cansancio: {entry.tirednessLevel}/10
              </span>
            )}
          </div>

          <div className="pl-12 space-y-2 text-sm text-black">
            {entry.bodySensation && (
              <p><span className="font-bold">Cuerpo:</span> {entry.bodySensation}</p>
            )}
            {entry.thought && (
              <p><span className="font-bold">Pensamiento:</span> {entry.thought}</p>
            )}
            {entry.contextReaction && (
               <p><span className="font-bold">Reacción entorno:</span> {entry.contextReaction}</p>
            )}
            {entry.transformationNote && (
               <p><span className="font-bold">Transformación:</span> {entry.transformationNote}</p>
            )}
            {entry.category === 'audio' && (
               <p><span className="font-bold">Escuchado:</span> {entry.listened ? 'Sí' : 'No'} {entry.emotion && `(${entry.emotion})`}</p>
            )}
          </div>

          {entry.aiFeedback && (
            <div className="mt-4 pl-12">
              <div className="bg-white p-3 rounded-lg border-2 border-indigo-700">
                <p className="text-xs font-black text-indigo-700 mb-1 uppercase tracking-wide">Coach AI Dice:</p>
                <p className="text-sm text-black italic font-medium">"{entry.aiFeedback}"</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};