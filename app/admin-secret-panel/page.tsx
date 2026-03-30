// File: src/app/admin-secret-panel/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Database, CheckCircle2, AlertTriangle, XCircle, Timer, Activity, Lock, Unlock } from "lucide-react";

const START_TIME = new Date("2026-05-09T12:00:00+07:00").getTime();
const END_TIME = new Date("2026-05-10T12:00:00+07:00").getTime();
const CP_DEADLINES: Record<number, number> = {
  1: START_TIME + (6 * 60 * 60 * 1000),  
  2: START_TIME + (12 * 60 * 60 * 1000), 
  3: START_TIME + (18 * 60 * 60 * 1000), 
};

export default function AdminDashboardOverview() {
  const [teamsData, setTeamsData] = useState<any[]>([]);
  const [now, setNow] = useState<number>(new Date().getTime());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date().getTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase.from('teams').select('status, track');
      if (data) setTeamsData(data);
    };
    fetchStats();
  }, []);

  // Timeline Logic
  const isStarted = now >= START_TIME;
  const isEnded = now >= END_TIME;
  let targetTime = START_TIME;
  if (isStarted && !isEnded) targetTime = END_TIME;
  
  const diff = Math.max(0, isStarted && !isEnded ? targetTime - now : START_TIME - now);
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  let currentPhase = "Pre-Event"; let lockStatus = "LOCKED"; let lockColor = "text-red-400 bg-red-400/10";
  if (isEnded) { currentPhase = "Event Ended"; lockStatus = "ALL LOCKED"; } 
  else if (isStarted) {
    if (now < CP_DEADLINES[1]) { currentPhase = "Phase 1 (Towards CP1)"; lockStatus = "OPEN: CP 1"; lockColor = "text-emerald-400 bg-emerald-400/10"; }
    else if (now < CP_DEADLINES[2]) { currentPhase = "Phase 2 (Towards CP2)"; lockStatus = "OPEN: CP 2"; lockColor = "text-emerald-400 bg-emerald-400/10"; }
    else if (now < CP_DEADLINES[3]) { currentPhase = "Phase 3 (Towards CP3)"; lockStatus = "OPEN: CP 3"; lockColor = "text-emerald-400 bg-emerald-400/10"; }
    else { currentPhase = "Final Sprint (Towards Final)"; lockStatus = "OPEN: FINAL"; lockColor = "text-emerald-400 bg-emerald-400/10"; }
  }
  const progressPct = isEnded ? 100 : isStarted ? ((now - START_TIME) / (END_TIME - START_TIME)) * 100 : 0;

  // Stats Logic
  const totalTeams = teamsData.length;
  const approvedTeams = teamsData.filter(t => t.status === 'approved').length;
  const pendingTeams = teamsData.filter(t => t.status === 'pending').length;
  const rejectedTeams = teamsData.filter(t => t.status === 'rejected').length;
  const uiuxCount = teamsData.filter(t => t.track === 'UI/UX').length;
  const dataCount = teamsData.filter(t => t.track === 'Data Automation').length;
  const saCount = teamsData.filter(t => t.track === 'System Analyst').length;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-light flex items-center gap-3"><Database className="text-blue-500" /> Dashboard Overview</h1>
        <p className="text-gray-400 text-sm mt-1">Real-time statistics for 3IN1 Tech Sprint 2026</p>
      </div>

      {/* GLOBAL TIMELINE & COUNTDOWN */}
      <div className="bg-[#0c122b] border border-white/5 rounded-3xl p-8 mb-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-blue-600/10 blur-[100px] rounded-full"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10">
          <div className="text-center lg:text-left">
            <p className="text-sm text-gray-400 font-light mb-2 flex items-center justify-center lg:justify-start gap-2">
              <Timer className="w-4 h-4 text-blue-400" /> {isEnded ? "Hackathon Completed" : isStarted ? "Time Remaining" : "Event Starts In"}
            </p>
            <div className="text-5xl md:text-6xl font-light tracking-wider text-white">
              {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="flex justify-between text-[10px] md:text-xs text-gray-500 mb-2 font-medium tracking-wider uppercase">
              <span>Start<br/><span className="font-light text-gray-600">09 May 12:00</span></span>
              <span className="text-center">CP1<br/><span className="font-light text-gray-600">09 May 18:00</span></span>
              <span className="text-center">CP2<br/><span className="font-light text-gray-600">10 May 00:00</span></span>
              <span className="text-center">CP3<br/><span className="font-light text-gray-600">10 May 06:00</span></span>
              <span className="text-right">Final<br/><span className="font-light text-gray-600">10 May 12:00</span></span>
            </div>
            <div className="relative w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-white/5">
              <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-1000 ease-linear" style={{ width: `${progressPct}%` }}></div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-light text-gray-300">Phase: <strong className="text-white font-medium">{currentPhase}</strong></span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider border border-white/5 ${lockColor}`}>
                {lockStatus.includes("OPEN") ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />} {lockStatus}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATISTIC DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0c122b] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
          <p className="text-sm font-light text-gray-400 mb-1">Total Teams Registered</p>
          <h3 className="text-4xl font-normal text-white">{totalTeams}</h3>
        </div>
        <div className="bg-[#0c122b] border border-white/5 rounded-2xl p-5">
          <p className="text-sm font-light text-gray-400 mb-3">Verification Status</p>
          <div className="flex justify-between items-center mb-1"><span className="text-xs text-gray-300 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400"/> Approved</span><span className="font-medium text-emerald-400">{approvedTeams}</span></div>
          <div className="flex justify-between items-center mb-1"><span className="text-xs text-gray-300 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-yellow-400"/> Pending</span><span className="font-medium text-yellow-400">{pendingTeams}</span></div>
          <div className="flex justify-between items-center"><span className="text-xs text-gray-300 flex items-center gap-1"><XCircle className="w-3 h-3 text-red-400"/> Rejected</span><span className="font-medium text-red-400">{rejectedTeams}</span></div>
        </div>
        <div className="bg-[#0c122b] border border-white/5 rounded-2xl p-5 lg:col-span-2">
          <p className="text-sm font-light text-gray-400 mb-3">Registrations by Track Category</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl text-center"><p className="text-2xl font-normal text-white">{uiuxCount}</p><p className="text-[10px] text-gray-500 uppercase mt-1">UI/UX Design</p></div>
            <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl text-center"><p className="text-2xl font-normal text-white">{dataCount}</p><p className="text-[10px] text-gray-500 uppercase mt-1">Data Auto</p></div>
            <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl text-center"><p className="text-2xl font-normal text-white">{saCount}</p><p className="text-[10px] text-gray-500 uppercase mt-1">Sys Analyst</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}