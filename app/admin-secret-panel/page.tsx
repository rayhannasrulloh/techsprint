// File: src/app/admin-secret-panel/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Database, CheckCircle2, AlertTriangle, XCircle, Activity, Lock, Unlock, Users, Clock } from "lucide-react";

const START_TIME = new Date("2026-06-16T12:00:00+07:00").getTime();
const END_TIME = new Date("2026-06-17T12:00:00+07:00").getTime();
const CP_DEADLINES: Record<number, number> = {
  1: START_TIME + (6 * 60 * 60 * 1000),  
  2: START_TIME + (12 * 60 * 60 * 1000), 
  3: START_TIME + (18 * 60 * 60 * 1000), 
};

export default function AdminDashboardOverview() {
  const [teamsData, setTeamsData] = useState<any[]>([]);
  const [recentTeams, setRecentTeams] = useState<any[]>([]);
  const [now, setNow] = useState<number>(new Date().getTime());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date().getTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase.from('teams').select('status, track');
      if (data) setTeamsData(data);
      
      const { data: recent } = await supabase
        .from('teams')
        .select('id, team_name, track, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      if (recent) setRecentTeams(recent);
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

  let currentPhase = "Pre-Event"; let lockStatus = "Locked"; let lockColor = "text-white";
  if (isEnded) { currentPhase = "Event Ended"; lockStatus = "All Locked"; } 
  else if (isStarted) {
    if (now < CP_DEADLINES[1]) { currentPhase = "Phase 1 (Towards CP1)"; lockStatus = "Open: CP 1"; lockColor = "text-blue-400"; }
    else if (now < CP_DEADLINES[2]) { currentPhase = "Phase 2 (Towards CP2)"; lockStatus = "Open: CP 2"; lockColor = "text-blue-400"; }
    else if (now < CP_DEADLINES[3]) { currentPhase = "Phase 3 (Towards CP3)"; lockStatus = "Open: CP 3"; lockColor = "text-blue-400"; }
    else { currentPhase = "Final Sprint (Towards Final)"; lockStatus = "Open: Final"; lockColor = "text-blue-400"; }
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
    <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-white">Dashboard Overview</h1>
        <p className="text-sm text-gray-400/80 mt-1.5 font-light tracking-wide">Here is the real-time statistics of the competition</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* COUNTDOWN CARD */}
        <div className="bg-[#0B132B] rounded-2xl p-8 flex flex-col items-center justify-center">
          <p className="text-sm text-blue-300 font-medium mb-4 uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-4 h-4" /> {isEnded ? "Competition Completed" : isStarted ? "Time Remaining" : "Competition Starts In"}
          </p>
          <div className="text-4xl md:text-5xl font-normal tracking-widest text-white font-mono">
            {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
          </div>
        </div>

        {/* TIMELINE CARD */}
        <div className="lg:col-span-2 bg-[#111827] rounded-2xl p-8 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-300">Phase: <strong className="text-white ml-1">{currentPhase}</strong></span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider bg-[#1F2937] ${lockColor}`}>
              {lockStatus.includes("Open") ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-gray-400" />} {lockStatus}
            </div>
          </div>
          
          <div className="flex justify-between text-[10px] md:text-xs text-gray-400 mb-3 font-semibold tracking-wider uppercase">
            <span>Start<br/><span className="font-mono font-normal text-gray-500 tracking-normal">16 June 12:00</span></span>
            <span className="text-center">CP1<br/><span className="font-mono font-normal text-gray-500 tracking-normal">16 June 18:00</span></span>
            <span className="text-center">CP2<br/><span className="font-mono font-normal text-gray-500 tracking-normal">17 June 00:00</span></span>
            <span className="text-center">CP3<br/><span className="font-mono font-normal text-gray-500 tracking-normal">17 June 06:00</span></span>
            <span className="text-right">Final<br/><span className="font-mono font-normal text-gray-500 tracking-normal">17 June 12:00</span></span>
          </div>
          <div className="relative w-full h-4 rounded-full overflow-hidden bg-[#030712]">
            <div className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-1000 ease-linear" style={{ width: `${progressPct}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: STATS */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#111827] rounded-2xl p-6">
            <p className="text-sm font-semibold text-gray-400 tracking-wider mb-2 uppercase">Total Teams</p>
            <h3 className="text-5xl font-medium text-white">{totalTeams}</h3>
          </div>
          
          <div className="bg-[#111827] rounded-2xl p-6">
            <p className="text-sm font-semibold text-gray-400 tracking-wider mb-4 uppercase">Verification</p>
            <div className="flex justify-between items-center mb-2"><span className="text-sm text-gray-300 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Approved</span><span className="font-medium text-white">{approvedTeams}</span></div>
            <div className="flex justify-between items-center mb-2"><span className="text-sm text-gray-300 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-500"/> Pending</span><span className="font-medium text-white">{pendingTeams}</span></div>
            <div className="flex justify-between items-center"><span className="text-sm text-gray-300 flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500"/> Rejected</span><span className="font-medium text-white">{rejectedTeams}</span></div>
          </div>

          <div className="bg-[#111827] rounded-2xl p-6 md:col-span-2">
            <p className="text-sm font-semibold text-gray-400 tracking-wider mb-4 uppercase">Track Distribution</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#030712] py-4 rounded-xl text-center"><p className="text-3xl font-medium text-white">{uiuxCount}</p><p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mt-1">UI/UX</p></div>
              <div className="bg-[#030712] py-4 rounded-xl text-center"><p className="text-3xl font-medium text-white">{dataCount}</p><p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mt-1">Data Auto</p></div>
              <div className="bg-[#030712] py-4 rounded-xl text-center"><p className="text-3xl font-medium text-white">{saCount}</p><p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mt-1">Sys Analyst</p></div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RECENT ACTIVITY */}
        <div className="bg-[#111827] rounded-2xl p-6 flex flex-col">
          <p className="text-sm font-semibold text-gray-400 tracking-wider mb-4 uppercase flex items-center gap-2">
            <Users className="w-4 h-4" /> Latest Registrations
          </p>
          <div className="flex-1 overflow-y-auto">
            {recentTeams.length === 0 ? (
              <p className="text-sm text-gray-500">No recent registrations.</p>
            ) : (
              <div className="space-y-3">
                {recentTeams.map(team => (
                  <div key={team.id} className="bg-[#030712] p-3 rounded-xl flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-white">{team.team_name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${team.status === 'approved' ? 'bg-green-600 text-white' : team.status === 'pending' ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white'}`}>
                        {team.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">{team.track}</span>
                      <span className="text-[10px] text-gray-500">{new Date(team.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}