"use client";
import React, { useState, useEffect } from 'react';
import { Trophy, Flame, ShieldCheck, Swords, LogOut, Activity, ChevronLeft, ChevronRight, User, Calendar, History } from 'lucide-react';

// Jugadores iniciales con sus iconos y correos automáticos
const INITIAL_DATA = [
  { id: 3, email: "chino@gmail.com", name: "Chino Montero", icon: "🇨🇳", points: 1050, streak: 0, wins: 0, losses: 0 },
  { id: 2, email: "puma@gmail.com", name: "El Puma", icon: "🐆", points: 1025, streak: 0, wins: 0, losses: 0 },
  { id: 1, email: "rrojas@gmail.com", name: "Rolando Rojas", icon: "🤠", points: 1000, streak: 0, wins: 0, losses: 0 },
  { id: 4, email: "jborbon@gmail.com", name: "Javier Borbon", icon: "🐍", points: 1000, streak: 0, wins: 0, losses: 0 },
  { id: 5, email: "jcuadra@gmail.com", name: "Jose Cuadra", icon: "", points: 1000, streak: 0, wins: 0, losses: 0 },
  { id: 6, email: "crodriguez@gmail.com", name: "Carlos Rodriguez", icon: "🐐", points: 1000, streak: 0, wins: 0, losses: 0 },
  { id: 7, email: "jcalderon@gmail.com", name: "Josue Calderon", icon: "", points: 1000, streak: 0, wins: 0, losses: 0 },
  { id: 8, email: "fmedina@gmail.com", name: "Fabio Medina", icon: "🦀", points: 1000, streak: 0, wins: 0, losses: 0 },
];

