"use client";
import React, { useState, useEffect } from 'react';
import { Trophy, Flame, ShieldCheck, Swords, User, Bell, Lock } from 'lucide-react';

export default function TennisLadderPro() {
  const defaultPlayers = [
    { id: 1, name: "Rolando Rojas", points: 1000, streak: 0, wins: 0, losses: 0 },
    { id: 2, name: "El Puma", points: 1000, streak: 0, wins: 0, losses: 0 },
    { id: 3, name: "Chino Montero", points: 1000, streak: 0, wins: 0, losses: 0 },
  ];

  const [players, setPlayers] = useState(defaultPlayers);
  const [activeUser, setActiveUser] = useState(null);
  const [retos, setRetos] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [pass, setPass] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedPlayers = localStorage.getItem('tennis-players');
    const savedRetos = localStorage.getItem('tennis-retos');
    if (savedPlayers) setPlayers(JSON.parse(savedPlayers));
    if (savedRetos) setRetos(JSON.parse(savedRetos));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('tennis-players', JSON.stringify(players));
      localStorage.setItem('tennis-retos', JSON.stringify(retos));
    }
  }, [players, retos, mounted]);

  const crearReto = (rivalName) => {
    if (!activeUser) return alert("Identifícate primero");
    const nuevoReto = {
      id: Date.now(),
      retador: activeUser.name,
      rival: rivalName,
      fecha: new Date().toLocaleDateString(),
      estado: 'PENDIENTE'
    };
    setRetos([...retos, nuevoReto]);
    alert(`¡Reto enviado a ${rivalName}! 🎾`);
  };

  const registrarResultado = (ganadorId, perdedorId) => {
    if (pass !== "chino123") return alert("Contraseña incorrecta");
    
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

    setPlayers(newPlayers.sort((a, b) => b.points - a.points));
    setRetos([]); // Limpiar retos al jugar
    alert("Ranking actualizado oficialmente");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 font-sans italic tracking-tighter uppercase">
      
      {/* SELECCIÓN DE USUARIO */}
      {!activeUser ? (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6 text-center">
          <Trophy size={80} className="text-lime-400 mb-6 animate-pulse" />
          <h1 className="text-4xl font-black mb-8">¿QUIÉN ERES?</h1>
          <div className="grid gap-4 w-full max-w-xs">
            {players.map(p => (
              <button key={p.id} onClick={() => setActiveUser(p)} className="py-4 bg-zinc-900 rounded-2xl font-black hover:bg-lime-400 hover:text-black transition-all">
                {p.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-xl mx-auto">
          {/* HEADER */}
          <header className="flex justify-between items-start mb-10">
            <div>
              <p className="text-lime-400 text-[10px] font-black tracking-widest">LADDER SYSTEM</p>
              <h1 className="text-5xl font-black leading-none">THE<br/>LADDER</h1>
            </div>
            <button onClick={() => setActiveUser(null)} className="flex flex-col items-end group">
              <User className="text-lime-400 group-hover:scale-110 transition-all" />
              <span className="text-[8px] mt-1 text-zinc-500">USER: {activeUser.name}</span>
            </button>
          </header>

          {/* RETOS ACTIVOS */}
          {retos.length > 0 && (
            <div className="mb-10 bg-lime-400 text-black p-6 rounded-[32px] shadow-[0_0_30px_rgba(163,230,53,0.2)]">
              <h2 className="text-xs font-black mb-3 flex items-center gap-2"><Bell size={14}/> RETOS EN CURSO</h2>
              {retos.map(r => (
                <p key={r.id} className="text-xl font-black italic">{r.retador} VS {r.rival}</p>
              ))}
            </div>
          )}

          {/* RANKING */}
          <div className="space-y-4 mb-20">
            {players.map((p, i) => (
              <div key={p.id} className={`p-6 rounded-[32px] border-2 ${p.streak >= 3 ? 'border-orange-500 bg-orange-500/10' : 'border-white/5 bg-zinc-900/50'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-black italic opacity-20">{i+1}</span>
                    <div>
                      <h3 className="text-xl font-black">{p.name} {p.streak >= 3 && '🔥'}</h3>
                      <p className="text-lime-400 font-mono text-sm">{p.points} PTS</p>
                    </div>
                  </div>
                  {activeUser.name !== p.name && (
                    <button onClick={() => crearReto(p.name)} className="bg-white text-black px-4 py-2 rounded-xl font-black text-xs hover:bg-lime-400 transition-all flex items-center gap-2">
                      <Swords size={14} /> RETAR
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* BOTÓN ADMIN (CHINO) */}
          {activeUser.name === "Chino Montero" && (
            <section className="bg-zinc-900 border border-white/10 rounded-[40px] p-8">
              <button onClick={() => setShowAdmin(!showAdmin)} className="w-full flex justify-between items-center text-xs font-black tracking-widest">
                <span className="flex items-center gap-2"><ShieldCheck size={16}/> MODO COMISIONADO</span>
                {showAdmin ? '-' : '+'}
              </button>
              
              {showAdmin && (
                <div className="mt-6 pt-6 border-t border-white/5">
                  <input 
                    type="password" 
                    placeholder="CONTRASEÑA ADMIN" 
                    className="w-full bg-black p-4 rounded-xl mb-4 border border-zinc-800 outline-none focus:border-lime-400 text-xs text-center"
                    onChange={(e) => setPass(e.target.value)}
                  />
                  <div className="grid gap-2">
                    <p className="text-[10px] text-zinc-500 mb-2">SELECCIONA QUIÉN GANÓ EL ÚLTIMO PARTIDO:</p>
                    {players.map(p => (
                      <button key={p.id} onClick={() => {
                        const rival = players.find(r => r.id !== p.id);
                        registrarResultado(p.id, rival.id);
                      }} className="py-3 border border-white/10 rounded-xl text-xs font-bold hover:bg-white hover:text-black transition-all">
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
    </div>
  );
}
