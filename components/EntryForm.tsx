import React, { useState } from 'react';
import { Entry, EntryCategory } from '../types';
import { GeminiService } from '../services/geminiService';
import { StorageService } from '../services/storageService';
import { Shield, Activity, Headphones, Plus, Loader2, Save } from 'lucide-react';

interface EntryFormProps {
  onEntrySaved: () => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({ onEntrySaved }) => {
  const [category, setCategory] = useState<EntryCategory>('boundary');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form States
  const [tiredness, setTiredness] = useState(5);
  const [bodySensation, setBodySensation] = useState('');
  const [thought, setThought] = useState('');
  const [contextReaction, setContextReaction] = useState('');
  const [didActivity, setDidActivity] = useState(true);
  const [transformationNote, setTransformationNote] = useState('');
  const [listened, setListened] = useState(true);
  const [emotion, setEmotion] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const newEntry: Entry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      category,
      customCategoryName: category === 'custom' ? customCategory : undefined,
      
      // Boundary
      tirednessLevel: category === 'boundary' ? tiredness : undefined,
      bodySensation: (category === 'boundary' || category === 'audio') ? bodySensation : undefined,
      thought: (category === 'boundary' || category === 'audio') ? thought : undefined,
      contextReaction: category === 'boundary' ? contextReaction : undefined,

      // Physical
      didActivity: category === 'physical' ? didActivity : undefined,
      transformationNote: category === 'physical' ? transformationNote : undefined,

      // Audio
      listened: category === 'audio' ? listened : undefined,
      emotion: category === 'audio' ? emotion : undefined,
    };