export default function RTATennisApp() {
  const [players, setPlayers] = useState(INITIAL_DATA);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [retos, setRetos] = useState<any[]>([]);
  const [historial, setHistorial] = useState<any[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [marcador, setMarcador] = useState({ s1: "", s2: "", s3: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passInput, setPassInput] = useState("");

  const itemsPerPage = 5;

  useEffect(() => {
    const savedPlayers = localStorage.getItem('rta-final-players');
    const savedRetos = localStorage.getItem('rta-final-retos');
    const savedHistorial = localStorage.getItem('rta-final-historial');
    const savedSession = localStorage.getItem('rta-final-session');
    
    if (savedPlayers) setPlayers(JSON.parse(savedPlayers));
    if (savedRetos) setRetos(JSON.parse(savedRetos));
    if (savedHistorial) setHistorial(JSON.parse(savedHistorial));
    if (savedSession) setActiveUser(JSON.parse(savedSession));
    
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('rta-final-players', JSON.stringify(players));
      localStorage.setItem('rta-final-retos', JSON.stringify(retos));
      localStorage.setItem('rta-final-historial', JSON.stringify(historial));
      if(activeUser) localStorage.setItem('rta-final-session', JSON.stringify(activeUser));
    }
  }, [players, retos, historial, activeUser, mounted]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = players.find(u => u.email === emailInput.toLowerCase() && passInput === "001122");
    if (user) {
      setActiveUser(user);
    } else {
      alert("Credenciales incorrectas (Clave: 001122)");
    }
  };

  const crearReto = (rival: any) => {
    const yaTiene = retos.some(r => r.retadorId === activeUser.id || r.rivalId === activeUser.id || r.retadorId === rival.id || r.rivalId === rival.id);
    if (yaTiene) return alert("Uno de los jugadores ya tiene un reto activo.");

    const nuevoReto = {
      id: Date.now(),
      retadorId: activeUser.id,
      retadorName: activeUser.name.split(' ')[0],
      rivalId: rival.id,
      rivalName: rival.name.split(' ')[0],
    };
    setRetos([...retos, nuevoReto]);
    alert(`Reto creado contra ${rival.name}`);
  };

  const resolverReto = (reto: any, ganadorId: number) => {
    if (adminPass !== "chino123") return alert("Clave de administrador incorrecta");
    
    const perdedorId = (ganadorId === reto.retadorId) ? reto.rivalId : reto.retadorId;
    const gNombre = (ganadorId === reto.retadorId) ? reto.retadorName : reto.rivalName;
    const pNombre = (ganadorId === reto.retadorId) ? reto.rivalName : reto.retadorName;
    const scoreText = `${marcador.s1}/${marcador.s2}${marcador.s3 ? '-' + marcador.s3 : ''}`;

    const updatedPlayers = players.map(p => {
      if (p.id === ganadorId) {
        let pts = p.points + 25;
        let strk = p.streak + 1;
        if (strk === 3) pts += 50;
        return { ...p, points: pts, streak: strk, wins: p.wins + 1 };
      }
      if (p.id === perdedorId) return { ...p, streak: 0, losses: p.losses + 1 };
      return p;
    }).sort((a, b) => b.points - a.points);

    setPlayers(updatedPlayers);
    setHistorial([{ id: Date.now(), ganador: gNombre, perdedor: pNombre, score: scoreText }, ...historial]);
    setRetos(retos.filter(r => r.id !== reto.id));
    setMarcador({ s1: "", s2: "", s3: "" });
    setShowAdmin(false);
  };

  if (!mounted) return null;

  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
  const totalPages = Math.ceil((sortedPlayers.length - 3) / itemsPerPage);
  const paginatedAspirantes = sortedPlayers.slice(3).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 font-sans italic tracking-tighter uppercase">
      {!activeUser ? (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6 text-center">
          <Trophy size={60} className="text-lime-400 mb-6" />
          <h1 className="text-4xl font-black italic mb-10 leading-none tracking-tighter">RTA TENNIS RANKING</h1>
          <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
            <input type="email" placeholder="CORREO" required className="w-full bg-zinc-900 p-4 rounded-2xl border border-white/5 outline-none focus:border-lime-400 font-bold text-xs" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} />
            <input type="password" placeholder="PASSWORD" required className="w-full bg-zinc-900 p-4 rounded-2xl border border-white/5 outline-none focus:border-lime-400 font-bold text-xs" value={passInput} onChange={(e) => setPassInput(e.target.value)} />
            <button type="submit" className="w-full py-5 bg-lime-400 text-black rounded-2xl font-black text-sm tracking-widest uppercase">Entrar</button>
          </form>
        </div>
      ) : (
        <div className="max-w-xl mx-auto pb-20">
          <header className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-5xl font-black leading-[0.85] italic tracking-tighter">RTA<br/>TENNIS<br/>RANKING</h1>
            </div>
            <div className="flex flex-col items-end gap-3">
              <button onClick={() => {localStorage.removeItem('rta-final-session'); setActiveUser(null);}} className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-white/5">
                <span className="text-[7px] text-zinc-500 font-black tracking-widest">{activeUser.name}</span>
                <LogOut size={12} className="text-lime-400" />
              </button>
              <div className="flex flex-col gap-1.5 items-end">
                {retos.map(r => (
                  <div key={r.id} className="bg-lime-400 text-black px-3 py-1 rounded-xl flex items-center gap-2 shadow-lg animate-pulse text-[9px] font-black uppercase italic">
                    <Activity size={10} /> {r.retadorName} VS {r.rivalName}
                  </div>
                ))}
              </div>
            </div>
          </header>

          <div className="grid gap-4 mb-10">
            {sortedPlayers.slice(0, 3).map((p, i) => {
              const tieneReto = retos.some(r => r.retadorId === p.id || r.rivalId === p.id);
              return (
                <div key={p.id} className={`relative p-8 rounded-[40px] border-2 transition-all ${i === 0 ? 'border-yellow-500 bg-yellow-500/10' : i === 1 ? 'border-zinc-400 bg-zinc-400/5' : 'border-orange-700 bg-orange-700/5'}`}>
                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-6">
                      <span className="text-7xl font-black italic opacity-20 leading-none">{i+1}</span>
                      <div>
                        <h3 className="text-2xl font-black leading-tight flex items-center gap-2">
                          {p.name} <span className="text-xl grayscale-0">{p.icon}</span>
                        </h3>
                        <p className="text-lime-400 font-mono text-[10px] mt-1 tracking-widest">{p.points} PTS • {p.wins}W / {p.losses}L</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {p.streak >= 3 && <Flame className="text-orange-500 fill-orange-500 animate-pulse mb-2" size={32} />}
                      {activeUser.id !== p.id && !tieneReto && !retos.some(r => r.retadorId === activeUser.id || r.rivalId === activeUser.id) && (
                        <button onClick={() => crearReto(p)} className="bg-white text-black px-4 py-2 rounded-xl font-black text-[9px] tracking-widest hover:bg-lime-400 transition-all uppercase">Retar</button>
                      )}
                      {tieneReto && <span className="text-[8px] font-black text-zinc-500 tracking-widest">IN GAME</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 mb-8 bg-zinc-900/30 p-4 rounded-[32px] border border-white/5">
            <h2 className="text-[9px] font-black tracking-[0.4em] text-zinc-600 mb-4 px-2 uppercase italic underline decoration-lime-500/50 underline-offset-8">Aspirantes</h2>
            {paginatedAspirantes.map((p) => {
              const globalIndex = sortedPlayers.findIndex(sp => sp.id === p.id);
              const tieneReto = retos.some(r => r.retadorId === p.id || r.rivalId === p.id);
              return (
                <div key={p.id} className="p-4 rounded-2xl bg-black/40 border border-white/5 flex justify-between items-center group hover:border-lime-400 transition-all">
                  <div className="flex items-center gap-4 text-left">
                    <span className="text-xl font-black italic text-zinc-700 w-6">#{globalIndex + 1}</span>
                    <div>
                      <h4 className="text-sm font-bold">{p.name} {p.icon}</h4>
                      <p className="text-[10px] text-zinc-500 font-mono italic">{p.points} PTS</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {activeUser.id !== p.id && !tieneReto && !retos.some(r => r.retadorId === activeUser.id || r.rivalId === activeUser.id) && (
                      <button onClick={() => crearReto(p)} className="bg-white text-black px-3 py-1.5 rounded-lg font-black text-[8px] tracking-widest hover:bg-lime-400 transition-all uppercase">Retar</button>
                    )}
                    {tieneReto && <span className="text-[7px] font-black text-zinc-700 uppercase">En Juego</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center items-center gap-6 mb-16">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 disabled:opacity-20 hover:text-lime-400"><ChevronLeft/></button>
            <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase italic">Pág {currentPage} / {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 disabled:opacity-20 hover:text-lime-400"><ChevronRight/></button>
          </div>

          {activeUser.email === "chino@gmail.com" && (
            <section className="bg-zinc-950 border-2 border-lime-400/20 rounded-[40px] p-8 shadow-2xl">
              <button onClick={() => setShowAdmin(!showAdmin)} className="w-full flex justify-between items-center text-[9px] font-black tracking-[0.3em] uppercase">
                <span className="flex items-center gap-2 italic"><ShieldCheck size={14} className="text-lime-400"/> Comisionado</span>
                {showAdmin ? 'CERRAR' : 'ABRIR'}
              </button>
              {showAdmin && (
                <div className="mt-8 space-y-6">
                  <input type="password" placeholder="CLAVE CHINO123" className="w-full bg-black p-4 rounded-xl border border-white/5 text-xs text-center font-bold tracking-widest outline-none focus:border-lime-400" onChange={(e) => setAdminPass(e.target.value)} />
                  {retos.length === 0 ? (
                    <p className="text-center text-[8px] text-zinc-700 font-black tracking-widest uppercase italic">Esperando partidos...</p>
                  ) : (
                    retos.map(r => (
                      <div key={r.id} className="p-6 bg-zinc-900 rounded-3xl space-y-4 border border-white/5">
                        <p className="text-[10px] font-black text-center text-zinc-500 tracking-widest uppercase italic border-b border-white/5 pb-2">{r.retadorName} VS {r.rivalName}</p>
                        <div className="grid grid-cols-3 gap-2">
                          <input type="text" placeholder="S1" className="bg-black text-center p-3 rounded-lg text-xs font-bold border border-white/5 outline-none focus:border-lime-400" value={marcador.s1} onChange={e => setMarcador({...marcador, s1: e.target.value})} />
                          <input type="text" placeholder="S2" className="bg-black text-center p-3 rounded-lg text-xs font-bold border border-white/5 outline-none focus:border-lime-400" value={marcador.s2} onChange={e => setMarcador({...marcador, s2: e.target.value})} />
                          <input type="text" placeholder="TB" className="bg-black text-center p-3 rounded-lg text-xs font-bold border border-orange-500/30 outline-none focus:border-orange-500" value={marcador.s3} onChange={e => setMarcador({...marcador, s3: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button onClick={() => resolverReto(r, r.retadorId)} className="py-4 bg-zinc-800 rounded-xl text-[9px] font-black hover:bg-lime-400 hover:text-black transition-all italic uppercase tracking-tighter">Ganó {r.retadorName}</button>
                          <button onClick={() => resolverReto(r, r.rivalId)} className="py-4 bg-zinc-800 rounded-xl text-[9px] font-black hover:bg-lime-400 hover:text-black transition-all italic uppercase tracking-tighter">Ganó {r.rivalName}</button>
                        </div>
                      </div>
                    ))
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
