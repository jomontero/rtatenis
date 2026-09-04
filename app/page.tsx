"use client";
import React, { useState, useEffect } from 'react';
import { Trophy, Flame, ShieldCheck, Swords, LogOut, Mail, Lock } from 'lucide-react';

export default function RTATennisApp() {
  // Configuración de usuarios permitidos (Mock de DB)
  const usersDB = [
    { id: 1, email: "rrojas@gmail.com", name: "Rolando Rojas", points: 1000, streak: 0, wins: 0, losses: 0 },
    { id: 2, email: "puma@gmail.com", name: "El Puma", points: 1000, streak: 0, wins: 0, losses: 0 },
    { id: 3, email: "chino@gmail.com", name: "Chino Montero", points: 1000, streak: 0, wins: 0, losses: 0 },
  ];

  const [players, setPlayers] = useState(usersDB);
  const [activeUser, setActiveUser] = useState(null);
  const [retos, setRetos] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [mounted, setMounted] = useState(false);

  // Estados del Formulario de Login
  const [emailInput, setEmailInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedPlayers = localStorage.getItem('rta-players');
    const savedRetos = localStorage.getItem('rta-retos');
    const savedSession = localStorage.getItem('rta-session');
    
    if (savedPlayers) setPlayers(JSON.parse(savedPlayers));
    if (savedRetos) setRetos(JSON.parse(savedRetos));
    if (savedSession) setActiveUser(JSON.parse(savedSession));
    
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('rta-players', JSON.stringify(players));
      localStorage.setItem('rta-retos', JSON.stringify(retos));
      if(activeUser) localStorage.setItem('rta-session', JSON.stringify(activeUser));
    }
  }, [players, retos, activeUser, mounted]);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = usersDB.find(u => u.email === emailInput.toLowerCase() && passInput === "001122");
    
    if (user) {
      // Buscamos los datos actuales del jugador en el estado (por si han cambiado los puntos)
      const currentPlayerStats = players.find(p => p.id === user.id);
      setActiveUser(currentPlayerStats);
      setError("");
    } else {
      setError("Credenciales incorrectas. Intenta de nuevo.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('rta-session');
    setActiveUser(null);
    setEmailInput("");
    setPassInput("");
  };

  const crearReto = (rivalName) => {
    const nuevoReto = {
      id: Date.now(),
      retador: activeUser.name,
      rival: rivalName,
      fecha: new Date().toLocaleDateString(),
    };
    setRetos([...retos, nuevoReto]);
    alert(`¡Reto enviado a ${rivalName}! 🎾`);
  };

  const registrarResultado = (ganadorId, perdedorId) => {
    if (adminPass !== "chino123") return alert("Contraseña de comisionado incorrecta");
    
    const newPlayers = players.map(p => {
      if (p.id === ganadorId) {
        let pts = p.points + 25;
        let strk = p.streak + 1;
        if (strk === 3) { pts += 50; alert("¡BONUS +50 POR RACHA!"); }
        return { ...p, points: pts, streak: strk, wins: p.wins + 1 };
      }
      if (p.id === perdedorId) return { ...p, streak: 0, losses: p.losses + 1 };
      return p;
    });

    const sortedPlayers = newPlayers.sort((a, b) => b.points - a.points);
    setPlayers(sortedPlayers);
    setRetos([]); 
    alert("Ranking actualizado oficialmente");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 font-sans italic tracking-tighter uppercase">
      
      {!activeUser ? (
        /* PANTALLA DE LOGIN */
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-sm">
            <div className="flex justify-center mb-8">
              <Trophy size={60} className="text-lime-400 animate-pulse" />
            </div>
            <h1 className="text-4xl font-black mb-2 text-center leading-none">RTA TENNIS</h1>
            <p className="text-zinc-500 mb-10 text-[10px] font-bold tracking-[0.3em] text-center">OFFICIAL RANKING SYSTEM</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-zinc-500" size={18} />
                <input 
                  type="email" 
                  placeholder="CORREO ELECTRÓNICO" 
                  required
                  className="w-full bg-zinc-900 p-4 pl-12 rounded-2xl border border-white/5 outline-none focus:border-lime-400 transition-all font-bold text-xs"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-zinc-500" size={18} />
                <input 
                  type="password" 
                  placeholder="CONTRASEÑA" 
                  required
                  className="w-full bg-zinc-900 p-4 pl-12 rounded-2xl border border-white/5 outline-none focus:border-lime-400 transition-all font-bold text-xs"
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500 text-[10px] font-black text-center animate-bounce">{error}</p>}
              <button type="submit" className="w-full py-5 bg-lime-400 text-black rounded-2xl font-black text-sm tracking-widest hover:bg-white transition-all">
                ENTRAR AL RANKING
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* CONTENIDO PRINCIPAL */
        <div className="max-w-xl mx-auto">
          <header className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-5xl font-black leading-[0.85] tracking-tighter italic">
                RTA<br/>TENNIS<br/>RANKING
              </h1>
            </div>
            <div className="flex flex-col items-end">
              <button onClick={handleLogout} className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-white/5 hover:bg-red-500/20 transition-all group">
                <span className="text-[8px] text-zinc-500 font-bold group-hover:text-white uppercase">{activeUser.name}</span>
                <LogOut size={14} className="text-lime-400 group-hover:text-white" />
              </button>
            </div>
          </header>

          {/* RETOS ACTIVOS */}
          {retos.length > 0 && (
            <div className="mb-10 bg-lime-400 text-black p-6 rounded-[32px] shadow-[0_0_40px_rgba(163,230,53,0.3)]">
              <h2 className="text-[10px] font-black mb-2 flex items-center gap-2 uppercase tracking-widest italic">🔥 Reto en Curso</h2>
              {retos.map(r => (
                <p key={r.id} className="text-2xl font-black italic leading-none">{r.retador} <span className="text-sm opacity-60">VS</span> {r.rival}</p>
              ))}
            </div>
          )}

          {/* RANKING */}
          <div className="space-y-4 mb-20">
            {players.map((p, i) => (
              <div key={p.id} className={`p-6 rounded-[32px] border-2 transition-all duration-500 ${p.streak >= 3 ? 'border-orange-500 bg-orange-500/10 shadow-[0_0_20px_rgba(249,115,22,0.1)]' : 'border-white/5 bg-zinc-900/50'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl font-black italic opacity-10">{i+1}</span>
                    <div>
                      <h3 className="text-2xl font-bold leading-none">{p.name} {p.streak >= 3 && '🔥'}</h3>
                      <p className="text-lime-400 font-mono text-xs mt-1 tracking-widest">{p.points} PTS</p>
                    </div>
                  </div>
                  {activeUser.id !== p.id && (
                    <button onClick={() => crearReto(p.name)} className="bg-white text-black px-5 py-2 rounded-xl font-black text-[10px] hover:bg-lime-400 transition-all flex items-center gap-2 tracking-widest">
                      <Swords size={14} /> RETAR
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* PANEL ADMIN (CHINO) */}
          {activeUser.email === "chino@gmail.com" && (
            <section className="bg-zinc-900 border border-white/10 rounded-[40px] p-8 mb-10 shadow-2xl">
              <button onClick={() => setShowAdmin(!showAdmin)} className="w-full flex justify-between items-center text-[10px] font-black tracking-[0.2em]">
                <span className="flex items-center gap-2"><ShieldCheck size={16}/> MODO COMISIONADO</span>
                {showAdmin ? 'CERRAR' : 'ABRIR'}
              </button>
              
              {showAdmin && (
                <div className="mt-6 pt-6 border-t border-white/5">
                  <input 
                    type="password" 
                    placeholder="PASSWORD DE RESULTADOS" 
                    className="w-full bg-black p-4 rounded-xl mb-4 border border-zinc-800 outline-none focus:border-lime-400 text-xs text-center font-bold"
                    onChange={(e) => setAdminPass(e.target.value)}
                  />
                  <div className="grid gap-2 text-center">
                    <p className="text-[10px] text-zinc-500 mb-2 font-bold tracking-widest uppercase">Elegir Ganador del Partido</p>
                    {players.map(p => (
                      <button key={p.id} onClick={() => {
                        const rival = players.find(r => r.id !== p.id);
                        registrarResultado(p.id, rival.id);
                      }} className="py-4 border border-white/10 rounded-2xl text-xs font-black hover:bg-white hover:text-black transition-all tracking-widest uppercase">
                        GANÓ {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      )}
      <footer className="text-center py-10 opacity-20 text-[8px] font-bold tracking-[0.5em]">
        RTA TENNIS PRO v3.0 • ADMIN BY CHINO
      </footer>
    </div>
  );
}
