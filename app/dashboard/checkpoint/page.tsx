// src/app/dashboard/checkpoint/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Send, CheckCircle2, AlertCircle, Lock, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

// KONFIGURASI WAKTU DEADLINE (+07.00)
// cp 1 = 09 Mei 2026, 18.00
// cp 2 = 10 Mei 2026, 00.00
// cp 3 = 10 Mei 2026, 06.00
const CP1_DEADLINE = new Date("2026-05-09T18:00:00+07:00").getTime();
const CP2_DEADLINE = new Date("2026-05-10T00:00:00+07:00").getTime();
const CP3_DEADLINE = new Date("2026-05-10T06:00:00+07:00").getTime();

// WAKTU BUKA FORM (1 jam sebelum deadline)
const ONE_HOUR = 60 * 60 * 1000;
const CP1_OPEN = CP1_DEADLINE - ONE_HOUR;
const CP2_OPEN = CP2_DEADLINE - ONE_HOUR;
const CP3_OPEN = CP3_DEADLINE - ONE_HOUR;

export default function CheckpointPage() {
  const [teamId, setTeamId] = useState<string | null>(null);
  const [teamStatus, setTeamStatus] = useState<string>("loading");
  const [now, setNow] = useState<number>(new Date().getTime());
  
  // Form State
  const [checkpointNumber, setCheckpointNumber] = useState("");
  const [reportText, setReportText] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Real-time Clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date().getTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Team Status
  useEffect(() => {
    const fetchTeamStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setTeamId(session.user.id);
        const { data } = await supabase.from('teams').select('status').eq('id', session.user.id).single();
        if (data) setTeamStatus(data.status);
      }
    };
    fetchTeamStatus();
  }, []);

  // Auto-select the latest open checkpoint
  useEffect(() => {
    if (now >= CP3_OPEN) setCheckpointNumber("3");
    else if (now >= CP2_OPEN) setCheckpointNumber("2");
    else if (now >= CP1_OPEN) setCheckpointNumber("1");
    else setCheckpointNumber("");
  }, [now]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId || teamStatus !== 'approved' || !checkpointNumber) return;

    setIsLoading(true); setMessage(""); setIsSuccess(false);

    try {
      const response = await fetch("/api/checkpoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, checkpointNumber: parseInt(checkpointNumber), reportText, githubLink }),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage("Checkpoint successfully submitted!"); setIsSuccess(true); setReportText(""); setGithubLink("");
      } else {
        setMessage(`Error: ${result.error}`); setIsSuccess(false);
      }
    } catch (error) {
      setMessage("Connection error. Please try again."); setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Status Logika
  const isCP1Open = now >= CP1_OPEN;
  const isCP2Open = now >= CP2_OPEN;
  const isCP3Open = now >= CP3_OPEN;
  const isAnyCpOpen = isCP1Open || isCP2Open || isCP3Open;

  if (teamStatus === "loading") return <div className="text-blue-500">Checking authorization...</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-wide mb-1 text-gray-100">Phase Checkpoint</h1>
        <p className="text-gray-400 font-light text-sm">Update your progress. Form opens exactly 1 hour before the deadline.</p>
      </div>

      <div className="max-w-2xl bg-[#0c122b] border border-white/5 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
        
        {/* LOCK SCREEN: Jika Belum Di-Approve */}
        {teamStatus !== 'approved' && (
          <div className="absolute inset-0 bg-[#050814]/90 backdrop-blur-md flex flex-col items-center justify-center z-30">
             <div className="bg-gray-800/50 p-4 rounded-2xl mb-4 border border-white/5"><Lock className="w-8 h-8 text-yellow-500" /></div>
             <h2 className="text-xl font-normal text-gray-200 mb-2">Account Unverified</h2>
             <p className="text-sm font-light text-gray-400 text-center max-w-xs">Your team status is currently <span className="text-yellow-400 font-medium uppercase">{teamStatus}</span>.</p>
          </div>
        )}

        {/* LOCK SCREEN: Jika Waktu Belum Terbuka Sama Sekali */}
        {teamStatus === 'approved' && !isAnyCpOpen && (
          <div className="absolute inset-0 bg-[#050814]/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
             <div className="bg-blue-900/30 p-4 rounded-2xl mb-4 border border-blue-500/30"><Clock className="w-8 h-8 text-blue-400 animate-pulse" /></div>
             <h2 className="text-xl font-normal text-gray-200 mb-2">Hold on, Hackers!</h2>
             <p className="text-sm font-light text-gray-400 text-center max-w-xs">
               Checkpoint 1 submission will open at <strong className="text-white">17:00 WIB</strong>.
             </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Select Phase</label>
            <select
              value={checkpointNumber}
              onChange={(e) => setCheckpointNumber(e.target.value)}
              required
              disabled={!isAnyCpOpen}
              className="w-full bg-[#0a0f24] border border-white/10 rounded-xl p-4 text-gray-200 font-light focus:outline-none focus:border-blue-500 appearance-none disabled:opacity-50"
            >
              <option value="" disabled>-- Select Checkpoint --</option>
              {isCP1Open && <option value="1">Checkpoint 1 (Deadline 18:00)</option>}
              {isCP2Open && <option value="2">Checkpoint 2 (Deadline 00:00)</option>}
              {isCP3Open && <option value="3">Checkpoint 3 (Deadline 06:00)</option>}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Progress Report</label>
            <textarea required rows={4} value={reportText} onChange={(e) => setReportText(e.target.value)} placeholder="Describe your current progress..." disabled={!isAnyCpOpen} className="w-full bg-[#0a0f24] border border-white/10 rounded-xl p-4 text-gray-200 font-light focus:outline-none focus:border-blue-500 resize-none disabled:opacity-50"></textarea>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Repository Link</label>
            <input type="url" required value={githubLink} onChange={(e) => setGithubLink(e.target.value)} placeholder="https://github.com/..." disabled={!isAnyCpOpen} className="w-full bg-[#0a0f24] border border-white/10 rounded-xl p-4 text-gray-200 font-light focus:outline-none focus:border-blue-500 disabled:opacity-50" />
          </div>

          <button type="submit" disabled={isLoading || !isAnyCpOpen} className="w-full flex items-center justify-center mt-4 text-lg bg-gradient-to-r from-blue-600 to-blue-800 py-4 rounded-xl font-normal hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 disabled:opacity-50">
            {isLoading ? "Submitting..." : "Submit Progress"} {!isLoading && <Send className="ml-2 w-5 h-5" />}
          </button>
        </form>

        {message && (
          <div className={`mt-8 p-4 rounded-xl flex items-center gap-3 border ${isSuccess ? 'bg-blue-900/20 border-blue-500/30 text-blue-300' : 'bg-red-900/20 border-red-500/30 text-red-300'}`}>
            {isSuccess ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <p className="font-light text-sm">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}