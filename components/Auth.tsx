import React, { useState } from 'react';
import { StorageService } from '../services/storageService';
import { User, Mail, ArrowRight, Check, ShieldCheck, Loader2 } from 'lucide-react';

interface AuthProps {
  onLoginSuccess: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<'method' | 'profile'>('method');
  const [method, setMethod] = useState<'google' | 'email' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleGoogleSimulate = () => {
    setIsLoading(true);
    // Simulating a Google OAuth delay
    setTimeout(() => {
      setMethod('google');
      setEmail('usuario.ejemplo@gmail.com'); // Simulate fetching email
      setName(''); // IMPORTANT: Force empty name so user must type it
      setIsLoading(false);
      setStep('profile'); 
    }, 1500);
  };

  const handleEmailSelect = () => {
    setMethod('email');
    setName('');
    setEmail('');
    setStep('profile');
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    StorageService.saveProfile({
      name: name.trim(),
      email: email,
      customActions: []
    });
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">
            Transformación<br/>Consciente
          </h1>
          <p className="text-gray-600 font-medium">Tu espacio de registro y evolución.</p>
        </div>

        <div className="bg-white border-2 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          
          {/* STEP 1: Choose Method */}
          {step === 'method' && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-bold text-black mb-6 text-center">Identifícate para comenzar</h2>
              
              <button
                onClick={handleGoogleSimulate}
                disabled={isLoading}
                className="w-full bg-white text-black border-2 border-black p-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  // Google G Icon Simulation
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                {isLoading ? 'Conectando...' : 'Ingresar con Google'}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-xs text-gray-500 font-medium">O</span>
                </div>
              </div>

              <button
                onClick={handleEmailSelect}
                className="w-full bg-black text-white border-2 border-black p-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-[2px_2px_0px_0px_rgba(100,100,100,1)] active:translate-y-[2px] active:shadow-none"
              >
                <Mail className="w-5 h-5" />
                Ingresar con Correo
              </button>
            </div>
          )}

          {/* STEP 2: Profile Details */}
          {step === 'profile' && (
            <form onSubmit={handleFinish} className="space-y-6 animate-fade-in">
              <div className="text-center">
                {method === 'google' ? (
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-xs font-bold border border-green-600 mb-2">
                    <ShieldCheck className="w-4 h-4" /> Cuenta Google Vinculada
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-xs font-bold border border-gray-300 mb-2">
                    <Mail className="w-4 h-4" /> Registro con Correo
                  </div>
                )}
                <h2 className="text-xl font-bold text-black mt-2">Configura tu Perfil</h2>
                <p className="text-sm text-gray-600 mt-1">Para que el Coach se dirija a ti correctamente.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-1">¿Cómo quieres que te llame?</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Escribe tu nombre aquí..."
                      className="w-full border-2 border-black rounded-xl py-3 pl-10 pr-3 text-sm focus:outline-none focus:ring-4 focus:ring-black/10 transition-shadow"
                      required
                    />
                  </div>
                </div>

                {method === 'email' && (
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">Tu correo electrónico</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="w-full border-2 border-black rounded-xl py-3 pl-10 pr-3 text-sm focus:outline-none focus:ring-4 focus:ring-black/10 transition-shadow"
                        required
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!name.trim() || (method === 'email' && !email.trim())}
                  className="w-full bg-black text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-[4px_4px_0px_0px_rgba(100,100,100,1)] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                >
                  <Check className="w-5 h-5" />
                  Terminar y Entrar
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </form>
          )}

        </div>
        
        <p className="text-center text-xs text-gray-400 mt-6 font-medium">
          Tus datos se guardan de forma segura en tu propio navegador.
        </p>
      </div>
    </div>
  );
};