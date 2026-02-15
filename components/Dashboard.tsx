import React, { useMemo } from 'react';
import { Entry } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Activity, ShieldAlert, Headphones, UserCheck } from 'lucide-react';

interface DashboardProps {
  entries: Entry[];
}

const COLORS = ['#000000', '#4f46e5', '#16a34a', '#d97706']; // Black, Indigo, Green, Amber

export const Dashboard: React.FC<DashboardProps> = ({ entries }) => {
  
  const tirednessData = useMemo(() => {
    // Process data for the tiredness chart (last 7 boundary entries)
    // Filter out undefined tiredness, ensure valid date, sort by date ascending
    const data = entries
      .filter(e => e.category === 'boundary' && e.tirednessLevel !== undefined)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7)
      .map(e => ({
        date: new Date(e.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
        cansancio: e.tirednessLevel || 0
      }));
    return data;
  }, [entries]);

  const categoryData = useMemo(() => {
    // Process data for the distribution pie chart
    const counts: Record<string, number> = { 'Límites': 0, 'Físico': 0, 'Audio': 0, 'Otro': 0 };
    
    entries.forEach(e => {
      if (e.category === 'boundary') counts['Límites']++;
      else if (e.category === 'physical') counts['Físico']++;
      else if (e.category === 'audio') counts['Audio']++;
      else counts['Otro']++;
    });

    return Object.entries(counts)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  }, [entries]);

  const stats = useMemo(() => {
    const boundaries = entries.filter(e => e.category === 'boundary').length;
    const audios = entries.filter(e => e.category === 'audio' && e.listened).length;
    const physical = entries.filter(e => e.category === 'physical' && e.didActivity).length;
    return { boundaries, audios, physical };
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border-2 border-black p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="bg-black p-4 rounded-full mb-4">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-black">Aún no hay datos</h3>
        <p className="text-black mt-2 font-medium">Comienza a registrar tus acciones para ver tu evolución aquí.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
          <div className="p-3 bg-black text-white rounded-xl border border-black">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-black font-bold uppercase">Límites ("No")</p>
            <p className="text-3xl font-black text-black">{stats.boundaries}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
          <div className="p-3 bg-white text-black border-2 border-black rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-black font-bold uppercase">Actividad Física</p>
            <p className="text-3xl font-black text-black">{stats.physical}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
          <div className="p-3 bg-white text-black border-2 border-black rounded-xl">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-black font-bold uppercase">Audios Coach</p>
            <p className="text-3xl font-black text-black">{stats.audios}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tiredness Chart */}
        <div className="bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-lg font-bold text-black mb-4">Nivel de Cansancio al poner Límites</h3>
          <div className="h-64 w-full">
            {tirednessData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tirednessData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="date" tick={{fontSize: 12, fill: 'black'}} stroke="#000000" />
                  <YAxis domain={[0, 10]} tick={{fontSize: 12, fill: 'black'}} stroke="#000000" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '2px solid black', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cansancio" 
                    stroke="#4f46e5" 
                    strokeWidth={3} 
                    dot={{ fill: '#4f46e5', strokeWidth: 2, r: 5, stroke: 'black' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-black font-medium text-sm">
                Registra límites para ver la gráfica
              </div>
            )}
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-lg font-bold text-black mb-4">Distribución de Actividades</h3>
          <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="black" strokeWidth={1} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '2px solid black', color: 'black' }} />
                <Legend wrapperStyle={{ color: 'black', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};