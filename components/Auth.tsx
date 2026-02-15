focus:outline-none focus:ring-4 focus:ring-black/10 transition-shadow"
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