// File: src/app/dashboard/checkpoint/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Send, CheckCircle2, AlertCircle, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function CheckpointPage() {
  const [teamId, setTeamId] = useState<string | null>(null);
  const [teamStatus, setTeamStatus] = useState<string>("loading");
  
  // Form State
  const [checkpointNumber, setCheckpointNumber] = useState("1");
  const [reportText, setReportText] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchTeamStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setTeamId(session.user.id);
        const { data } = await supabase
          .from('teams')
          .select('status')
          .eq('id', session.user.id)
          .single();
          
        if (data) setTeamStatus(data.status);
      }
    };
    fetchTeamStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId || teamStatus !== 'approved') return;

    setIsLoading(true);
    setMessage("");
    setIsSuccess(false);

    try {
      const response = await fetch("/api/checkpoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: teamId,
          checkpointNumber: parseInt(checkpointNumber),
          reportText,
          githubLink,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Checkpoint successfully submitted!");
        setIsSuccess(true);
        setReportText("");
        setGithubLink("");
      } else {
        setMessage(`Error: ${result.error}`);
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage("Connection error. Please try again.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (teamStatus === "loading") return <div className="text-blue-500">Checking authorization...</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-wide mb-1 text-gray-100">Phase Checkpoint</h1>
        <p className="text-gray-400 font-light text-sm">Update your progress every 6 hours. Consistency is key.</p>
      </div>

      <div className="max-w-2xl bg-[#0c122b] border border-white/5 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
        
        {/* LOCK SCREEN FOR PENDING/REJECTED TEAMS */}
        {teamStatus !== 'approved' && (
          <div className="absolute inset-0 bg-[#050814]/90 backdrop-blur-md flex flex-col items-center justify-center z-20">
             <div className="bg-gray-800/50 p-4 rounded-2xl mb-4 border border-white/5">
               <Lock className="w-8 h-8 text-yellow-500" />
             </div>
             <h2 className="text-xl font-normal text-gray-200 mb-2">Form Locked</h2>
             <p className="text-sm font-light text-gray-400 text-center max-w-xs leading-relaxed">
               Your team status is currently <span className="text-yellow-400 font-medium uppercase">{teamStatus}</span>. 
               You must be approved by the committee to unlock submissions.
             </p>
          </div>
        )}

        {/* CHECKPOINT FORM */}
        <form onSubmit={handleSubmit} className={`space-y-6 ${teamStatus !== 'approved' ? 'opacity-20 pointer-events-none' : ''}`}>
          {/* Select Phase */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Phase</label>
            <select
              value={checkpointNumber}
              onChange={(e) => setCheckpointNumber(e.target.value)}
              className="w-full bg-[#0a0f24] border border-white/10 rounded-xl p-4 text-gray-200 font-light focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none"
            >
              <option value="1">Checkpoint 1 (Hour 6)</option>
              <option value="2">Checkpoint 2 (Hour 12)</option>
              <option value="3">Checkpoint 3 (Hour 18)</option>
            </select>
          </div>

          {/* Progress Report */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Progress Report</label>
            <textarea
              required
              rows={4}
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Briefly describe what your team has accomplished..."
              className="w-full bg-[#0a0f24] border border-white/10 rounded-xl p-4 text-gray-200 font-light focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            ></textarea>
          </div>

          {/* GitHub Link */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Repository Link</label>
            <input
              type="url"
              required
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full bg-[#0a0f24] border border-white/10 rounded-xl p-4 text-gray-200 font-light focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || teamStatus !== 'approved'}
            className="w-full flex items-center justify-center mt-4 text-lg bg-gradient-to-r from-blue-600 to-blue-800 py-4 rounded-xl font-normal hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? "Synchronizing..." : "Submit Progress"} 
            {!isLoading && <Send className="ml-2 w-5 h-5" />}
          </button>
        </form>

        {/* Status Message */}
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
// Output: Renders the Checkpoint form with an authentication check. It overlays a frosted-glass Lock screen if the user is not yet approved by the admin.