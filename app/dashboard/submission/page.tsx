// File: src/app/dashboard/submission/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Rocket, CheckCircle2, AlertCircle, Lock, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

// 🕒 KONFIGURASI WAKTU FINAL (WIB)
const FINAL_DEADLINE = new Date("2026-03-26T09:00:00+07:00").getTime();
const FINAL_OPEN = FINAL_DEADLINE - (60 * 60 * 1000); // buka submission form jam 11:00 WIB

export default function SubmissionPage() {
  const [teamId, setTeamId] = useState<string | null>(null);
  const [teamStatus, setTeamStatus] = useState<string>("loading");
  const [now, setNow] = useState<number>(new Date().getTime());
  
  // Form State
  const [finalRepoLink, setFinalRepoLink] = useState("");
  const [presentationLink, setPresentationLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Real-time Clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date().getTime()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId || teamStatus !== 'approved') return;

    setIsLoading(true); setMessage(""); setIsSuccess(false);

    try {
      // API logic untuk Final Submission (Pastikan kamu membuat file API-nya nanti)
      const { error } = await supabase.from('submissions').insert([{
        team_id: teamId,
        final_repo_link: finalRepoLink,
        presentation_link: presentationLink
      }]);

      if (!error) {
        setMessage("Final Project successfully submitted! Excellent work."); setIsSuccess(true);
      } else {
        setMessage(`Error: ${error.message}`); setIsSuccess(false);
      }
    } catch (error) {
      setMessage("Connection error. Please try again."); setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const isFinalOpen = now >= FINAL_OPEN;

  if (teamStatus === "loading") return <div className="text-emerald-500">Checking authorization...</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-wide mb-1 text-gray-100">Final Submission</h1>
        <p className="text-gray-400 font-light text-sm">The finish line is near. Submit your final deliverables here.</p>
      </div>

      <div className="max-w-2xl bg-[#0c122b] border border-white/5 rounded-3xl p-10 shadow-2xl relative overflow-hidden border-t-emerald-500/30">
        
        {/* LOCK SCREEN: Jika Belum Di-Approve */}
        {teamStatus !== 'approved' && (
          <div className="absolute inset-0 bg-[#050814]/90 backdrop-blur-md flex flex-col items-center justify-center z-30">
             <div className="bg-gray-800/50 p-4 rounded-2xl mb-4 border border-white/5"><Lock className="w-8 h-8 text-yellow-500" /></div>
             <h2 className="text-xl font-normal text-gray-200 mb-2">Account Unverified</h2>
             <p className="text-sm font-light text-gray-400 text-center max-w-xs">You must be approved to submit the final project.</p>
          </div>
        )}

        {/* LOCK SCREEN: Jika Waktu Belum Jam 11 Siang (10 Mei) */}
        {teamStatus === 'approved' && !isFinalOpen && (
          <div className="absolute inset-0 bg-[#050814]/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
             <div className="bg-emerald-900/30 p-4 rounded-2xl mb-4 border border-emerald-500/30"><Clock className="w-8 h-8 text-emerald-400 animate-pulse" /></div>
             <h2 className="text-xl font-normal text-gray-200 mb-2">Final Gate is Closed</h2>
             <p className="text-sm font-light text-gray-400 text-center max-w-xs">
               Final submission will officially open on <strong className="text-white">10 May at 11:00 WIB</strong>. Focus on finishing your product!
             </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Final GitHub Repository</label>
            <input type="url" required value={finalRepoLink} onChange={(e) => setFinalRepoLink(e.target.value)} placeholder="https://github.com/... (Must be public)" disabled={!isFinalOpen} className="w-full bg-[#0a0f24] border border-white/10 rounded-xl p-4 text-gray-200 font-light focus:outline-none focus:border-emerald-500 disabled:opacity-50" />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Pitch Deck / Presentation Link</label>
            <input type="url" required value={presentationLink} onChange={(e) => setPresentationLink(e.target.value)} placeholder="Google Slides / Figma / Canva Link" disabled={!isFinalOpen} className="w-full bg-[#0a0f24] border border-white/10 rounded-xl p-4 text-gray-200 font-light focus:outline-none focus:border-emerald-500 disabled:opacity-50" />
          </div>

          <button type="submit" disabled={isLoading || !isFinalOpen} className="w-full flex items-center justify-center mt-4 text-lg bg-gradient-to-r from-emerald-600 to-emerald-800 py-4 rounded-xl font-normal hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 disabled:opacity-50">
            {isLoading ? "Encrypting & Submitting..." : "Submit Final Project"} {!isLoading && <Rocket className="ml-2 w-5 h-5" />}
          </button>
        </form>

        {message && (
          <div className={`mt-8 p-4 rounded-xl flex items-center gap-3 border ${isSuccess ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-300' : 'bg-red-900/20 border-red-500/30 text-red-300'}`}>
            {isSuccess ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <p className="font-light text-sm">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}