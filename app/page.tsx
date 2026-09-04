"use client";
import React, { useState, useEffect } from 'react';
import { Trophy, Flame, ShieldCheck, Swords, LogOut, Activity, History, ChevronLeft, ChevronRight, User } from 'lucide-react';

export default function RTATennisApp() {
  const adminEmail = "chino@gmail.com";
  
  const initialPlayers = [
    { id: 3, email: "chino@gmail.com", name: "Chino Montero", icon: "🇨🇳", points: 1050, streak: 0, wins: 0, losses: 0 },
    { id: 2, email: "puma@gmail.com", name: "El Puma", icon: "🐆", points: 1025, streak: 0, wins: 0, losses: 0 },
    { id: 1, email: "rrojas@gmail.com", name: "Rolando Rojas", icon: "🤠", points: 1000, streak: 0, wins: 0, losses: 0 },
    { id: 4, email: "jborbon@gmail.com", name: "Javier Borbon", icon: "🐍", points: 1000, streak: 0, wins: 0, losses: 0 },
    { id: 5, email: "jcuadra@gmail.com", name: "Jose Cuadra", icon: "", points: 1000, streak: 0, wins: 0, losses: 0 },
    { id: 6, email: "crodriguez@gmail.com", name: "Carlos Rodriguez", icon: "🐐", points: 1000, streak: 0, wins: 0, losses: 0 },
    { id: 7, email: "jcalderon@gmail.com", name: "Josue Calderon", icon: "", points: 1000, streak: 0, wins: 0, losses: 0 },
    { id: 8, email: "fmedina@gmail.com", name: "Fabio Medina", icon: "🦀", points: 1000, streak: 0, wins: 0, losses: 0 },
  ];

  const [players, setPlayers] = useState(initialPlayers);
  const [activeUser, setActiveUser] = useState(null);
  const [retos, setRetos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [marcador, setMarcador] = useState({ s1: "", s2: "", s3: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passInput, setPassInput] = useState("");

  const itemsPerPage = 5;

  useEffect(() => {
    const savedPlayers = localStorage.getItem('rta-v8-players');
    const savedRetos = localStorage.getItem('rta-v8-retos');
    const savedHistorial = localStorage.getItem('rta-v8-historial');
    const savedSession = localStorage.getItem('rta-v8-session');
    if (savedPlayers) setPlayers(JSON.parse(savedPlayers));
    if (savedRetos) setRetos(JSON.parse(savedRetos));
    if (savedHistorial) setHistorial(JSON.parse(savedHistorial));
    if (savedSession) setActiveUser(JSON.parse(savedSession));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('rta-v8-players', JSON.stringify(players));
      localStorage.setItem('rta-v8-retos', JSON.stringify(retos));
      localStorage.setItem('rta-v8-historial', JSON.stringify(historial));
      if(activeUser) localStorage.setItem('rta-v8-session', JSON.stringify(activeUser));
    }
  }, [players, retos, historial, activeUser, mounted]);

  const handleLogin = (e) => {
    e.preventDefault();
    const userMatch = players.find(u => u.email === emailInput.toLowerCase() && passInput === "001122");
    if (userMatch) setActiveUser(userMatch);
    else alert("Credenciales incorrectas.");
  };

  const resolverReto = (reto, ganadorId) => {
    if (adminPass !== "chino123") return alert("Clave incorrecta");
    const perdedorId = (ganadorId === reto.retadorId) ? reto.rivalId : reto.retadorId;
    const gNombre = (ganadorId === reto.retadorId) ? reto.retadorName : reto.rivalName;
    const pNombre = (ganadorId === reto.retadorId) ? reto.rivalName : reto.retadorName;
    const marcadorFinal = `${marcador.s1}/${marcador.s2}${marcador.s3 ? '-' + marcador.s3 : ''}`;

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
    setHistorial([{ id: Date.now(), ganador: gNombre, perdedor: pNombre, score: marcadorFinal }, ...historial]);
    setRetos(retos.filter(r => r.id !== reto.id));
    setMarcador({ s1: "", s2: "", s3: "" });
    setShowAdmin(false);
  };

  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
  const totalPages = Math.ceil(sortedPlayers.length / itemsPerPage);
  const currentPlayers = sortedPlayers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-sans italic tracking-tighter uppercase">
      {!activeUser ? (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6 text-center">
          <Trophy size={60} className="text-lime-400 mb-4" />
          <h1 className="text-4xl font-black leading-none mb-10 tracking-tighter italic">RTA TENNIS</h1>
          <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4 italic">
            <input type="email" placeholder="EMAIL" required className="w-full bg-zinc-900 p-4 rounded-2xl border border-white/5 outline-none focus:border-lime-400 font-bold text-xs" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} />
            <input type="password" placeholder="PASSWORD" required className="w-full bg-zinc-900 p-4 rounded-2xl border border-white/5 outline-none focus:border-lime-400 font-bold text-xs" value={passInput} onChange={(e) => setPassInput(e.target.value)} />
            <button type="submit" className="w-full py-5 bg-lime-400 text-black rounded-2xl font-black text-sm tracking-widest uppercase">Entrar</button>
          </form>
        </div>
      ) : (
        <div className="max-w-xl mx-auto pb-20">
          <header className="flex justify-between items-start mb-10">
            <h1 className="text-5xl font-black leading-[0.85] italic tracking-tighter">RTA<br/>TENNIS<br/>RANKING</h1>
            <div className="flex flex-col items-end gap-3">
              <button onClick={() => {localStorage.removeItem('rta-v8-session'); setActiveUser(null);}} className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-white/5">
                <span className="text-[7px] text-zinc-500 font-black">{activeUser.name}</span>
                <LogOut size={12} className="text-lime-400" />
              </button>
              <div className="flex flex-col gap-1.5 items-end">
                {retos.map(r => (
                  <div key={r.id} className="bg-lime-400 text-black px-3 py-1 rounded-xl flex items-center gap-2 shadow-lg animate-pulse text-[9px] font-black">
                    <Activity size={10} /> {r.retadorName} VS {r.rivalName}
                  </div>
                ))}
              </div>
            </div>
          </header>

          {/* TOP 3 - GRANDE */}
          <div className="grid gap-4 mb-10">
            {sortedPlayers.slice(0, 3).map((p, i) => (
              <div key={p.id} className={`relative p-8 rounded-[40px] border-2 overflow-hidden ${i === 0 ? 'border-yellow-500 bg-yellow-500/5' : i === 1 ? 'border-zinc-400 bg-zinc-400/5' : 'border-orange-700 bg-orange-700/5'}`}>
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-6">
                    <span className="text-7xl font-black italic opacity-20 leading-none">{i+1}</span>
                    <div>
                      <h3 className="text-3xl font-black leading-tight uppercase flex items-center gap-2">
                        {p.name} <span className="text-2xl grayscale-0">{p.icon}</span>
                      </h3>
                      <p className="text-lime-400 font-mono text-xs mt-1 tracking-[0.2em]">{p.points} PTS • {p.wins}W / {p.losses}L</p>
                    </div>
                  </div>
                  {p.streak >= 3 && <Flame className="text-orange-500 fill-orange-500 animate-pulse" size={32} />}
                </div>
              </div>
            ))}
          </div>

          {/* RESTO DE LA LISTA - PEQUEÑO + PAGINACIÓN */}
          <div className="space-y-2 mb-8 bg-zinc-900/30 p-4 rounded-[32px] border border-white/5">
            <h2 className="text-[9px] font-black tracking-[0.4em] text-zinc-600 mb-4 px-2 uppercase italic">Aspirantes</h2>
            {currentPlayers.map((p) => {
              const globalIndex = sortedPlayers.findIndex(sp => sp.id === p.id);
              if (globalIndex < 3) return null; // Saltar si ya está en el top 3
              
              return (
                <div key={p.id} className="p-4 rounded-2xl bg-black/40 border border-white/5 flex justify-between items-center group hover:border-lime-400/50 transition-all">
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-black italic text-zinc-700 w-6">#{globalIndex + 1}</span>
                    <div>
                      <h4 className="text-sm font-bold uppercase">{p.name} {p.icon}</h4>
                      <p className="text-[10px] text-zinc-500 font-mono italic">{p.points} PTS</p>
                    </div>
                  </div>
                  {activeUser.id !== p.id && (
                    <button onClick={() => setRetos([...retos, {id: Date.now(), retadorId: activeUser.id, retadorName: activeUser.name.split(' ')[0], rivalId: p.id, rivalName: p.name.split(' ')[0]}])} className="bg-white text-black px-3 py-1.5 rounded-lg font-black text-[8px] tracking-widest hover:bg-lime-400 transition-all opacity-0 group-hover:opacity-100 uppercase">Retar</button>
                  )}
                </div>
              );
            })}
          </div>

          {/* PAGINACIÓN */}
          <div className="flex justify-center items-center gap-6 mb-16">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 disabled:opacity-20"><ChevronLeft/></button>
            <span className="text-[10px] font-black tracking-widest uppercase">Página {currentPage} / {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 disabled:opacity-20"><ChevronRight/></button>
          </div>

          {/* PANEL ADMIN */}
          {activeUser.email === adminEmail && (
            <section className="bg-zinc-950 border border-lime-400/20 rounded-[40px] p-8 shadow-2xl">
              <button onClick={() => setShowAdmin(!showAdmin)} className="w-full flex justify-between items-center text-[9px] font-black tracking-[0.3em]">
                <span className="flex items-center gap-2 uppercase italic"><ShieldCheck size={14}/> Comisionado</span>
                {showAdmin ? 'CERRAR' : 'ABRIR'}
              </button>
              {showAdmin && (
                <div className="mt-8 space-y-6">
                  <input type="password" placeholder="CLAVE CHINO123" className="w-full bg-black p-4 rounded-xl border border-white/5 text-xs text-center font-bold tracking-widest" onChange={(e) => setAdminPass(e.target.value)} />
                  {retos.map(r => (
                    <div key={r.id} className="p-6 bg-zinc-900 rounded-3xl space-y-4">
                      <p className="text-[10px] font-black text-center text-zinc-500 tracking-widest uppercase">{r.retadorName} VS {r.rivalName}</p>
                      <div className="grid grid-cols-3 gap-2 uppercase">
                        <input type="text" placeholder="S1" className="bg-black text-center p-3 rounded-lg text-xs font-bold border border-white/5" value={marcador.s1} onChange={e => setMarcador({...marcador, s1: e.target.value})} />
                        <input type="text" placeholder="S2" className="bg-black text-center p-3 rounded-lg text-xs font-bold border border-white/5" value={marcador.s2} onChange={e => setMarcador({...marcador, s2: e.target.value})} />
                        <input type="text" placeholder="TB" className="bg-black text-center p-3 rounded-lg text-xs font-bold border border-orange-500/30" value={marcador.s3} onChange={e => setMarcador({...marcador, s3: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 uppercase italic">
                        <button onClick={() => resolverReto(r, r.retadorId)} className="py-4 bg-zinc-800 rounded-xl text-[9px] font-black hover:bg-lime-400 hover:text-black transition-all italic tracking-tighter">Ganó {r.retadorName}</button>
                        <button onClick={() => resolverReto(r, r.rivalId)} className="py-4 bg-zinc-800 rounded-xl text-[9px] font-black hover:bg-lime-400 hover:text-black transition-all italic tracking-tighter">Ganó {r.rivalName}</button>
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
