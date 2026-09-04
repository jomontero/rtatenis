"use client";
import React, { useState, useEffect } from 'react';
import { Trophy, Flame, ShieldCheck, Swords, RotateCcw } from 'lucide-react';

export default function TennisLadderDemo() {
  // 1. Datos iniciales de la liga
  const defaultPlayers = [
    { id: 1, name: "Rolando Rojas", points: 1000, streak: 0, wins: 0, losses: 0 },
    { id: 2, name: "El Puma", points: 1000, streak: 0, wins: 0, losses: 0 },
    { id: 3, name: "Chino Montero", points: 1000, streak: 0, wins: 0, losses: 0 },
  ];

  const [players, setPlayers] = useState(defaultPlayers);
  const [mounted, setMounted] = useState(false);

  // 2. Cargar datos guardados al iniciar
  useEffect(() => {
    const savedData = localStorage.getItem('tennis-ladder-db');
    if (savedData) {
      setPlayers(JSON.parse(savedData));
    }
    setMounted(true);
  }, []);

  // 3. Guardar datos automáticamente cuando cambien
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('tennis-ladder-db', JSON.stringify(players));
    }
  }, [players, mounted]);

  // 4. LÓGICA DE PARTIDO
  const registrarResultado = (ganadorId, perdedorId) => {
    const confirmacion = confirm(`¿Confirmas que ganó ${players.find(p => p.id === ganadorId).name}?`);
    if (!confirmacion) return;

    const newPlayers = players.map(player => {
      // Lógica para el Ganador
      if (player.id === ganadorId) {
        let nuevosPuntos = player.points + 25;
        let nuevaRacha = player.streak + 1;
        
        // BONUS DE 3 VICTORIAS: +50 PUNTOS
        if (nuevaRacha === 3) {
          nuevosPuntos += 50;
          alert(`¡🔥 BRUTAL! ${player.name} ha ganado 3 seguidos. ¡RECIBE +50 PTS DE BONUS!`);
        }

        return { ...player, points: nuevosPuntos, streak: nuevaRacha, wins: player.wins + 1 };
      }
      
      // Lógica para el Perdedor
      if (player.id === perdedorId) {
        return { ...player, streak: 0, losses: player.losses + 1 };
      }

      return player;
    });

    // Ordenar ranking por puntos antes de guardar
    setPlayers(newPlayers.sort((a, b) => b.points - a.points));
  };

  const resetLeague = () => {
    if (confirm("¿Seguro que quieres resetear toda la liga a 1000 puntos?")) {
      setPlayers(defaultPlayers);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-10 font-sans tracking-tight uppercase italic">
      
      {/* HEADER */}
      <header className="max-w-xl mx-auto mb-10 flex justify-between items-end">
        <div>
          <p className="text-lime-400 font-black text-[10px] tracking-[0.3em] mb-1" PRO SERIES</p>
          <h1 className="text-6xl font-black italic leading-none tracking-tighter">RTAbr/>TENIS</h1>
        </div>
        <Trophy className="text-zinc-800" size={60} />
      </header>

      {/* RANKING LIST */}
      <main className="max-w-xl mx-auto space-y-4">
        {players.map((player, index) => (
          <div 
            key={player.id} 
            className={`relative overflow-hidden p-6 rounded-[32px] border-2 transition-all duration-500 ${
              player.streak >= 3 
              ? 'border-orange-500 bg-orange-500/10 shadow-[0_0_40px_rgba(249,115,22,0.2)]' 
              : 'border-white/5 bg-zinc-900/40'
            }`}
          >
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-6">
                <span className={`text-5xl font-black italic ${player.streak >= 3 ? 'text-orange-500/40' : 'text-zinc-800'}`}>
                  {index + 1}
                </span>
                <div>
                  <h2 className="text-2xl font-black flex items-center gap-2">
                    {player.name} {player.streak >= 3 && <Flame className="text-orange-500 fill-orange-500 animate-pulse" />}
                  </h2>
                  <div className="flex gap-4 mt-1">
                    <span className="text-lime-400 font-mono text-sm tracking-tighter">{player.points} PTS</span>
                    <span className="text-zinc-500 font-mono text-[10px] self-center">W:{player.wins} / L:{player.losses}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-[10px] font-black text-zinc-500 tracking-widest mb-1">STREAK</p>
                <div className="flex gap-1 justify-end">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i <= player.streak ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'bg-zinc-800'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* ADMIN PANEL - SOLO PARA CHINO */}
        <section className="mt-12 bg-white text-black rounded-[40px] p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="flex items-center gap-2 text-xs font-black tracking-[0.2em]">
              <ShieldCheck size={18} /> ADMIN: CHINO MONTERO
            </h2>
            <button onClick={resetLeague} className="text-zinc-400 hover:text-red-500">
              <RotateCcw size={16} />
            </button>
          </div>

          <p className="text-2xl font-black italic leading-none mb-6 uppercase tracking-tighter text-zinc-900">
            ¿QUIÉN GANÓ EL ÚLTIMO PARTIDO?
          </p>

          <div className="grid gap-3">
            {players.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  // Abre un selector para elegir contra quién perdió
                  const perdedor = players.find(rival => rival.id !== p.id);
                  registrarResultado(p.id, perdedor.id);
                }}
                className="group relative w-full py-5 bg-zinc-950 text-white rounded-2xl font-black text-sm tracking-widest hover:bg-lime-400 hover:text-black transition-all flex justify-between px-8 items-center"
              >
                <span>GANÓ {p.name}</span>
                <Swords size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </section>
      </main>

      <footer className="max-w-xl mx-auto mt-10 text-center">
        <p className="text-zinc-600 text-[10px] tracking-[0.5em] font-bold">LADDER SYSTEM v1.0 • POWERED BY GEMINI</p>
      </footer>
    </div>
  );
}
