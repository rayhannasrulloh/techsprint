// File: src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Megaphone, Pin, Clock, Activity, AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AnnouncementsPage() {
  const [teamData, setTeamData] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Fetch Team Status
        const { data: teamRes } = await supabase
          .from('teams')
          .select('team_name, status')
          .eq('id', session.user.id)
          .single();
        if (teamRes) setTeamData(teamRes);
        
        // Fetch Announcements (Sort descending)
        const { data: annRes } = await supabase
          .from('announcements')
          .select('*')
          .order('created_at', { ascending: false });
        if (annRes) setAnnouncements(annRes);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-white/10 rounded w-3/4"></div></div></div>;

  // Determine styling based on status
  const isPending = teamData?.status === 'pending';
  const isRejected = teamData?.status === 'rejected';
  const isApproved = teamData?.status === 'approved';

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Greeting Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-light tracking-wide mb-1 text-gray-100">
          Welcome back, <span className="font-medium text-blue-400">{teamData?.team_name || "Team"}</span>!
        </h1>
        <p className="text-gray-400 font-light text-sm">Last update: {new Date().toLocaleDateString()} | 24 Hours Remaining</p>
      </div>

      {/* Global Warning Banner for Pending/Rejected */}
      {isPending && (
        <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center gap-4">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          <div>
            <h3 className="text-yellow-400 font-medium">Your account is pending verification</h3>
            <p className="text-yellow-500/70 text-sm font-light">You will not be able to submit checkpoints until the committee approves your registration.</p>
          </div>
        </div>
      )}

      {isRejected && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4">
          <XCircle className="w-6 h-6 text-red-500" />
          <div>
            <h3 className="text-red-400 font-medium">Registration Rejected</h3>
            <p className="text-red-500/70 text-sm font-light">Please contact the committee via Discord for further clarification.</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Status Card Dynamic */}
        <div className="bg-[#0c122b] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${isApproved ? 'bg-emerald-500/10' : isPending ? 'bg-yellow-500/10' : 'bg-red-500/10'}`}>
              <Activity className={`w-5 h-5 ${isApproved ? 'text-emerald-400' : isPending ? 'text-yellow-400' : 'text-red-400'}`} />
            </div>
            <span className="text-xs font-medium bg-white/5 px-2 py-1 rounded-full text-gray-400">Registration</span>
          </div>
          <div>
            <h3 className="text-2xl font-normal text-white mb-1 capitalize">
              {teamData?.status || "Unknown"}
            </h3>
            <p className="text-sm font-light text-gray-500">
              {isApproved ? "You are ready to hack!" : "Awaiting committee review."}
            </p>
          </div>
        </div>

        {/* Time Card */}
        <div className="bg-[#0c122b] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xs font-medium bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full">Next Deadline</span>
          </div>
          <div>
            <h3 className="text-3xl font-normal text-white mb-1">18:00</h3>
            <p className="text-sm font-light text-gray-500">Checkpoint 1 Submission</p>
          </div>
        </div>
      </div>

      {/* Announcements Feed Dynamic */}
      <h2 className="text-lg font-light text-gray-300 mb-4 flex items-center gap-2"><Megaphone className="w-5 h-5 text-blue-500" /> Recent Activity</h2>
      <div className="space-y-4">
        
        {announcements.length === 0 ? (
          <div className="text-gray-500 font-light text-sm italic p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center">No announcements yet.</div>
        ) : (
          announcements.map((ann) => (
            <div key={ann.id} className={`rounded-2xl p-6 relative overflow-hidden flex gap-4 transition-colors ${ann.is_pinned ? 'bg-gradient-to-r from-blue-900/20 to-[#0c122b] border border-blue-500/20' : 'bg-[#0c122b] border border-white/5 hover:bg-white/[0.03]'}`}>
              
              {/* Blue line for pinned */}
              {ann.is_pinned && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>}
              
              <div className="mt-1">
                {ann.is_pinned ? <Pin className="w-5 h-5 text-blue-400" /> : <Megaphone className="w-5 h-5 text-gray-500" />}
              </div>
              
              <div className="w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className={`text-base font-normal ${ann.is_pinned ? 'text-blue-100' : 'text-gray-200'}`}>{ann.title}</h3>
                    {ann.is_pinned && <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full uppercase tracking-wider">Pinned</span>}
                  </div>
                  <span className="text-xs text-gray-500 font-light whitespace-nowrap">
                    {new Date(ann.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
                
                <p className="text-gray-400 font-light text-sm leading-relaxed mb-3 whitespace-pre-wrap">
                  {ann.content}
                </p>
                
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Posted by {ann.author}</p>
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}
// Output: Renders the Dashboard Overview with dynamic data fetching, greeting the team by name, and showing a global warning banner if their status is pending or rejected.