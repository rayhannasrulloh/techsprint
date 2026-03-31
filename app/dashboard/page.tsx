// File: src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Megaphone, Pin, Activity, AlertTriangle, XCircle, CheckCircle2, Timer } from "lucide-react";
import { supabase } from "@/lib/supabase";

// 🕒 KONFIGURASI WAKTU HACKATHON (WIB)
const START_TIME = new Date("2026-05-09T12:00:00+07:00").getTime();
const CP1_DEADLINE = new Date("2026-05-09T18:00:00+07:00").getTime();
const CP2_DEADLINE = new Date("2026-05-10T00:00:00+07:00").getTime();
const CP3_DEADLINE = new Date("2026-05-10T06:00:00+07:00").getTime();
const FINAL_DEADLINE = new Date("2026-05-10T12:00:00+07:00").getTime();

export default function DashboardPage() {
  const [teamData, setTeamData] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [now, setNow] = useState<number>(new Date().getTime());

  useEffect(() => {
    const timerId = setInterval(() => setNow(new Date().getTime()), 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: teamRes } = await supabase.from('teams').select('team_name, status').eq('id', session.user.id).single();
        if (teamRes) setTeamData(teamRes);
        
        const { data: annRes } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
        if (annRes) setAnnouncements(annRes);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // --- REAL-TIME COUNTDOWN ---
  let nextStageName = "Event Starts";
  let targetTime = START_TIME;

  if (now > FINAL_DEADLINE) {
    nextStageName = "Event Ended"; targetTime = 0;
  } else if (now > CP3_DEADLINE) {
    nextStageName = "Final Submission"; targetTime = FINAL_DEADLINE;
  } else if (now > CP2_DEADLINE) {
    nextStageName = "Checkpoint 3"; targetTime = CP3_DEADLINE;
  } else if (now > CP1_DEADLINE) {
    nextStageName = "Checkpoint 2"; targetTime = CP2_DEADLINE;
  } else if (now > START_TIME) {
    nextStageName = "Checkpoint 1"; targetTime = CP1_DEADLINE;
  } else {
    nextStageName = "Hackathon Starts"; targetTime = START_TIME;
  }

  const diff = Math.max(0, targetTime - now);
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);
  const timeString = targetTime === 0 ? "00:00:00" : `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  if (isLoading) return <div className="animate-pulse flex space-x-4 p-8"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-white/10 rounded w-3/4"></div></div></div>;

  const isPending = teamData?.status === 'pending';
  const isRejected = teamData?.status === 'rejected';
  const isApproved = teamData?.status === 'approved';

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header & Status Warning */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end">
        <div>
          <h1 className="text-3xl font-light tracking-wide mb-1 text-gray-100">
            Welcome back, <span className="font-medium text-blue-400">{teamData?.team_name || "Team"}</span>!
          </h1>
          <p className="text-gray-400 font-light text-sm">Dashboard Overview</p>
        </div>
      </div>

      {isPending && (
        <div className="mb-8 p-4 bg-yellow-500/10 rounded-2xl flex items-center gap-4 bg-gradient-to-r from-yellow-300/10 to-yellow-950/10">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          <div>
            <h3 className="text-yellow-400 font-medium">Your account is pending verification</h3>
            <p className="text-yellow-500/70 text-sm font-light">You will not be able to submit checkpoints until the committee approves your registration.</p>
          </div>
        </div>
      )}

      {isRejected && (
        <div className="mb-8 p-4 bg-red-500/10 rounded-2xl flex items-center gap-4 bg-gradient-to-r from-red-300/10 to-red-950/10">
          <XCircle className="w-6 h-6 text-red-500" />
          <div>
            <h3 className="text-red-400 font-medium">Registration Rejected</h3>
            <p className="text-red-500/70 text-sm font-light">Please contact the committee via Discord for further clarification.</p>
          </div>
        </div>
      )}

      {/* --- LIVE STATS GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#0c122b] bg-gradient-to-b from-emerald-300/10 to-emerald-950/10 rounded-2xl p-6 flex flex-col justify-between ">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-full ${isApproved ? 'bg-emerald-500/10' : isPending ? 'bg-yellow-500/10' : 'bg-red-500/10'}`}>
              <CheckCircle2 className={`w-5 h-5 ${isApproved ? 'text-emerald-400' : isPending ? 'text-yellow-400' : 'text-red-400'}`} />
            </div>
            <span className="text-xs font-medium bg-white/5 px-2 py-1 rounded-full text-gray-400">Registration</span>
          </div>
          <div>
            <h3 className="text-2xl font-normal text-white mb-1 capitalize">{teamData?.status || "Unknown"}</h3>
            <p className="text-sm font-light text-gray-500">{isApproved ? "You are ready to hack!" : "Awaiting review."}</p>
          </div>
        </div>

        <div className="bg-gradient-to-b from-blue-300/10 to-blue-950/10 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden lg:col-span-2">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="flex justify-between items-start mb-2 relative z-10">
            <div className="bg-blue-500/10 p-2 rounded-full">
              <Timer className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xs font-medium bg-white/10 text-white/80 px-2 py-1 rounded-full flex items-center gap-1">
               Towards: {nextStageName}
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="text-4xl md:text-5xl font-light text-white tracking-widest tabular-nums">{timeString}</h3>
            <p className="text-sm font-light text-gray-400 mt-2">Time Remaining to {nextStageName}</p>
          </div>
        </div>
      </div>

      {/* --- ANNOUNCEMENTS --- */}
      <h2 className="text-lg font-light text-gray-300 mb-4 flex items-center gap-2"><Megaphone className="w-5 h-5 text-blue-500" /> Recent Activity</h2>
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="text-gray-500 font-light text-sm italic p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center">No announcements yet.</div>
        ) : (
          announcements.map((ann) => (
            <div key={ann.id} className={`rounded-2xl p-6 relative overflow-hidden flex gap-4 transition-colors ${ann.is_pinned ? 'bg-gradient-to-b from-blue-900/20 to-blue-950/10 shadow-lg' : 'bg-[#0c122b] border border-white/5 hover:bg-white/[0.03]'}`}>
              {ann.is_pinned && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>}
              <div className="mt-1">{ann.is_pinned ? <Pin className="w-5 h-5 text-blue-400" /> : <Megaphone className="w-5 h-5 text-gray-500" />}</div>
              <div className="w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className={`text-base font-normal ${ann.is_pinned ? 'text-blue-100' : 'text-gray-200'}`}>{ann.title}</h3>
                    {ann.is_pinned && <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full tracking-wider">Pinned</span>}
                  </div>
                  <span className="text-xs text-gray-500 font-light whitespace-nowrap">{new Date(ann.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
                <p className="text-gray-400 font-light text-sm leading-relaxed mb-3 whitespace-pre-wrap">{ann.content}</p>
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider justify-end">Posted by {ann.author}</p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
// Output: Renders the Dashboard overview page focusing strictly on the countdown timer, team status, and announcements.