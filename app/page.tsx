"use client";
import React, { useState, useEffect } from 'react';
import { Trophy, Flame, ShieldCheck, Swords, LogOut, Mail, Lock, Calendar } from 'lucide-react';

export default function RTATennisApp() {
  const adminEmail = "chino@gmail.com";
  
  const [players, setPlayers] = useState([
    { id: 1, email: "rrojas@gmail.com", name: "Rolando Rojas", points: 1000, streak: 0, wins: 0, losses: 0 },
    { id: 2, email: "puma@gmail.com", name: "El Puma", points: 1000, streak: 0, wins: 0, losses: 0 },
    { id: 3, email: "chino@gmail.com", name: "Chino Montero", points: 1000, streak: 0, wins: 0, losses: 0 },
  ]);

  const [activeUser, setActiveUser] = useState(null);
  const [retos, setRetos] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [mounted, setMounted] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedPlayers = localStorage.getItem('rta-v5-players');
    const savedRetos = localStorage.getItem('rta-v5-retos');
    const savedSession = localStorage.getItem('rta-v5-session');
    
    if (savedPlayers) setPlayers(JSON.parse(savedPlayers));
    if (savedRetos) setRetos(JSON.parse(savedRetos));
    if (savedSession) setActiveUser(JSON.parse(savedSession));
    
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('rta-v5-players', JSON.stringify(players));
      localStorage.setItem('rta-v5-retos', JSON.stringify(retos));
      if(activeUser) localStorage.setItem('rta-v5-session', JSON.stringify(activeUser));
    }
  }, [players, retos, activeUser, mounted]);

  const handleLogin = (e) => {
    e.preventDefault();
    const userMatch = players.find(u => u.email === emailInput.toLowerCase() && passInput === "001122");
    if (userMatch) {
      setActiveUser(userMatch);
      setError("");
    } else {
      setError("Credenciales incorrectas.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('rta-v5-session');
    setActiveUser(null);
  };

  const crearReto = (rival) => {
    // Verificar si alguno ya tiene un reto activo
    const yaTieneReto = retos.some(r => 
      r.retadorId === activeUser.id || r.rivalId === activeUser.id || 
      r.retadorId === rival.id || r.rivalId === rival.id
    );

    if (yaTieneReto) return alert("Uno de los jugadores ya tiene un reto pendiente.");

    const nuevoReto = {
      id: Date.now(),
      retadorId: activeUser.id,
      retadorName: activeUser.name,
      rivalId: rival.id,
      rivalName: rival.name,
      fecha: new Date().toLocaleDateString()
    };
    setRetos([...retos, nuevoReto]);
    alert(`Reto creado: ${activeUser.name} vs ${rival.name} 🎾`);
  };

  const resolverReto = (reto, ganadorId) => {
    if (adminPass !== "chino123") return alert("Clave de comisionado incorrecta");
    
    const perdedorId = (ganadorId === reto.retadorId) ? reto.rivalId : reto.retadorId;

    const newPlayers = players.map(p => {
      if (p.id === ganadorId) {
        let pts = p.points + 25;
        let strk = p.streak + 1;
        if (strk === 3) { pts += 50; alert("¡🔥 BONUS DE RACHA +50!"); }
        return { ...p, points: pts, streak: strk, wins: p.wins + 1 };
      }
      if (p.id === perdedorId) return { ...p, streak: 0, losses: p.losses + 1 };
      return p;
    });

    setPlayers(newPlayers.sort((a, b) => b.points - a.points));
    setRetos(retos.filter(r => r.id !== reto.id)); // Eliminar el reto resuelto
    setShowAdmin(false);
  };

  if (!mounted) return null;

  const isAdmin = activeUser && (activeUser.email === adminEmail || activeUser.name === "Chino Montero");

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 font-sans italic tracking-tighter uppercase">
      
      {!activeUser ? (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6">
          <Trophy size={60} className="text-lime-400 mb-4" />
          <h1 className="text-4xl font-black text-center leading-none mb-10 tracking-tighter">RTA TENNIS</h1>
          <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
            <input type="email" placeholder="EMAIL" required className="w-full bg-zinc-900 p-4 rounded-2xl border border-white/5 outline-none focus:border-lime-400 font-bold text-xs" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} />
            <input type="password" placeholder="PASSWORD" required className="w-full bg-zinc-900 p-4 rounded-2xl border border-white/5 outline-none focus:border-lime-400 font-bold text-xs" value={passInput} onChange={(e) => setPassInput(e.target.value)} />
            {error && <p className="text-red-500 text-[10px] font-black text-center">{error}</p>}
            <button type="submit" className="w-full py-5 bg-lime-400 text-black rounded-2xl font-black text-sm tracking-widest uppercase">Entrar</button>
          </form>
        </div>
      ) : (
        <div className="max-w-xl mx-auto pb-20">
          <header className="flex justify-between items-start mb-12">
            <h1 className="text-5xl font-black leading-[0.85] italic">RTA<br/>TENNIS<br/>RANKING</h1>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-white/5">
              <span className="text-[8px] text-zinc-500 font-bold uppercase">{activeUser.name}</span>
              <LogOut size={14} className="text-lime-400" />
            </button>
          </header>

          {/* BANDEJA DE RETOS PARA TODOS LOS USUARIOS */}
          <section className="mb-12">
            <h2 className="text-[10px] font-black tracking-widest text-zinc-500 mb-4 flex items-center gap-2"><Calendar size={14}/> RETOS ACTIVOS</h2>
            {retos.length === 0 ? (
              <p className="text-zinc-700 text-xs font-bold italic">No hay partidos pendientes...</p>
            ) : (
              <div className="space-y-2">
                {retos.map(r => (
                  <div key={r.id} className="bg-lime-400 text-black p-5 rounded-2xl flex justify-between items-center shadow-lg animate-pulse">
                    <p className="text-lg font-black italic">{r.retadorName} <span className="text-xs opacity-50">VS</span> {r.rivalName}</p>
                    <Swords size={20} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* RANKING */}
          <div className="space-y-4 mb-20">
            <h2 className="text-[10px] font-black tracking-widest text-zinc-500 mb-4 flex items-center gap-2"><Trophy size={14}/> CLASIFICACIÓN</h2>
            {players.map((p, i) => {
              const tieneReto = retos.some(r => r.retadorId === p.id || r.rivalId === p.id);
              return (
                <div key={p.id} className={`p-6 rounded-[32px] border-2 transition-all ${p.streak >= 3 ? 'border-orange-500 bg-orange-500/10' : 'border-white/5 bg-zinc-900/50'}`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <span className="text-5xl font-black italic opacity-10">{i+1}</span>
                      <div>
                        <h3 className="text-2xl font-bold leading-none">{p.name} {p.streak >= 3 && '🔥'}</h3>
                        <p className="text-lime-400 font-mono text-xs mt-1">{p.points} PTS</p>
                      </div>
                    </div>
                    {activeUser.id !== p.id && !tieneReto && !retos.some(r => r.retadorId === activeUser.id || r.rivalId === activeUser.id) && (
                      <button onClick={() => crearReto(p)} className="bg-white text-black px-5 py-2 rounded-xl font-black text-[10px] tracking-widest hover:bg-lime-400 transition-all">RETAR</button>
                    )}
                    {tieneReto && (
                      <span className="text-[8px] font-black text-zinc-500 tracking-widest">OCUPADO</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* PANEL COMISIONADO: SOLO MUESTRA RETOS PARA DECIDIR GANADOR */}
          {isAdmin && (
            <section className="bg-zinc-900 border-2 border-lime-400/30 rounded-[40px] p-8">
              <button onClick={() => setShowAdmin(!showAdmin)} className="w-full flex justify-between items-center text-[10px] font-black tracking-widest">
                <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-lime-400"/> RESOLVER PARTIDOS (CHINO)</span>
                {showAdmin ? 'CERRAR' : 'ABRIR'}
              </button>
              
              {showAdmin && (
                <div className="mt-6 pt-6 border-t border-white/5">
                  <input type="password" placeholder="CLAVE CHINO123" className="w-full bg-black p-4 rounded-xl mb-6 border border-zinc-800 text-xs text-center font-bold" onChange={(e) => setAdminPass(e.target.value)} />
                  
                  {retos.length === 0 ? (
                    <p className="text-center text-zinc-500 text-[10px] font-bold tracking-widest">NO HAY RETOS PARA RESOLVER</p>
                  ) : (
                    <div className="space-y-6">
                      {retos.map(r => (
                        <div key={r.id} className="border border-white/5 p-4 rounded-2xl bg-black/40">
                          <p className="text-[10px] text-zinc-500 font-bold mb-3 tracking-[0.2em] text-center uppercase">Elegir Ganador de este Reto</p>
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => resolverReto(r, r.retadorId)} className="py-3 bg-zinc-900 rounded-xl text-[10px] font-black hover:bg-lime-400 hover:text-black transition-all">
                              {r.retadorName}
                            </button>
                            <button onClick={() => resolverReto(r, r.rivalId)} className="py-3 bg-zinc-900 rounded-xl text-[10px] font-black hover:bg-lime-400 hover:text-black transition-all">
                              {r.rivalName}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
