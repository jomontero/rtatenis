"use client";
import React, { useState, useEffect } from 'react';
import { Trophy, Flame, ShieldCheck, Swords, LogOut, Activity, ChevronLeft, ChevronRight, User } from 'lucide-react';

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
    const savedPlayers = localStorage.getItem('rta-v9-players');
    const savedRetos = localStorage.getItem('rta-v9-retos');
    const savedHistorial = localStorage.getItem('rta-v9-historial');
    const savedSession = localStorage.getItem('rta-v9-session');
    if (savedPlayers) setPlayers(JSON.parse(savedPlayers));
    if (savedRetos) setRetos(JSON.parse(savedRetos));
    if (savedHistorial) setHistorial(JSON.parse(savedHistorial));
    if (savedSession) setActiveUser(JSON.parse(savedSession));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('rta-v9-players', JSON.stringify(players));
      localStorage.setItem('rta-v9-retos', JSON.stringify(retos));
      localStorage.setItem('rta-v9-historial', JSON.stringify(historial));
      if(activeUser) localStorage.setItem('rta-v9-session', JSON.stringify(activeUser));
    }
  }, [players, retos, historial, activeUser, mounted]);

  const handleLogin = (e) => {
    e.preventDefault();
    const userMatch = players.find(u => u.email === emailInput.toLowerCase() && passInput === "001122");
    if (userMatch) setActiveUser(userMatch);
    else alert("Credenciales incorrectas.");
  };

  const handleLogout = () => { localStorage.removeItem('rta-v9-session'); setActiveUser(null); };

  const crearReto = (rival) => {
    const yaTieneReto = retos.some(r => r.retadorId === activeUser.id || r.rivalId === activeUser.id || r.retadorId === rival.id || r.rivalId === rival.id);
    if (yaTieneReto) return alert("Uno de los jugadores ya tiene un reto pendiente.");

    const nuevoReto = {
      id: Date.now(),
      retadorId: activeUser.id,
      retadorName: activeUser.name.split(' ')[0],
      rivalId: rival.id,
      rivalName: rival.name.split(' ')[0],
    };
    setRetos([...retos, nuevoReto]);
    alert(`Reto creado: ${activeUser.name} vs ${rival.name} 🎾`);
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
          <h1 className="text-4xl font-black italic tracking-tighter mb-10 leading-none">RTA TENNIS</h1>
          <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
            <input type="email" placeholder="EMAIL" required className="w-full bg-zinc-900 p-4 rounded-2xl border border-white/5 outline-none focus:border-lime-400 font-bold text-xs" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} />
            <input type="password" placeholder="PASSWORD" required className="w-full bg-zinc-900 p-4 rounded-2xl border border-white/5 outline-none focus:border-lime-400 font-bold text-xs" value={passInput} onChange={(e) => setPassInput(e.target.value)} />
            <button type="submit" className="w-full py-5 bg-lime-400 text-black rounded-2xl font-black text-sm uppercase tracking-widest">ENTRAR</button>
          </form>
        </div>
      ) : (
        <div className="max-w-xl mx-auto pb-20">
          <header className="flex justify-between items-start mb-10">
            <h1 className="text-5xl font-black italic leading-[0.85] tracking-tighter">RTA<br/>TENNIS<br/>RANKING</h1>
            <div className="flex flex-col items-end gap-3">
              <button onClick={handleLogout} className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-white/5">
                <span className="text-[7px] text-zinc-500 font-black">{activeUser.name}</span>
                <LogOut size={12} className="text-lime-400" />
