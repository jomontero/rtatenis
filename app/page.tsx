"use client";
import React, { useState, useEffect } from 'react';
import { Trophy, Flame, ShieldCheck, Swords, LogOut, Calendar, Activity, History } from 'lucide-react';

export default function RTATennisApp() {
  const adminEmail = "chino@gmail.com";
  
  const [players, setPlayers] = useState([
    { id: 1, email: "rrojas@gmail.com", name: "Rolando Rojas", points: 1000, streak: 0, wins: 0, losses: 0 },
    { id: 2, email: "puma@gmail.com", name: "El Puma", points: 1000, streak: 0, wins: 0, losses: 0 },
    { id: 3, email: "chino@gmail.com", name: "Chino Montero", points: 1000, streak: 0, wins: 0, losses: 0 },
  ]);

  const [activeUser, setActiveUser] = useState(null);
  const [retos, setRetos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [marcador, setMarcador] = useState({ s1: "", s2: "", s3: "" });
  const [mounted, setMounted] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedPlayers = localStorage.getItem('rta-v7-players');
    const savedRetos = localStorage.getItem('rta-v7-retos');
    const savedHistorial = localStorage.getItem('rta-v7-historial');
    const savedSession = localStorage.getItem('rta-v7-session');
    
    if (savedPlayers) setPlayers(JSON.parse(savedPlayers));
    if (savedRetos) setRetos(JSON.parse(savedRetos));
    if (savedHistorial) setHistorial(JSON.parse(savedHistorial));
    if (savedSession) setActiveUser(JSON.parse(savedSession));
    
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('rta-v7-players', JSON.stringify(players));
      localStorage.setItem('rta-v7-retos', JSON.stringify(retos));
      localStorage.setItem('rta-v7-historial', JSON.stringify(historial));
      if(activeUser) localStorage.setItem('rta-v7-session', JSON.stringify(activeUser));
    }
  }, [players, retos, historial, activeUser, mounted]);

  const handleLogin = (e) => {
    e.preventDefault();
    const userMatch = players.find(u => u.email === emailInput.toLowerCase() && passInput === "001122");
    if (userMatch) { setActiveUser(userMatch); setError(""); } 
    else { setError("Credenciales incorrectas."); }
  };

  const handleLogout = () => {
    localStorage.removeItem('rta-v7-session');
    setActiveUser(null);
  };

  const crearReto = (rival) => {
    const yaTieneReto = retos.some(r => r.retadorId === activeUser.id || r.rivalId === activeUser.id || r.retadorId === rival.id || r.rivalId === rival.id);
    if (yaTieneReto) return alert("Uno de los jugadores ya está ocupado.");

    const nuevoReto = {
      id: Date.now(),
      retadorId: activeUser.id,
      retadorName: activeUser.name.split(' ')[0],
      rivalId: rival.id,
      rivalName: rival.name.split(' ')[0],
    };
    setRetos([...retos, nuevoReto]);
  };

  const resolverReto = (reto, ganadorId) => {
    if (adminPass !== "chino123") return alert("Clave incorrecta");
    if (!marcador.s1 || !marcador.s2) return alert("Ingresa al menos los 2 primeros sets");

    const perdedorId = (ganadorId === reto.retadorId) ? reto.rivalId : reto.retadorId;
    const gNombre = (ganadorId === reto.retadorId) ? reto.retadorName : reto.rivalName;
    const pNombre = (ganadorId === reto.retadorId) ? reto.rivalName : reto.retadorName;

    // Formatear marcador final
    const marcadorFinal = `${marcador.s1} / ${marcador.s2} ${marcador.s3 ? '/ ' + marcador.s3 : ''}`;

    const newPlayers = players.map(p => {
      if (p.id === ganadorId) {
        let pts = p.points + 25;
        let strk = p.streak + 1;
        if (strk === 3) pts += 50;
        return { ...p, points: pts, streak: strk, wins: p.wins + 1 };
      }
      if (p.id === perdedorId) return { ...p, streak: 0, losses: p.losses + 1 };
      return p;
    });

    setPlayers(newPlayers.sort((a, b) => b.points - a.points));
    setHistorial([{ id: Date.now(), ganador: gNombre, perdedor: pNombre, score: marcadorFinal }, ...historial].slice(0, 5));
    setRetos(retos.filter(r => r.id !== reto.id));
    setMarcador({ s1: "", s2: "", s3: "" });
    setShowAdmin(false);
  };

  if (!mounted) return null;
  const isAdmin = activeUser && (activeUser.email === adminEmail || activeUser.name === "Chino Montero");

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 font-sans italic tracking-tighter uppercase">
      {!activeUser ? (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6 text-center">
          <Trophy size={60} className="text-lime-400 mb-4" />
          <h1 className="text-4xl font-black leading-none mb-10 tracking-tighter">RTA TENNIS</h1>
          <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
            <input type="email" placeholder="EMAIL" required className="w-full bg-zinc-900 p-4 rounded-2xl border border-white/5 outline-none focus:border-lime-400 font-bold text-xs" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} />
            <input type="password" placeholder="PASSWORD" required className="w-full bg-zinc-900 p-4 rounded-2xl border border-white/5 outline-none focus:border-lime-400 font-bold text-xs" value={passInput} onChange={(e) => setPassInput(e.target.value)} />
            <button type="submit" className="w-full py-5 bg-lime-400 text-black rounded-2xl font-black text-sm tracking-widest">ENTRAR</button>
          </form>
        </div>
      ) : (
        <div className="max-w-xl mx-auto pb-20">
          
          <header className="flex justify-between items-start mb-16">
            <h1 className="text-5xl font-black leading-[0.85] italic tracking-tighter">RTA<br/>TENNIS<br/>RANKING</h1>
            <div className="flex flex-col items-end gap-3">
              <button onClick={handleLogout} className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-white/5">
                <span className="text-[7px] text-zinc-500 font-black">{activeUser.name}</span>
                <LogOut size={12} className="text-lime-400" />
              </button>
              <div className="flex flex-col gap-1.5 items-end">
                {retos.map(r => (
                  <div key={r.id} className="bg-lime-400 text-black px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg animate-pulse">
                    <Activity size={10} />
                    <p className="text-[9px] font-black italic">{r.retadorName} VS {r.rivalName}</p>
                  </div>
                ))}
              </div>
            </div>
          </header>

          {/* RANKING */}
          <div className="space-y-4 mb-16">
            <h2 className="text-[10px] font-black tracking-[0.3em] text-zinc-600 mb-4 uppercase">Clasificación Pro</h2>
            {players.map((p, i) => {
              const tieneReto = retos.some(r => r.retadorId === p.id || r.rivalId === p.id);
              return (
                <div key={p.id} className={`p-6 rounded-[32px] border-2 transition-all duration-500 ${p.streak >= 3 ? 'border-orange-500 bg-orange-500/10' : 'border-white/5 bg-zinc-900/50'}`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <span className="text-5xl font-black italic opacity-10">{i+1}</span>
                      <div>
                        <h3 className="text-2xl font-bold leading-none">{p.name} {p.streak >= 3 && '🔥'}</h3>
                        <p className="text-lime-400 font-mono text-[10px] mt-1.5">{p.points} PTS | W:{p.wins} L:{p.losses}</p>
                      </div>
                    </div>
                    {activeUser.id !== p.id && !tieneReto && !retos.some(r => r.retadorId === activeUser.id || r.rivalId === activeUser.id) && (
                      <button onClick={() => crearReto(p)} className="bg-white text-black px-4 py-2 rounded-xl font-black text-[9px] hover:bg-lime-400 transition-all">RETAR</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* HISTORIAL */}
          {historial.length > 0 && (
            <section className="mb-16">
              <h2 className="text-[10px] font-black tracking-[0.3em] text-zinc-600 mb-6 flex items-center gap-2"><History size={14}/> Resultados Recientes</h2>
              <div className="space-y-3">
                {historial.map(h => (
                  <div key={h.id} className="bg-zinc-900/30 border border-white/5 p-4 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-xs font-black italic text-white uppercase"><span className="text-lime-400">WIN:</span> {h.ganador}</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase">vs {h.perdedor}</p>
                    </div>
                    <p className="text-xs font-mono font-black text-lime-400">{h.score}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* PANEL COMISIONADO */}
          {isAdmin && (
            <section className="bg-zinc-900 border-2 border-lime-400/30 rounded-[40px] p-8 shadow-2xl">
              <button onClick={() => setShowAdmin(!showAdmin)} className="w-full flex justify-between items-center text-[9px] font-black tracking-[0.2em] uppercase">
                <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-lime-400"/> Registrar Marcador</span>
                {showAdmin ? 'CERRAR' : 'ABRIR'}
              </button>
              
              {showAdmin && (
                <div className="mt-6 pt-6 border-t border-white/5 space-y-6">
                  <input type="password" placeholder="CLAVE CHINO123" className="w-full bg-black p-4 rounded-xl border border-zinc-800 text-xs text-center font-bold tracking-widest" onChange={(e) => setAdminPass(e.target.value)} />
                  
                  {retos.map(r => (
                    <div key={r.id} className="border border-white/5 p-5 rounded-3xl bg-black/40 space-y-4">
                      <p className="text-[9px] text-center font-black text-zinc-500 tracking-widest">{r.retadorName} VS {r.rivalName}</p>
                      <div className="grid grid-cols-3 gap-2">
                        <input type="text" placeholder="SET 1" className="bg-zinc-900 text-center p-3 rounded-xl text-xs font-bold border border-white/5" value={marcador.s1} onChange={e => setMarcador({...marcador, s1: e.target.value})} />
                        <input type="text" placeholder="SET 2" className="bg-zinc-900 text-center p-3 rounded-xl text-xs font-bold border border-white/5" value={marcador.s2} onChange={e => setMarcador({...marcador, s2: e.target.value})} />
                        <input type="text" placeholder="TB 3" className="bg-zinc-900 text-center p-3 rounded-xl text-xs font-bold border border-orange-500/30" value={marcador.s3} onChange={e => setMarcador({...marcador, s3: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <button onClick={() => resolverReto(r, r.retadorId)} className="py-4 bg-zinc-800 rounded-xl text-[9px] font-black hover:bg-lime-400 hover:text-black transition-all italic">GANÓ {r.retadorName}</button>
                        <button onClick={() => resolverReto(r, r.rivalId)} className="py-4 bg-zinc-800 rounded-xl text-[9px] font-black hover:bg-lime-400 hover:text-black transition-all italic">GANÓ {r.rivalName}</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