    try {
      // 1. Get AI Analysis
      const aiResponse = await GeminiService.analyzeEntry(newEntry);
      newEntry.aiFeedback = aiResponse;
      setFeedback(aiResponse);

      // 2. Save to Storage
      StorageService.saveEntry(newEntry);
      
      // 3. Clear critical fields
      // setBodySensation(''); setThought(''); 
      
      // 4. Notify Parent
      onEntrySaved();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCategoryButton = (id: EntryCategory, label: string, Icon: React.ElementType) => (
    <button
      type="button"
      onClick={() => { setCategory(id); setFeedback(null); }}
      className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl transition-all border-2 ${
        category === id 
        ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(100,100,100,1)]' 
        : 'bg-white text-black border-black hover:bg-gray-50'
      }`}
    >
      <Icon className="w-6 h-6 mb-2" />
      <span className="text-xs font-bold text-center">{label}</span>
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto pb-20">
      
      {/* Category Selector */}
      <div className="flex gap-3 mb-8">
        {renderCategoryButton('boundary', 'Límites', Shield)}
        {renderCategoryButton('physical', 'Actividad', Activity)}
        {renderCategoryButton('audio', 'Audio', Headphones)}
        {renderCategoryButton('custom', 'Otro', Plus)}
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black space-y-6 text-black">
        <h2 className="text-xl font-bold text-black flex items-center gap-2 border-b-2 border-gray-100 pb-2">
          {category === 'boundary' && 'Registro: "Hasta aquí llegué"'}
          {category === 'physical' && 'Registro: Actividad Cuerpo-Mente'}
          {category === 'audio' && 'Registro: Mensaje del Coach'}
          {category === 'custom' && 'Registro Personalizado'}
        </h2>

        {/* Boundary Fields */}
        {category === 'boundary' && (
          <>
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Nivel de cansancio (1-10) - Para decir basta
              </label>
              <input 
                type="range" min="1" max="10" value={tiredness} 
                onChange={(e) => setTiredness(Number(e.target.value))}
                className="w-full accent-black h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-black font-semibold mt-1">
                <span>Fresco (1)</span>
                <span>Agotado (10)</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-black mb-1">¿Qué sientes en tu cuerpo al decir NO?</label>
              <textarea 
                className="w-full border-2 border-black rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none placeholder-gray-500 bg-white text-black"
                rows={3}
                placeholder="Ej: Tensión en los hombros, alivio en el pecho..."
                value={bodySensation}
                onChange={e => setBodySensation(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">¿Qué piensas en este momento?</label>
              <input 
                className="w-full border-2 border-black rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none placeholder-gray-500 bg-white text-black"
                placeholder="Ej: Que estoy cuidando mi energía..."
                value={thought}
                onChange={e => setThought(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">¿Cómo reaccionó el contexto/personas?</label>
              <textarea 
                className="w-full border-2 border-black rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none placeholder-gray-500 bg-white text-black"
                rows={2}
                placeholder="Ej: Se sorprendieron pero aceptaron..."
                value={contextReaction}
                onChange={e => setContextReaction(e.target.value)}
              />
            </div>
          </>
        )}

        {/* Physical Activity Fields */}
        {category === 'physical' && (
          <>
            <div className="flex items-center gap-4">
              <label className="text-sm font-bold text-black">¿Realizaste la actividad?</label>
              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setDidActivity(true)}
                  className={`px-4 py-2 rounded-lg text-sm border-2 font-bold ${didActivity ? 'bg-black text-white border-black' : 'bg-white text-black border-black'}`}
                >Sí</button>
                <button 
                  type="button" 
                  onClick={() => setDidActivity(false)}
                  className={`px-4 py-2 rounded-lg text-sm border-2 font-bold ${!didActivity ? 'bg-black text-white border-black' : 'bg-white text-black border-black'}`}
                >No</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">Transformación (Sentir / Pensar / Hacer)</label>
              <textarea 
                className="w-full border-2 border-black rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none placeholder-gray-500 bg-white text-black"
                rows={4}
                placeholder="¿Cómo colaboró esta actividad en tu transformación hoy?"
                value={transformationNote}
                onChange={e => setTransformationNote(e.target.value)}
                required
              />
            </div>
          </>
        )}

        {/* Audio Fields */}
        {category === 'audio' && (
          <>
            <div className="flex items-center gap-4">
              <label className="text-sm font-bold text-black">¿Escuchaste el audio?</label>
              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setListened(true)}
                  className={`px-4 py-2 rounded-lg text-sm border-2 font-bold ${listened ? 'bg-black text-white border-black' : 'bg-white text-black border-black'}`}
                >Sí</button>
                <button 
                  type="button" 
                  onClick={() => setListened(false)}
                  className={`px-4 py-2 rounded-lg text-sm border-2 font-bold ${!listened ? 'bg-black text-white border-black' : 'bg-white text-black border-black'}`}
                >No</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">¿Qué emoción te viene al escucharlo?</label>
              <input 
                className="w-full border-2 border-black rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none placeholder-gray-500 bg-white text-black"
                placeholder="Ej: Esperanza, calma, resistencia..."
                value={emotion}
                onChange={e => setEmotion(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">¿Qué pasa en tu cuerpo?</label>
              <input 
                className="w-full border-2 border-black rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none placeholder-gray-500 bg-white text-black"
                placeholder="Ej: Se relaja el estómago..."
                value={bodySensation}
                onChange={e => setBodySensation(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">¿Qué piensas al escucharlo?</label>
              <textarea 
                className="w-full border-2 border-black rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none placeholder-gray-500 bg-white text-black"
                rows={2}
                value={thought}
                onChange={e => setThought(e.target.value)}
              />
            </div>
          </>
        )}

        {/* Custom Fields */}
        {category === 'custom' && (
           <>
            <div>
              <label className="block text-sm font-bold text-black mb-1">Nombre de la Actividad</label>
              <input 
                className="w-full border-2 border-black rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none placeholder-gray-500 bg-white text-black"
                placeholder="Ej: Meditación, Lectura..."
                value={customCategory}
                onChange={e => setCustomCategory(e.target.value)}
                required
              />
            </div>
             <div>
              <label className="block text-sm font-bold text-black mb-1">Notas / Sensaciones</label>
              <textarea 
                className="w-full border-2 border-black rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none placeholder-gray-500 bg-white text-black"
                rows={4}
                value={transformationNote}
                onChange={e => setTransformationNote(e.target.value)}
                required
              />
            </div>
           </>
        )}

        {/* Submit Action */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(100,100,100,1)] transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {isSubmitting ? 'Analizando con IA...' : 'Guardar y Recibir Feedback'}
        </button>
      </form>

      {/* AI Feedback Display */}
      {feedback && (
        <div className="mt-6 bg-white p-6 rounded-2xl border-2 border-indigo-600 shadow-[4px_4px_0px_0px_rgba(79,70,229,1)] animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
             <div className="bg-indigo-600 p-2 rounded-full shadow-sm text-white">
               <span className="text-xl">🤖</span>
             </div>
             <h3 className="font-bold text-indigo-800">Feedback del Coach Gemini</h3>
          </div>
          <p className="text-black leading-relaxed italic font-medium">"{feedback}"</p>
        </div>
      )}
    </div>
  );
};